#!/usr/bin/env bash
# W2 loop-integration adapter — feed the DISTILLED journal hypotheses through the resonance
# pre-filter, so the operator/loop sees which journal-derived setups resemble failed research
# BEFORE they get promoted to gauntlet runs. Read-only on the jsonl; writes only the pre-filter
# report. Decoupled from the engine — reconstructs the hypothesis string from kind+dims.
set -u
JH="${1:-$HOME/code/projects/mym-autotrader/engine/state/journal_hypotheses.jsonl}"
[ -f "$JH" ] || { echo "w2-scan: no hypotheses file: $JH" >&2; exit 1; }
python3 - "$JH" <<'PY' | python3 "$HOME/.claude/fabric/w2_prefilter.py" --stdin
import json, sys
for line in open(sys.argv[1], encoding="utf-8"):
    try:
        d = json.loads(line)
    except Exception:
        continue
    s = (" ".join(d.get("dims", [])) + " " + str(d.get("kind", ""))).strip()
    if s:
        print(s)
PY
