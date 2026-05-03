#!/usr/bin/env bash
# mcp-probe.sh
# Standalone MCP health probe — enumerate, status-check, surface re-auth needs.
# Safe to run anywhere. Used by the `health` skill and by weekly cron.
set -euo pipefail

OUT="${1:-/dev/stdout}"
CACHE="${HOME}/.claude/mcp-needs-auth-cache.json"

{
  echo "# MCP probe — $(date)"
  echo

  if ! command -v claude >/dev/null 2>&1; then
    echo "🔴 claude CLI not on PATH"
    exit 0
  fi

  list=$(claude mcp list 2>&1 || true)
  echo "## Connection list"
  echo '```'
  echo "$list"
  echo '```'
  echo

  bad=$(echo "$list" | grep -v "✓ Connected" | grep -E ":\s" || true)
  if [ -n "$bad" ]; then
    echo "## 🔴 Disconnected"
    echo '```'
    echo "$bad"
    echo '```'
    echo
  fi

  if [ -f "$CACHE" ]; then
    needs=$(jq 'length' "$CACHE" 2>/dev/null || echo 0)
    if [ "$needs" -gt 0 ]; then
      echo "## 🟡 Needs re-auth ($needs server(s))"
      jq -r 'to_entries[] | "- \(.key): \(.value)"' "$CACHE" 2>/dev/null
      echo
      echo "Fix: \`claude mcp <re-auth flow per server>\`"
    fi
  fi

  echo "## Routing-table cross-check"
  for mcp in chrome-devtools playwright github context7 mempalace; do
    if echo "$list" | grep -q "^$mcp:"; then
      echo "- ✓ $mcp present"
    else
      echo "- 🔴 $mcp missing (referenced in CLAUDE.md routing table)"
    fi
  done
} > "$OUT"
