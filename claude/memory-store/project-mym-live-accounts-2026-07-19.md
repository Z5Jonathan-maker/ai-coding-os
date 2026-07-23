---
name: project-mym-live-accounts-2026-07-19
description: "Live account state + hard operational findings from the 2026-07-19 session — the Tradeify book, the lane-heal trap, and the convexity correction"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-20T00:05:44.268Z
---

Live/funded account picture as of 2026-07-19 (via CrossTrade MCP `GetAccountSummary`/`ListStrategies`):

- **Tradeify Select 150k** `TDFYSL150239294520` — **the only account going live to trade.** $155,817.53, $4,500 trailing DD, flat. Runs 6 headless `Area61Precision_v2` lanes (QF-fade family), 30m/1m, window 09:45–10:30 ET, from `DEPLOY_PLAN` in `service/auto_deploy_tradeify.py`: MNQ (UnitQty 2, $800 daily), M2K, MGC×2, MYM, MES (each UnitQty 1, $300 daily).
- **Goat 100K Sprints** `GFTESPRINTJONATHAN57247` / `...35870` — $106,703 / $106,709, both **STANDING DOWN** until the founder requests login info. Passed the evals last week via bot trades + his manual trades. Their 3 registry deployments (LE/HE/MNQ) show `strategy_not_in_account_collection` = registered but not running.
- The exec service (`service/app.py`, mode:live, dry_run:false) routes `morning-vwap` lanes to DEMO5195862/DEMO6855370 — a **separate** demo forward-test path, NOT the funded book. Two independent live paths; only Tradeify is real money.

**HARD OPERATIONAL FINDING — a lane cannot be turned off by disabling it.** Disabling a strategy in NT8 works for ~3 seconds, then `service/auto_deploy_tradeify.py` (launchd `com.jonathan.auto-deploy-tradeify`, 30s interval) detects "lanes missing" and **heals it back as a new strategy id**. The real control point is the `DEPLOY_PLAN` list, not the live strategies. Founder granted scope to edit that file 2026-07-19; a workflow added an `enabled` flag so a disabled lane is no longer healed back. **If anyone hand-disables a lane in NT8, it returns in 30s.**

**CONVEXITY CORRECTION (I was wrong, the founder was right).** I judged the book with "strip the top-N fills → it goes negative," which is an invalid test for a deliberately convex payoff (small frequent losses, rare huge wins) — it's like stripping the best trades from a trend-follower. Measured properly on the deduped journal (108 unique trades, 19 days): 27.8% win, avg win $656 vs avg loss $97, **payoff R 6.74 vs the 2.60 its win rate requires → PASS**, expectancy +$111.84/trade, skew +4.55. MNQ:O5 passes on its own terms (R 11.36 vs 7.50). The only failures are **bracket-caused, not edge-caused**: MES and MYM are "TP0.25 padding sleeves" (target 0.1×step, stop 0.5×step) designed for a high win rate they aren't delivering (MES 11%, needs 67%).

**Streak math the founder pushed back on, correctly.** A Bernoulli/iid streak model overstates HIS discretionary risk because after 2 losses he stops/sizes down — the model can't see the trader ([[feedback-backtest-measures-robot-not-trader]]). But it DOES apply to the bots: `Area61Precision_v2` fires its 3rd trade at full size regardless, `MaxConsecLosses:4` per-strategy, so 6 lanes can each take 4 losers/day. iid streak sizing binds the bots, not him.

**Best forward performer, honestly:** the US30/YM relay (+$9,965, 9 trades) was the eval-passing signal relay, not manual — journal tags `us30-relay-YYYYMMDD-<acct>`, isManual=False. MNQ is the broadest positive but the demo is flat and the live Tradeify MNQ bucket is slightly negative — forward is CONFIRMING the backtest, not contradicting it. **LE is NOT 100% forward-win** — deduped it's 6 trades, 50%, +$30 (breakeven scalp); the 100% was the mirrored single-day view.

Related: [[project-mym-fade-doctrine-verdict]], [[reference-goat-funded-rules]], [[project-mym-journal-mirroring]], [[feedback-defer-to-trading-instinct]], [[project-mym-forward-generator-gap]]
