---
name: project-mym-forward-test-execution-fidelity
description: "MYM Sim101 forward-test purpose = execution fidelity of approved bots, NOT strategy re-validation"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

The 6 MYM strategies live on Sim101 (ScalpRotation_v1, QfVwapReentry_v6, Area61Precision_v2 ×2 [stop50/VWAP and stop100/#2-FVG], Area61Sniper_v2, ORB5_v1) are the **approved survivors** of rigorous backtesting that already killed all the other candidate "winners." Their edge is settled.

**The Sim101 forward-test is validating EXECUTION FIDELITY, not the strategies.** The question is: are the NT8 bots *faithfully executing the approved strategy config* on live fills — right QF levels/tolerance, right session windows (EtOffsetMin, WinStart/End, Flatten), stops/targets placed and honored as configured, fills matching assumptions, no param/timezone drift? P&L is a byproduct; fidelity is the signal. This is why Jonathan hasn't gone live yet.

**Why:** the strategy logic is done; the risk is the parent bot mis-executing it on the live market. Do NOT read flat/negative live P&L as "the edge is weak" or re-litigate the strategies — read it as "is the bot executing correctly?"

**How to apply:** when watching Sim101, compare live entries/exits/stops against the approved spec, flag execution discrepancies (mis-bracketing, wrong levels, session/timezone mismatch, slippage vs assumed). Today's 2026-06-24 1-min intrabar-stop finding is itself an *execution-model* lesson (backtest fill assumptions vs reality) — it reinforces why live execution-fidelity testing matters; it is NOT a reason to rewrite the approved strategies. Related: [[project-mym-autotrader-assistant]], [[project-mym-live-config]], [[project-mym-best-playbook]].
