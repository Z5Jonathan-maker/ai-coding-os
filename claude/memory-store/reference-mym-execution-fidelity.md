---
name: reference-mym-execution-fidelity
description: "How to verify the mym-autotrader live book is the certified winning design firing correctly — the fidelity gate, the winner/loser rule, and the CrossTrade bridge's hidden-TP gotcha"
metadata: 
  node_type: memory
  type: reference
  originSessionId: efe30758-1fc2-41df-a0af-136e4975a265
  modified: 2026-07-22T18:35:20.997Z
---

Verifying live-execution correctness on the funded/prop NT8 book (mym-autotrader):

**WINNER vs LOSER rule (learned the hard way 2026-07-22):** the authoritative winner status is the STRATEGY-REGISTRY rung (rungs 4-6 = "recorded winning strategies") + the founder's own keep/pull decisions — NOT research teardowns. A "dead-mechanized" / "do-not-fund" research note (BOOK-FOUNDATION-VERDICT, fade-doctrine) does NOT override a cell the registry certifies (placebo P=0.00) and the founder kept in the active book. MNQ §12 is a certified winner (PF 10.4→26.8) despite carrying a "dead-mechanized" research note. Never drop a live cell on research verdicts alone; cross-check the registry rung + whether the founder pulled it.

**The CrossTrade bridge hides NT8 managed profit-targets.** `GetAllOrders` returns stops but NOT the strategy's `SetProfitTarget` limits, and executions/journal lag same-day. So NEVER judge TP-ladder correctness from live order state — a position showing "stop, no TP" is usually just the bridge, not a broken ladder. Verify from the CLOSED-TRADE JOURNAL (`GetJournalTrades`, exitName = "Profit target"/"Stop loss"/"XF").

**The ladder design:** Area61Precision_v2 enters 3 signals sA/sB/sC (journal entryName PA/PB/PC) → TP1/TP2/TP3, `UnitQty` contracts each → real contracts = 3×UnitQty (MNQ canonical UnitQty=2 = 6 contracts). Attribution: lane_registry.attribute_trade (PA/PB/PC=Precision leg, us30-*=relay).

**THE PERMANENT SELF-CHECK: `scripts/fidelity_gate.py`** (launchd `com.jonathan.mym-fidelity-gate`, 20min, --push, dedup). Journal-based. Deterministic hard-alarms any N: OFF-BOOK (disabled/pulled cell holding a position — caught MES on 5 seats), NAKED (no stop), param-drift. Behavioral (N≥20 only, so small-N noise never false-alarms): funded cell vs Sim101 reference twin. Companion: `scripts/positions_now.py` (live positions × roster × protection × plan-compliance) and `scripts/dissect_trade.py` (per-trade teardown). Related: [[project-mym-wiring-pass-2026-07-22]], [[project-mym-precision-cs-parity-gap]], [[project-mym-exit-corrected-book]].
