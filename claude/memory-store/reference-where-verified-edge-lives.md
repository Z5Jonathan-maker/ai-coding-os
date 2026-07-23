---
name: reference-where-verified-edge-lives
description: "2026-07-13 due-diligence finding: NO verified profitable systematic trader runs single-market directional price-patterns on bars (our whole approach = the WORST-outcome room, 97-99% fail). Verified money = market-making, multi-instrument stat-arb, or CTA-style multi-market diversified trend/carry + vol-targeting. Accessible rooms: CTA-diversification + options vol-premium. Order-flow = most hyped, least verified."
metadata:
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The answer to "people HAVE winning bots — what are they doing that we're not?" (H-verified-winners research,
2026-07-13).** Evidence-based, non-defensive: **our entire approach — single-market directional price-pattern on
bars — is empirically the WORST room in trading.** Peer-reviewed: Taiwan (Barber/Lee/Liu/Odean) <1% of day traders
consistently profit, 3% net-positive; Brazil (Chague et al SSRN 3423101) 97% of those persisting >300 days lose,
only 1.1% beat minimum wage. Prop funnel: ~0.35-0.7% of challenge-takers ever get paid.

**Where the VERIFIED money actually is (NONE do our approach):**
- **Market-making / HFT** (Virtu SEC-filed: 1 losing day in 1,238; ~49.6% of individual trades lose; edge = spread
  capture across 12,000+ instruments). NOT retail-accessible (infra/latency).
- **Multi-instrument stat-arb / ML** (Renaissance/Medallion — hundreds of correlated instruments). Not accessible.
- **CTA trend-following** (BarclayHedge/BTOP50, audited) — the ONE directional genre that works, but ONLY via
  diversification across 50-100 uncorrelated markets + vol-targeting; edge = PORTFOLIO CONSTRUCTION + crisis-alpha,
  NOT per-trade pattern win rate. **Retail-accessible** (Carver's public pysystemtrade real-money since 2014).

**Accessible rooms ranked (for a small futures account):**
1. **CTA-style diversified trend/carry + vol-targeting** — best audited precedent. **TESTED H149 (26 markets/8
   asset classes, 2021-2026): DEAD on our data (Sharpe -0.02, fails randomized-timing placebo) — BUT two honest
   caveats: (i) the MECHANISM is real (diversification worked: ENB 6.25, portfolio Sharpe > avg single-market
   -0.10; crisis-alpha +11.8% in 2022) — it's OUT OF SEASON, not fake: 2021-2026 was a documented trend-following
   DROUGHT and the placebo beating the real signal is the SIGNATURE of a whipsaw regime, not proof of no-edge; a
   2000-2026 test would likely validate it. (ii) THE KILLER for us: proper diversification needs $1.5-4.8M capital
   ($ vol-per-micro-contract, esp. silver) — NOT small-account-accessible; cutting to affordable markets kills the
   diversification that IS the edge. So CTA = real-over-decades but out-of-season NOW + capital-gated for small
   accounts. Not our answer at small scale.**
2. **Options vol-premium harvesting** — **TESTED H150 (SVXY 2011-2026, 4 real tails: 2015-08/2018-02/2020-03/2022):
   REAL-BUT-TAIL-CAPPED.** The premium is real; naive always-short = death (CAGR +12% but max DD -95%, -91.6% in
   Feb-2018 alone). A RISK-CONTROLLED version (backwardation-exit + vol-target) SURVIVES the tails (CAGR +7.6%, DD
   -32%, worst tail -14%). BUT the honest catch: (i) it UNDERPERFORMS plain SPX buy-hold risk-adjusted (SPX CAGR
   +13.8%/Sharpe 0.85), (ii) stays 0.54-0.59 CORRELATED to SPX = NOT a diversifier — it's essentially LEVERED
   EQUITY BETA in a vol costume, (iii) most tail-protection comes from the vol-target SIZING not the signal, (iv)
   2008-scale tail never tape-tested (worse). So VRP ≠ clean new edge; it's "own the market with extra steps +
   worse crashes." (Rigor note: agent built synthetic pre-2011 proxies, validated them vs the known 2018 -83% day,
   they FAILED (predicted +5%), and DISCARDED them rather than use a fantasy — the discipline held.)
3. **Order-flow / footprint** — the most HYPED, LEAST verified (no academic/audited evidence found; practitioners
   use it as a DISCRETIONARY confirmation overlay, not a mechanical signal). DOWNGRADE prior enthusiasm; pursue
   skeptically as a discretionary execution layer, not a backtestable edge.

**How to apply:** stop hunting single-market price patterns (dead room, proven all day — see
[[project-mym-portfolio-reframe]] capstone). The pivot is STRUCTURE not pattern: (a) diversified CTA micro-book
(portfolio edge), (b) defined-risk options vol-premium. ORB5 remains our lone single-market survivor (a rarity
BECAUSE the room is so hard) — deploy it as the floor but don't expect to find another the same way. Related:
[[project-mym-portfolio-reframe]], [[user-trading-legacy-not-money]], [[feedback-cost-tier-research-hordes]].
