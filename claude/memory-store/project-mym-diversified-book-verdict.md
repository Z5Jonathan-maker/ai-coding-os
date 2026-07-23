---
name: project-mym-diversified-book-verdict
description: "2026-07-15 (wf wdsnw2uro): the founder's regime-diversified thesis (breakout/volatile + reversion/chop + trend/trending) honestly tested. VERDICT SPLIT: the diversified BOOK is a REAL edge (Sharpe 0.74 vs 0.47 best-single = +56.5%, vol halved 7.9->4.6%, 3 families near-orthogonal |rho|<=0.16) BUT the regime-ROUTING classifier is a NULL P&L driver (wash-to-negative vs always-on) -- the edge is the DIVERSIFICATION, not the routing. Tail partially fails (crashes concentrate 0.74 in trend). Deploy the BOOK, drop the router-as-alpha claim. Sharpe undeflated + dilutes with dead cells; deflate + clean before capital."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Regime-diversified book — honest verdict (2026-07-15, wf wdsnw2uro; forensics/regime-book/).** Founder's thesis: breakout in VOLATILE
regimes + mean-reversion in CHOP/REVERSAL + trend-following in TRENDING, routed by a classifier. Built a no-look-ahead-PROVEN daily regime
classifier (truncation-invariant, 509/509 labels stable; regimes validated OOS: VOLATILE->highest fwd vol 6/6, ->mean-reverts 5/6,
TRENDING->momentum-follows-through 6/6) + 3 honest-fill family sleeves on ES/MES/YM/GC/CL/MNQ.

**THE SPLIT VERDICT (both true):**
- **The diversified BOOK is a REAL edge.** Equal-risk blend of the 3 sleeves: **Sharpe 0.74** (soft-prob variant 0.75) vs best-single-family
  (breakout) 0.47 = **+56.5%**; ann vol **7.9%->4.6%** (nearly halved); maxDD -9.6%->-8.5%; diversification ratio **1.60**; captured 92% of the
  theoretical uncorrelated-ideal Sharpe. Families NEAR-ORTHOGONAL: breakout×reversion -0.021, breakout×trend +0.161, reversion×trend +0.034.
  The "book of weak uncorrelated sleeves" thesis ([[project-mym-reversion-book-blueprint]], [[project-mym-portfolio-reframe]]) CONFIRMED.
- **The regime-ROUTING classifier is a NULL P&L driver.** The regime-gate is wash-to-slightly-NEGATIVE vs running the families ALWAYS-ON; you'd
  capture nearly all the Sharpe uplift without the classifier. **The edge is the DIVERSIFICATION, not the routing.** Deploy the book; do NOT sell
  the router as alpha (keep it at most as a turnover/DD overlay). The founder's intuition was RIGHT on combine-uncorrelated-families, WRONG (unproven)
  on trade-each-only-in-season.
- **Tail caveat:** diversification works in the MEAN (Sharpe/vol) but partially fails in the TAIL -- 15 worst book days concentrate 0.74 in the TREND
  sleeve, 13/15 have 2+ sleeves down together (tail corr > body corr); Calmar only +3.4%, maxDD only 11% shallower.

**PER-FAMILY (honest cell-level):** BREAKOUT: ORB5 on MNQ/MES gated to VOLATILE = real lift (PF 1.23->1.32 MNQ, 1.16->1.31 MES) -- CONFIRMS ORB5 +
the vol gate helps momentum. ES/YM daily-channel breakout = LOSERS both regimes (kill). REVERSION (chop-gated) + TREND (Carver EWMAC): GC/CL reversion
+ CL trend flagged dead; positive cells carry it. H4 nuance: trend-vs-chop persistence is ASSET-CLASS dependent -- holds on commodities (GC/CL) but
INVERTS on equity indices in the 2021-26 bull sample (no naive equity-index momentum without the vol gate).

**DEPLOY PATH (next_action, the fundable-book question):** (1) CUT dead cells (ES/YM daily-channel breakout, GC/CL reversion, CL trend); rebuild
sleeves from POSITIVE cells only. (2) A/B always-on-combined vs regime-routed-combined OOS -- if routing doesn't beat always-on, retire the classifier
as a P&L driver. (3) FIX the tail: cap the trend sleeve OR add a crash-independent 4th leg (bond ZN/ZB + GC + BTC reversion, the reversion-book cross-asset
set). (4) CPCV/DSR DEFLATE the combined book + trailing-vol weighting -> the honest deployable Sharpe (0.74 is undeflated/full-sample/ex-post). THEN
own-capital/Sim-first per the F5 boundary. This is the closest thing to a real deployable edge the session produced -- a modest honest BOOK, not a hero.