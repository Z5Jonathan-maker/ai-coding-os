---
name: project-mym-strategy-lab
description: "mym-autotrader Strategy Lab — the interactive strategy-research UI (docs/strategy-lab.html) + live MTF harmonics dashboard the founder asked for (best lab + best visuals); toggle strategies/TFs/session-windows, harmonic quality scoring, feeds harmonic.json via a launchd service."
metadata:
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-22T07:14:00.000Z
---

**Built 2026-07-21 (mym-autotrader), founder brief: "the best strategy lab with the best visuals."** An
interactive research UI to toggle every knob — strategies, timeframes, session windows (24/7 vs e.g. 08-12 ET),
markets — and study/compare findings, collab'd with K3 per founder request.

- **UI:** `docs/strategy-lab.html` (+ `dashboard-public/strategy-lab.html`). Service: `service/strategy_lab.py`,
  run under launchd `com.jonathan.mym-strategy-lab.plist` (logs `logs/strategy-lab.{out,err}`).
- **Harmonics dashboard feed:** `docs/data/harmonic.json` — MTF harmonic panel: active pattern + status
  (forming/in-PRZ/confirmed/invalidated), **quality score 0-100** (fib accuracy, leg/time symmetry, PRZ
  tightness, clean pivots), PRZ lo/hi, MTF alignment across TFs, direction, fib-cluster confluence, structural
  context, trend/vol regime, risk (PRZ width in ATR). Two panels PARKED: order_flow (needs MBO,
  [[project-mym-mbo-lane]]) and vwap (needs session-VWAP series). `final_confidence` = "ablation not yet run".

**Founder directives baked in (2026-07-21):** everything ships into the Vault/command center — NO more separate
artifact dashboards ([[project-vault-os-charter]]); 30m & 1h are the winning TFs; harmonics confluence is a
diversionary VISUAL system for BOTH manual trades and full-auto bots; diversify across markets for volume.

**How to apply:** when building trading UIs, extend the Strategy Lab / Vault — don't spin up a new standalone
dashboard. Harmonic scoring + MTF alignment logic lives in the harmonic feed. See [[project-harmonic-ym-verdict]]
for the underlying edge status (the lab visualizes it; the FDR book is the substantive finding).
