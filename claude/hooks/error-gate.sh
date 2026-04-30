#!/bin/bash
# PostToolUse hook: detect when the same tool keeps failing (non-zero
# exit OR error keywords in output). After ERROR_GATE_THRESHOLD repeats
# (default 3), emit additionalContext nudging Claude to change tactic.
#
# Different from loop-guard.sh: loop-guard catches identical CALLS;
# error-gate catches repeated FAILURES regardless of input. Together
# they catch both "I keep retrying the same thing" and "everything I
# try with this tool is broken."
#
# State per session+tool:
#   ~/.claude/hooks/state/error-gate-<session>.<tool>.count
set -u

STATE_DIR="$HOME/.claude/hooks/state"
THRESHOLD="${ERROR_GATE_THRESHOLD:-3}"
mkdir -p "$STATE_DIR"

input=$(cat)
export _EG_INPUT="$input"
read session_id tool failed <<<"$(python3 <<'PY'
import json, os, re
raw = os.environ.get("_EG_INPUT", "")
try:
    d = json.loads(raw)
except Exception:
    print("default _ false"); raise SystemExit(0)

sid = d.get("session_id", "default")
tool = d.get("tool_name", "_")
# tool_response is the canonical field; fall back to common alternatives
resp = d.get("tool_response", d.get("tool_result", ""))

failed = False
if isinstance(resp, dict):
    if resp.get("is_error") or resp.get("isError"):
        failed = True
    txt = json.dumps(resp)
elif isinstance(resp, str):
    txt = resp
else:
    txt = ""

# Heuristics: common error markers
if not failed and isinstance(txt, str):
    if re.search(r'\b(error|failed|exception|traceback|fatal|denied|exit code [1-9])', txt, re.IGNORECASE):
        failed = True
    if "<tool_use_error>" in txt:
        failed = True

print(sid, tool.replace(' ', '_'), str(failed).lower())
PY
)"
unset _EG_INPUT

[ -z "${session_id:-}" ] && exit 0

counter="$STATE_DIR/error-gate-${session_id}.${tool}.count"

if [ "$failed" != "true" ]; then
  rm -f "$counter"
  exit 0
fi

count=$(( $(cat "$counter" 2>/dev/null || echo 0) + 1 ))
echo "$count" > "$counter"

if [ "$count" -lt "$THRESHOLD" ]; then
  exit 0
fi

# Reset so we don't fire again on the very next call
rm -f "$counter"

cat <<JSON
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"[error-gate] ${tool} has failed ${count} times in a row this session. Stop forcing ${tool}. Check assumptions: is the tool the right choice, are the inputs valid, is the target reachable, do you have permission? If you can't fix it in one more call, switch strategy or mark the task blocked and move on."}}
JSON
