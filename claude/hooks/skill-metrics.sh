#!/bin/bash
# Stop hook — increments per-skill applied counts in ~/.claude/state/skill-metrics.json
# by parsing Skill tool invocations from the active session transcript.
#
# Lifted from OpenSpace (HKUDS/OpenSpace) skill metrics pattern as a no-MCP, no-Python,
# no-SQLite variant. Full FIX-trigger logic (fallback rate threshold → auto-queue to
# /skill-creator) is v2; this v1 ships applied counts + first/last_seen timestamps.
#
# Schema (~/.claude/state/skill-metrics.json):
#   {
#     "version": 1,
#     "updated": "<ISO-8601 UTC>",
#     "skills": {
#       "<skill-name>": {
#         "applied":    <int>,
#         "first_seen": "<ISO-8601 UTC>",
#         "last_seen":  "<ISO-8601 UTC>"
#       }
#     }
#   }
#
# Defensive: no jq → no-op. Missing transcript → no-op. No skills used → no-op.
# Never blocks the Stop event chain — exit 0 on any error.
set -u

METRICS_FILE="$HOME/.claude/state/skill-metrics.json"
PROJECTS_DIR="$HOME/.claude/projects"

# jq is required for atomic JSON updates; fail-silent if absent
command -v jq >/dev/null 2>&1 || exit 0

# Find the most recently modified session jsonl across all project dirs.
# Use find -printf+sort instead of find|xargs to handle paths with spaces (SC2038-safe).
LATEST_JSONL=$(find "$PROJECTS_DIR" -name '*.jsonl' -type f -print0 2>/dev/null \
  | xargs -0 -I{} stat -f '%m %N' {} 2>/dev/null \
  | sort -rn \
  | head -1 \
  | cut -d' ' -f2-)
[ -z "$LATEST_JSONL" ] && exit 0
[ ! -f "$LATEST_JSONL" ] && exit 0

# Scan recent activity for Skill invocations.
# Pattern: tool_use blocks with {"name":"Skill","input":{"skill":"X",...}}
SKILLS_USED=$(tail -300 "$LATEST_JSONL" 2>/dev/null \
  | grep -oE '"name":"Skill"[^}]*"skill":"[^"]+"' \
  | grep -oE '"skill":"[^"]+"' \
  | cut -d'"' -f4 \
  | sort -u)

[ -z "$SKILLS_USED" ] && exit 0

# Initialize metrics file if missing or empty
if [ ! -s "$METRICS_FILE" ]; then
  mkdir -p "$(dirname "$METRICS_FILE")"
  echo '{"version":1,"updated":"","skills":{}}' > "$METRICS_FILE"
fi

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TMP=$(mktemp 2>/dev/null) || exit 0

# Build cumulative jq filter — one skill per increment, then write atomically
JQ_ARGS=(--arg now "$NOW")
JQ_FILTER='.updated = $now'

i=0
while IFS= read -r skill; do
  [ -z "$skill" ] && continue
  JQ_ARGS+=(--arg "s$i" "$skill")
  JQ_FILTER="$JQ_FILTER | .skills[\$s$i].applied = ((.skills[\$s$i].applied // 0) + 1) | .skills[\$s$i].last_seen = \$now | (.skills[\$s$i].first_seen //= \$now)"
  i=$((i+1))
done <<< "$SKILLS_USED"

jq "${JQ_ARGS[@]}" "$JQ_FILTER" "$METRICS_FILE" > "$TMP" 2>/dev/null \
  && mv "$TMP" "$METRICS_FILE" \
  || rm -f "$TMP"

exit 0
