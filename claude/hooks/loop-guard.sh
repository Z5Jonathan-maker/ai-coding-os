#!/bin/bash
# PreToolUse hook that detects when Claude keeps re-running the same failing
# tool call. Per-session sliding window of recent calls; if the same call
# fingerprint repeats LOOP_GUARD_MAX times within the window, block the call
# and tell Claude to change strategy.
#
# Fingerprint = sha1(tool_name + ":" + tool_input_json), so a different file
# path or different command resets the count.
#
# State files (per session):
#   ~/.claude/hooks/state/loop-<session>.log   one line per call: <epoch> <fp>
#
# Tunables (env):
#   LOOP_GUARD_MAX=5         repeats before block (default 5)
#   LOOP_GUARD_WINDOW=300    sliding window seconds (default 5 min)
set -u

STATE_DIR="$HOME/.claude/hooks/state"
LOOP_GUARD_MAX="${LOOP_GUARD_MAX:-5}"
LOOP_GUARD_WINDOW="${LOOP_GUARD_WINDOW:-300}"

mkdir -p "$STATE_DIR"

input=$(cat)

read session_id tool_name fp <<<"$(printf '%s' "$input" | python3 -c '
import json, sys, hashlib
d = json.load(sys.stdin)
sid = d.get("session_id", "default")
tool = d.get("tool_name", "")
ti = d.get("tool_input", {})
fp = hashlib.sha1((tool + ":" + json.dumps(ti, sort_keys=True)).encode()).hexdigest()[:12]
print(sid, tool, fp)
' 2>/dev/null)"

[ -z "${session_id:-}" ] && exit 0

log="$STATE_DIR/loop-${session_id}.log"
now=$(date +%s)
cutoff=$(( now - LOOP_GUARD_WINDOW ))

# Append this call, then prune anything older than the window.
echo "$now $fp" >> "$log"
awk -v c="$cutoff" '$1 >= c' "$log" > "$log.tmp" && mv "$log.tmp" "$log"

# Count how many times this fingerprint appears in the window.
count=$(awk -v f="$fp" '$2 == f' "$log" | wc -l | tr -d ' ')

if [ "$count" -le "$LOOP_GUARD_MAX" ]; then
  exit 0
fi

# Reset so the next genuinely-different call after this nudge isn't blocked.
: > "$log"

cat <<JSON
{"decision":"block","reason":"[loop-guard] You have called ${tool_name} with the same arguments ${count} times in the last ${LOOP_GUARD_WINDOW}s. Stop retrying. Change something:\n- Read a different file or use a different search pattern\n- Check the actual error output instead of re-running\n- Try a different tool entirely\n- If genuinely stuck, mark the task blocked and move on\nDo not re-run this exact call again until you have new information."}
JSON
