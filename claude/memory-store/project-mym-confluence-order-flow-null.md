---
name: project-mym-confluence-order-flow-null
description: "MYM order-flow/confluence research — PARKED for future continuation. Rigorous verdict: order flow doesn't systematize on YM (both data layers); it's a discretionary conviction tool. Full arc + owned data + resume points inside."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-28: Exhaustive investigation of whether order-flow / volume-profile / microstructure (the 22-concept
"institutional toolkit" from IG educator @zak.elga) improves the MYM strategies on QF. Method = industry-leading
rigor (meta-labeling + CPCV + Deflated Sharpe + BH-FDR; engine calibrated by reproducing the MTF gate at §12
2.32×). **PARKED as future continuation** at founder's request. Verdict + everything needed to resume below.

## THE ARC (what was tested, in order)
1. **Single order-flow features** (1m proxies AND $155 real tick `trades`, 123.6M YM trades) gating the 4 fades → NULL.
2. **Meta-model** (LogisticRegression+GBM on VWAP-dist+CVD-divergence+vol+delta → P(win)) → found a SIZER edge
   on §12/Sniper that survived nested-CPCV + multi-cut forward (AUC ~0.65)... BUT dummy-proof equal-risk on top
   of the DEPLOYED MTF gate = only **1.04× §12 / 1.17× Sniper** → mostly REDUNDANT with the MTF gate. Marginal.
3. **Liquidity sweeps** (naive AND research-faithful: reclaim+delta+overnight/equal pools+NY-open) → null/marginal
   (PDH/PDL breaks CONTINUE 67-81% per Edgeful; sweep-fade is mostly discretionary lore).
4. **Continuation/breakout** (the opposite of fading; never tested before) → null (base-rate bias ≠ tradeable entry).
5. **ORDER BOOK / resting liquidity** ($25 MBO pilot, the RIGHT data layer founder flagged): reconstructed the
   book; FILL-based features (absorption/iceberg) null; resting-WALL size faint+positive on 102 fade-taps (AUC 0.60,
   NOT significant) but INVERTED on 332 all-QF-touches (AUC 0.20) → CONTEXT-DEPENDENT confound, not a standalone edge.
6. **YouTube/credibility research** (who actually makes money): NO verified systematic YM order-flow strategy
   exists. Only YM-specific channel = Kodi Kai Trades (course funnel, unverified). Credible names (Axia Futures
   FCA-regulated desk, FuturesTrader71, Jigsaw/Peter Davies, Merritt Black/SMB) trade ES/NQ, publish ZERO audited
   P&L. 97% of futures day-traders lose; 7% of prop entrants ever get a payout. Axia (the one proof OF works) =
   apprenticeship + 1-3 selected/cohort + discretionary — NOT a buyable system. FT71: order flow is "an execution
   tool, NOT a trading system." Practitioner: "reading the tape isn't edge... what's human is reconstructing intent."

## VERDICT (don't re-litigate without a genuinely new angle)
Order flow — executed-trade layer AND resting-liquidity/book layer — does NOT produce a robust SYSTEMATIC edge on
YM for a level-trader. It's a **discretionary, in-the-moment conviction read** (which is what real order-flow pros
+ the academic/HFT reality both say). The book is 60-80% spoofed; the academic edge is sub-2min/HFT-arbitraged. The
real systematic edge stays **QF + MTF gate**. Order flow's real use for the founder = conviction on his MANUAL trades
(matches his own edge = discretionary QF selection, see [[user-trading-legacy-not-money]]).

## OWNED ASSETS (kept — don't re-buy; total spent $180)
- data/databento/ym_trades_2021_2026.dbn.zst ($155, 123.6M trades) + ym_trades_agg.npz (per-min delta + tick profile)
- data/databento/ym_mbo_2026q2.dbn.zst ($25, 3mo full order book) + qf_tap_orderbook.parquet + all_qf_touches.parquet
- backtest/confluence/: PRE-REGISTRATION + harness.py (CPCV/DSR/BH-FDR validation engine, reusable for ANY future
  idea) + features/features_hifi/expanded_skeptic/stress_test/multicut/free_only/build_orderbook_features/
  all_qf_touches/liquidity_sweep/improved_sweep/continuation.py. docs/ai-memory/ORDER-FLOW-CONFLUENCE-PLAN.md.

## FUTURE CONTINUATION (if resumed)
1. The wall signal is CONTEXT-DEPENDENT (holds→reversal, eaten→continuation) — could test it CONDITIONAL on a
   day-type/regime classifier (only inside reversal contexts). Needs more MBO (~$100/yr) to get significance.
2. Build the live "wall hold vs stop-flush" readout at the QFs = the discretionary CONVICTION tool (the genuine
   use). NOT systematic — a manual aid. Founder was offered this; deferred.
3. The marginal Sniper meta-sizer (1.17×) could be Sim101 forward-tested if ever wanted.
4. Develop the discretionary order-flow READ as a skill: Axia Futures / FT71 / Jigsaw concepts (ES/NQ), not a YM system.
5. LESSON baked into the harness: always run the meta-model (not just single features); build features per their
   REAL definition (divergence≠confirmation); test the RIGHT data layer (book≠trades); be as skeptical of a NULL
   as a positive; a statistical bias (67% PDH continuation) ≠ a tradeable entry.
Relates to [[project-mym-mtf-gate-golden-standard]].
