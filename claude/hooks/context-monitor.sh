#!/bin/bash
# PostToolUse hook that reads Claude Code's own debug logs to compute the
# REAL % of context window remaining (not a guess), writes it to
# /tmp/cc-context-pct so other hooks can read it, and emits a non-blocking
# warning at 40/25/20/15% remaining.
#
# Background: Claude Code writes lines like
#   autocompact: tokens=12345 effectiveWindow=200000
# to ~/.claude/debug/*.txt. This hook parses the most recent line for the
# actual numbers. Falls back to silent no-op if debug logs are absent.
#
# Throttled: only reads the log every 3rd invocation to keep overhead low,
# unless we're already in <25% remaining (then every call).
set -u

DEBUG_DIR="$HOME/.claude/debug"
PCT_FILE="/tmp/cc-context-pct"
COUNTER_FILE="$HOME/.claude/hooks/state/context-monitor.count"
mkdir -p "$(dirname "$COUNTER_FILE")"

prev_pct=$(cat "$PCT_FILE" 2>/dev/null || echo 100)
count=$(( $(cat "$COUNTER_FILE" 2>/dev/null || echo 0) + 1 ))
echo "$count" > "$COUNTER_FILE"

# Throttle: only re-read every 3rd call if we're above 25% remaining
if [ "$prev_pct" -gt 25 ] && [ $((count % 3)) -ne 0 ]; then
  exit 0
fi

[ -d "$DEBUG_DIR" ] || exit 0

# Find the most recent autocompact line across all debug files
last=$(grep -h 'autocompact:' "$DEBUG_DIR"/*.txt 2>/dev/null | tail -1)
[ -z "$last" ] && exit 0

tokens=$(printf '%s' "$last" | grep -oE 'tokens=[0-9]+' | cut -d= -f2)
window=$(printf '%s' "$last" | grep -oE 'effectiveWindow=[0-9]+' | cut -d= -f2)

[ -z "$tokens" ] || [ -z "$window" ] || [ "$window" -eq 0 ] && exit 0

# % remaining
remaining=$(( (window - tokens) * 100 / window ))
echo "$remaining" > "$PCT_FILE"

# Only warn on threshold crossings (don't spam every call)
warn=""
if [ "$remaining" -lt 15 ] && [ "$prev_pct" -ge 15 ]; then
  warn="EMERGENCY: ${remaining}% context remaining. Save state to a file NOW (CHECKPOINT.md or similar) before /compact corrupts it. Stop opening new files."
elif [ "$remaining" -lt 20 ] && [ "$prev_pct" -ge 20 ]; then
  warn="CRITICAL: ${remaining}% context remaining. Wrap up current task. Avoid reading large files."
elif [ "$remaining" -lt 25 ] && [ "$prev_pct" -ge 25 ]; then
  warn="WARNING: ${remaining}% context remaining. Be selective with file reads."
elif [ "$remaining" -lt 40 ] && [ "$prev_pct" -ge 40 ]; then
  warn="NOTICE: ${remaining}% context remaining."
fi

[ -z "$warn" ] && exit 0

# Emit as a non-blocking system message via JSON (PostToolUse can use
# additionalContext to inject text without blocking the tool result)
cat <<JSON
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"[context-monitor] $warn"}}
JSON
