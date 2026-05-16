#!/bin/bash
# SessionStart hook: surface the most recent checkpoint (if recent enough
# and from the same cwd) as additional context. Lets a fresh Claude
# session pick up where the prior one left off without the user having to
# paste anything.
#
# v2 (2026-05-15): prefer HANDOFF.json (machine-readable, GSD-lift) over
# markdown checkpoint when both are present. JSON gives us structured
# in_progress_task + blockers + next_steps without natural-language parsing.
#
# Heuristic:
#   - Only surface if the artifact is < SESSION_RESUME_MAX_AGE seconds old
#     (default 1 day = 86400)
#   - Only surface if the cwd matches current cwd OR SESSION_RESUME_FORCE=1
set -u

CHECKPOINT_DIR="$HOME/.claude/checkpoints"
HANDOFF_FILE="$HOME/.claude/state/HANDOFF.json"
MAX_AGE="${SESSION_RESUME_MAX_AGE:-86400}"

[ -d "$CHECKPOINT_DIR" ] || exit 0

input=$(cat)
cwd=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("cwd",""))' 2>/dev/null)
[ -z "$cwd" ] && exit 0

# Prefer HANDOFF.json if present, fresh, and parseable
if [ -f "$HANDOFF_FILE" ] && command -v jq >/dev/null 2>&1; then
  ho_mtime=$(stat -f %m "$HANDOFF_FILE" 2>/dev/null || stat -c %Y "$HANDOFF_FILE" 2>/dev/null)
  now=$(date +%s)
  ho_age=$((now - ho_mtime))
  if [ "$ho_age" -le "$MAX_AGE" ] && jq -e . "$HANDOFF_FILE" >/dev/null 2>&1; then
    export _SR_HANDOFF_PATH="$HANDOFF_FILE"
    export _SR_HANDOFF_AGE="$ho_age"
    python3 <<'PY'
import json, os
with open(os.environ["_SR_HANDOFF_PATH"]) as f:
    h = json.load(f)
task = h.get("in_progress_task", {}) or {}
title = task.get("title", "(no title)")
status = task.get("status", "")
phase = h.get("phase", "") or "(none)"
blockers = h.get("blockers", []) or []
pending = h.get("pending_human_actions", []) or []
files = h.get("files_in_flight", []) or []
next_steps = h.get("next_steps", []) or []
plan_ref = h.get("plan_reference") or "(none)"
isa_ref = h.get("isa_reference") or "(none)"
key_ctx = h.get("key_context", "") or ""
md_sibling = h.get("markdown_sibling", "")

lines = [
    f"[session-resume] HANDOFF.json from {os.environ['_SR_HANDOFF_AGE']}s ago. "
    "This is structured prior-session state. Read, acknowledge, then check "
    "whether the user wants to continue or start fresh.",
    "",
    f"**In-progress task:** {title} ({status})",
    f"**Phase:** {phase}",
    f"**Plan:** {plan_ref}",
    f"**ISA:** {isa_ref}",
]
if blockers:
    lines += ["", "**Blockers:**"] + [f"- {b}" for b in blockers]
if pending:
    lines += ["", "**Pending human actions:**"] + [f"- {p}" for p in pending]
if files:
    lines += ["", "**Files in flight:**"] + [f"- `{f.get('path','?')}` — {f.get('intent','?')}" for f in files]
if next_steps:
    lines += ["", "**Next steps:**"] + [f"{i+1}. {s}" for i, s in enumerate(next_steps)]
if key_ctx:
    lines += ["", "**Key context:**", key_ctx]
if md_sibling:
    lines += ["", f"_Markdown sibling: {md_sibling}_"]

print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "\n".join(lines)}}))
PY
    unset _SR_HANDOFF_PATH _SR_HANDOFF_AGE
    exit 0
  fi
fi

# Fallback: most recent markdown checkpoint (legacy path)
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
