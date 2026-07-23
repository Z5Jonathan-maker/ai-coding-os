# Quant Methodology Canon — Academic Backbone for MYM's Gauntlet

- **Kind:** Concept layer (peer-reviewed academic corpus), not a mentor brain — no single author,
  no video transcripts. Sibling to `mentor-aligrithm/` and `mentor-algorithmic-io/` in the mega-brain
  convention, but the source is a ranked reading list across SSRN/arXiv/NBER/CME Group/JFE, not one
  person's publication stream.
- **Docs:** `_README.md` + `_manifest.json` + `canon-formulas.md` +
  `cross-index-gauntlet-convergence.md` + `academic-harvest-2026-07-15.md` = 5 files.
- **Source:** `~/code/projects/mym-autotrader/forensics/research-mine/academic-sweep/reading-list.md`
  — a 17-paper ranked reading list, sweep date 2026-07-12, part of the same 5-source research-mine
  wave that produced `mentor-algorithmic-io/`. Full source ranking + gap notes live in that file.
  **Second wave 2026-07-15:** `academic-harvest-2026-07-15.md` — 16 papers / 5 veins (ORB lineage,
  OU vol-conditioning closed-form trio, round-number clustering beyond Osler, intraday
  seasonality, sector-ETF-neutral MR) from the academic-lit-gaps harvest at
  `~/code/projects/mym-autotrader/research/papers/2026-07-15/`; dig-queue cards lit15-01..08 in
  `vault/07-opportunity-pipeline/academic-lit-mine-2026-07-15.md`.

## What this is

The academic-sweep dossier verdicted **DEEP-MINE-YES** (one of two sources in the 5-source wave to
earn it — see `~/code/projects/mym-autotrader/forensics/research-mine/SYNTHESIS.md`). Its headline
finding is not a windfall of new edges — it's confirmation that **MYM's gauntlet already runs the
canonical academic validation stack** (PBO/CSCV, DSR, Harvey-Liu multiple-testing haircut), plus a
small number of genuine upgrades and exactly one new candidate edge. This concept layer captures the
**9 papers with fully or partially extracted formulas/findings** as a recallable reference —
independent of any specific mentor's synthesis, citable directly in `docs/ai-memory/STRATEGY.md` or
the book.

## The 9 papers captured (see `canon-formulas.md` for full formulas)

1. **Bailey & Lopez de Prado (2014)** — Deflated Sharpe Ratio + the False Strategy Theorem
2. **Bailey, Borwein, Lopez de Prado & Zhu (2015)** — Probability of Backtest Overfitting (PBO/CSCV)
3. **Arian, Norouzi & Seco (2024)** — CPCV dominates walk-forward (lowest PBO, highest DSR)
4. **Harvey & Liu (2015)** + Harvey, Liu & Zhu (2016) — non-linear multiple-testing haircut
5. **Osler (FRBNY SR-150/SR-125)** — round-number order clustering — ★ **flagged prominently below,
   the published microfoundation of MYM's own QF-fade + failed-retest re-entry canon**
6. **Gao, Han, Li & Zhou (2018, JFE)** — intraday momentum (first half-hour predicts last half-hour)
7. **Moskowitz, Ooi & Pedersen (2012, JFE)** — Time Series Momentum (58 futures)
8. **Zhang, Li, Peng & Chen (2026)** — one-switch decision-timing-leakage benchmark
9. **Busseti, Ryu & Boyd (2016)** — risk-constrained Kelly gambling

## ★ Osler is the load-bearing citation in this brain

**Osler's round-number order-clustering finding (FRBNY Staff Report 150/125) is the single best
academic anchor MYM's live edge has.** Take-profit orders cluster AT round numbers (bounce -> the
fade works); stop-loss orders cluster JUST BEYOND (cascade -> first-touch is a trap, the trade is the
**failed-retest re-entry**). This is not a new edge and it does not resurrect mechanical first-touch
fading — it is the published microstructural mechanism for MYM's existing two-phase QF/AREA61 canon.
**Cite it directly in `docs/ai-memory/STRATEGY.md` and the book.** See `canon-formulas.md` #5 for the
full verbatim mechanics and magnitudes.

## When to consult this brain

- **Auditing MYM's DSR/PBO implementation** — papers #1 and #2 are the source-of-truth formulas;
  spot-check MYM's code against the verbatim expressions in `canon-formulas.md`, especially that the
  SR₀ threshold uses the correct expected-max-of-N form and that N is the *effective* independent
  trial count from the 8-category DoF ledger, not raw config count.
- **Promoting CPCV to the primary validator** — paper #3 (Arian et al.) is the empirical case;
  MYM already owns `confluence/harness.py::cpcv_splits` but doesn't yet route DSR/PBO through CPCV
  paths as the primary validator. Highest-ROI methodology change on the table per the SYNTHESIS.
- **Confirming the haircut-Sharpe gate is non-linear** — paper #4; "the rule-of-thumb 50% haircut
  is WRONG" (verbatim) — top Sharpes lightly penalized, marginal ones crushed.
- **Citing the microfoundation of the QF-fade** — paper #5 (Osler), see above.
- **Validating ORB / MTF-gate / trend-pullback lanes** — papers #6 and #7; Gao's regime-conditioned
  intraday momentum is also the design template for the one genuinely-new edge candidate in the
  whole research-mine wave (a last-30-min ES/NQ sleeve gated by first-30-min vol/volume — queue #4
  in SYNTHESIS.md, not yet gauntleted).
- **Institutionalizing the bar-END/START look-ahead fix** — paper #8 (Zhang et al.); converts a
  one-off fix into a standing regression test (`decision_timing_switch` gate: toggle bar-close vs
  next-bar-open decision timing, flag any edge that collapses).
- **Re-deriving prop-firm sizing on rigorous footing** — paper #9 (Boyd); the twin of
  `scripts/challenge_sizing.py`'s theta/cushion sizer, collapsing it to one principled knob
  λ = log β / log α.
- **Checking whether the field independently converges on MYM's approach** — see
  `cross-index-gauntlet-convergence.md`, which ties this canon to `mentor-aligrithm/
  gauntlet-doctrine-comparison.md`: an independent CQF-credentialed practitioner (Aligrithm) AND the
  peer-reviewed academic literature both arrive at essentially the same validation skeleton MYM
  already runs.
- **Deriving OU/MR entry bands, the analytic vol floor, the no-stop-on-MR proof skeleton, or a
  noise-robust half-life** — `academic-harvest-2026-07-15.md` vein 2 (Bertram 2010; Leung & Li
  2015; Holy & Tomanova 2018 ARMA(1,1); Endres & Stubinger 2018 regime-OU).
- **Citing round-number clustering beyond Osler** (vol-conditioned, electronic-venue-surviving,
  account-level retail buy-side skew) — `academic-harvest-2026-07-15.md` vein 3
  (Schwartz/Van Ness/Van Ness 2004; Chung & Chiang 2006; Bloomfield/Chin/Craig 2025).
- **Checking whether a "new" paper re-describes an already-closed family** — the ADJUDICATED
  ledger in `vault/07-opportunity-pipeline/academic-lit-mine-2026-07-15.md` (Pineda retest =
  family closed permanently; Baltussen L30 = closed 5-for-5; Mesfin survivors = GMM-blocked).

## Recall pattern

```bash
rg -i 'PATTERN' ~/.claude/wiki/learnings/quant-methodology-canon/
rg -i 'PATTERN' ~/code/projects/mym-autotrader/forensics/research-mine/academic-sweep/reading-list.md
```

**Mempalace semantic ingestion: not yet run** — same status as `mentor-aligrithm/` and
`mentor-algorithmic-io/` (mempalace was not a live tool in the session that built this brain).

## Provenance

Built from the `academic-sweep/reading-list.md` dossier inside the founder-authorized research-mine
wave (2026-07-12). Formulas reproduced here are already-extracted, already-published verbatim
quotes/equations from free-access sources (arXiv, SSRN abstracts/preprints, Stanford, NY Fed, CME
Group, NYU, NBER) — no paywalled full-text was scraped to build this file; journal-paywalled exact
tables (Arian et al. *Knowledge-Based Systems*, Gao et al. *JFE*) are noted as gaps in
`canon-formulas.md` where relevant.

**D-WEB applies to everything in this brain**: every formula/finding here is ideas-only. Nothing
touches the money path without a local rebuild and the full gauntlet — same as every mentor brain in
this mega-brain layer.
