---
name: project-mym-forward-fidelity-verdict
description: "2026-07-14 forward-fidelity capstone: the LIVE/forward book empirically CONFIRMS the honest-fill kill. Over 3 weeks / 132 fills, the fade family (the funded book) is breakeven-NEGATIVE on its own certified markets — exactly where H157's honest re-cert put it, and ~33x below the +$1.98M instant-fill fantasy. Real money agrees with the honest gauntlet, not the fantasy cert. THE GAP: funded money = 100% the dead fade; the honest survivors (trend-gated ORB5, RSI2 book) are undeployed or deployed-wrong. Founder F5 to close."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Forward-fidelity study (2026-07-14, window 06-23→07-14, 132 closed fills, fleet_audit ran clean exit 0).** The founder
asked: study live forward performance vs backtest accuracy; what fired today. Verdict — **the live money is the final
judge and it CONFIRMS the honest-fill kill.**

**THE DECISIVE NUMBER:** if the +$414.65/trade instant-fill FANTASY edge were real, the ~82 forward fade legs would have
printed ~+$34,000. They printed ~+$1,037 — and ALL of it is 2 out-of-scope Live-Cattle trades (+$1,210 on 2 signals).
**Strip LE and the fade is -$37 over 69 index/equity fills** (Sim101 mirror dead-flat -$6) = exactly the breakeven-negative
H157's honest re-cert predicted, ~33x below the fantasy. On its OWN certified markets (MNQ/MES/MYM/M2K/HE) the funded book
LOSES (-$369). So H157 was RIGHT; the +$1.98M certification was fill-fantasy; live fills prove it (and $0 commission in the
journal — real ~$0.80-1.50 RT makes it strictly worse).

**WHAT FIRED TODAY (2026-07-14, -$572, ALL Sim101):** funded Precision fired 1 MNQ short/acct ~29802 @ 8:48am, scratched
at BE ($0/$0/-$1) — the fade's honest signature (no edge, no disaster); Sim101 correlated fade legs (RA/RB/RC,NA/NB/NC,
PA/PB/PC) + O5 ORB5 short = -$571; ORB5 has 2 open Sim101 shorts +$167.5 unrealized.

**EXECUTION FIDELITY (fleet_audit: MATCHED 2 / MISSING 64 / UNEXPECTED 66 / PARAM-DRIFT 0 / CRITICAL 0):** 0 CRITICAL (all
fills traceable) + 0 param-drift are the positives, but parity is structurally UNVERIFIABLE (tape ends 07-10; funded lanes
= §12/PrecAM on MNQ/M2K ≠ certified plan on MGC; ORB is a faithless port by design — live .cs enters at OR-close, cert
engine waits for the breakout). RED FLAGS: (a) **-$506 of Tradeify's loss = 2 OFF-BOOK ORB fills** (O4 MNQ q4 -$412 on
07-02, O5 -$94 on 07-03 on a HOLIDAY_STANDDOWN) — real money lost off-book (book-transition residue; ORB no longer
deployed there). (b) **Off-book classes STILL FIRING on Sim101: RangePlay_v1** (FALSIFIED/retired 2026-06-29, [[project-mym-rangeplay-falsified]])
7 fills/-$60 + **Ramp_v1** (staged, not live-cleared) RA/RB/RC on 07-13/14 — confirm the NT8 instances are actually stopped.

**THE GAP + RECOMMENDATIONS (founder F5, nothing auto-changed):** real prop money runs the one family that's backtest-dead
AND live-confirmed-dead, while the honest survivors sit undeployed/wrong. (1) DON'T scale the fade on funded — no edge, LE
is variance (regress to 37% win / -$84 avg-trade per [[project-mym-le-forward-watch]]). (2) REDEPLOY ORB5 as the CERTIFIED
champion — trend-gated, 1 MNQ micro, drop the multi-market scaling; the live -$873 is the UNGATED wrong-form variant
(PF 0.76) not the gated champion (PF 1.48, H142) — the gate IS the edge; sim-forward the gated version first. (3) STAND UP
the RSI2/reversion book ([[project-mym-reversion-book-blueprint]]) on Sim101 first (zero forward fills yet — paper it to
confirm honest fills hold live). (4) Housekeeping: stop the retired RangePlay/staged Ramp instances.

**Residual uncertainty (honest):** pure fade forward sample is only ~3 days (rules OUT the fantasy conclusively but can't
pin the exact breakeven sign yet); execution parity is unmeasured not proven-good (2/132 matched); ORB5's -$873 is
inconclusive (a chop-regime loss is consistent with a PF-1.48 trend sleeve, confounded by ungated deploy). NOT fatalism —
there ARE two honest survivors; the finding is narrow + firm: **the money currently sits on the one thing that doesn't work.**
Forensics: forward-fidelity-study wf_ba36b71a-4dd + scripts/fleet_audit.py + forensics/h157. Related: [[project-mym-fade-doctrine-verdict]],
[[project-mym-p2-recert-deflated-corpus]], [[project-mym-forward-test-execution-fidelity]].
**⚠️ UNDER REVIEW (2026-07-15 PM):** this verdict's core claim ("LIVE money CONFIRMS the honest-fill kill") is now SUSPECT. 2026-07-15 forensics proved the live execution layer was itself broken
(lock self-termination wipes, 9:30 guillotine, heal-defeated dedup phantom fires, push mislabels) — so the live tape agreeing with the backtest may be two broken things agreeing: both measured the
same broken MANAGEMENT, neither measured the SIGNAL. The bracket-faithful study (forensics/bracket-faithful/) shows Ramp's signal+pure-bracket clears the deflation bar (PF 1.51, OOS 1.98) while
signal+actual-management dies — the exact divergence this verdict couldn't see. Full forward-book rectification (every fired trade re-scored signal-faithful) at forensics/forward-rectification/;
do NOT cite this verdict as settled until that lands. See [[project-mym-fill-fidelity-verdict]].
