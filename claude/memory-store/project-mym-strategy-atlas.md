---
name: project-mym-strategy-atlas
description: MYM strategy re-validation on the real NT8 engine + the Strategy Atlas (edge map / portfolio architecture)
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-20: Ran a full re-validation of every MYM/US30 strategy on the REAL NT8 Strategy Analyzer (via CrossTrade MCP,
engine fingerprint afe1aaa71f4c9c6e), because the Python backtester was PROVEN systematically inflated. Source of truth now:
`mym-autotrader/docs/ai-memory/STRATEGY-ATLAS.md` (the synthesis/map) + `STRATEGY-REVALIDATION.md` (raw test log).

**OUTCOME (the headline, 2026-06-20): after exhaustive OOS testing, the ONE validated edge is ORB on MNQ (Micro Nasdaq).**
ORB-6 (opening-range breakout: first 30min defines range, enter OR-body direction, stop=opposite OR extreme, flat 15:55,
SkipDoji). MNQ full history 2023-2026 (12 contracts, 634 trades): PF 1.37/1.35/1.34 at 2/3/4-tick slippage, MAR 8-9, NO losing
year, survived the Nasdaq pullbacks (not a bull-carry — trades both directions). PASSES cost + multi-year gates. The deployable
candidate. ORB generalizes in SIGN to MES/M2K/MYM but is ROBUST only on MNQ (Nasdaq = best opening-momentum habitat). REMAINING
GATE = demo forward-test (USER-GATED; runs on live VPS the agent can't drive). Combinations DON'T beat MNQ-alone: strategy-
stacking on one instrument adds no risk-adj value; equal-weight multi-instrument DILUTES the best (M2K is the only genuine
diversifier @ corr 0.27 -> MNQ-anchored + small M2K satellite, risk-weighted MNQ-heavy, is the honest book).

EVERYTHING ELSE DIED OOS (do not resurrect without new evidence):
- S1 open-fade: in-sample +$3k but OOS -$2,894 (regime artifact; mean-reversion bleeds in trends). NOT an edge.
- S2 breakout-retest (YM): OOS +$421 (~breakeven, too thin); MNQ: OOS -$799 (PF 0.97). NOT robust.
- The "S1+S2 complementary pair" / regime gate / combined-book all-weather story = IN-SAMPLE ARTIFACTS, debunked by OOS.
- Coil, ping-pong, sniper, multi-pair NQ, last-hour-momentum, overnight-drift (long bull-carry): all dead/marginal OOS.

EARLIER IN-SAMPLE NOTES (now KNOWN to be regime-specific / non-generalizing — kept for the exit-architecture lesson only):
- S1 OPEN-FADE (VwapDirFadeQual_v4, MYM unqual, 9:30-10:15, stop50, flat15:45, 3mic): REAL, mean-reversion, regime-dependent.
  6-mo +$3,043, worst month Oct25 -$1,119 (0 wins). Owns trend-PAUSE months.
- S2 BREAKOUT-RETEST (BreakoutRetest_v2, RunnerToClose=true/Tp1=75/StopBuf=15, ~2mic): REAL but fragile trend-follower.
  THE EXIT TREASURE: capping the runner at +250 (Jonathan's literal spec / the Python) collapses it to PF 1.02; letting the
  runner RIDE uncapped (+ half-off at Tp1) is the edge. NT8 won't honor manual partial ExitLimit under a managed SetStopLoss
  -> must split each entry into 2 managed sub-entries (half H + runner R), each own SetStopLoss/SetProfitTarget.
- COMBINED BOOK (S1+S2): total +$3,365, max monthly DD -$700 vs S1-alone -$1,119 -> trend complement RAISES return AND cuts
  worst DD ~37% (MAR 2.72 -> 4.80). The two are genuinely complementary (S2 harvests Oct, the month S1 dies).
- DEBUNKED on real engine (do NOT re-add): coil (thin/single-window), ping-pong (single-window), sniper (PF 0.00),
  wall-qualification (hurts), multi-pair NQ (MNQ -$8k), 945-start, full-day. All were Python-canon mirages.

THE MISSION (per Jonathan, 2026-06-20): build a STRATEGY ATLAS = map every edge's DNA + capital-suitability + scaling path,
then assign each to a deployment Playbook (Instant-funding / Eval / Cash-compounding / Automation / Institutional-portfolio).
7-phase program: Isolate -> Optimize -> External Discovery -> Challenge Winners -> Combinatorial -> Portfolio -> Atlas.
Open gaps/next veins: May26 is red for BOTH engines (a 3rd distinct regime/edge missing); S2's Jan/WA quarters lose (needs a
with-HTF-trend SELECTION filter — Jonathan's real edge is selection, per [[feedback-backtest-measures-robot-not-trader]]).
Vehicles: Tradeify Select 150K ($5k EOD trailing DD, no consistency, 5 accts, bots OK) + own Tradovate (cash compounding).
GATE: nothing live until OOS holdout-positive + demo forward-test. See [[project-mym-autotrader-assistant]], [[project-us30-live-signals]].
