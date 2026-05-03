#!/usr/bin/env bash
# memory-health-check.sh
# Walks ~/.claude auto-memory: line counts, broken pointers, orphan files,
# stale entries (>90d). Flags but does not delete. Run weekly via cron.
set -euo pipefail

MEM_DIR="${HOME}/.claude/projects/-Users-leonardofibonacci-Claude-Code/memory"
INDEX="${MEM_DIR}/MEMORY.md"
OUT="${HOME}/.claude/audits/memory-health-$(date +%Y-%m-%d).md"

[ -d "$MEM_DIR" ] || { echo "memory dir missing: $MEM_DIR" >&2; exit 1; }

declare -a issues=()

# 1. MEMORY.md size
if [ -f "$INDEX" ]; then
  lines=$(wc -l < "$INDEX")
  [ "$lines" -gt 180 ] && issues+=("🟡 MEMORY.md at ${lines}/200 lines — consolidate")
  [ "$lines" -gt 200 ] && issues+=("🔴 MEMORY.md exceeds 200 lines (${lines}) — overflow truncates in session context")
else
  issues+=("🔴 MEMORY.md missing")
fi

# 2. Broken pointers in MEMORY.md → file
while IFS= read -r linkfile; do
  [ -f "$MEM_DIR/$linkfile" ] || issues+=("🔴 broken pointer in MEMORY.md: $linkfile not found")
done < <(grep -oE '\[[^]]+\]\([^)]+\.md\)' "$INDEX" 2>/dev/null | sed -E 's/.*\(([^)]+)\).*/\1/')

# 3. Orphan memory files (file exists but no MEMORY.md pointer)
for f in "$MEM_DIR"/*.md; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  [ "$base" = "MEMORY.md" ] && continue
  grep -q "($base)" "$INDEX" 2>/dev/null || issues+=("🟡 orphan: $base exists but no MEMORY.md entry")
done

# 4. Frontmatter completeness
for f in "$MEM_DIR"/*.md; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  [ "$base" = "MEMORY.md" ] && continue
  for field in name description type; do
    grep -qE "^${field}:" "$f" || issues+=("🟡 $base missing frontmatter field: $field")
  done
done

# 5. Stale project memories (mtime > 90 days)
while IFS= read -r f; do
  base=$(basename "$f")
  age_days=$(( ($(date +%s) - $(stat -f %m "$f" 2>/dev/null || stat -c %Y "$f")) / 86400 ))
  [ "$age_days" -gt 90 ] && issues+=("🟢 $base last modified ${age_days}d ago — review for staleness")
done < <(find "$MEM_DIR" -name "project_*.md" -type f)

{
  echo "# Memory health — $(date)"
  echo
  echo "MEMORY.md: $(wc -l < "$INDEX" 2>/dev/null || echo 0) lines"
  echo "Files in memory dir: $(find "$MEM_DIR" -maxdepth 1 -name "*.md" -type f | wc -l | tr -d ' ')"
  echo
  if [ ${#issues[@]} -eq 0 ]; then
    echo "✓ All clean."
  else
    echo "Issues:"
    printf '%s\n' "${issues[@]}"
  fi
} > "$OUT"

cat "$OUT"
