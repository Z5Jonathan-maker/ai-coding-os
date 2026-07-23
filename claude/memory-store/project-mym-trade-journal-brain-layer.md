---
name: project-mym-trade-journal-brain-layer
description: "mym-autotrader trade-journal brain layer (built 2026-07-21/22) — FXBlue ~15k+31k verified broker trades, outcome labeling, 19 ranked hypotheses, excursion/exit-replacement engine, ground-truth account edge classifier that CORRECTS an earlier tape-replay 'no edge'."
metadata:
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-22T07:14:00.000Z
---

**Built 2026-07-21→22 (mym-autotrader, committed):** a Layer 1→7 **trade-journal brain** distinct from the
strategy-discovery gauntlet — it studies REAL traded outcomes, not synthetic backtests.

- **Corpus:** FXBlue verified-trade harvester pulled ~15k real broker-tracked trades (Result/SL/TP/MAE/MFE),
  then scaled +31k via account discovery (`1cf20445`, `43721368`). TradingView-ideas harvester seeded a
  ~7.5k→15.6k idea corpus (`b99901f2`, `e12b61c7`). Outcome labeler back-computes win/loss + R + regime from
  databento tapes (`67d94d2c`). Practitioner-lexicon tagging re-tagged the 27k corpus (`d4f4575a`).
- **Distillation:** Layer 7 bridge distilled **19 ranked strategy hypotheses from 15.4k labeled trades**
  (`39af7148`). Tri-model roadmap (Opus + Fable 5 + K3) drove the "journal-gold" extraction (`8a03bbe3`).
- **Key engine + finding — entry-vs-exit skill isolation:** the excursion/exit-replacement engine (tri-model
  #1 vein, `a4e61adc`) separates entry edge from exit skill via MAE/MFE. Tier 0 isolates trader-skill with
  evidence-shrunk expectancy + martingale down-weighting (`efd8d4c7`) → a **skill-ceiling** result.
- **CORRECTION (important, `d19093e9` supersedes `733c6f04`):** the tape-replay counterfactual-exit engine +
  K3 randomized-entry null first read "no edge"; the **ground-truth account edge classifier CORRECTED that to
  a real edge.** Always cite the corrected verdict, not the tape-replay "no edge".

**How to apply:** this is the empirical-realized-trades brain (FXBlue/journal), NOT the synthetic gauntlet —
consistent with [[feedback-backtest-measures-robot-not-trader]] and [[feedback-forward-outweighs-backtest]].
The entry-vs-exit / MAE-MFE decomposition is the live lens for "is the edge entry or management" questions;
pairs with [[reference-management-multiplies-not-creates]]. Fable 5 is the strong-tier atom-extraction model
for the harvester (`c58c3ef8`).
