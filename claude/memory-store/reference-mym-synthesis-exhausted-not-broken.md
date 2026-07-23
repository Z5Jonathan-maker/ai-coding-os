---
name: reference-mym-synthesis-exhausted-not-broken
description: "mym-autotrader: the `synthesis` generator source emitting [] is EXHAUSTED, not broken. It composes 42 coherent cells (ou_mr+cmma_mr, its only 2 runnable-signal families) and ALL 42 are already buried in the graveyard -> correctly emits nothing (honors never-re-test-buried). NOT the mypy is_reversion_cell red herring. Don't 'fix' it by forcing emission."
metadata:
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-18 diagnosis (do not re-chase).** `synthesis_hypotheses()` returns `[]`. This looks like a bug (a mypy trace flags `MechanismComposition.is_reversion_cell` as undefined) but that is a FALSE POSITIVE -- the method is monkey-patched onto the class at runtime (synthesis.py ~line 327, `type: ignore[attr-defined]`) and resolves fine.

**The real cause:** `_coherent_pool()` composes 42 economically-coherent cells, but they are ALL in families `ou_mr` + `cmma_mr` -- the ONLY two primitives with runnable signal functions in `engine/generator/signals.py` (`_ou_halflife`, `cmma_entry/exit`). All 42 have already been tested and BURIED (graveyard dead_fps). Dedup drops all 42 -> emit 0. That is CORRECT behavior (the resurrection queue owns buried fingerprints; the composer owns the unburied frontier, which is now empty).

**So synthesis has EXHAUSTED its static composable space.** Fresh generation now comes from `problem_driven` (novel gap-targeted cells) + the widened research-card vocab -- see [[project-mym-engine-self-learning-live]]. Synthesis resting is a sign of health, not breakage.

**To REVIVE synthesis (a real follow-up, not a quick fix):** add a new coherence-allowed reversion primitive to `_MECHANISMS` -- candidates already coherence-allowed with the vol_regime_gate are `price_path_convexity_reversal` and `nagel_vol_conditioned_reversal`. BLOCKER: neither has a runnable signal function in signals.py (they exist only as primitive PROSE). So reviving = implement + validate a new signal fn first (its own gauntlet-validated build). `dd_mr`/`dual_thrust` are NOT in the primitive library at all.

**The 6 failing `test_synthesis_composer.py` tests** assert synthesis EMITS into a full `collect()` -- brittle live-emission assertions that fail as the graveyard fills (pre-existing, not a regression). Proper fix: refactor them to test MECHANICS against a CONTROLLED (empty) graveyard, deterministically -- deferred. Related: [[feedback-corpus-as-brain-standing-directive]].
