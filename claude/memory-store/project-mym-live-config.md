---
name: project-mym-live-config
description: "MYM live prop books + operational state (updated 2026-07-11 night) + Jonathan's durable risk preferences — post SIL/MBT pulls, hardened money path, ramp lane pending sim"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Live books (as of 2026-07-11 night):** Tradeify TDFYSL150239294520 = 5 lanes after compliance
pulls: §12 MNQ q2 (MDL 800) + M2K + MGC ×2 (§12 + PrecAM) + TP25 sleeve MYM + MES. **SIL pulled
07-10** (firm: unsupported) and **MBT pulled 07-11** (firm publishes NO crypto derivatives) — both
lanes stay validated, no Tradeify home. Goat ×2 (GFTESPRINT…57247/…35870) = GF7: MNQ q3 + LE + HE,
MDL 2850, livestock ExitBy 1355.

**Money path hardened (merge e6a0943, 506 tests):** healer raises on garbled bridge + pages after
3 failures; passover derives EXPECTED from DEPLOY_PLAN + verifies params verbatim; gate fails
closed; dd_throttle fails conservative; per-root roll alarms. **Uncompiled pending bridge:**
Area61Precision_v2.cs dedup guard (H71 duplicate-fire bug) + Area61Ramp_v1.cs (H79 sim trio).
NT8-restart trap: MCP deploys evaporate unless the workspace is saved (restart detector designed,
ops/H78, not shipped).

**Clocks:** first Tradeify payout window ~07-20; GF7 funding median ~07-27 (funded rebalance
pre-designed, vault/04-playbooks/h60, founder-gated); wave eval 07-23; ramp lane (08:15-09:30
pre-open ES/NQ/GC) CERTIFIED-PENDING-SIM, resting-limit-only. Fleet ×5 approved-in-principle,
gated (vault/04-playbooks/h69).

**Jonathan's durable risk preferences (from the 2026-06 live era, still true):** tight stops
(~$25/micro class), wants a winning-majority strategy psychologically (rejected 41%-win sniper),
aggressive small-account scaler by nature ($300→$30k), entry discipline = LIMIT AT the figure,
never chase (his real 51,000 long entered 26pt late taught this).

**How to apply:** vault/STRATEGY-REGISTRY.md LIVE section + scripts/prop_passover.py EXPECTED are
the source of truth for book state — this memory is the pointer. Related:
[[project-mym-autotrader-assistant]], [[feedback-goat-evals-speed-first]].
