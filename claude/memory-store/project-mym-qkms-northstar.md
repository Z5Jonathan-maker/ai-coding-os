---
name: project-mym-qkms-northstar
description: "Founder's 2026-07-14 blueprint = the QKMS (Quant Knowledge Mining System) north-star for the discovery engine's INTAKE + validation layers: institutional source hierarchy (public-API-first), evidence grading A-F, 21-step validation gauntlet, knowledge graph, structured research cards. Plus the asset-class EXPANSION: edges aren't futures-only — options, CFDs, and prediction markets (Polymarket) are new veins. KEY DISCIPLINE: intake breadth scales BEHIND our honest-fill + cumulative-K gauntlet, never around it."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The founder handed a full "QUANT KNOWLEDGE MINING SYSTEM" spec (2026-07-14) = the north-star for the [[project-mym-discovery-engine]]'s
ACQUIRE + GENERATOR + VALIDATION layers.** 24 sections: source-acquisition priority (official APIs > public dumps > open datasets >
RSS/Atom > frontend REST/GraphQL where permitted > OpenAPI/sitemaps/JSON-LD/BibTeX/Crossref > public GitHub > HTML last) — which is
EXACTLY our API-crack playbook; a huge academic source list (arXiv/SSRN/RePEc/OpenAlex/Semantic Scholar/Crossref/CORE/NBER/SSRN/...);
market + microstructure + alt-data catalogs; the full method taxonomy (stats/TS/ML/DL/RL/econophysics/TDA/graph/info-theory); strategy+code
repos (Quantpedia/QuantConnect/mlfinlab/vectorbt/FinRL/Qlib); evidence grading A-F; a 21-step VALIDATION GAUNTLET; knowledge graph
(paper→concept→formula→signal→strategy→code→data→backtest→robustness→deployment); dedup/lineage; structured research cards; aggressive
cross-discipline search ("an edge may be buried in a study that never says 'strategy'"). Full spec saved as `docs/QKMS-ROADMAP.md` in mym-autotrader.

**THE LOAD-BEARING WISDOM (do NOT lose this): intake breadth scales BEHIND the honest-fill + cumulative-K deflation gauntlet, NEVER around
it.** 100× content ≠ 100× false positives ONLY because every look is charged against lifetime-K (DSR √(2 ln K) + SAFFRON online-FDR) and every
candidate runs honest fills + the multi-execution matrix. The whole point of the engine is that MORE fuel is safe *because* the gauntlet is
the moat. The engine we built ALREADY implements the hard half of his spec: his §1 acquisition-priority = our crack playbook; his §17-18
grading+validation-gauntlet = our dual-error gauntlet (honest fills / OOS / placebo / deflation / multi-execution / quarantine-not-delete);
his §7 stats = our DSR + SAFFRON at cumulative-K; his §20 dedup/lineage = our fingerprint + graveyard reopen-keys; his §21 research card =
our Candidate/HypothesisSpec. So the blueprint VALIDATES the architecture and defines the INTAKE EXPANSION, not a rebuild.

**EXTERNAL VALIDATION:** the founder's mined quant-knowledge source independently converged on our exact hard-won discipline (honest fills,
Deflated/Probabilistic Sharpe, survivorship control, multiple-testing correction, quarantine-not-delete, "never accept because a paper/author
claims profit"). Corroborates [[reference-what-the-research-points-to]] + [[project-mym-p2-recert-deflated-corpus]] — the doctrine is right.

**ASSET-CLASS EXPANSION (founder, 2026-07-14): the edges aren't futures-only — options, CFDs, and PREDICTION MARKETS are new veins.** Each
flows through the SAME kill-by-default gauntlet but needs its OWN honest-fill model:
- **CFDs** ≈ our futures cache already (US30≈YM, NAS100≈NQ, XAUUSD≈GC) — near-zero incremental data; the delta is broker spread + overnight
  financing. CFD strategies are largely testable TODAY on the databento cache. NOTE prop-firm rule: overnight OK on some firms, no multi-day holds.
- **Options** need a DIFFERENT honest-fill model (fills at bid/ask, wide spreads, Greeks/IV/assignment; a MID-PRICE fill is the options
  equivalent of our instant-fill fantasy that killed the fade catalog). Data mostly paid (OptionMetrics/ORATS); free is limited (CBOE delayed,
  yfinance/Tradier chains). Treat as a later vein, honest-fill-first.
- **Prediction markets (Polymarket) = THE standout untapped vein.** PROBED LIVE 2026-07-14: public Gamma API (gamma-api.polymarket.com/markets)
  + CLOB API (clob.polymarket.com, order book + price history) return full JSON with NO auth/crack (question, outcomes, outcomePrices, liquidity,
  volume, conditionId). We already have a `polymarket/scraping.md` browser-harness domain skill. WHY it's the best new vein: (a) accessible +
  public-API, (b) genuinely UNCORRELATED to macro/futures → fits the decorrelated-book doctrine ([[project-mym-reversion-book-blueprint]]),
  (c) documented anomalies (favorite-longshot bias, convergence-to-resolution, cross-market/complementary-outcome arbitrage), (d) different
  return process (event-probability → 0/1). CAVEAT: thin books + resolution risk → honest-fill model matters as much as anywhere.

**SEQUENCING (wise, not naive):** the gauntlet is the moat; widen the intake behind it. Priority = (1) close v1 + wire the free databento
loader (futures/commodity/crypto lanes live), (2) add public-API academic source connectors to engine/acquire (OpenAlex/Semantic-Scholar/
arXiv/Crossref are FULLY open — no crack), (3) the prediction-market vein (public API + uncorrelated), (4) CFD reuse of the futures cache,
(5) options last (needs its own honest-fill + data). Every new source/vein is kill-by-default + charged against cumulative-K. Do NOT chase the
20M-papers/50M-repos scale naively — that's fuel; without the honest gauntlet it's just faster garbage. Related: [[feedback-backtest-measures-robot-not-trader]],
[[reference-management-multiplies-not-creates]], [[project-mym-mr-dig-queue]].

**SYNTHESIS DOCTRINE (founder directive 2026-07-15, THE elevation): the corpus is not strategies-to-replicate — it is CONCEPTS/THEORIES/MECHANISMS
that let the engine CREATE NEW strategies. "Study everything → become the quant, not the copycat."** The generator becomes an INVENTOR: distill the
theory corpus into a library of economically-grounded PRIMITIVES (signal mechanisms: OU-half-life reversion, Nagel vol-conditioned reversal,
cointegration spread, Hurst persistence as a regime filter, regime-switch, seasonality, momentum, ORB, order-flow; conditioning gates: vol-regime,
trend-MTF, session, liquidity, calendar; executions), then COMPOSE novel strategies (coherent mechanism × gate × vessel × tf, each with a real
economic rationale). ANTI-DATA-MINING LAW: a synthesized strategy is emitted ONLY if it carries a real economic MECHANISM (a WHY prices behave this way —
liquidity provision, risk-transfer, inventory flow, info diffusion, behavioral over/under-reaction, physical seasonality, carry); a mechanism-less pattern
is data-mining and is rejected. Composition is coherence-constrained (which mechanism×gate pairings the economics justify), NOT a blind grid. Every
synthesized candidate still runs the SAME dual-error gauntlet + one cumulative-K look + correlation-cap + graveyard dedup (never resynthesize known-dead
cells: naive reversal, QF fade, 1R-ORB). Built at engine/generator/synthesis.py. This is the generation half of the QKMS; the intake half feeds it the theory.

**SYNTHESIS RESULT (2026-07-15, wf wg1ajdy85 — DELIVERED + honest-null):** built a **33-primitive economically-grounded library** (13 signal
mechanisms: OU-halflife reversion, connors-RSI2, Nagel vol-conditioned reversal[sizing-tilt-only], cointegration-spread, index-residual, path-shape-selloff[h165
PATH gate = strongest MR filter], CMMA cross-asset-reversion-spine, physical-seasonality[only non-decaying MR vein], XS-momentum, ORB, order-flow[null on YM],
carry, price-path-convexity, COT-contrarian; + 13 regime GATES: hurst/DFA, HMM-state, vol-regime, capitulation-breadth[the true reversion discriminator, replaces
raw-vol], **trend_mtf_gate = THE season gate**, session, liquidity, calendar, distance-to-resolution, efficiency-ratio, variance-ratio, correlation-regime;
+ 7 executions) with COHERENCE RULES (12 allowed / 12 FORBIDDEN cells encoding everything we've learned: opposite management trend-vs-reversion, next-open NOT
limit-below on baskets[h166], NO price-stop on MR, single PATH-gate beats stacked-gates[h165], ORB no-1R-cap). Composer wired as a generator SOURCE
(family:84/corpus:36/combinatorial:26/synthesis:20), REFUSES every incoherent/known-dead cell, 138 tests green. **HONEST TRADING NULL: invented 20 novel
compositions (new ou_mr/cmma_mr families), killed ALL 20 on honest fills (GREEN=0, 12 execution-sensitive quarantines, 8 robust kills). COMPOSITION DID NOT BEAT
PRIMITIVE** — a single coherent regime gate did NOT rescue reversion (0/20 passed an honest execution). K rose 14051→15399 (synthesis RAISED the DSR bar, never
lowered it — honest-forever working). The machine invented + killed its own inventions as ruthlessly as everything else = working as designed, zero live risk.
**The null is NARROW, not final:** only the single-signal × single-gate daily corner was tested; the market-neutral index-residual / cointegration / seasonality /
XS-momentum veins + multi-primitive FUSION (signal × gate × breadth triples) are UNTESTED = the frontier. CRUCIAL: the engine INDEPENDENTLY produced the founder's
regime-diversification thesis (trend_mtf_gate: momentum on trend days, reversion on chop days) — now being tested as the regime-diversified book (wf wdsnw2uro).

**OPERATIONALIZATION (2026-07-15 PM, founder re-pasted the full 24-section QKMS spec):** the honest split against what's built — VALIDATION half (§17 grading / §18 gauntlet / §7 DSR+SAFFRON / §20 fingerprint-lineage / §21 research cards) = DONE, battle-tested. ACQUISITION half = ~80% BUILT, not greenfield: engine/acquire/ has a real throttled HTTP client (fetch.py RealHttp, min_interval+UA+retries) + connectors for arXiv/OpenAlex/Semantic-Scholar/Crossref/GitHub/RSS/Atom, a corpus_reader (reads data/research_corpus/, families aligrithm|mr_blogs|academic), and dig_queue wiring the generator consumes (engine/generator/__init__.py). **THE GAP WAS OPERATION, NOT CODE: nobody RAN the intake, so the dig-queue was empty → `orchestrate generate` produced 0 candidates → the hunter starved (K frozen at 16,046).** This directly explains the "hunter generates 0" finding. FIX IN PROGRESS (agent a1d12e...): run the intake on FULLY-OPEN APIs only (§1 rule: official APIs, NO auth/paywall/robots bypass — arXiv/OpenAlex/Semantic-Scholar/Crossref) for §22 technical topics (order-flow imbalance, VPIN, opening/closing auction, overnight drift, intraday reversal, queue imbalance, price clustering...), extract §13-15, close the acquire→dig_queue populate gap, run generate+gauntlet, verify K advances + candidates sourced from mined research. Doctrine intact: intake breadth scales BEHIND the honest gauntlet, never around it; every mined item is kill-by-default + charged against cumulative-K. See [[feedback-corpus-as-brain-standing-directive]] (the fuel loop), [[project-mym-discovery-engine]].