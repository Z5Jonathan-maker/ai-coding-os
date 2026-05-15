#!/usr/bin/env bash
# self-improvement-digest.sh
# Weekly performance digest. Aggregates session stats from jsonl logs +
# hook output to surface "what should the brain learn from last week".
set -euo pipefail

PROJ_DIR="${HOME}/.claude/projects"
DAYS="${1:-7}"
OUT="${HOME}/.claude/audits/digest-$(date +%Y-%m-%d).md"

[ -d "$PROJ_DIR" ] || {
  echo "no projects dir" >&2
  exit 1
}

session_count=$(find "$PROJ_DIR" -name "*.jsonl" -mtime -"$DAYS" | wc -l | tr -d ' ')

# Tool error rate — count tool_result entries with isError
tool_total=0
tool_errors=0
while IFS= read -r f; do
  t=$(jq '[.message.content[]? | select(.type == "tool_result")] | length' "$f" 2>/dev/null | awk '{s+=$1}END{print s+0}')
  e=$(jq '[.message.content[]? | select(.type == "tool_result" and .is_error == true)] | length' "$f" 2>/dev/null | awk '{s+=$1}END{print s+0}')
  tool_total=$((tool_total + t))
  tool_errors=$((tool_errors + e))
done < <(find "$PROJ_DIR" -name "*.jsonl" -mtime -"$DAYS")

err_rate="0"
[ "$tool_total" -gt 0 ] && err_rate=$(awk "BEGIN { printf \"%.2f\", ($tool_errors / $tool_total) * 100 }")

# Top tools used
top_tools=$(find "$PROJ_DIR" -name "*.jsonl" -mtime -"$DAYS" -exec jq -r '.message.content[]?.name // empty' {} \; 2>/dev/null | sort | uniq -c | sort -rn | head -10)

# Hook log volume
hook_logs=$(ls "$HOME/.claude/cc-"*.log 2>/dev/null | head -5)
hook_summary=""
for h in $hook_logs; do
  size=$(wc -l <"$h" 2>/dev/null)
  hook_summary="${hook_summary}\n- $(basename "$h"): $size lines"
done

{
  echo "# Self-improvement digest — last ${DAYS} days"
  echo "_Generated $(date)_"
  echo
  echo "## Activity"
  echo "- Sessions: $session_count"
  echo "- Tool calls (total): $tool_total"
  echo "- Tool errors: $tool_errors (${err_rate}%)"
  echo
  echo "## Top tools used"
  echo '```'
  echo "$top_tools"
  echo '```'
  echo
  echo "## Hook activity"
  echo -e "$hook_summary"
  echo
  echo "## Recommendations"
  if (($(echo "$err_rate > 5" | bc -l 2>/dev/null || echo 0))); then
    echo "- 🔴 Tool error rate above 5% — investigate via \`audit\` skill"
  fi
  if [ "$session_count" -gt 50 ]; then
    echo "- 🟡 High session count — consider running \`memory-curator\` agent"
  fi
  if [ "$session_count" -lt 5 ]; then
    echo "- 🟢 Low activity week — system idle"
  fi
} >"$OUT"

cat "$OUT"
