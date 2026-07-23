#!/usr/bin/env python3
"""Vocabulary Geometric Operationalizer v2 — chart-geometry extension of vocab_operationalize.py.

The text v1 scores keyword sub-conditions in resolved rationale text. This v2 joins resolved trades
to the nearest 1m OHLCV bar at/before entry_time, computes real entry geometry (wicks, ATR-normalized
swings/rounds, volume, compression), and keeps features whose ordered buckets show a monotone win/loss
gradient. Survivors feed upstream of engine/knowledge/distill_hypotheses.py -> the gauntlet.

READ-ONLY on engine/state journals and data/databento tape; writes only the opportunity report/jsonl.
UKOIL is intentionally unmapped. ATR is rolling 1m true range mean(14). Swings are 5-bar fractals
confirmed two bars later. No bars after the matched entry bar are used; ts_event is treated as the
completed-minute timestamp.

Usage: vocab_geometric.py
"""
import json, sys
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd

REPO = Path("/Users/leonardofibonacci/code/projects/mym-autotrader")
JOURNALS = [REPO / "engine/state" / f"trade_journal_{n}.jsonl"
            for n in "crypto energy gold indices platinum silver".split()]
TAPE_DIR, OUT_DIR = REPO / "data/databento", REPO / "vault/07-opportunity-pipeline"
TODAY = date.today().isoformat()
OUT_MD, OUT_JSONL = OUT_DIR / f"vocab-geometric-{TODAY}.md", OUT_DIR / f"vocab-geometric-{TODAY}.jsonl"
MIN_N, SPREAD, TOL, ATR_N, LOOKBACK, VOL_N, PIVOT, EPS = 20, 0.02, pd.Timedelta("5min"), 14, 50, 20, 2, 1e-9

TAPES = {
    "XAUUSD": ["gc_v0_ext_1m.parquet", "gc_1m_2023-06_2026-06.parquet"],
    "US30": ["ym_c0_ext_1m.parquet", "ym_1m_2023-06_2026-06.parquet"],
    "NAS100": ["nq_c0_ext_1m.parquet", "nq_1m_2023-06_2026-06.parquet"],
    "SPX500": ["es_c0_ext_1m.parquet", "es_1m_2023-06_2026-06.parquet"],
    "US2000": ["rty_1m_2021_2026.parquet"], "USOIL": ["cl_c0_ext_1m.parquet", "cl_1m_2023-06_2026-06.parquet"],
    "NGAS": ["ng_1m_2021_2026.parquet"], "XPTUSD": ["pl_1m_2021_2026.parquet"],
    "XAGUSD": ["si_1m_2021_2026.parquet"], "BTCUSD": ["btc_1m.parquet"], "ETHUSD": ["eth_1m_2021_2026.parquet"],
}
ROUND1 = {"BTCUSD": 500, "ETHUSD": 50, "XAUUSD": 10, "XAGUSD": 0.5, "XPTUSD": 10,
          "US30": 100, "NAS100": 50, "SPX500": 25, "US2000": 10, "USOIL": 1, "NGAS": 0.1}
ROUND2 = {"BTCUSD": 1000, "ETHUSD": 100, "XAUUSD": 25, "XAGUSD": 1, "XPTUSD": 25,
          "US30": 250, "NAS100": 100, "SPX500": 50, "US2000": 25, "USOIL": 5, "NGAS": 0.25}
DEFS = {
    "body_range": "abs(close-open)/(high-low) on matched entry bar",
    "upper_wick_range": "(high-max(open,close))/(high-low) on matched entry bar",
    "lower_wick_range": "(min(open,close)-low)/(high-low) on matched entry bar",
    "close_pos_range": "(close-low)/(high-low), 0=low and 1=high",
    "body_aligned_with_trade": "direction * (close-open)/(high-low); positive favors trade side",
    "close_pos_for_trade": "long=close_pos, short=1-close_pos",
    "atr14_1m": "rolling mean true range over last 14 one-minute bars",
    "bar_range_atr": "(high-low)/ATR14 on matched entry bar",
    "atr14_ratio_50": "ATR14 now / ATR14 from 50 bars ago",
    "lookback50_range_atr": "(50-bar high - 50-bar low)/ATR14, ending at entry bar",
    "dist_round1_atr": "distance from entry price to nearest instrument round increment / ATR14",
    "dist_round2_atr": "distance from entry price to nearest coarser round increment / ATR14",
    "bars_since_swing_high": "bars since latest confirmed 5-bar fractal swing high",
    "bars_since_swing_low": "bars since latest confirmed 5-bar fractal swing low",
    "entry_vs_prior50_extreme_atr": "long: entry-prior50_high; short: prior50_low-entry, / ATR14",
    "dist_nearest_prior50_extreme_atr": "min distance from entry to prior 50-bar high/low, / ATR14",
    "dir_wick_beyond_swing_atr": "trade-side wick beyond latest confirmed swing, clipped at 0, / ATR14",
    "opp_wick_beyond_swing_atr": "opposite-side wick beyond latest confirmed swing, clipped at 0, / ATR14",
    "vol_vs_med20": "entry-bar volume / median volume of prior 20 bars",
    "gap_atr": "abs(entry open - prior close)/ATR14",
}
FEATS = list(DEFS)
TAPE_COLS = ["ts_event", "open", "high", "low", "close", "volume"]
MERGE_COLS = ["ts_event", "open", "high", "low", "close", "body_range", "upper_wick_range", "lower_wick_range",
              "close_pos_range", "atr14_1m", "bar_range_atr", "atr14_ratio_50", "lookback50_range_atr",
              "prior50_high", "prior50_low", "last_swing_high", "last_swing_low", "bars_since_swing_high",
              "bars_since_swing_low", "vol_vs_med20", "gap_atr"]


def load_trades():
    rows = []
    for f in JOURNALS:
        for line in f.open(encoding="utf-8", errors="ignore"):
            try:
                d = json.loads(line); r = d.get("r_multiple")
                if r is not None:
                    rows.append({"instrument": d.get("instrument"), "direction": (d.get("direction") or "").lower(),
                                 "entry_time": d.get("entry_time"), "entry_price": d.get("entry_price"),
                                 "r_multiple": float(r)})
            except Exception:
                continue
    df = pd.DataFrame(rows)
    if df.empty:
        return df
    try:
        df["entry_ts"] = pd.to_datetime(df["entry_time"], utc=True, errors="coerce", format="mixed")
    except TypeError:
        df["entry_ts"] = pd.to_datetime(df["entry_time"], utc=True, errors="coerce")
    df["entry_price"] = pd.to_numeric(df["entry_price"], errors="coerce")
    return df


def read_tape(inst):
    frames = []
    for name in TAPES[inst]:
        p = TAPE_DIR / name
        if not p.exists():
            raise FileNotFoundError(str(p))
        frames.append(pd.read_parquet(p, columns=TAPE_COLS))
    df = pd.concat(frames, ignore_index=True) if len(frames) > 1 else frames[0]
    df["ts_event"] = pd.to_datetime(df["ts_event"], utc=True, errors="coerce")
    df = df.dropna(subset=["ts_event"]).sort_values("ts_event").drop_duplicates("ts_event", keep="last").reset_index(drop=True)
    for c in TAPE_COLS[1:]:
        df[c] = pd.to_numeric(df[c], errors="coerce")
    return add_tape_features(df)


def add_tape_features(df):
    ix = pd.Series(np.arange(len(df)), index=df.index, dtype="float64")
    o, h, l, c, v = df["open"], df["high"], df["low"], df["close"], df["volume"]
    rng, pc = (h - l).replace(0, np.nan), c.shift(1)
    tr = pd.concat([(h - l).abs(), (h - pc).abs(), (l - pc).abs()], axis=1).max(axis=1)
    atr = tr.rolling(ATR_N, min_periods=5).mean().replace(0, np.nan)
    ph = (h > h.shift(1)) & (h > h.shift(2)) & (h >= h.shift(-1)) & (h >= h.shift(-2))
    pl = (l < l.shift(1)) & (l < l.shift(2)) & (l <= l.shift(-1)) & (l <= l.shift(-2))
    phv, plv = h.where(ph).shift(PIVOT).ffill(), l.where(pl).shift(PIVOT).ffill()
    phi, pli = ix.where(ph).shift(PIVOT).ffill(), ix.where(pl).shift(PIVOT).ffill()
    df["body_range"], df["upper_wick_range"] = (c - o).abs() / rng, (h - np.maximum(o, c)) / rng
    df["lower_wick_range"], df["close_pos_range"] = (np.minimum(o, c) - l) / rng, (c - l) / rng
    df["atr14_1m"], df["bar_range_atr"], df["atr14_ratio_50"] = atr, (h - l) / atr, atr / atr.shift(LOOKBACK)
    df["lookback50_range_atr"] = (h.rolling(LOOKBACK, min_periods=10).max() - l.rolling(LOOKBACK, min_periods=10).min()) / atr
    df["prior50_high"], df["prior50_low"] = h.shift(1).rolling(LOOKBACK, min_periods=10).max(), l.shift(1).rolling(LOOKBACK, min_periods=10).min()
    df["last_swing_high"], df["last_swing_low"] = phv, plv
    df["bars_since_swing_high"], df["bars_since_swing_low"] = ix - phi, ix - pli
    df["vol_vs_med20"] = v / v.shift(1).rolling(VOL_N, min_periods=5).median().replace(0, np.nan)
    df["gap_atr"] = (o - pc).abs() / atr
    return df


def round_dist(px, step, atr):
    st = step.replace(0, np.nan)
    return (px - (px / st).round() * st).abs() / atr


def match_all(trades):
    rows, cov, gaps = [], [], {"unmapped": {}, "parse_fail": 0, "tape_error": {}, "no_bar": {}}
    for inst, g in trades.groupby("instrument", dropna=False):
        inst = "UNKNOWN" if pd.isna(inst) else inst; total = len(g)
        if inst not in TAPES:
            gaps["unmapped"][inst] = total
            cov.append({"instrument": inst, "total": total, "matched": 0, "mapped": "no", "rows": 0, "min": "", "max": ""}); continue
        gaps["parse_fail"] += int(g["entry_ts"].isna().sum())
        gv = g.dropna(subset=["entry_ts"]).sort_values("entry_ts").reset_index(drop=True)
        try:
            tape = read_tape(inst) if not gv.empty else pd.DataFrame()
        except Exception as e:
            gaps["tape_error"][inst] = f"{total}: {e}"
            cov.append({"instrument": inst, "total": total, "matched": 0, "mapped": "error", "rows": 0, "min": "", "max": ""}); continue
        if tape.empty or gv.empty:
            cov.append({"instrument": inst, "total": total, "matched": 0, "mapped": "yes", "rows": 0, "min": "", "max": ""}); continue
        m = pd.merge_asof(gv, tape[MERGE_COLS], left_on="entry_ts", right_on="ts_event", direction="backward", tolerance=TOL)
        miss = int(m["ts_event"].isna().sum())
        if miss:
            gaps["no_bar"][inst] = miss
        m = m.dropna(subset=["ts_event"]).copy()
        if len(m):
            atr, rng = m["atr14_1m"].replace(0, np.nan), (m["high"] - m["low"]).replace(0, np.nan)
            long, side = m["direction"].eq("long"), np.where(m["direction"].eq("long"), 1.0, -1.0)
            m["entry_px"] = m["entry_price"].fillna(m["open"])
            m["body_aligned_with_trade"] = side * (m["close"] - m["open"]) / rng
            m["close_pos_for_trade"] = np.where(long, m["close_pos_range"], 1 - m["close_pos_range"])
            m["entry_vs_prior50_extreme_atr"] = np.where(long, (m["entry_px"] - m["prior50_high"]) / atr, (m["prior50_low"] - m["entry_px"]) / atr)
            m["dist_nearest_prior50_extreme_atr"] = np.minimum((m["entry_px"] - m["prior50_high"]).abs(), (m["entry_px"] - m["prior50_low"]).abs()) / atr
            m["dir_wick_beyond_swing_atr"] = np.where(long, np.maximum(0, m["high"] - m["last_swing_high"]) / atr, np.maximum(0, m["last_swing_low"] - m["low"]) / atr)
            m["opp_wick_beyond_swing_atr"] = np.where(long, np.maximum(0, m["last_swing_low"] - m["low"]) / atr, np.maximum(0, m["high"] - m["last_swing_high"]) / atr)
            m["dist_round1_atr"] = round_dist(m["entry_px"], m["instrument"].map(ROUND1).astype(float), atr)
            m["dist_round2_atr"] = round_dist(m["entry_px"], m["instrument"].map(ROUND2).astype(float), atr)
            rows.append(m[["instrument", "direction", "entry_ts", "ts_event", "entry_px", "r_multiple"] + FEATS])
        cov.append({"instrument": inst, "total": total, "matched": len(m), "mapped": "yes", "rows": len(tape),
                    "min": tape["ts_event"].min().isoformat(), "max": tape["ts_event"].max().isoformat()})
    return (pd.concat(rows, ignore_index=True) if rows else pd.DataFrame()), cov, gaps


def bucketize(df, feat):
    s = pd.to_numeric(df[feat], errors="coerce").replace([np.inf, -np.inf], np.nan)
    x = df.loc[s.notna(), ["r_multiple"]].copy(); x[feat] = s.dropna()
    if len(x) < MIN_N or x[feat].nunique() < 2:
        return [], "too_few", 0, 0, 0
    try:
        x["bucket"] = pd.qcut(x[feat], 3, labels=["low", "mid", "high"], duplicates="drop")
    except ValueError:
        x["bucket"] = pd.NA
    if x["bucket"].nunique(dropna=True) < 3:
        x["bucket"] = np.where(x[feat] <= x[feat].median(), "low", "high")
    rows = []
    for b in [b for b in ["low", "mid", "high"] if b in set(x["bucket"].dropna())]:
        r, vals = x.loc[x["bucket"].eq(b), "r_multiple"], x.loc[x["bucket"].eq(b), feat]
        rows.append({"bucket": b, "n": int(len(r)), "win_rate": round(float((r > 0).mean()), 3),
                     "expR": round(float(r.mean()), 3), "lo": round(float(vals.min()), 4), "hi": round(float(vals.max()), 4)})
    wr, er = [r["win_rate"] for r in rows], [r["expR"] for r in rows]
    wsp, esp = max(wr) - min(wr), max(er) - min(er)
    mono = (all(np.diff(wr) >= -EPS) or all(np.diff(wr) <= EPS) or all(np.diff(er) >= -EPS) or all(np.diff(er) <= EPS))
    return rows, ("monotone" if mono and (wsp >= SPREAD or esp >= SPREAD) else "mixed"), round(wsp, 3), round(esp, 3), len(x)


def fmt(rows):
    return "<br>".join(f"{r['bucket']} [{r['lo']},{r['hi']}]: n={r['n']} wr={100*r['win_rate']:.1f}% expR={r['expR']:+.3f}" for r in rows)


def main():
    trades = load_trades()
    if trades.empty:
        print("no resolved trades", file=sys.stderr); return 1
    n0, base_wr, base_expR = len(trades), float((trades["r_multiple"] > 0).mean()), float(trades["r_multiple"].mean())
    matched, cov, gaps = match_all(trades)
    if matched.empty:
        print("no trades matched to tape", file=sys.stderr); return 1
    mn, m_wr, m_expR = len(matched), float((matched["r_multiple"] > 0).mean()), float(matched["r_multiple"].mean())
    tested, keep = [], []
    for feat in FEATS:
        bs, verdict, wsp, esp, n = bucketize(matched, feat)
        rec = {"name": feat, "definition": DEFS[feat], "n": n, "buckets": bs, "verdict": verdict, "win_rate_spread": wsp, "expR_spread": esp}
        tested.append(rec); keep += [rec] if verdict == "monotone" else []
    keep.sort(key=lambda r: (-r["expR_spread"], -r["win_rate_spread"], r["name"]))
    lines = [f"# Vocab Geometric Operationalizer — {TODAY}", "",
             f"**Tape coverage: {mn}/{n0} resolved trades matched ({100*mn/n0:.1f}%).**",
             f"Base all resolved: win_rate {base_wr:.3f}, expR {base_expR:+.3f}.",
             f"Matched subset: win_rate {m_wr:.3f}, expR {m_expR:+.3f}.", "", "## Coverage By Instrument", "",
             "| instrument | total | matched | coverage | mapped | tape rows | tape min | tape max |",
             "|---|--:|--:|--:|---|--:|---|---|"]
    for c in sorted(cov, key=lambda x: x["instrument"]):
        lines.append(f"| {c['instrument']} | {c['total']} | {c['matched']} | {100*c['matched']/c['total']:.1f}% | {c['mapped']} | {c['rows']} | {c['min']} | {c['max']} |")
    lines += ["", "## All Tested Features", "", "| feature | n | buckets low -> high | verdict | wr spread | expR spread |", "|---|--:|---|---|--:|--:|"]
    lines += [f"| {r['name']} | {r['n']} | {fmt(r['buckets'])} | {r['verdict']} | {r['win_rate_spread']:.3f} | {r['expR_spread']:+.3f} |" for r in tested]
    lines += ["", "## Surviving Monotone Features", "",
              f"{len(keep)} features passed monotonicity plus spread >= {SPREAD}, ranked by expR spread.", "",
              "| rank | feature | definition | buckets low -> high | wr spread | expR spread |", "|--:|---|---|---|--:|--:|"]
    lines += [f"| {i} | {r['name']} | {r['definition']} | {fmt(r['buckets'])} | {r['win_rate_spread']:.3f} | {r['expR_spread']:+.3f} |"
              for i, r in enumerate(keep, 1)]
    lines += ["", "## Caveats", "", "- UKOIL is intentionally unmapped; no Brent proxy substitution was used.",
              f"- Parse failures: {gaps['parse_fail']}; no tape bar within {TOL}: {gaps['no_bar'] or {}}.",
              f"- Tape load errors: {gaps['tape_error'] or {}}.",
              "- Features use 1-minute OHLCV only; volume ratios depend on the vendor's contract/session aggregation.",
              "- Matched entry bar is the nearest tape timestamp at or before entry_time; no later bars are included."]
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT_JSONL.write_text("\n".join(json.dumps(r) for r in keep) + ("\n" if keep else ""), encoding="utf-8")
    print("\n".join(lines[:6])); print(f"{len(tested)} features tested; {len(keep)} monotone survivors")
    print(f"wrote {OUT_MD}"); print(f"wrote {OUT_JSONL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
