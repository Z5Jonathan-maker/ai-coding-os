---
name: project-mym-fade-doctrine-verdict
description: "2026-07-13 closing verdict: the QF-fade is DEAD as a mechanized strategy in ALL entry forms (chase/resting/his-real-re-entry, 3 causally-clean tests); edge if real is purely DISCRETIONARY; measure via his journal, not backtests. Honest catalog = a small momentum book."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The pivotal day (2026-07-13). The QF-fade doctrine does not mechanize.** The instant-fill backtest
that valued the fade book at +$246k/yr was ~80% look-ahead (PF 261-301 on days price touched the QF zone
and never returned — unfillable for a bot OR a human). Under HONEST fills the mechanized fade is negative,
proven three independent, causally-clean ways:
- **H122/H123 chase** (the deployed bot: wait for a re-touch after the 30m close) — 0/9 live, book ~breakeven-negative.
- **H124 resting limit** (rest at the zone in advance — a purer fade) — 0/14, resting fills MORE trades and nets WORSE.
- **H127 the founder's REAL two-phase re-entry** (first touch = trap; the trade = the failed-retest RE-ENTRY via
  the AREA61 contrarian close) — **0/13 REVIVED, all stay dead.** It reproduces his selectivity (2-5x more selective,
  flips several OOS-30 slices positive) but every cell fails full-sample net + placebo + tail.

**So: the mechanizable fade has no honest systematic edge in ANY entry representation, including his own method.**
The market STRUCTURE is real (QFs get faded — Osler); the MECHANIZED HARVEST is dead; the edge — IF real — lives
ONLY in the discretionary layer no rule/backtest/paper can capture (which setups to take, the live-tape read, the
re-entry feel). This is the brutal confirmation of [[feedback-backtest-measures-robot-not-trader]] ("the backtest
is the strategy minus Jonathan; the gap IS the edge"). **HARD RULE: stop trying to mechanize the fade / re-cut its
entry — it's been exhausted 3 ways. Measure the discretionary edge via his REAL journal + forward discretionary
results, not more mechanized backtests.**

**KEY sub-finding (needs founder follow-up):** the deployed §12 MTF gate requires 4H/1H/30M momentum to AGREE
with the fade (momentum-CONFIRMATION) — structurally INCOMPATIBLE with the AREA61 CONTRARIAN close (507 candidates
→ 0 pass). **The deployed bot was NEVER running his contrarian AREA61 lane** — the live §12 book is a momentum-agree
fade (also dead), not his real method. The "MTF gate golden standard PF 11.65" ([[project-mym-mtf-gate-golden-standard]])
was instant-fill fantasy. Reconcile before trusting that gate.

**The honest surviving catalog (H125/H126, committed ab1162b):** a small REAL momentum book — **ORB5** (MNQ,
or_bars=3 UNCAPPED, trend-gated; deployed StopCap=60 variant DIES honest) + **BandMomentum** (MNQ, ~$2.7k/yr;
size as ONE NQ bucket with ORB5). Fazen fill-robust but H94-FRAGILE (Sim101 only). US80 open-lane FRAGILE (paper
only). **BURY:** all 14 fade cells + the P2 +$430k + Ramp (a dead resting-limit fade, not a breakout).

**How to apply:** never re-mechanize the fade; the forward tradeable book is momentum (ORB5+BandMomentum). LE
forward-watch ([[project-mym-le-forward-watch]]) continues per founder. Related: [[project-mym-precision-cs-parity-gap]],
[[project-mym-p2-recert-deflated-corpus]], [[user-trading-legacy-not-money]].

**INDEPENDENT CONFIRMATION 2026-07-13 (H144, founder challenged "the direction was correct / is the fill test
right?"). Both answered rigorously:** (1) FILL MODEL is HONEST/conservative, NOT the villain — ORB5 survives at
0-tick slippage (PF 1.24) and loses only 1.9% PF from 0→2 ticks; the stop-through fill models gap-through (trigger
OR WORSE); 1 tick MNQ=$0.50 is generous for a liquid micro. Fades died because they were fill-FANTASY (limit at a
level the tape never traded = too OPTIMISTIC), the structural opposite of our model being too harsh. (2) THE FADE'S
DIRECTION WAS NEVER REAL — measured CAUSALLY with fills IGNORED (bar after the touch closes): first-touch QF-fade
hit-rate 47-50% at every R on both 250 & 125 grids, indistinguishable from random (MC p=0.39, z=-0.22); 2R/3R
sub-50%. The only "edge" (55.6% @R25) was pure TOUCH-BAR INTRABAR LOOK-AHEAD — inverts to 47% measured from the next
bar. Stop-confirmation entry makes it WORSE (27-34%). So NO fill rescues it; the direction is a coin flip and any
real edge is 100% discretionary touch-SELECTION. GENERALIZED BEYOND QUARTER-FIGURES (H148, 2026-07-13): the "Turtle Soup / Wyckoff spring" structural
false-breakout fade (the discretionary-mine's most-convergent lead — 3 schools, ~90 yrs) died 0/36 cells,
placebo coin-flip (p 0.41-0.60) on ES/NQ/GC/CL — the FIRST fade with zero mechanical overlap to the QF grid,
and it died for a CLEANER reason: no direction-selection signal AT ALL (not a fill artifact). So fading ANY
failed-breakout / structural extreme has no mechanical directional edge — the fade doctrine is not
QF-specific, it's ALL mechanized fades.
DIRECTIONAL-SALVAGE SWEEP (H154, 2026-07-13, founder asked "was there an alternate ENTRY that made the tossed
strategies keepable?"): 0 of 6 salvaged. For every tossed strategy (gold ORB, crude ORB, MNQ Globex/London opens,
TradeX manipulation-fade, + QF-fade & Gao controls) the DIRECTION was a coin flip both ways (fills removed) — so no
entry rescues it; the problem was the idea, not the entry. IMPORTANT NUANCE (validates the founder's instinct): GOLD
09:30 ORB's fade SIGN is genuinely REAL (gold mean-reverts against the OR break — we WERE entering it backwards), but
the MAGNITUDE is a coin flip: the frictionless ceiling (zero-cost, perfect fill = best entry physically possible)
tops out at PF 1.089 < the 1.15 bar, so no entry can convert it. So "SIGN real / MAGNITUDE too small to harvest" —
gold reverts at the open but the move is too tiny after any cost. Method validated (both controls correctly returned
coin-flip). Takeaway: the ORB momentum structure that works at the 09:30 US cash open does NOT transfer to overnight
(Globex/London) or other-instrument opens (gold/crude). Do not re-litigate these tosses. Forensics: forensics/h154-directional-salvage/.
GOLD-REVERSION HUNT (H155, founder-directed "go bigger"): 0 of 5 keepable. Gold's mean-reversion DIRECTION is REAL
(confirmed again — ceilings >1.0, chop-gate lifts them exactly as reversion theory predicts, Bollinger fade beats
random-direction placebo p 0/0.002), and it would have been a beautiful diversifier (near-zero/negative corr to ORB5
+ RSI2). BUT the per-trade MOVE is too small to harvest net-of-costs: tight-wick stops get hit ~68% before the revert
completes, and gap-through slippage ALONE sinks PF below 1.0 — every honest PF landed 0.58-0.88, net/yr negative.
BIGGER TARGETS made it WORSE (pdmid/opposite-level/overnight/round-$ frictionless ceilings all FELL below 1.0), so the
"go bigger" hypothesis is specifically FALSIFIED — gold doesn't revert FAR enough. The one setup that passed magnitude
(daily RSI(2) Connors on gold, ceiling 1.87 / honest PF 1.70) is a DRIFT ARTIFACT not reversion — pure long exposure to
gold's $1290→$3300 melt-up (random-dir placebo p 0.21/0.33, buy&hold PF 1.14, silver/copper refute). CONCLUSION: gold
reverts but too GENTLY to trade mechanically; don't re-litigate. Forensics: forensics/h155-gold-reversion/. Also H144: ORB+pivots 0/8 (day-type beta); in-season (H129) surfaced
only regime-beta (NQ +30.8% → random-dir breakout-w-stop is profitable riding the trend; best recent placebo p=0.135,
none prop-passable). Forensics: forensics/h144-entry-pivot-inseason/. New durable rule cemented in
[[project-tradex-orb-digest]]: day-selection filters need placebo-THROUGH-filter + gate-decomposition.
