---
name: project-mym-ramp-live-forensic-verdict
description: "2026-07-15 (wf w9pmhgq2l): founder's live MNQ Ramp short (29,950, flattened -17.25pt at 9:30, then fell 186pt through TP) triggered a full forensic of his hypothesis 'the signal is a winner, the backtest tested a broken config.' VERDICT: FALSIFIED both halves. (1) VWAP-from-0930 bug is in PRECISION not Ramp — Ramp already uses the correct 18:00 Globex anchor; fixing it is neutral (+$268). (2) Uncapping the 9:30 flatten (his fix) is the WORST change (-$5,283) — the 9:30 cap is PROTECTIVE because pre-open fades reverse into the RTH open and get stopped. All 8 honest cells lose (PF 0.60-0.87, boot P(loss) 0.78-0.99). Today's win = n=1 SURVIVORSHIP (its pre-open leg was a -17pt loss). Real gap = execution-fidelity (cert look-ahead fills). KILL BY DEFAULT, stay Sim-locked. The edge, if any, is DISCRETIONARY selection (he recognized today's hold-past-open winner; the mechanical rule can't)."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Ramp live-trade forensic (2026-07-15, wf w9pmhgq2l; forensics/ramp-corrected/).** Founder showed 2 textbook live MNQ shorts this morning
(9:15 Ramp RA/RB/RC on Sim101 flattened -17.25pt at 9:30 then fell 186pt through TP; 10:10 Precision PA/PB/PC, open+in-profit) and argued: the
SIGNAL is a real winner; the -$6,168 backtest that falsified Ramp tested a BROKEN config (VWAP-from-0930 + 9:30 flatten) = "calling winners losers,
many times." Forensic dissected + honest-fill re-tested crippled-vs-corrected across full NQ history at BOTH S values.

**VERDICT — hypothesis FALSIFIED, both halves:**
1. **VWAP: NEUTRAL (+$268), and my earlier read was WRONG.** I told the founder the "VWAP-accumulates-from-0930" bug (the .cs header flags) crippled
   Ramp. FALSE: that bug belongs to the live **Precision_v2** class (RTH, where 0930 anchor is correct); **Ramp_v1.cs CORRECTS it** (DELTA 1 = 18:00
   Globex anchor) AND the H79 engine uses the same corrected anchor. So the fired trade + the -$6k backtest both used the RIGHT VWAP. Fixing it only
   changes trade selection, never flips sign. (Own the error.)
2. **Uncapping the 9:30 flatten (the founder's proposed fix) is CATASTROPHIC (-$5,283 at deployed S) — the single worst change.** The 9:30 cap is
   PROTECTIVE: the pre-open QF fade systematically REVERSES into the RTH open and gets stopped (exit mix flips cap->stop; stops become modal). Confirms
   forensics/h57 (uncapping NQ gives back ~6%). All 8 cells (2 VWAP x 2 exit x 2 S) LOSE: PF 0.60-0.87, net/OOS negative, bootstrap P(net<=0) 0.78-0.99;
   corrected (-$3,661) is WORSE than crippled (-$2,903). NOT outlier-driven (strip top-5 days -> loses MORE).
3. **Today's win = n=1 SURVIVORSHIP.** Its PRE-open leg was a -17pt LOSS; it only won on an ATYPICAL post-open continuation — the mirror-opposite of the
   sample average. Two textbook trades in a morning did not overturn a 5.5yr structural loser.
4. **The real +$53k -> -$6k gap is EXECUTION FIDELITY** (cert used look-ahead limit-at-level fills; honest next-bar/touch-through+slippage prints a loss).
   Not the cap, not the VWAP.

**DEPLOYED PARAM DIVERGENCE (worth noting):** the live MNQ Ramp instance runs S=82.27 (StopPts 32.9075) = ~1.9x the frozen §8 SIM cert spec (S=43.41).
Both S values lose honestly.

**CORRECTION / REVERSAL (2026-07-15, wf w1d3bdth5 fill-model forensic) — the "VWAP/cap" framing was right but the FILL axis was NOT tested here, and it partially reverses the kill.** The Ramp
re-test above used MARKET-at-next-bar-open entry. The .cs header CERTIFIES entry is a pre-armed RESTING LIMIT at the level (MTF one-bar-stale by construction). Market-next-open is the WRONG fill
for a resting-limit fade and systematically converts winners into recorded losers. Re-running with the correct fill: market -$2,635 (PF0.86) → realizable limit@z + stale MTF **+$1,006 to +$3,262
(PF 1.08–1.23, OOS PF 1.15–1.37), boot p 0.28–0.40 (marginal, NOT significant)**; every market cell PF<1, every limit cell PF>1. Under correct fills, removing the 9:30 flatten HELPS (reverses the
"cap protective" finding above — that finding was an artifact of the wrong fill). Founder was RIGHT the fill model mismeasured it. **BUT it's narrow, see [[project-mym-fill-fidelity-verdict]]:** the
even-more-faithful live fill (re-touch after arm bar, H122) revives only §12 MNQ, not Ramp/the family; realizable edge is marginal, not a goldmine. NET: don't call Ramp "clearly dead"; call it
"mismeasured → marginal at best." Still Sim-locked, still no F5 deploy. I OWN the earlier over-confident "kill by default, cap is protective" read — it rested on a wrong fill model.

**THE HONEST + RESPECTFUL SYNTHESIS (the session's core truth, [[feedback-backtest-measures-robot-not-trader]], [[project-mym-fade-doctrine-verdict]]):**
the MECHANICAL fade is a structural loser — the bot cannot tell today's hold-past-open winner from the average revert-and-stop loser. But the founder,
watching the chart, DID recognize it. That discretionary SELECTION is real skill the rule can't capture — it is his edge, not the mechanical strategy's.
Path forward is NOT uncapping the bot (falsified); it's either find a mechanical FILTER that separates post-open continuations from reversals (genuine
research), or accept it as his discretionary overlay. **KILL BY DEFAULT: keep Sim-locked, do NOT fix/uncap/F5/deploy; file to vault/03-failed-research/;
log today as a labeled survivorship datapoint (like [[project-mym-le-forward-watch]]).** The engine did exactly what it was built to do — refused to
confirm a losing config on a hunch, even a compelling one.