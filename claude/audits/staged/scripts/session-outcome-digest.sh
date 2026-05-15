#!/usr/bin/env bash
# session-outcome-digest.sh
# Reads the most recent session jsonl, extracts probable failure-fix pairs and
# optimization signals, writes a CANDIDATE digest to ~/.claude/wiki/logs/
# session-candidates-<date>.md. Does NOT auto-append to failure/optimization log
# — those stay curator/Claude-driven. Reduces "what did I do this session" review
# from 30min reading transcripts to 2min reading the candidates file.
set -euo pipefail

PROJ_DIR="${HOME}/.claude/projects"
OUT="${HOME}/.claude/wiki/logs/session-candidates-$(date +%Y-%m-%d).md"

# Most recent jsonl across all project dirs
LATEST=$(find "$PROJ_DIR" -name "*.jsonl" -type f -print0 2>/dev/null \
  | xargs -0 ls -t 2>/dev/null | head -1)
[ -n "$LATEST" ] || {
  echo "no session jsonl found" >&2
  exit 0
}

# Pattern signals — extracted from message content
fail_signals=$(jq -r '
  .message.content[]?
  | select(.type == "text")
  | .text // empty
  | select(test("(?i)(failed|error|broke|fix|root cause|caused by|workaround)"; "g"))
  | "- " + (. | split("\n")[0] | .[:200])
' "$LATEST" 2>/dev/null | sort -u | head -15)

opt_signals=$(jq -r '
  .message.content[]?
  | select(.type == "text")
  | .text // empty
  | select(test("(?i)(faster|cheaper|optimization|improved|reduced|eliminated|automated)"; "g"))
  | "- " + (. | split("\n")[0] | .[:200])
' "$LATEST" 2>/dev/null | sort -u | head -15)

# Tools used + count
top_tools=$(jq -r '.message.content[]?.name // empty' "$LATEST" 2>/dev/null \
  | sort | uniq -c | sort -rn | head -8)

mkdir -p "$(dirname "$OUT")"
{
  echo "# Session candidates — $(date)"
  echo "_Source: $(basename "$LATEST")_"
  echo
  echo "**Review and promote** to failure-log.md / optimization-log.md if substantive. Discard if noise."
  echo
  echo "## Possible failures + fixes"
  echo "${fail_signals:-(none detected)}"
  echo
  echo "## Possible optimizations"
  echo "${opt_signals:-(none detected)}"
  echo
  echo "## Tool usage this session"
  echo '```'
  echo "${top_tools:-(empty)}"
  echo '```'
} >"$OUT"

echo "$OUT"
