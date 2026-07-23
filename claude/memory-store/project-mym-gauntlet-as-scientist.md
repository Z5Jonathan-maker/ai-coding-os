---
name: project-mym-gauntlet-as-scientist
description: "mym-autotrader's \"Gauntlet as scientist\" layer — discover→classify→evolve→route: classifies every strategy into an emergent, self-growing winner taxonomy instead of one DSR pass/fail"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-22T20:02:10.838Z
---

Built 2026-07-22 (~25 commits, branch `mym-playbook-and-bots`, all tested/pushed). Reframes strategy
discovery from a single universal-DSR pass/fail into a **classification science**: the gauntlet first
DISCOVERS where an edge lives, names the ARCHETYPE, then decides deployability. Extends [[project-mym-discovery-engine]].

**Where it lives (engine/gauntlet/ unless noted):**
- `winner_profiles.py:classify_strategy` → StrategyProfile identity card (archetype + confidence + primary_regimes + weakness + deployment_rule). Catalogues EVERY winner type (high-PF-sniper / high-frequency / regime-conditional / Universal), not one gate.
- `archetype_evolution.py` — self-evolving taxonomy: KMeans+silhouette clusters winners into EMERGENT categories; continuity by CENTROID (not label churn); 8-feature signature incl. skew (tail-risk) + time-consistency + log10(n); auto-labels (Lottery / Fat-Tail-Loss / Steady / Streaky).
- `performance_tensor.py` (market×tf×execution → domain map + robustness) + `deployment_router.py` (`market_dna` → active specialists by live regime; read-only advisory).
- `engine/generator/regime_gate.py:apply_regime_gate` wired into `engine/run.py:gauntlet()` — `spec.gate` now ACTUALLY filters a family to its regime (was identity-only). +18 regime-specialist probes in `families.py:broad_family_hypotheses` (which also fixed the 85%-ORB/RSI K-monopoly — proposes all 20 fam_* families, was 2).
- `catalogue_builder.py` — classifies the persisted brick-streams + evolves the taxonomy; wired fail-soft into `ops/season-advance.sh` (daily self-grow).
- `regime_classify.py:classify_candidate_regime` — re-realizes a candidate's trades on its panel + classifies WITH the tape (regime archetypes need aligned trades the daily brick-streams lack). Auto-wired into `gauntlet()` behind env **MYM_CATALOGUE** (OFF ⇒ byte-identical, fail-soft).

**How to apply:** state files are `engine/state/winner_catalogue.jsonl` + `winner_taxonomy.json` (gitignored). DISTINCT from the trader-tape `docs/data/winner_catalogue.json` (that's trader-receipt reproduction; this is strategy classification). To populate regime archetypes on a real hunt, run with `MYM_CATALOGUE=1`. All new modules declared in `engine/gauntlet/wiring_status.py`.

**Provenance:** built by Claude + a K3 (kimi) two-model review — K3 reproduced 9 correctness bugs against live code (NaN→KMeans crash, empty-cluster phantom archetypes, Infinity-JSON, fail-OPEN router, low_drawdown false-winner, float-idx crash, ts-key freq corruption, best_bucket=None open rule, vol_high_half); all fixed + regression-tested (`test_k3_review_fixes.py`).

**NEXT (fresh sessions, not marathon-tail):** new signal families (gap/opening-drive/seasonal/liquidity-sweep = new money-code); per-family K accounting (founder-gated methodology — changes what counts as a new look); K3 depth polish (stable archetype_id + Hungarian assignment, regime-relative thresholds vs placebo null). See repo `SESSION-HANDOFF.md` 2026-07-22 block for the full map.
