#!/usr/bin/env bash
# SessionStart hook: cheap TEL reachability check. Surfaces if TEL is down
# so Claude knows it can't fall back to TEL for credentialed ops this session.
# Stays silent unless TEL is unreachable AND TEL is expected to be running.
# 6h dedup so it doesn't thrash on rapid-restart sessions.
set -u

# Only check if TEL is expected to be installed
[ -d "$HOME/.claude/tel" ] || exit 0
[ -f "$HOME/Library/LaunchAgents/bio.tel.plist" ] || exit 0

LAST_FILE="/tmp/claude-tel-probe.last"
LAST=$(stat -f %m "$LAST_FILE" 2>/dev/null || echo 0)
NOW=$(date +%s)
[ $((NOW - LAST)) -lt 21600 ] && exit 0
touch "$LAST_FILE"

if ! curl -fsS -m 2 http://127.0.0.1:8765/health >/dev/null 2>&1; then
  echo "[tel-health] TEL is installed but not responding at http://127.0.0.1:8765 — credentialed actions will fail" >&2
  echo "[tel-health] Restart: launchctl kickstart -k gui/$(id -u)/bio.tel" >&2
fi
exit 0
