---
name: reference-nebula-harvest
description: "Nebula (brother Ross Haze's MT5 forex genetic strategy factory) — what to lift (intrabar SL/TP walk, overfitting.py DSR/PBO/newsvendor, Ledoit-Wolf shrinkage), what to distrust (optimistic sim, no-op parity gate), data surface (free MT5 CFD feed for US30/NAS100/XAUUSD)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

Nebula = the user's brother (Ross Haze) commercial Mac/Win Electron app: a mass genetic-programming factory for MT4/MT5 forex/CFD EAs. ~360 blocks → 4-slot genome, evolves hundreds–12k genomes/run, honest sub-bar sim, López-de-Prado-grade stats gate, auto-generates .mq5. Full framework report: `~/code/research/nebula-harvest/NEBULA-FRAMEWORK.md`. Genome bank (open-mode community pool, read-only): `https://nebula-genome-bank.rosshaze.workers.dev` — 3 published genomes (2 XAUUSD M15 Structure, Sharpe 5.34/3.61 = overfit-suspect by his own math) + a large experience pool (NAS100 M15 heavy). His IP — study/lift ideas, don't touch admin key or the write/contribute path.

**LIFT into mym-autotrader (queue AFTER current retrial drains, then re-run calibration battery — don't split verdicts across engine versions):**
1. **Intrabar SL/TP walk** (`nebula-repo/engine/risk.py:2221-2332`) → our `engine/gauntlet/fills.py`. Exact MT5 1-min-OHLC tick-order tie-break for same-bar SL-vs-TP (UP bar O→L→H→C, DOWN O→H→L→C), fill snapped to next sub-bar open. Generalizes our EXIT-2 gap-through fix; kills the both-touched-bar coin-flip. HIGHEST-VALUE lift.
2. **overfitting.py extras**: scipy-free DSR + PBO/CSCV (we now have), PLUS the newsvendor-calibrated forward "pitch" (lower-confidence-bound promise) + studentized IS↔OOS divergence (Lo/Mertens SE) + the correct rotation-based signal placebo (stronger than a free shuffle).
3. **Ledoit-Wolf constant-correlation covariance shrinkage** for the multi-sleeve HRP book; his portfolio assembler (≤8-leg, corr≤0.75, Jaccard≤0.70).

**DISTRUST (why his "winners" need re-validation on OUR fills):** his default backtest slippage is **0** (spread only), exits tuned to MT5's *optimistic* tester, and `deploy_parity_gate.py` is a **documented no-op**. So his genomes are inflated beyond mere overfit. Take his RULES as hypotheses; re-validate on honest futures fills. [[project-mym-fidelity-certificate-2026-07-16]]

**DOCTRINE CONFIRMATION:** his own composite scored **AUC 0.272 (anti-predictive) on a sealed blind-OOS window** → he rebuilt selection to exclude IS strength. Independent convergence with [[feedback-backtest-measures-robot-not-trader]] and the DSR/PBO work — two brothers, separate rooms, same immune system.

**DATA SURFACE (the user's key point — CFD≈futures on a different chart):** MT5 Python API reading a running terminal (`copy_rates_from_pos`/`copy_rates_range`), symbols incl **US30/NAS100/SPX500/XAUUSD/XAGUSD**, 3–20yr depth, macOS via Wine (`ws://127.0.0.1:9876`). `data/external_data/external_data.py::load()` ~self-contained → reusable as a FREE secondary cross-check / rapid-prototype feed for NAS100/US30/XAUUSD. Caveat: broker-demo CFD (quality varies, different sessions, no contract volume) — cross-check + prototype only, re-validate edges on Databento futures. Relates to [[project-mym-discovery-engine]] free-data hunt + the vessel-split doctrine ([[project-mym-fundability-2026-07-16]] — CFD is a candidate own-capital/offshore vessel for the overnight reversion book Goat/Tradeify ban).

**DON'T lift:** the mass GP loop (blows our cumulative-K budget — only survives because it deflates vs summed n_trials), MQL/Wine deploy, free-shuffle MC, CFD realism knobs, Orion voice, the hive pool.
