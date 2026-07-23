---
name: feedback-backtest-his-real-method-not-strawman
description: "HARD RULE — never backtest Jonathan's QF method as a first-touch fade; encode his ACTUAL AREA 61 method or it's a strawman"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-20: I spent an entire session backtesting Jonathan's YM/US30 quarter-figure method as a MECHANICAL FIRST-TOUCH FADE
(VwapDirFadeQual: enter the instant price tags a QF, every tap, no candle confirm, zone-filter off, re-entry no-op), watched it
fail OOS, and wrongly concluded "his strategies don't work." His method has made him real money for YEARS. The backtest was a
STRAWMAN — and my own memory already warned me ([[feedback-qf-two-phase-premove]], [[feedback-backtest-measures-robot-not-trader]],
[[project-qf-ladder-backtest-findings]]). Having the memory ≠ applying it. This is the application rule.

**Why:** the first touch of a QF is the LIQUIDITY GRAB / pre-move he SKIPS; entering it gets run over (my test stopped out 27x in
a trend). His edge lives in the qualifications a first-touch fade strips out.

**How to apply — before ANY backtest of his method, encode HIS ACTUAL method (canon: mym-autotrader/docs/ai-memory/STRATEGY.md = BCFX/AREA 61):**
1. ENTRY = AREA 61 contrarian trigger: wait for the CLOSE of a strong, body-dominant, OPPOSITE-colour candle IN the zone
   (long at QF support on a strong BEARISH close; short at QF resistance on a strong BULLISH close). NOT the first touch. Entry at candle CLOSE.
2. TWO-PHASE: first touch = liquidity grab (skip); the trade is the failed-retest / re-entry at the same QF.
3. ZONE QUALITY: only trade a QF that is a real zone — large QF with multiple prior daily reactions (>=3 same-side rejections / 30d),
   ROLE-matched (resistance needs rejected-down history). A bare QF is not a zone.
4. SELECTIVITY: SKIP levels tapped too many times (about to break) and levels that broke+closed through. The skips are the edge.
5. RE-ENTRY: re-enter the same level ONLY after a WINNING scalp; STOP the moment a full stop hits (level is failing). Re-entering
   after losses is the catastrophic anti-pattern (canon: +$14,140 with the rule vs -$18,586 re-entering after losses).
6. SESSION: NY open ~09:45-10:30 ET is the edge window; lunch is a graveyard. New moves on bars closing <=10:45, re-entries <=11:30.
7. The validated mechanization of this = §10 textbook lane (textbook_study.py) + the §11 five tradables — port THOSE to NT8 and
   OOS-test them, not a raw first-touch fade.

**2026-06-20 follow-up (proven on NT8):** the FAITHFUL AREA 61 port (Area61_v1: contrarian candle-close + quality/role zone +
re-enter-only-on-win) is ~BREAKEVEN OOS on its own (12 MYM contracts 2023-26: -$886/PF 0.93, longs ~flat, ALL the loss is the
short side fading resistance into the secular Dow uptrend). That ~breakeven IS the mechanical floor; his DISCRETION (selection +
trend-read + management) is the edge on top, exactly as this memory says. DO NOT try to mechanize his §2 trend bias with a coarse
filter: a daily-SMA(20) bias gate (Area61_v2 BiasGate) made it WORSE (-$2,874/PF 0.69) — too coarse, it killed the good
trend-aligned longs and kept the bad counter-trend shorts. Lesson: surface bias/grade/confluence as CONTEXT in the live signal
(done — service/live_scan.py scan_area61 + ntfy push now show grade [A/A+], daily-bias with-trend/counter-trend, zone confluence),
and let HIM apply selection. Ship the signal, not a fully-auto bot. Stop adding coarse mechanical filters hoping one sticks (overfit trap).

Also obey [[feedback-read-all-source-files]]: read STRATEGY.md §1-12 + the transcripts BEFORE coding a backtest of his method.
ORB-on-MNQ (the session's one survivor) is a SEPARATE generic edge — fine to keep, but it is NOT his method and its survival
does not bear on whether his method works.
