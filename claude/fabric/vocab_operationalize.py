#!/usr/bin/env python3
"""Vocabulary Operationalizer — the one genuinely additive method lifted from the Lil Fish channel
(2026-07-23), adapted to the TEXT-based trade journal.

A coarse discretionary dim ("breakout") hides many finer sub-conditions. We enumerate measurable
sub-conditions (cached in vocab_ops_cache.json — the slow LLM-enumeration step, decoupled from the
fast per-run compute), detect each in the RESOLVED trades' rationale text, and keep only the ones
with a real winner/loser gradient (|expR lift| vs base). Survivors are validated finer features that
feed upstream of engine/knowledge/distill_hypotheses.py -> the gauntlet.

READ-ONLY on the journal; writes a report + candidate jsonl to the opportunity pipeline. Additive.
(Geometric v2 — join resolved trades to OHLCV via entry_time and compute wick/ATR features — is the
deeper extension once this loop is proven.)

Usage: vocab_operationalize.py [<dim>|all]   e.g. all | breakout | sweep | rejection
"""
import json, re, sys
from datetime import date
from pathlib import Path

REPO = Path("/Users/leonardofibonacci/code/projects/mym-autotrader")
JOURNALS = sorted((REPO / "engine/state").glob("trade_journal_*.jsonl"))
OUT_DIR = REPO / "vault/07-opportunity-pipeline"
CACHE = Path(__file__).resolve().parent / "vocab_ops_cache.json"
MIN_N, LIFT = 20, 0.02


def load_resolved():
    rows = []
    for f in JOURNALS:
        for line in f.open(encoding="utf-8", errors="ignore"):
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("r_multiple") is None:
                continue
            try:
                rows.append(((d.get("rationale") or "").lower(), float(d["r_multiple"])))
            except (TypeError, ValueError):
                continue
    return rows


def load_ops(dim):
    try:
        cache = json.loads(CACHE.read_text(encoding="utf-8"))
    except Exception:
        return {}
    dims = cache if dim == "all" else {dim: cache.get(dim, [])}
    return {d: [(o["name"], [k.lower() for k in o.get("keywords", []) if k]) for o in ops]
            for d, ops in dims.items() if ops}


def main():
    dim = (sys.argv[1] if len(sys.argv) > 1 else "all").lower()
    rows = load_resolved()
    if not rows:
        print("no resolved trades", file=sys.stderr); return 1
    n0 = len(rows)
    base_wr = sum(1 for _, r in rows if r > 0) / n0
    base_expR = sum(r for _, r in rows) / n0

    dims = load_ops(dim)
    if not dims:
        print(f"no operationalizations for '{dim}' (check {CACHE})", file=sys.stderr); return 1

    res = []
    for d, ops in dims.items():
        for name, kws in ops:
            if not kws:
                continue
            pat = re.compile("|".join(re.escape(k) for k in kws))
            present = [r for t, r in rows if pat.search(t)]
            n = len(present)
            if n < MIN_N:
                continue
            wr = sum(1 for r in present if r > 0) / n
            expR = sum(present) / n
            res.append({"dim": d, "name": name, "keywords": kws[:4], "n": n,
                        "win_rate": round(wr, 3), "expR": round(expR, 3),
                        "wr_lift": round(wr - base_wr, 3), "expR_lift": round(expR - base_expR, 3)})
    res.sort(key=lambda x: -abs(x["expR_lift"]))
    keep = [r for r in res if abs(r["expR_lift"]) > LIFT]

    lines = [f"# Vocab Operationalizer — '{dim}' — {date.today().isoformat()}", "",
             f"Base (resolved n={n0}): win_rate {base_wr:.3f}, expR {base_expR:+.3f}", "",
             f"{len(res)} sub-conditions with n>={MIN_N}; **{len(keep)} discriminating** "
             f"(|expR lift|>{LIFT}), ranked by |lift|:", "",
             "| dim | sub-condition | detect | n | win% | expR | expR lift |",
             "|---|---|---|--:|--:|--:|--:|"]
    for r in keep:
        lines.append(f"| {r['dim']} | {r['name']} | `{'/'.join(r['keywords'][:2])}` | {r['n']} | "
                     f"{100*r['win_rate']:.0f} | {r['expR']:+.3f} | **{r['expR_lift']:+.3f}** |")
    if OUT_DIR.exists():
        (OUT_DIR / f"vocab-ops-{dim}-{date.today().isoformat()}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
        (OUT_DIR / f"vocab-ops-{dim}.jsonl").write_text("\n".join(json.dumps(r) for r in keep) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
