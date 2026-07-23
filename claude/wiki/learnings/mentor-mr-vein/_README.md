# MR Vein — Cross-Source Mean-Reversion Canon (QEdges / RobotWealth / Chan / Alvarez / Aligrithm)

- **Kind:** Quant-trading VEIN brain (cross-source, not a single mentor — sibling to
  `mentor-aligrithm/` and `mentor-algorithmic-io/`, same mega-brain convention). Created because
  the 2026-07-15 MR dig-queue deepening harvest spans five publication streams and the distilled
  MR laws belong in one place, not scattered across per-author brains.
- **Docs:** `_README.md` + `_manifest.json` + `mr-canon.md` = 3 files.
- **Sources digested (37 raw files):** 20 Aligrithm articles (incl. PAID 10.14 / 10.10 / 4.70
  from the corpus crack), 9 Quantifiable Edges (Rob Hanna) CBI posts + a 23-row dated CBI spike
  ledger 2012-2025, 3 RobotWealth posts, 2 Alvarez, 2 Chan.
- **Raw corpus:** `~/code/projects/mym-autotrader/research/mr-vein/2026-07-15/` (spec-01..06 +
  `raw/`). Gauntlet-ready cards distilled from this brain:
  `~/code/projects/mym-autotrader/vault/07-opportunity-pipeline/mr-dig-queue-specified.md`
  (mrq-01..mrq-11).
- **Mined:** 2026-07-15, MR dig-queue deepening wave (context: [[project-mym-mr-dig-queue]],
  [[project-mym-reversion-book-blueprint]] H163, H165/H166 drill verdicts).
- **Standing caveat:** ALL content D-WEB — web-sourced claims, ideas only, kill-by-default
  gauntlet before any money path. Two hard-rule notes: the QEdges Catapult construction is
  login-gated and was NOT accessed (proxy built from public posts instead); PIT single-name data
  (Norgate/CRSP) was NOT purchased (convexity Tier-2 + CGO faithful arms parked pending founder).

## What this brain holds

`mr-canon.md` — the distilled, exact-parameterization MR laws:

1. **Capitulation-breadth (CBI)** — the public level map, the buy>=10/sell<=3 rule, the falsifiable
   proxy definition, and WHY breadth beats raw vol as an MR regime gate (2020: vol 35%, MR
   Sharpe +1.2 — the naive vol gate misses the best MR year).
2. **OU half-life machinery** — AR(1) estimator, the Kendall small-sample de-biasing
   `β_c = β + (1+3β)/n` (OLS understates memory → MR re-enters too soon), block-bootstrap
   gating on the 75th-percentile half-life, the 0.5×-half-life z-lookback law (verified 32% vs
   22% p.a.), the 63-day reject bar, Ehlers FDI cross-check `H = 2 − D`.
3. **One-persistence-axis law** — AR(1) β / Hurst / VR / ER are ONE number in costumes; never
   stack them as separate gates (H165 gate-stack overfit signature).
4. **Sector-ETF market-neutral construction** — the exact 4.51/4.52 recipe (in-window Spearman
   coupling kill-switch, fit-weighted index-deviation score, CDF-compress, EWM-3) + the hard
   rules: cross-sectional demean (the 0.55→0.18 killer), specific-factor P&L gate, U-fold,
   cost-aware no-trade buffer.
5. **Path convexity** — the exact Gulen-Woeppel dollar-close formula, published magnitudes, the
   recency-weighted-extrapolation decomposition, and the tiered honest test plan.
6. **Book law: NO tight stop on MR** — the measured −2 ATR case (−0.55%/trade, +0.19% → −0.36%),
   Sharpe maximizes at S=∞ or 4+ ATR, catastrophe-only 4-6 ATR, TIME (3-4× half-life) is the
   MR stop.
7. **CMMA pooled primitive** — the exact cross-asset normalization (log close, MA excludes
   current bar, ATR includes it, ÷√(k+1), W=100).
8. **Execution law (vessel-dependent)** — single-name → limit 1-4% below close; ETF/index →
   next-open canonical (limit-entry INVERTS to adverse selection on ETFs, H166).
9. **Adjacents** — COT commercials ~2-week lead (mechanically counter-trend hedgers), CGO
   disposition-overhang conditioning, calendar-spread precision-weighted fusion (parked:
   market-making construction).

## When to consult this brain

- Before ANY new mean-reversion sleeve, gate, or exit design for `mym-autotrader` — this is the
  distilled cross-practitioner consensus + the exact numbers.
- When tempted to add a vol/regime gate to an MR sleeve → read the CBI-vs-vol section and the
  one-persistence-axis law first.
- When setting stops or exits on a reversion trade → book law section (the stop destroys the
  edge; the exit is time or the signal).
- When building any cross-sectional / market-neutral construction → the demean rule and the
  specific-factor P&L gate.

## When to skip

- Momentum/ORB work (only the regime-gate material transfers), prop-firm sizing (see
  `mentor-aligrithm/` pillar 3 + vault playbooks), microstructure/L3 (see the MBO lane docs).

## Recall pattern

`rg -i "half-life|kendall|CBI|convexity|CMMA|demean|no-trade buffer" ~/.claude/wiki/learnings/mentor-mr-vein/`
