#!/usr/bin/env bash
# skill-usage-tracker.sh
# Scan recent Claude Code session jsonl for skill invocations + frequencies.
# Reveals which skills get used vs gather dust → input to deprecation decisions.
set -euo pipefail

PROJ_DIR="${HOME}/.claude/projects"
DAYS="${1:-30}"
OUT="${HOME}/.claude/audits/skill-usage-$(date +%Y-%m-%d).md"

[ -d "$PROJ_DIR" ] || {
  echo "no projects dir at $PROJ_DIR" >&2
  exit 1
}

# Collect every Skill tool invocation from sessions modified in the last N days.
tmp=$(mktemp)
find "$PROJ_DIR" -name "*.jsonl" -type f -mtime -"$DAYS" | while read -r f; do
  jq -r 'select(.message.content[]?.type == "tool_use" and .message.content[].name == "Skill") | .message.content[] | select(.name == "Skill") | .input.skill' "$f" 2>/dev/null
done | sort | uniq -c | sort -rn >"$tmp"

# All skills on disk
all_skills=$(find "$HOME/.claude/skills" -maxdepth 1 -mindepth 1 -printf "%f\n" 2>/dev/null)
if [ -z "$all_skills" ]; then
  for d in "$HOME"/.claude/skills/*/; do
    name=$(basename "$d")
    case "$name" in backup*) continue ;; esac
    all_skills="$all_skills$name"$'\n'
  done
fi

{
  echo "# Skill usage — last ${DAYS} days"
  echo "_Generated $(date)_"
  echo
  echo "## Used skills (descending)"
  echo
  echo '| Count | Skill |'
  echo '|---|---|'
  awk '{ print "| "$1" | `"$2"` |" }' "$tmp"
  echo
  echo "## Unused skills (zero invocations in window)"
  echo
  used=$(awk '{print $2}' "$tmp")
  for s in $all_skills; do
    grep -qx "$s" <<<"$used" || echo "- \`$s\`"
  done
} >"$OUT"

rm -f "$tmp"
cat "$OUT"
