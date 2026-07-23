#!/usr/bin/env bash
# SessionStart hook: run the OS CANON guard (knowledge-store integrity) advisory.
# Surfaces drift (auto-memory orphans/split-brain, wiki dangling links, learnings
# index drift, stale 3-tier) at session start instead of letting it rot silently.
# Never blocks. 6h dedup so it doesn't thrash on rapid-restart sessions.
set -u

GUARD="$HOME/.claude/scripts/check_canon_os.py"
[ -f "$GUARD" ] || exit 0

LAST_FILE="/tmp/claude-canon-guard.last"
LAST=$(stat -f %m "$LAST_FILE" 2>/dev/null || echo 0)
NOW=$(date +%s)
[ $((NOW - LAST)) -lt 21600 ] && exit 0
touch "$LAST_FILE"

OUT=$(python3 "$GUARD" 2>/dev/null)
# stay silent when clean; surface a concise summary otherwise
if ! printf '%s' "$OUT" | grep -q "SUMMARY: 0 error(s), 0 advisory"; then
  echo "[canon-guard] knowledge-store drift — run: python3 ~/.claude/scripts/check_canon_os.py" >&2
  printf '%s\n' "$OUT" | grep -E "^  (!!|⚠|✗)" | head -8 | sed 's/^/[canon-guard] /' >&2
fi
exit 0
