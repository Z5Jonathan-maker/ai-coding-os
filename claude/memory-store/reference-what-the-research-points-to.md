---
name: reference-what-the-research-points-to
description: "2026-07-13 grand synthesis of the full-day strategy hunt: there is NO single spectacular all-weather mechanical winner at retail scale (those live in HFT/market-making/$M-CTA rooms). Real edges = a few SIMPLE, economically-motivated, low-parameter, MODEST, season-conditional rules validated on genuinely-unseen data. We found TWO: ORB5 (momentum) + RSI(2) (mean-reversion, Connors). The game is a BOOK of modest uncorrelated edges + the calibrated bullshit-detector + discretion — not a hero strategy."
metadata:
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**THE GRAND SYNTHESIS (2026-07-13, after ~17 hunt cycles H122-H152 + 13k prior tests).** Founder asked
"what does all the research point to?" The honest answer:

**1. There is NO single winning strategy to find — not the spectacular, all-weather, mechanical kind.**
Every price-pattern died the calibrated gauntlet (proven: 6% FPR, 85% power @PF1.25). Verified winners
(Virtu/Renaissance/CTAs, [[reference-where-verified-edge-lives]]) are in rooms we can't access (HFT,
market-making, $M multi-market CTA) OR run PORTFOLIOS of modest edges — never one hero. The room we hunted
(single-market directional price patterns) is empirically the WORST (97-99% of people lose).

**2. Real edges DO exist — they're just MODEST, SIMPLE, and SEASON-CONDITIONAL.** The two that survived
honest OOS + deflation + placebo all day:
- **ORB5** — opening-range momentum breakout, MNQ intraday. PF 1.48 gated, fundable, ~$4.3k/yr/contract.
- **RSI(2)** — Connors mean-reversion dip-buy, long-only index/ES. 22yr OOS PF 2.92, win 81.5%, beats
  placebo 998/1000 (H151). **H152 CONFIRMED it's a REAL uncorrelated diversifier**: corr to ORB5 full -0.05,
  STRESS -0.18 (NEGATIVE when it matters — the mirror image of ORB5×BandMom 0.84 stress); combining them
  raises Sharpe 1.14→1.42 and CUTS maxDD -22%. The first genuine 2-edge book. **BUT VERDICT =
  REAL-EDGE-WRONG-VESSEL: its edge IS the ~4.6-day OVERNIGHT hold, and EVERY prop firm bans overnight carry
  (Goat/Tradeify/Lucid/MFFU all force daily flatten). So RSI(2) CANNOT run in a prop account — it needs the
  founder's OWN capital / standard futures account (IB etc.). ~4 trades/yr also rules it out as a standalone
  eval-passer.** KEY STRATEGIC INSIGHT: the prop daily-flatten constraint is itself a FILTER that kills a
  whole class of real edges (overnight/swing mean-reversion, carry, overnight-drift) — prop forces you into
  the crowded intraday-momentum room (ORB). Best play: ORB5 in prop (intraday) + RSI(2) in own account
  (overnight) = a genuine uncorrelated 2-edge book split across two vessels. Vault: vault/07-opportunity-pipeline/rsi2-sleeve-diversifier.md.

**GATE×EDGE FINDING (H153, 2026-07-13) — ONE gate cleanly separates the two edges = the Season doctrine realized.**
The founder's prior-day-TRENDINESS gate (H96b) is the spine: ORB5 (momentum) wants TREND days; RSI(2) (mean-reversion)
wants the OPPOSITE — CHOP/RANGE days. Applying the SAME gate CONTRA to RSI(2) (trade only non-trend days) took it
OOS PF 2.92 → **17.75** (+509%), stripping 12 of 17 base losers (all on trend days); VERIFIED clean (placebo-through-
gate p 0.001/0.003, coin-flip placebo stays flat ~0.94 = NOT day-type beta; 4/4 subperiods; tail-robust). Adding a
VIX≥20 fear-regime filter is additive quality (PF→3.86 base / higher stacked; return/trade 0.43%→1.16%, verified).
So the regime CLASSIFICATION tells you WHICH edge to run — momentum on trend, reversion on chop. ORB5 itself needs NO
overlay: every stacked gate (MTF-momentum, vol-regime, VWAP, DOW, DD-governor) was redundant or day-type-beta or hurt
— its base TREND gate is already optimal (don't over-engineer it). CAVEATS: RSI2 gates are QUALITY (better WHEN), not a
fix for its overnight-vessel non-deployment; VIX gate cuts RSI2 frequency further (~4→~1.6/yr).

**3. The SIGNATURE that separates real from fake (the durable meta-lesson):** survivors are SIMPLE +
economically-motivated (there's a REASON: opening-auction momentum; oversold panic reversion) + LOW-parameter
+ validated on genuinely-unseen data + MODEST + season-conditional. Deaths are complex / marketed /
top-of-a-big-search / or just long-beta in disguise (the random-direction + beta-neutral placebo strips it).
"Test thousands, share the survivors" = a SURVIVORSHIP MACHINE (H151: 11/12 died; the 1 that held, RSI(2),
was a decades-old simple published rule, NOT a search-winner). Day-selection filters = day-type-beta trap
([[project-tradex-orb-digest]]). Paid products (TradeX/Payout Vault/SOP decks) = instant-fill fantasy +
survivorship + sizing frameworks on fake P&L.

**4. The single most valuable ASSET built isn't any strategy — it's the calibrated honest-fill gauntlet**
(bullshit-detector). It told RSI(2) (real) from the other 11 + the fades + the products (fake). That doesn't
expire; every dollar it stops you burning is earned.

**How to apply — THE GAME IS A BOOK, NOT A STRATEGY:** collect a handful of modest, real, uncorrelated edges
(we have 2: ORB5 momentum + RSI(2) mean-reversion), size to SURVIVE not to get rich, rotate by SEASON, add
discretion on top ([[user-trading-legacy-not-money]], [[feedback-season-doctrine]]). Deploy ORB5 as the floor
([[project-mym-portfolio-reframe]] H142 playbook). Stop paying tuition to the mirage-selling ecosystem — you
now have the detector to see through it. Related: [[reference-where-verified-edge-lives]],
[[feedback-backtest-measures-robot-not-trader]].
