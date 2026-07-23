---
name: project-mym-30min-migration
description: "MYM 4 QF fades migrated 15m→30m (validated +33%, parity-proven); faithful TV indicator + live dashboard Signals; NT8 staged pending F5/feed"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-27: Migrated the 4 QF-fade strategies (§12 / Sniper / Precision×2) from 15-min to **30-min**. A clean TF sweep (5/15/30/180m, full 1m resolution + nudge + year-by-year, `backtest/tf_validate.py`) proved 30m beats the locked 15m: combined **PF 2.71 vs 2.05, +33% net, 0 losing yrs, nudge-robust**; every fade improved (§12 2.37→2.98, Sniper 1.49→2.17, P2 1.57→1.97). **ORB (MNQ 5m) + RangePlay (MYM 1m) stay native** — ORB's opening-range hi/lo is bar-size-invariant, RangePlay's edge is 1m throughput; "coarser is better" is QF-fade-FAMILY-specific, NOT blanket. Caught+fixed a `fade_once` invalidation TF bug (hardcoded +15min → `tf_min` param, default 15 = 15m byte-identical); parity re-proven **15m 1407/1407 + 30m 1334/1334 exact** (`tf_parity_30m.py`).

Shipped (commits 188412f..23e3f75, branch `mym-playbook-and-bots`): live detectors `service/*_live.py` + `ib_runner` → 30m; NinjaScript `QfVwapReentry_v6`/`Area61Sniper_v2`/`Area61Precision_v2` `AddDataSeries(Minute,30)` staged on NT8 but **`file_only` — INACTIVE until an NT8 F5/restart + data-feed reconnect** (VPS-Claude prompt was handed to the user to finish it); indicator `docs/pine/4_visual_YM.pine` (30m-locked) with a live TRADE TICKET card (entry/stop/TP/why/per-strat PF) + native signals-log board (2nd tab) + native `alert()`s; `/signals` feed endpoint + CORS + dashboard `docs/dashboard.html` ⚡ Signals tab (TV alert→/webhook→/signals→ACCEPTED/REJECTED cards). 172 tests pass; wire-test end-to-end OK.

**HARD CAVEAT:** the TradingView on-chart track record can NEVER show the full-history edge — `request.security_lower_tf`'s intrabar cap only resolves a recent CLEAN slice (the indicator now excludes truncation-mis-resolved trades, greys them, shows "excl N"). Authoritative edge = the **Python backtest (~55% / PF 2.71)**, not the chart table. User purchased real-time CME data → signals fire on real-time 30m bar closes (no 10-min lag) → card + alerts + dashboard all live/actionable. Related: [[project-mym-best-playbook]], [[project-mym-forward-test-execution-fidelity]], [[feedback-backtest-his-real-method-not-strawman]].
