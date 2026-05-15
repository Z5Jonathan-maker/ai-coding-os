#!/usr/bin/env bash
# mcp-usage-tracker.sh
# Mirror of skill-usage-tracker.sh but for MCP tools. Surfaces which MCPs
# actually get invoked vs gather dust → input to retirement decisions.
# Counts every mcp__<server>__<tool> tool call across recent jsonl sessions.
set -euo pipefail

PROJ_DIR="${HOME}/.claude/projects"
DAYS="${1:-30}"
OUT="${HOME}/.claude/audits/mcp-usage-$(date +%Y-%m-%d).md"

[ -d "$PROJ_DIR" ] || {
  echo "no projects dir" >&2
  exit 1
}

tmp=$(mktemp)
find "$PROJ_DIR" -name "*.jsonl" -type f -mtime -"$DAYS" -print0 \
  | xargs -0 jq -r '.message.content[]?.name // empty' 2>/dev/null \
  | grep -E "^mcp__" \
  | awk -F'__' '{print $2}' \
  | sort | uniq -c | sort -rn >"$tmp"

# All MCPs currently loaded — skip "Checking..." header line, only keep
# lines that look like "<name>: <url>" with a real connection state
loaded_mcps=$(claude mcp list 2>/dev/null \
  | grep -vE "^Checking|^$" \
  | grep -E ":\s+\S+\s+-\s+(✓|!|✗)" \
  | awk -F: '{print $1}' | tr ' ' '_' | sed 's/^claude.ai_/claude_ai_/')

{
  echo "# MCP usage — last ${DAYS} days"
  echo "_Generated $(date)_"
  echo
  echo "## Used MCPs (descending by tool-call count)"
  echo
  echo '| Calls | MCP server |'
  echo '|---|---|'
  awk '{ print "| "$1" | `"$2"` |" }' "$tmp"
  echo
  echo "## Loaded but unused MCPs (zero calls in window)"
  echo
  used=$(awk '{print $2}' "$tmp")
  for m in $loaded_mcps; do
    grep -qx "$m" <<<"$used" || echo "- \`$m\`"
  done
  echo
  echo "## Recommendations"
  unused_count=$(comm -23 <(echo "$loaded_mcps" | sort) <(echo "$used" | sort) | wc -l | tr -d ' ')
  if [ "$unused_count" -gt 5 ]; then
    echo "- 🟡 $unused_count MCPs loaded but unused in last ${DAYS}d — consider retiring (frees session-start time + avoids fallback recommendations cluttering MCP probe)"
  fi
} >"$OUT"

rm -f "$tmp"
echo "$OUT"
