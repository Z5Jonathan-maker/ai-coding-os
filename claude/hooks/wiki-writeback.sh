#!/usr/bin/env bash
# Stop hook: append session-end markers to wiki logs so manual writeback isn't
# required for every session. Cheap — only writes a heartbeat unless explicit
# CC_WIKI_FAILURE or CC_WIKI_OPTIMIZATION env vars were set during the session.
# Real entries (with root cause + fix) are still written by Claude during the
# session via Edit on the log files. This hook captures unprompted heartbeats.
set -u

WIKI="${HOME}/.claude/wiki"
[ -d "$WIKI" ] || exit 0

HEARTBEAT="$WIKI/logs/.session-heartbeat"
mkdir -p "$WIKI/logs"

# Heartbeat: last session timestamp + cwd
{
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) cwd=${PWD}"
} >> "$HEARTBEAT"

# If the session set explicit env vars, append structured entries
if [ -n "${CC_WIKI_FAILURE:-}" ]; then
  cat >> "$WIKI/logs/failure-log.md" <<EOF

## $(date +%Y-%m-%d) · ${CC_WIKI_FAILURE_TITLE:-(untitled)}
$CC_WIKI_FAILURE
EOF
fi

if [ -n "${CC_WIKI_OPTIMIZATION:-}" ]; then
  cat >> "$WIKI/logs/optimization-log.md" <<EOF

## $(date +%Y-%m-%d) · ${CC_WIKI_OPTIMIZATION_TITLE:-(untitled)}
$CC_WIKI_OPTIMIZATION
EOF
fi

# Cap heartbeat at 1000 lines (rotate)
if [ -f "$HEARTBEAT" ] && [ "$(wc -l < "$HEARTBEAT")" -gt 1000 ]; then
  tail -500 "$HEARTBEAT" > "$HEARTBEAT.tmp" && mv "$HEARTBEAT.tmp" "$HEARTBEAT"
fi

exit 0
