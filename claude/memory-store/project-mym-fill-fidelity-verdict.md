---
name: project-mym-fill-fidelity-verdict
description: "2026-07-15: founder watched every live signal all day and concluded 'the problem is bot fidelity + backtest fidelity, not the strategies.' VERDICT: substantially RIGHT on both axes, with a narrowing caveat. (1) Backtest fidelity: market-at-next-open was the WRONG entry fill for a resting-limit fade (.cs certifies limit entry) — it converted winners into recorded losers; correcting it flips the sign. But the fully-faithful live fill (re-touch after arm bar, H122) revives ONLY §12 MNQ (marginal, boot ~0.09), NOT the family — the rest stay dead even under corrected fills (H122/H130/H157 already proved this). (2) Bot fidelity: real exit bugs cut directionally-correct trades — LE lock-trail closed all 3 legs at +2 ticks during the expected retrace (missed TP1 that price reached); Ramp 9:30 guillotine. Today: §12 MNQ (the lone survivor) ran clean to TP; LE was a good-tail print on an unproven cell, cut by the lock; ORB5 the only genuinely-wrong signal. Fix the exits (F5); trust §12 MNQ small; rest unproven."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Founder's full-day live-observation synthesis (2026-07-15): "issues are with bot fidelity + backtesting fidelity, NOT our strategies. Every trade today was perfect to what the signals
called; only the ORB5 MES was a bad signal."** He watched every signal fire and play out. VERDICT: **substantially right on both axes, with an honest narrowing.**

**AXIS 1 — BACKTEST FIDELITY (fill model). RIGHT, and I OWN the earlier over-confidence.** The prior "honest" fade backtests used MARKET-at-next-bar-open entry. The live `.cs` header CERTIFIES
entry is a pre-armed RESTING LIMIT at the level (MTF one-bar-stale by construction). Market-next-open is the wrong fill for a resting-limit fade → systematically records winners as losers. Ramp
fill-model forensic (wf w1d3bdth5): market -$2,635/PF0.86 → realizable limit@z+stale-MTF **+$1k–3.3k/PF1.08–1.23, boot p 0.28–0.40**; every market cell PF<1, every limit cell PF>1; and removing the
9:30 flatten HELPS under correct fills (reverses my earlier "cap is protective," which was a wrong-fill artifact — see [[project-mym-ramp-live-forensic-verdict]] correction).
**THE NARROWING (critical, don't lose):** the Ramp b-real fills FIRST-TOUCH (armed a bar early). The Precision/fade family live bot is STRICTER — `Place()` fires off the 1-min series AFTER the arm
bar closes, so it fills only on a later RE-TOUCH ([forensics/h122-recert-live9], which self-selects worse-timed entries. Under that faithful fill **only §12 MNQ clears PF>1 (marginal, boot ~0.09);
the other 7 live cells go net-NEGATIVE**; instant-fill had overstated ~100×. [forensics/h130] falsifies the limit-at-z family four ways; [forensics/h157] full-corpus honest recert. So the fill
correction revives **ONE cell (§12 MNQ), not the family.** The graveyard re-score under corrected fills is DONE — not pending. Reconciles [[project-mym-p2-recert-deflated-corpus]] (that kill was
faithful, not a market-fill artifact — H122 used the re-touch model, not market-next-open).

**AXIS 2 — BOT FIDELITY (exits cut winners). CONFIRMED, real bugs, worth fixing regardless of edge.** THREE distinct premature-exit mechanisms in one day:
1. **LE lock-trail** ([Area61Precision_v2.cs:349-368]): the profit-lock/BE trail moved the shared stop to +2 ticks after a small favorable tick, then the expected retrace tapped it → all 3 legs
   (PA1/PB1/PC1) closed at 231.35 simultaneously ("StopCancelClose", not TP/stop) ~60s in. Price then reached 230.40 = its TP1 (230.439). The lock arms on entry NOISE and bails during the
   retrace the fade THESIS expects ([[feedback-qf-two-phase-premove]]) — structurally self-defeating; mis-calibrated for LE's range.
2. **Ramp 9:30 guillotine** (FlattenHHmm=930) — flattened a directionally-correct short for -17pt, then it ran 186pt to TP.
3. The 10:10 §12 MNQ short was the one the bot did NOT cut → ran clean through TP1 (29,695) to 29,598 = the day's clean winner.

**TODAY'S LIVE SCORECARD (the out-of-sample tape, keep appending):** §12 MNQ Precision (10:10, the lone faithful-fill survivor) = clean TP win; LE Precision = good-tail print on a stand-down
cell, robbed by the lock bug; Ramp MNQ (Sim) = textbook, guillotined at 9:30; ORB5 MES = the ONE genuinely-wrong signal (stopped). So the cell the math keeps (§12 MNQ) is the cell that won clean —
consistent, encouraging, marginal. 2/2 favorable-tail on the fades; honest model win-rate ~40%.

**REFINED PROGRAM VERDICT:** founder's "fidelity not strategies" is validated — but the corrected fill revives §12 MNQ (marginal), not the whole family; the rest stay unproven even after the fix
(already tested). NEXT WORK (not a redundant sweep): (a) resolve whether live §12 MNQ fills FIRST-TOUCH (→ marginal-positive) or RE-TOUCH (→ breakeven) — today's 10:10 fill can settle it; (b) founder
F5 to recalibrate the LE lock + reconsider the 9:30 flatten (they cost money on every cell); (c) trust §12 MNQ SMALL + forward-collect; (d) stand down the unproven cells. Related:
[[feedback-backtest-measures-robot-not-trader]], [[project-mym-fade-doctrine-verdict]], [[project-mym-forward-fidelity-verdict]], [[feedback-defer-to-trading-instinct]].

**EVENING ESCALATION (2026-07-15 PM — supersedes parts of the above; the day's REAL findings):**
1. **CORRECTION: the 10:10 MNQ winner was ORB5_v1, NOT §12** (push-mislabel bug printed §12 params on any root-match fill — founder was reasoning from wrong telemetry all along; fix SHIPPED,
   service/signal_fidelity_ledger.py + forward_test_journal.py true-sleeve resolution, 909 tests green, root-lookup _plan_params DELETED).
2. **ROOT CAUSE of the LE "wipe": the strategies killed THEMSELVES.** Lock armed on the entry bar (favExt measured from ZONE on intrabar extremes), submitted a stop-modify on the wrong side of the
   retraced market → broker InvalidPrice → NT8 default ErrorHandling = terminate + cancel + market-close. GOAT LE/HE LockTo=StopPts (0.4×step outlier, h114) makes it near-certain on any retrace.
   Same unguarded pattern in Precision_v2/v3 + Sniper_v2 (lock75 AND lockBE blocks) = all 40 lanes exposed. **GUARD WRITTEN (Option A, params untouched), code-review APPROVED, replay-gate 4/4 PASS
   on today's poison tape** (old logic reproduces the wipe; guarded survives to TP1). Healer exonerated (masked, didn't cause); heal re-arm defeated H71 dedup → the -$600 11:08 phantom re-fire.
3. **LE stop-widening FALSIFIED at population** (founder's +5t idea): today's top-tick shape = 2.2% of LE stop-outs (5 in 5.5yr); 91% run over by median 26t; every widening 1.1-2.0× nets WORSE.
4. **BRACKET-FAITHFUL STUDY (founder's "trade what the push says" hypothesis): RAMP VALIDATED** — pure pushed bracket +$11,819 vs actual-law +$1,006 (11.7×), PF 1.513, OOS PF 1.983, boot p
   0.013-0.034 = FIRST time Ramp clears the deflation bar under a realizable fill; the thief was the LOCK TRAIL (scalps winners at +0.04×step before the 2S TP pays), the 9:30 flatten was the smaller
   half. LE half-validated: lock removal recovers ~$11.8k of the $23.6k bleed (win 12.5%→21.3%) but the sleeve STILL loses under the exact pushed bracket — "LE dies" stands. **CROSS-SLEEVE LAW:
   the 0.6/0.04 lock trail destroyed ~$12k on BOTH audited sleeves — every Precision/Sniper cell needs the same lock audit before deciding fleet-wide strip (F5).** Ramp: sim-only until h125
   placebo gauntlet passes on the pure-bracket law.
5. **THE STRUCTURAL BLIND SPOT (why I never caught it, owned to founder):** all verification was PARITY-shaped ("does the backtest match the bot?") — and it passed, because BOTH contained the same
   broken management. Nobody asked FIDELITY ("does the bot match the signal?") until the founder hand-marked charts today. Two broken things agreeing look like truth. **Consequence: past "live tape
   confirms the backtest kill" conclusions ([[project-mym-forward-fidelity-verdict]]) are UNDER REVIEW — the live tape was executing wrong, so it would agree with a backtest of wrong management.**
   Forward-book RECTIFICATION running (wf_44ab7ffd-708): every trade ever fired re-scored signal-faithful vs as-executed vs backtest expectation → forensics/forward-rectification/RECTIFIED-BOOK.md.
6. **Triple-check architecture built:** (L1) replay-gate + parity re-run + compile tonight; (L2) termination watchdog (60s, pages with REASON, circuit-breaker recommend; staged plist — founder loads)
   + VPS healer rules pending VPS access; (L3) promised-vs-executed auto-ledger (FIDELITY-FLAGs, same-day digest). Today's banked: funded +$6,430 (US30 Storms relay +$6,900 ×3 accts — score the
   Storms lane per [[reference-storms-vagafx-recon]]), sim +$1,160 (ORB5 +$1,550). Faithful counterfactual +$9.1-11.2k; bugs cost $1.5-3.6k in one day.
**ENTRY-FILL RE-TRIAL — DECISIVE (2026-07-15 PM, wf winmiekem; forensics/entry-fill/, 4 controls bit-matched K1-K4):** tested the founder's ACTUAL entry (instant market-at-the-push, model A) vs
resting-limit-first-touch (B) vs re-touch (C), pure-bracket exits, 24 model-cells, honest fills, IS/OOS/boot.
- **Model A (his market entry) clears the OOS deflation bar on ZERO cells.** Best on only 2/8 (§12 MGC +$1,050, TP25 MES +$1,362) and BOTH evaporate OOS; loser on §12 MNQ/M2K; **catastrophic on §12 LE −$36,297 (PF 0.55, worst of all 24)** — the "stopped by a tick" pathology amplified because a market order pays a spread the fade can't afford. The founder's "my instant entry wins" is FALSIFIED mechanized; his edge = DISCRETIONARY TIMING/selection (confirmed, = [[feedback-backtest-measures-robot-not-trader]]). Corpus concurs: resting limits adverse-selected 4:1-12:1 (arXiv 2409.12721, Osler FRBNY round-number microfoundation), "confirmation IS the edge," MYM = directional bracket TAKER not a resting maker.
- **Graveyard re-trial = $0 true resurrections.** 8 fade cells re-scored under per-cell-best honest fill: 1 clears deflation (Ramp MNQ resting-limit +$12,475, OOS PF 1.82, boot p 0.017 — but that's the ALREADY-VALIDATED 15m ramp lane / positive control, NOT a fade dug from the graveyard); 5 flip positive-but-INSIGNIFICANT (boot p 0.14-0.36, treat as noise, +$18,076 gross); 2 stay dead. **Correcting entry-testing REMOVES phantom edge (fill-at-z look-ahead inflated dead cells into fakes: breakout-retest +$21,884/yr cheat → −$1,285/yr honest), it does NOT manufacture real edge.** The backtest was HONEST; the old "winners" were fill-cheat fakes correctly killed.
- **METHODOLOGY IS CODIFIED (answer to "is entry testing fixed"): YES** — backtest/phase1/costs.py market_next_open + PHANTOM-FILL LAW; decision_timing.py one-switch D-DT gate (Zhang 2026 arXiv 2605.23959); engine/gauntlet/execution.py+fills.py multi-execution matrix; test_gauntlet.py false-negative QUARANTINE ("lives under one fill, dies under another → never dead") = the exact "signal good, entry test wrong" guard.
- **THE UNIFIED HONEST SYNTHESIS of the founder's whole-day thesis:** (1) "backtest calls winners losers" = NO (backtest honest; fakes correctly killed; graveyard genuinely dead). (2) "live execution robs real winners" = YES — the BUGS (Ramp 9:30, LE self-wipe, lock trail) stole genuinely-good LIVE trades (~$1.5-3.6k today), being fixed tonight. **The winners in the trash live in the bug-robbed LIVE trades, NOT the backtest graveyard.** Founder edge = discretionary judgment + the one automatable lane (Ramp-MNQ-resting-limit-pure-bracket). Path: support his MANUAL signal-taking (today +$6,900 US30 by hand); automate only Ramp-limit (pending h125 placebo); STOP re-chasing the fade graveyard (honestly dead). Report forensics/entry-fill/ENTRY-VERDICT.md + RESURRECTION-TALLY.md.
