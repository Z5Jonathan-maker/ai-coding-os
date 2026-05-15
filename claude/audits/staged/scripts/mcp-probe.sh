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
    echo "## 🔴 Disconnected — recommended fallbacks"
    echo '```'
    echo "$bad" | while IFS= read -r line; do
      mcp=$(echo "$line" | awk -F: '{print $1}' | sed 's/^claude.ai //; s/ /_/g; s/^/claude_ai_/' | sed 's/^claude_ai_claude_ai_/claude_ai_/')
      [ -z "$mcp" ] && continue
      fb=$(~/.claude/scripts/mcp-fallback-resolver.sh "$mcp" 2>/dev/null || true)
      if [ -n "$fb" ]; then
        echo "$line  →  fallback: $fb"
      else
        echo "$line  →  no healthy fallback (stage as READY-TO-RUN)"
      fi
    done
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
  for mcp in chrome-devtools playwright github context7 mempalace auto-browser webclaw; do
    if echo "$list" | grep -q "^$mcp:"; then
      echo "- ✓ $mcp present"
    else
      echo "- 🔴 $mcp missing (referenced in CLAUDE.md routing table)"
    fi
  done

  echo
  echo "## Langfuse emission test"
  if [ -n "${LANGFUSE_BASE_URL:-}" ]; then
    if curl -fsS -m 3 "${LANGFUSE_BASE_URL}/api/public/health" >/dev/null 2>&1; then
      echo "- ✓ Langfuse endpoint responding at ${LANGFUSE_BASE_URL}"
    else
      echo "- 🔴 Langfuse endpoint unreachable at ${LANGFUSE_BASE_URL} — telemetry silently dropping"
    fi
  else
    echo "- 🟡 LANGFUSE_BASE_URL not set in env — plugin may be misconfigured"
  fi

  echo
  echo "## TEL canary"
  if [ -x "$HOME/.claude/scripts/tel-canary.sh" ]; then
    "$HOME/.claude/scripts/tel-canary.sh" 2>&1 | sed 's/^/  /'
    if [ -L "$HOME/Library/LaunchAgents/bio.tel.plist" ] || [ -f "$HOME/Library/LaunchAgents/bio.tel.plist" ]; then
      if curl -fsS -m 2 http://127.0.0.1:8765/health >/dev/null 2>&1; then
        echo "- ✓ TEL daemon responding at http://127.0.0.1:8765"
      else
        echo "- 🔴 TEL plist installed but daemon not responding — launchctl kickstart -k gui/$(id -u)/bio.tel"
      fi
    else
      echo "- 🟡 TEL daemon not installed yet — see ~/.claude/tel/ops/INSTALL.md step 3"
    fi
  else
    echo "- 🟡 tel-canary.sh missing"
  fi
} >"$OUT"
