---
name: project-mym-reversion-book-blueprint
description: "The deployable core of the operation (H163, 2026-07-14): a diversified mean-reversion BOOK — Connors RSI2/Double-7s behind the H153 chop-gate, across ~4 crash-independent risk bets (equity cluster + TLT/rates + gold + crypto). ~56 trades/yr, honest fundable crash-Sharpe ~1.9 WITH the cross-asset legs (1.44 equity-only). Own-capital/funded-seat, overnight. Mean-reversion is our ONLY validated edge; this is how we build it into a book."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**After the full 2026-07-14 hunt, mean-reversion (Connors RSI2 dip-buy + Double-7s) is our ONLY validated edge**
(ORB5 downgraded to regime-beta per [[project-mym-portfolio-reframe]]; fades dead; corroborated by the external
"pattern-last/reversion-first" study + Tomas/vagafx). The deployable form is a BOOK, not a single sleeve. Blueprint
grounded in forensics/h163-equity-etf-reversion-breadth/ + forensics/h156-rsi2-mr-universe/ (corr matrices, book
Sharpe/ENB computed live).

**THE KEY STRUCTURAL FINDING — breadth of EDGES is abundant; crash-independent BETS are ~4.** 23 instruments carry a
placebo-clean reversion edge, BUT long-only dip-buyers all fire together in a selloff: equity co-active corr 0.52-0.81,
index ETFs 0.88-0.97. So "10 equity sleeves" = ONE fat bet in a crash. The low CALM pairwise corr (~0.135) EVAPORATES
exactly when tail-risk bites. Real diversification is CROSS-ASSET, and there are only ~4 genuinely crash-independent
risk bets: (1) the equity-reversion cluster (one bet), (2) TLT/rates (co-active -0.05, the one orthogonal equity-side
sleeve — different macro driver), (3) GC/gold, (4) BTC/crypto. Adding a 6th tech stock does nothing; adding gold/rates/
crypto is what lifts the CRASH Sharpe from 1.44 (equity-only) to ~1.9 (fundable).

**THE BOOK (build order):**
1. **Equity core NOW** (own capital, behind the gate): the 6 Bonferroni@K=42 survivors — MSFT, GOOGL, EFA, SPY, XLP, XLV
   — + TLT (orthogonal hedge). Calm Sharpe ~1.9, ~43 trades/yr.
2. **Add 3 cross-asset futures legs** (the crash-independent bets that lift crash-Sharpe to ~1.9): YM Double-7s (index,
   OOS PF 3.53 p=0.009, the placebo-cleanest), GC via MGC micro (metals, PF 1.79 MOC/2.54 next-open, deepest 10yr
   sample), BTC via MBT micro (PF 7.26 but FRAGILE — next-open collapses to 1.64, edge is overnight-gap; satellite/
   small/own-capital only). YM-GC underlying corr 0.17, gated entry days 100% non-overlapping.
3. **Cheap next extension:** free yfinance pull of GLD/SLV/GDX/DBC/USO commodity ETFs (the most likely additional true
   decorrelators; same zero-cost path that already turned a 3-sleeve futures answer into a 23-instrument study).
4. **Do NOT add:** ES/NQ/RTY / 2nd index (same crash cluster as SPY/YM), SI/PL/HO/energy/livestock (die honest/too-thin),
   more single-name tech (drift not reversion — NVDA is the canary). Breadth = different MARKETS, not more names in a bucket.

**NON-NEGOTIABLE — the H153 chop-gate IS the safety, not a nicety.** Ungated, this is a 2020 blow-up: IWM -36.5%, AAPL
-38.3%, XLF -29.8% max DD (long-only dip-buying into a crash). The RANGE (prior-day chop) gate lifts SPX OOS PF 2.92->17.75
(placebo p<0.001) while the mirror TREND gate KILLS it to 0.91 — direct proof the gate strips the trending/crashing days
where MR bleeds. Gated crash DD compresses to ~-10/-15%. TLT + GC actively HEDGE the crash; the rest merely survive it.
RUN THE ENTIRE BOOK BEHIND THE GATE.

**Vessel + frequency + capital:** own-capital / funded-seat, OVERNIGHT hold (MOC entry -> exit RSI2>70 or 7-day-high; the
multi-day hold IS the edge, single-overnight amputates it). Own-capital continuous = native fit (BTC + equity ETFs earn
full total return incl. dividends). Funded-seat flatten-reenter survives on YM (3.53->2.64) + GC (IMPROVES 1.79->2.54).
Breadth fixes RSI2's ~4/yr frequency wall: full 10-sleeve book ~56 trades/yr (~1/week). Capital: equity core ~$70-100k
(margin-eligible) OR split — funded futures seat runs YM/MGC, cash equity account runs the ETF/TLT core; futures overlay
via micros (MYM/MGC/MBT) is margin-light. Whole book on ~$100-150k own-capital.

**Honest ceiling:** fundable, NOT spectacular — crash-Sharpe ~1.9 WITH cross-asset legs, ~1.44 without. The edge is the
BOOK CONSTRUCTION + the chop-gate discipline + the calibrated detector, not any single sleeve. This is the deployable core
([[reference-what-the-research-points-to]] realized: "the game is a book + the bullshit-detector + discretion, not a hero
strategy"). Pairs with the perpetual discovery engine ([[project-mym-portfolio-reframe]] architecture) to maintain/rotate
it. Deploy gated, own-capital first; F5 + founder go before any funded seat.