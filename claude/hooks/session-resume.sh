#!/bin/bash
# SessionStart hook: surface the most recent checkpoint (if recent enough
# and from the same cwd) as additional context. Lets a fresh Claude
# session pick up where the prior one left off without the user having to
# paste anything.
#
# Heuristic:
#   - Only surface if the last checkpoint is < SESSION_RESUME_MAX_AGE
#     seconds old (default 1 day = 86400)
#   - Only surface if the last checkpoint's cwd matches current cwd OR
#     SESSION_RESUME_FORCE=1
set -u

CHECKPOINT_DIR="$HOME/.claude/checkpoints"
MAX_AGE="${SESSION_RESUME_MAX_AGE:-86400}"

[ -d "$CHECKPOINT_DIR" ] || exit 0

input=$(cat)
cwd=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("cwd",""))' 2>/dev/null)
[ -z "$cwd" ] && exit 0

# Most recent checkpoint
latest=$(ls -t "$CHECKPOINT_DIR"/*.md 2>/dev/null | head -1)
[ -z "$latest" ] && exit 0

# Age check
mtime=$(stat -f %m "$latest" 2>/dev/null || stat -c %Y "$latest" 2>/dev/null)
[ -z "$mtime" ] && exit 0
now=$(date +%s)
age=$((now - mtime))
[ "$age" -gt "$MAX_AGE" ] && exit 0

# CWD check (unless forced)
ckpt_cwd=$(grep -m1 '^- cwd: ' "$latest" | sed 's/^- cwd: `\(.*\)`/\1/')
if [ "${SESSION_RESUME_FORCE:-0}" != "1" ] && [ -n "$ckpt_cwd" ] && [ "$ckpt_cwd" != "$cwd" ]; then
  exit 0
fi

# Emit as additionalContext via JSON (SessionStart supports this)
content=$(head -c 4000 "$latest")
export _SR_CONTENT="$content"
export _SR_PATH="$latest"
export _SR_AGE="$age"
python3 <<'PY'
import json, os
ctx = (
    f"[session-resume] Picking up from prior session checkpoint "
    f"({os.environ['_SR_AGE']}s ago, file: {os.environ['_SR_PATH']}). "
    f"This is context only — the user may have moved on. Read, "
    f"acknowledge, then check whether the user wants to continue or "
    f"start fresh.\n\n"
    + os.environ["_SR_CONTENT"]
)
print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": ctx}}))
PY
unset _SR_CONTENT _SR_PATH _SR_AGE
