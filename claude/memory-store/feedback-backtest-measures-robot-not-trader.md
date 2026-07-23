---
name: feedback-backtest-measures-robot-not-trader
description: "Mechanical backtests measure a robot caricature of Jonathan's discretionary edge, NOT his real edge — the gap (selectivity/management/day-selection) IS his skill; study his real journal, not the proxy"
metadata:
  type: feedback
---

2026-06-14: After days of rigorous backtesting walked the US30 quarter-figure
strategy down to a modest mechanical PF ~1.3 (one cross-regime pair, low volume),
Jonathan pushed back: he trades it MANUALLY and is profitable month after month
with high win rates + tiny drawdown. The gap between his lived results and the
backtest is the key signal.

**Why:** Documented norm (QuantifiedStrategies, EarnForex): discretionary rule-based
traders get smooth equity / minimal DD, while the MECHANICAL version of the SAME
strategy gets low returns / large DD. The backtest measured the strategy with HIM
removed. The difference IS his skill: (1) SELECTIVITY — he takes only A+ setups; the
mechanical net force-trades B/C garbage he'd skip (his "2022 failure" was the robot
trading chop he'd avoid). (2) EARLY-CUT management — full -1R stops in backtest vs he
bails on invalidation (-0.2R scratch). (3) DAY-SELECTION — he stands down on noisy
days; robot trades every qualifying day. (4) ENTRY PRECISION — tip-of-wick limits vs
15m-close fills. (5) the mechanical signal def is a CARICATURE of his real read.

**How to apply:** For Jonathan's actual plan (HE trades one master + copier to 20
accounts), HIS real discretionary edge propagates — the backtest's PF 1.3 is the
floor of the robot version, irrelevant to copier-from-his-master. Backtest is only
the right question for FULL hands-off automation. STUDY THE RIGHT THING: analyze his
REAL broker statements / trade journal (true win/DD/PF/R-dist + what his A+ setups
share), not a mechanical reconstruction. Don't grade the trader by the robot.
Related: [[feedback-read-all-source-files]], [[project-textbook-open-lane]],
[[feedback-live-trading-canon-only-relay]].

**RETRACTION / SHARPENING (2026-07-15 PM, founder-corrected):** the founder states FLATLY he applies ZERO discretion — "I get the push signal and just enter, no analysis, no opinion, no edge."
So the long-standing "his edge is discretionary selection/timing" inference is WRONG — it was a lazy gap-filler for "live wins but backtest loses." Corrected model: he is a PURE EXECUTOR, so any edge is in the SIGNAL SOURCE, not the trader — a clean mechanical question with the man removed. Reconciliation of his winning FEELING vs the red book (both true, different buckets): (1) his MANUAL "just enter" takes are green ~+$7,900 over ~2 sessions BUT ~$6,900 of that is ONE trade = the James STORMS US30 relay (EXTERNAL source, n=1), + the 07-14 relays +$1,065; tiny favorable sample dominated by an external signal. (2) the BOT's OWN fade pushes, auto-traded + faithfully scored over 3.5 weeks (wf w3jr5xoyx rectification), are RED (-$1,599 signal-faithful; the +$988 as-executed is ORB5 loose-stop windfalls, not edge). So "take the push and win" is TRUE only for the small external/manual bucket, FALSE for our fade bot. **NEW FRAMING (supersedes discretionary-edge): score every SIGNAL SOURCE taken BLIND, kill-by-default — our fades RED, ORB5-MNQ thin, Storms +$6,900/n=1 unproven-standout, NexGenAlgo untested. Measure the source not the man.** Related: [[project-mym-fill-fidelity-verdict]] (entry-fill re-trial: market-at-every-push 0/24 cells clear, $0 graveyard resurrections), [[reference-storms-vagafx-recon]] (score Storms forward, verified-record-was-losing so deflate hard).
