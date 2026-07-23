---
name: project-mym-fill-calibration-vindicated
description: "2026-07-17: the honest-fill gauntlet was genuinely ~1 tick too harsh on LIQUID equity-index STOP exits (92/92 real funded fills settle at-or-inside the level) — corrected in engine (commit 59d2a02e), but every kill stayed fill-invariant. Rule: validate fill assumptions against real fills; a too-harsh axis != a verdict flip — prove invariance before claiming any revival."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-17:** The founder's months-long "you're too harsh" challenge was RIGHT on one axis. The gauntlet over-charged one tick on the EXIT LEG of `round_trip_cost` for LIQUID equity-index STOP exits (ES/NQ/YM/RTY + micros MES/MNQ/MYM/M2K). 92/92 real funded index stops filled at-or-inside the stop level (median 0 ticks beyond) — `forensics/fill-calibration-vs-real/VERDICT.md`. Corrected: per-contract `liquid_index` flag drops exactly one tick on a genuine liquid-index stop hit ONLY; thin tapes (LE/GC/CL/crypto) and ALL non-stop exits keep full friction. Can only ever remove <=1 tick — accuracy, never a loosening. Applied + 8 new tests + 140 passing, commit 59d2a02e.

**Behavior-changing rules:**
1. Validate fill/cost assumptions against REAL fills (journal/GetJournalTrades), not first principles — the founder was right to push; our conservative default WAS off by a tick on deep-book index stops.
2. A fill assumption can be genuinely too harsh AND flip zero verdicts. Before claiming a correction revives anything, PROVE invariance: here Config A/MNQ stayed DEAD (DSR 0.003->0.0033, ~100x under the 0.5 floor); 0.3R scalp stayed DEAD (73.3% < 76.9% breakeven). The real killers (deflation at cumulative-K, drift-control placebo, win-rate geometry) don't move with fills.
3. Production placebo is house-invariant by construction (real + placebo routed through the same `realize()`); the "st=1 point vs 1 tick" placebo bug was forensic-scratch (`config_a.py`) only — don't attribute a scratch-script artifact to the engine.

Related: [[project-mym-fill-fidelity-verdict]], [[feedback-backtest-his-real-method-not-strawman]], [[feedback-forward-outweighs-backtest]].
