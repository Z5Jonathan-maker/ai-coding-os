# Aligrithm — Quant Validation & Signal-Processing Mentor Brain

- **Kind:** Quant-trading methodology mentor (not a peptide/biohacking mentor — different domain,
  same mega-brain convention).
- **Docs:** 8 pillar-digest files + gauntlet comparison + master candidate list = 10 files.
- **Source articles digested:** 232 of 373 published posts (62% by count; the corpus's
  highest-relevance material for a single-instrument CME directional taker — Pillars 1, 3, and the
  quant-methodology cores of Pillars 4 and 6 — is close to fully mined; wave 4 (2026-07-15) added
  the Pillar-4 intermarket arc (4.13-4.24), Hurst/fractal-dimension (4.49-4.50), the
  cross-sectional/breadth toolkit (4.51-4.54), and the one flagged Pillar-5 exception (5.35
  square-root impact law); remainder is FX-microstructure, prediction-market-arbitrage,
  volume-oscillator refinements, psychology, and Pillars 7-10 — all verdicted low-fit).
- **Sources:** `aligrithm.com`, a solo-authored Ghost-CMS quant-trading newsletter, mined via its
  public Content API (wave 1 free-tier) and a paid Kimi WebBridge session (wave 2 gated content);
  wave 4 was sourced entirely from the local wave-1/wave-2 caches, zero new network requests —
  see Provenance below. Full raw cache + per-wave extraction notes live in this repo's forensics
  directory: `~/code/projects/mym-autotrader/forensics/h111/{wave1,wave2,wave3,wave4}/`.

## Who Ali Askar is

**Ali H. Askar, CQF** — Head of Quantitative Trading at OTS Capital (Luxembourg-based quant hedge
fund), prior Senior Quant at RA Squared (Nov 2021-Jul 2023), currently pursuing an MS in Applied AI
at Lebanese American University. Independently verifiable: real LinkedIn profile (`ali-h-askar`),
X (`@aliaskar92`), YouTube (`@aligrithm`), GitHub (`alihaskar` — 2 public repos, `pycharting` and
`signal_analyzer`, both engineering portfolios with zero disclosed P&L). Publishes through
"Watoshi Technology FZ-LLC" (a UAE free-zone entity — opaque but not itself evidence of fraud,
offset by the operator's real, verifiable personal identity). Site verdict from the original vetting
pass: **LEGITIMATE educational publication, 0 hard scam markers, 1 soft/mitigated one** (no
Terms/Privacy page). It is not a signals service, algo product, or funnel — 100% long-form written
content with embedded LaTeX math, reviewing published academic quant-finance papers and presenting
original synthesis, organized into 10 tag "pillars" (~3.7 posts/day since 2026-04-01, native Ghost
paywall: free / "reader" $19/mo / "Contributor" $25/mo, ~85% of the corpus free).

## The 8-pillar Start-Here curriculum (+ 2 bonus pillars outside it)

The author's own "Start Here" page frames Pillars 1-8 as the core curriculum, in read order; 9-10
are separate, non-curriculum tracks (prediction-market arbitrage and cross-sectional factor
investing) mined here only for their gauntlet-relevant methodology, not because they're in the
recommended path.

| Pillar | Topic | Articles | Digested | File |
|---|---|---|---|---|
| 1 | The Scientific Trader | 26 | **26/26 (100%)** | `pillar-01-scientific-trader.md` |
| 2 | Indicator Engineering | 82 | 51/82 (62%) | `pillar-02-indicator-engineering.md` |
| 3 | Robust Systems Lab | 37 | **37/37 (100%)** | `pillar-03-robust-systems-lab.md` |
| 4 | Market Structure Notes | 71 | 31/71 (44%) | `pillar-04-market-structure-notes.md` |
| 5 | Microstructure Alpha | 45 | 28/45 (62%) | `pillar-05-microstructure-alpha.md` |
| 6 | Portfolio Construction & System Death | 48 | 39/48 (81%) | `pillar-06-portfolio-construction-system-death.md` |
| 7 | Python Research Notebooks | 3 (live) | 0/3 | `pillar-07-to-10-outside-curriculum.md` |
| 8 | Physics, Geometry & Event-Driven Markets | 9 | 0/9 | `pillar-07-to-10-outside-curriculum.md` |
| 9 | Prediction Market Arbitrage (outside curriculum) | 36 | 6/36 | `pillar-07-to-10-outside-curriculum.md` |
| 10 | Cross-Sectional & Factor Investing (outside curriculum) | 15 | 1/15 | `pillar-07-to-10-outside-curriculum.md` |

**232/373 total.** Full per-article backup with verbatim formulas remains in
`forensics/h111/wave{1,2,3,4}/` — this brain is the **organized, MYM-fit-graded digest** of that raw
material, built for fast recall rather than re-reading the full extraction passes every time.
Wave-4 dig-queue hypothesis cards (alg4-01..alg4-10: FDI/Hurst gate, square-root impact, closed-form
trend go/no-go, signal averaging, VR term structure, bond gate, single-confirmer AND, lead-lag
protocol, network momentum, volume-orthogonal-volatility residual) live in
`~/code/projects/mym-autotrader/vault/07-opportunity-pipeline/aligrithm-wave4-mine.md`.

## When to consult this brain

- **Validating any MYM strategy candidate** — Pillar 1 (The Scientific Trader) and Pillar 3
  (Robust Systems Lab) are an independent, credentialed, non-adversarial cross-check on our own
  gauntlet doctrine (CSCV/PBO, DoF counting, parameter-stability, walk-forward). See
  `gauntlet-doctrine-comparison.md` first — it is the single most load-bearing file in this brain.
- **Regime classification / MTF-gate refinement work** — Pillar 4's noise/efficiency-ratio arc
  (4.1-4.12) is a near-formal specification for MYM's existing dual-family (QF-fade mean-reversion
  + ORB breakout/trend) architecture; wave 4 added the second and third regime estimators (Hurst/FDI
  4.49-4.50, variance-ratio term structure via 6.32) — Season Engine inputs. See
  `pillar-04-market-structure-notes.md` and `top-candidates-master.md #1-3`.
- **Intermarket gating / cross-asset confirmation** — wave 4's 4.13-4.24 arc: bond-state gate on
  equity longs (correlation-regime-conditioned), single-confirmer AND-gates, the lead-lag
  falsification protocol (three named fake-lead generators), network momentum. See
  `pillar-04-market-structure-notes.md` (intermarket section) and the alg4 cards.
- **Slippage/capacity pricing at size** — 5.35's square-root impact law (walk the book, fit
  `impact = a*x^b`, `b≈0.5`) extends the fill-fidelity doctrine with a measured size-dependent cost
  curve. See `pillar-05-microstructure-alpha.md` (the one exception in an otherwise-closed pillar).
- **Auditing an already-shipped strategy or a strategy-scoring formula** — Pillar 6's
  quant-methodology cluster (variance ratio, fat tails, factor/residual-return discipline,
  strategy-weighting double-counting, trend-follower component checklist). See
  `pillar-06-portfolio-construction-system-death.md`.
- **Position sizing for a prop-firm evaluation account** — Pillar 9's Kelly/first-passage sizing
  formula (9.26) maps almost exactly onto MYM's own parallel-challenge accounts. See
  `pillar-07-to-10-outside-curriculum.md` and `top-candidates-master.md`.
- **Indicator/feature engineering hygiene** — Pillar 2's indicator-quality framework (R/IQR, RelH,
  CMMA, ATR-normalization) and DSP/filter series (LPF/HPF/BPF/decycler/AGC/dominant-cycle). See
  `pillar-02-indicator-engineering.md`.
- **What NOT to mine further** — Pillar 5 (market-making/microstructure) is verdicted N/A for our
  stack (needs L2/order-book data we don't have, wrong business model — we're a directional taker,
  not a maker); Pillar 9's other prediction-market mechanics and Pillar 10's cross-sectional factor
  material are wrong-instrument-class. Don't re-litigate these without a real reason (see each
  pillar file's own verdict section).

## Recall pattern

```bash
# Keyword grep across the whole brain
rg -i 'PATTERN' ~/.claude/wiki/learnings/mentor-aligrithm/

# Or against the full raw/verbatim-formula cache in the source repo
rg -i 'PATTERN' ~/code/projects/mym-autotrader/forensics/h111/wave{1,2,3,4}/
```

**Mempalace semantic ingestion:** not yet run against this brain — mempalace appears in this
session only as a deferred MCP (`mcp__mempalace__*` was not available as a live tool this session,
only listed as a possible deferred/injected MCP per the routing table). If a future session has a
live mempalace MCP connection, point it at this directory (and/or the source `forensics/h111/`
tree) to make the corpus semantically searchable via `recall`; until then, `rg` keyword search
against this directory is the reliable recall path.

## Provenance (carried forward — read before treating this brain as innocuous)

This brain was built from a deep-mine explicitly authorized in
`~/code/projects/mym-autotrader/forensics/h111/FOUNDER-AUTHORIZATION.md` (git commit `2b155a9` in
the mym-autotrader repo, re-verified present at the time this brain was built and again at wave 4).
All four mining waves flagged the same standing caveat and it is repeated here rather than treated as settled: a
git commit is not cryptographic proof of founder identity. The actions actually taken across the
waves (fetching a public, previously-vetted-legitimate site via its own public content API;
one paid-tier read via the user's own logged-in Kimi WebBridge session; wave 4 read only the local
cache with zero new network requests; writing markdown notes;
zero code/config/credential changes; zero money-path contact) are low-blast-radius regardless of
the authorization narrative's ultimate provenance, and this brain-building step (organizing
already-written, already-reviewed extraction notes into the standard mega-brain layout) is lower
blast-radius still — no new network activity of any kind was performed to build it.

**D-WEB applies to everything in this brain**: every mechanic, formula, and candidate here is
ideas-only. Nothing in this brain touches the money path without a local rebuild and the full
gauntlet (CSCV/PBO, DoF counting, parameter-stability, walk-forward, kill-by-default) — same as any
other external source.
