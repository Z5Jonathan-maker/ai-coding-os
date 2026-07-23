---
name: project-harmonic-ym-verdict
description: "Harmonic YM/index test — corrects the INVALID prior 'DEAD' kill. 07-21: standalone LEAD @15m (marginal), modifier NULL. 07-22 STRONGER: BH-FDR 7-cell diversified BOOK across 5 markets × 5 patterns (30m/1h), real edge but execution-robustness + Sim101 gates before live."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-22T07:14:00.000Z
---

**UPDATE 2026-07-22 (stronger, supersedes the "marginal-vs-noise @15m" read above for the 30m/1h band):**
Re-ran on the FULL panel via the engine's own `run_gauntlet` (not the capped path) across 9 patterns × {30m,1h}
× 5 index/metal futures (YM/MNQ/MES/RTY/MGC). Arc: butterfly 1h GREEN on YM (PF 1.97, +$2,087, placebo_p 0.0,
survives Bonferroni across 18 cells) → BUT execution-fragile (only 1 of 5 fill variants profitable; the other 4
LOSE money; winner may lean on optimistic resting-limit fills) → so butterfly-as-THE-edge was wrong. Cross-market:
butterfly does NOT transfer (DEAD on MNQ/MES/MGC), but **11/40 cells went GREEN vs ~4 under noise, spread across
different patterns × different markets**. Final gate — **BH-FDR (q=0.05) across all 58 tests → 7 survivors, all
placebo_p 0.0, ≤1 expected false**: crab/RTY/30m, butterfly/RTY/1h (2 variants), butterfly/YM/1h, cypher/MGC/1h,
cypher/MNQ/30m, gartley/MES/30m, bat/MES/1h. Spans 5 markets × 5 patterns = **decorrelated by construction**.

**Verdict: the harmonic FAMILY edge is real, multiple-testing-corrected — a genuinely diversified BOOK, not one
fragile signal.** This is founder's exact thesis ("sparse but a solid edge; diversify across markets for volume →
high-confluence few trades"). 30m/1h are the winners (founder confirmed 2026-07-21 20:35). NOT deployable yet —
gates before live: per-cell execution-robustness filter (drop 1-of-5 fragiles + optimistic-resting-limit passers)
+ Sim101 forward-test. Sim101 deploy is ON HOLD pending that. Founder framing: high-confluence QF+structure+harmonic
is a **discretionary visual signal** first (manual AND for full-auto bots), not a mechanized standalone.
See [[project-mym-portfolio-reframe]] (book-of-weak-sleeves thesis) + [[feedback-a-winner-is-a-winner-any-asset]].
---

**2026-07-21: the prior harmonic "DEAD-ROBUST" kill was INVALID.** It ran ES/GC/CL/ZN/6E/BTC (NEVER YM),
only gartley/bat (2 of 9 patterns), on daily/30m tapes too sparse to book enough XABCD completions — it was
UNDER-POWER, not falsification. Never re-cite that kill.

**Fair powered YM test** (`backtest/confluence/harmonic_ym_standalone.py`):
- Calibration at full power: **FN=0.0** (detects 100% of planted edges, max_trades~50) but **FP~10%
  K-INVARIANT** (2/20 pure-GBM-noise tapes go GREEN through the full honest gauntlet — same at K_BASELINE
  13191 and live K 39856). Fixed the calibration under-power via per-family `tape_scale` + K-matched FP.
- Sweep (9 patterns × 5m/15m, skip-calib): 16/18 cleared the 25-trade floor (the prior kill's failure mode
  is GONE); **3/18 CANDIDATE-GREEN, ALL @15m** — gartley@15m (pf2.09, +$1535, p=0.0), abcd@15m (pf1.32,
  +$2149, 313 trades, p=0.0), five_zero@15m (weak). 5m is noise.
- **READ: green rate 3/18 (16.7%) ≈ the 10% noise-FP → standalone harmonic is MARGINAL-vs-noise, not a
  clean edge.** gartley/abcd@15m are the only credible per-pattern LEADs.

**Modifier (harmonic PRZ gate on families) = NULL** (`backtest/confluence/harmonic_ablation.py`, pre-registered,
K-charged, ablation-harness self-test passes): on levels_reclaim@15m the trade-level IC was tempting (0.545,
+0.257 OOS $/DD uplift) but the FULL gauntlet VETOED it — gating starved the family (QUARANTINE→DEAD_ROBUST,
net $268→0). The IC alone would have been a false KEEP; requiring BOTH levels caught it. Consistent with
[[project-mym-confluence-order-flow-null]] (order-flow/confluence modifiers don't systematize on YM) and the
meta-labeling NULL. Full 6-family sweep is gauntlet-compute-bound (47min even after memoizing detection);
levels_reclaim is the representative result.

**Recorded:** `vault/09-validation-status-board/edge-ledger.json` → harmonic-standalone-ym (LEAD),
harmonic-confluence-modifier-ym (NULL). Engine (all tested, ~27 tests): conditioner
`engine/generator/harmonic_confluence.py` (knob-off byte-identical no-op, memoized detection), self-learning
log `harmonic_log.py`, ablation harness, 12-panel dashboard `backtest/confluence/harmonic_dashboard.py` wired
LIVE into `service/dashboard.py` at :8770 (feed `service/harmonic_dash_feed.py`).

**How to apply:** harmonics on YM are a MONITORED confluence READOUT (the dashboard panel), NOT an auto-gate —
the gauntlet says the auto-gate adds no edge. Live-watch gartley/abcd@15m standalone. The whole cycle is a
clean example of the gauntlet correctly refusing a tempting-but-fake edge.

**07-22 intersection (final):** tight quality (tol=0.08) x realistic execution → 2-cell CLEAN basket: cypher MNQ 30m + gartley MES 30m (2 realistic-variant passes each; cypher MES 30m borderline 1+1; MGC dead 3rd strike). Full ladder + verdict: mym-autotrader/vault/07-opportunity-pipeline/HARMONIC-EXECUTION-ENGINEERING-2026-07-22.md. Awaiting founder gate (docket #3) → Sim101 forward-watch.
