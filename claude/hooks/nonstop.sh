#!/bin/bash
# Stop hook that nudges Claude to keep working when "nonstop mode" is armed.
#
# Activation:   touch ~/.claude/hooks/state/nonstop.activate   (one-shot)
# Deactivation: touch ~/.claude/hooks/state/nonstop.deactivate (one-shot)
# Per-session active flag:  ~/.claude/hooks/state/nonstop-<session>.active
# Per-session nudge counter: ~/.claude/hooks/state/nonstop-<session>.count
#
# NONSTOP_MAX env caps nudges per turn (default 5; 0 = unlimited).
set -u

STATE_DIR="$HOME/.claude/hooks/state"
NONSTOP_MAX="${NONSTOP_MAX:-5}"

mkdir -p "$STATE_DIR"

input=$(cat)
session_id=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("session_id","default"))' 2>/dev/null \
  || echo default)
already_nudged=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(str(d.get("stop_hook_active",False)).lower())' 2>/dev/null \
  || echo false)

active_file="$STATE_DIR/nonstop-${session_id}.active"
counter_file="$STATE_DIR/nonstop-${session_id}.count"

if [ -f "$STATE_DIR/nonstop.deactivate" ]; then
  rm -f "$STATE_DIR/nonstop.deactivate" "$active_file" "$counter_file"
  exit 0
fi

if [ -f "$STATE_DIR/nonstop.activate" ]; then
  rm -f "$STATE_DIR/nonstop.activate"
  : >"$active_file"
fi

[ -f "$active_file" ] || exit 0
[ "$already_nudged" = "true" ] && exit 0

count=$(($(cat "$counter_file" 2>/dev/null || echo 0) + 1))
echo "$count" >"$counter_file"

if [ "$NONSTOP_MAX" -gt 0 ] && [ "$count" -gt "$NONSTOP_MAX" ]; then
  rm -f "$active_file" "$counter_file"
  exit 0
fi

cat <<'JSON'
{"decision":"block","reason":"[nonstop] Don't stop yet. Run through the loop:\n1. Open the task list — anything still pending or in_progress?\n2. Blocked? Try (a) solve it yourself (read code/docs, fix the error), (b) work around it without changing the outcome, (c) mark the task blocked with reason and move to the next.\n3. Long-running work — spawn a background Agent, don't sit on it.\n4. Out of work? touch ~/.claude/hooks/state/nonstop.deactivate and stop cleanly.\nNo brute-force retries, no destructive shortcuts, no unauthorized writes."}
JSON
