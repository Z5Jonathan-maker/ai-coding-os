#!/usr/bin/env bash
# SessionStart hook: surface AI-SYSTEM-V2 drift/failures at session start so
# the new model context starts AWARE of what's broken.
#
# This is the bridge between the closed-loop observability (AI-SYSTEM-V2 status,
# deploy-watch, mempalace auto-write) and the agent that actually acts on it.
# Pre-2026-05-14 sessions started blind to drift and had to discover it via
# bug reports. Now: every fresh session knows what's broken before it speaks.
#
# Quiet-by-default: ONLY emits when something is WARN/FAIL. A clean stack
# produces no context (don't pollute the session with "all green").
set -u

STATUS_CMD="$HOME/AI-SYSTEM-V2/scripts/ai-control.sh"
[ -x "$STATUS_CMD" ] || exit 0

# Read stdin (session metadata) so the hook is a well-formed Claude Code hook
_input=$(cat 2>/dev/null || true)

# Run the local status dashboard. 8s hard timeout — session start shouldn't be
# delayed.
("$STATUS_CMD" status 2>&1) >/tmp/session-health-$$.out &
hpid=$!
elapsed=0
while [ $elapsed -lt 8 ]; do
  if ! kill -0 $hpid 2>/dev/null; then
    wait $hpid
    rc=$?
    break
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done
if kill -0 $hpid 2>/dev/null; then
  kill -TERM $hpid 2>/dev/null
  rm -f /tmp/session-health-$$.out
  exit 0
fi

# A clean operational dashboard produces no additional context.
if [ "${rc:-0}" = "0" ] && grep -q '\*\*Status:\*\* OPERATIONAL' /tmp/session-health-$$.out; then
  rm -f /tmp/session-health-$$.out
  exit 0
fi

# Strip ANSI escapes.
body=$(sed -E $'s/\033\\[[0-9;]*m//g' /tmp/session-health-$$.out)
rm -f /tmp/session-health-$$.out

# Skip if no body (defensive)
[ -z "$body" ] && exit 0

# Wrap into SessionStart additionalContext via JSON
export _SH_BODY="$body"
python3 <<'PY'
import json, os
body = os.environ["_SH_BODY"].strip()
if not body:
    raise SystemExit(0)
ctx = (
    "[session-health] Stack state at session start. The closed-loop "
    "observability (AI-SYSTEM-V2 status) is reporting non-green components. "
    "Surface to the user only if relevant to their current request — "
    "don't volunteer it for trivial questions.\n\n"
    + body
)
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": ctx
    }
}))
PY
unset _SH_BODY
