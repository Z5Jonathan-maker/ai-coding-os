#!/usr/bin/env bash
# fabric self-heal — keep the trading code graphs present + the ADR intact.
# Discovered 2026-07-23: codebase-memory graphs EVICT under disk pressure, and a
# full re-index WIPES the in-graph ADR. This reflex detects both and repairs them.
# Safe to run on a timer (idempotent). Dev tooling — never touches the funded path.
set -u
CBM="$HOME/local/bin/codebase-memory-mcp"
ADR_FILE="$HOME/.claude/fabric/adr-mym-autotrader.md"
MYM="Users-leonardofibonacci-code-projects-mym-autotrader"
REPOS=(
  "$HOME/code/projects/mym-autotrader"
  "$HOME/code/projects/area61-command-center"
  "$HOME/code/projects/tradingview-mcp-jackson"
  "$HOME/code/projects/mym-multicharts"
  "$HOME/code/projects/us30-dashboard"
)
[ -x "$CBM" ] || { echo "self-heal: codebase-memory-mcp missing"; exit 1; }

# Sweep corrupt graph shards. auto_watch is disabled to stop the reindexer/CLI race that
# produced these (2026-07-23), but keep the sweep as belt-and-suspenders + disk reclaim.
if find "$HOME/.cache/codebase-memory-mcp" -name "*.corrupt" -print -quit 2>/dev/null | grep -q .; then
  echo "self-heal: removing corrupt graph shard(s)"
  find "$HOME/.cache/codebase-memory-mcp" -name "*.corrupt" -delete 2>/dev/null
fi

present="$("$CBM" cli list_projects 2>/dev/null)"   # whole output (log line + JSON); tail -1 missed the JSON and false-flagged MISSING
healed=0
for r in "${REPOS[@]}"; do
  [ -d "$r" ] || continue
  base="$(basename "$r")"
  if ! printf '%s' "$present" | grep -q -- "$base"; then
    echo "self-heal: MISSING $base -> re-indexing"
    "$CBM" cli index_repository --repo-path "$r" >/dev/null 2>&1 && healed=$((healed+1))
  fi
done

# ADR: re-apply if the flagship graph has none (a re-index wipes it)
adr="$("$CBM" cli manage_adr <<<"{\"project\":\"$MYM\"}" 2>/dev/null)"
if printf '%s' "$adr" | grep -q '"no_adr"' && [ -f "$ADR_FILE" ]; then
  python3 - "$CBM" "$MYM" "$ADR_FILE" <<'PY' && echo "self-heal: ADR re-applied"
import sys, json, subprocess
cbm, proj, adr_file = sys.argv[1], sys.argv[2], sys.argv[3]
args = {"project": proj, "mode": "update", "content": open(adr_file).read()}
subprocess.run([cbm, "cli", "manage_adr"], input=json.dumps(args),
               capture_output=True, text=True)
PY
fi

echo "self-heal: done ($healed graph(s) re-indexed)"
