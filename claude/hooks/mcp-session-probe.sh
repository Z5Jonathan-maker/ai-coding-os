#!/usr/bin/env bash
# SessionStart hook: cheap MCP reachability snapshot. Surfaces broken servers
# inline so Claude doesn't try to use a dead MCP and waste tokens debugging.
# Stays silent unless something is actually broken.
# Output goes to stderr (Claude Code captures it for the system-reminder context).
set -u

REPORT="$HOME/.claude/audits/mcp-probe-$(date +%Y-%m-%d).md"

# Skip if probe ran in last 6 hours (avoid cost on rapid-restart sessions)
LAST=$(stat -f %m "$REPORT" 2>/dev/null || echo 0)
NOW=$(date +%s)
[ $((NOW - LAST)) -lt 21600 ] && exit 0

bash "$HOME/.claude/scripts/mcp-probe.sh" "$REPORT" 2>/dev/null

# Surface only if there are 🔴 critical findings
if grep -q "🔴" "$REPORT" 2>/dev/null; then
  echo "[mcp-session-probe] MCP issues detected this session — see $REPORT" >&2
  grep "🔴" "$REPORT" >&2
fi
exit 0
