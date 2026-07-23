---
name: project-mym-precision-cs-parity-gap
description: "Area61Precision_v2 live .cs is NOT at 100% engine parity — diverges on 4 structural axes, but NET CONSERVATIVE (under-fires, never over-risks per-trade); safe to trade, v3 perfection is rolling"
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Do NOT assume the live Area61Precision_v2 .cs is a 100% replica of the certified
qf_engine_multi backtest.** The H120 sweep (2026-07-12 night) proved the deployed .cs
diverges from the engine on **four structural axes** beyond the known MTF-pin timezone bug:

- **(a) flat `Tol=20`** hardcoded for all 9 cells instead of scaling `0.16*QfStep` — AGGRESSIVE-leaning
  on 8/9 cells (LE ~260x / HE ~213x too wide; TP25 MYM the lone ~10% tighter). Frequency/qualification
  effect only (admits more zones into react/wall map, widens invalidation band). Does NOT touch StopPts.
- **(b) narrow ±1-4-step zone-scan** vs engine's wide 33-level anchor block — strictly CONSERVATIVE (subset).
- **(c) retry-vs-lock** — .cs re-scans subsequent bars after a rejected zone; engine locks the day's ONE
  first-touch candidate. MORE trade-DAYS than validated, but `active` flag never resets mid-day so still
  hard-capped at 1 arm/day (MaxTradesPerDay=6 never stressed). AGGRESSIVE-leaning but bounded.
- **(d) fill-timing** — .cs Place() fires from the 1-min series only AFTER the 30-min candidate bar
  closed → can only fill on a LATER re-touch; the engine assumes instant fill at candidate close. Strictly
  CONSERVATIVE admissibility filter (41% of matched MNQ candidates never filled).

**NET direction for the as-deployed book = CONSERVATIVE.** Direct proof: H119's own published v3 numbers
(with (a)+(c) unfixed) show `n_cs < n_engine` on **all 9 cells, zero overshoot** (e.g. MNQ 53 vs 262;
day-match 13.3-43.8%). (b)+(d) trade-suppression dominate (a)+(c) trade-inflation in every cell.
**Critically: NO axis touches StopPts / position size / per-trade dollar risk** — every axis affects only
which/how-many setups, never how much is risked. So the live book UNDER-fires (leaves edge on the table),
it does NOT over-risk. Rails (MDL $300-800/lane, MCL 4) bound the day regardless.

**Money-safety verdict:** safe to trade the current proven binary. The 2026-07-10 Friday LE cattle trade
(+$730, validated brackets, journal-confirmed) is the empirical proof the live path fires correct brackets.

**Deploy state 2026-07-12:** F5 HELD for Monday — no same-night rewrite (would violate no-change-stacking);
the current proven binary trades (bounded-conservative, rails hold). **H120 fixed all 5 axes** (Tol→0.16*QfStep,
ATR off-by-one, wide 33-level zone-scan, retry→lock via dayDone, MTF-pin bucket-on-start) in
`ninjascript/Area61Precision_v3.cs` + added an additive opt-in `fill_wait_1m` engine flag (default False, so
H119 recert stays valid) — lifting mean day-match 25.1%→**84.2%** (dir 99.9%, entry≤1tick 99.5%). Committed
`0f9aa28`, independently verified pre-commit (4-way adversarial: additivity gated + byte-identical default,
5 fixes bit-exact to engine, residual reproduced live, 806/2/0 tests + ruff clean). **v3 is NOT deployed/
compiled** — still a perfection candidate.

**H121 (2026-07-13, committed af0f5b8) CONFIRMED the VWAP hypothesis:** making the engine compute session VWAP
at 1-min granularity (the faithful/realizable construction the live .cs already runs; helper bit-identical to
the .cs across 494,837 comparisons) lifts day-match 84.2%→**93.3%** (+9.1pt, direction agreement 100%, eng_only
days cut 60-70% every cell). Implemented as additive opt-in `vwap_1m=False` (default byte-identical, H119 untouched).
**Edge SURVIVES all 9 cells** under 1-min VWAP (PF holds/improves on 6/9; net −5.4% from ~8% fewer higher-precision
trades = conservative). **1-min VWAP is RECOMMENDED canonical but NOT flipped** — that's deploy-gated (needs founder
sign-off + a fresh Sim101 forward-test window, since it changes every certified number). The remaining ~6.7pt is
the H120 **fill-timing axis** (engine ref's `wait_for_1m_fill` lacks the .cs's ExitByHHmm entry cutoff) = **H122**
follow-on, NOT VWAP, NOT a new bug. So v3 path to true 100%: adopt 1m VWAP canonical (founder) → close H122
fill-timing → re-cert → F5. Forensics: `forensics/h120/` + `forensics/h121/`.

**How to apply:** when reasoning about live P&L vs backtest, remember the live book is a coarser,
net-conservative subset — flat live P&L ≠ weak edge (see [[project-mym-forward-test-execution-fidelity]]).
Never claim "100% parity" until the 4 axes are closed + re-certified. Related: [[project-mym-live-config]],
[[project-mym-mtf-gate-golden-standard]], [[feedback-backtest-measures-robot-not-trader]].
