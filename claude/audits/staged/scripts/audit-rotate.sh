#!/usr/bin/env bash
# audit-rotate.sh
# Rotates ~/.claude/audits/ to prevent unbounded growth from daily/weekly
# self-monitor outputs. Compresses .md files older than 30 days into a
# monthly tarball; deletes tarballs older than 1 year.
set -euo pipefail

AUDIT_DIR="${HOME}/.claude/audits"
ARCHIVE_DIR="${AUDIT_DIR}/archive"

[ -d "$AUDIT_DIR" ] || { echo "audit dir missing" >&2; exit 1; }
mkdir -p "$ARCHIVE_DIR"

# Find .md files older than 30 days, group by year-month, tar.gz them
find "$AUDIT_DIR" -maxdepth 1 -name "*.md" -type f -mtime +30 -print0 | \
  while IFS= read -r -d '' f; do
    # Extract YYYY-MM from filename if it has a date pattern
    base=$(basename "$f")
    ym=$(echo "$base" | grep -oE '[0-9]{4}-[0-9]{2}' | head -1)
    [ -z "$ym" ] && ym=$(date -r "$f" +%Y-%m)
    tarball="$ARCHIVE_DIR/audits-$ym.tar.gz"

    if [ -f "$tarball" ]; then
      # Append to existing tarball (need to extract, add, recreate)
      tmp=$(mktemp -d)
      tar -xzf "$tarball" -C "$tmp" 2>/dev/null || true
      mv "$f" "$tmp/"
      tar -czf "$tarball.new" -C "$tmp" . && mv "$tarball.new" "$tarball"
      rm -rf "$tmp"
    else
      tar -czf "$tarball" -C "$AUDIT_DIR" "$base"
      rm -f "$f"
    fi
    echo "rotated: $base → audits-$ym.tar.gz"
  done

# Delete tarballs older than 1 year
find "$ARCHIVE_DIR" -name "audits-*.tar.gz" -type f -mtime +365 -print0 | \
  while IFS= read -r -d '' t; do
    echo "expiring: $(basename "$t") (>1y old)"
    rm -f "$t"
  done

# Report
md_count=$(find "$AUDIT_DIR" -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
arch_count=$(find "$ARCHIVE_DIR" -name "audits-*.tar.gz" | wc -l | tr -d ' ')
size=$(du -sh "$AUDIT_DIR" | awk '{print $1}')
echo "---"
echo "audit dir: $md_count active .md, $arch_count archives, total $size"
