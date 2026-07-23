---
name: feedback-dashboards-stay-accurate
description: "Standing directive — as edges/winners are validated or killed, the dashboards must always reflect the true current state (honesty rail applied to the cockpit)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
---

Standing directive (2026-07-19): as winners grow and the system evolves, the dashboards and all surfaces must **always stay accurate and updated** — the honesty rail applied to the cockpit itself.

**Why:** the Vault/HQ dashboards are the operator's single source of truth. A stale or hand-patched scoreboard is worse than none — it launches decisions on fiction. Same principle as the honest-fill gauntlet, one layer up.

**How to apply:** never hand-edit dashboard numbers that will drift. Wire every dashboard surface to a **data-driven source of truth** that a generator projects on each rebuild. Concretely for mym-autotrader:
- Research-verdict scoreboard source of truth = `vault/09-validation-status-board/edge-ledger.json` (append an entry every time an edge reaches a verdict: CERTIFIED/VALIDATED/CONDITIONAL/LEAD/NULL/FAILED_TRANSFER/FALSIFIED/KILLED; never delete, set disposition=SUPERSEDED).
- Projected by `service/dashboard.py:write_edge_scoreboard()` -> `docs/data/edge-scoreboard.json` (runs every rebuild, launchd `com.jonathan.mym-dashserve`/`mym-hq-state`, ~300s).
- Rendered by the Vault "EDGE SCOREBOARD" deck (`docs/hq-vault/` renderScoreboard) at `:8770/hq-vault/`.
- Live/funded book truth stays in `strategy-intel.json` / `vault/STRATEGY-CANON.md` — the edge-ledger is the DISCOVERY-pipeline scoreboard, complementary.

The rule generalizes: any new "winner" or system-state surface = ledger/source-of-truth + generator projection + render, never a static hand-edit. Relates to [[project-mym-hq-command-center]] and the honest-fill discipline in [[feedback-forward-outweighs-backtest]].
