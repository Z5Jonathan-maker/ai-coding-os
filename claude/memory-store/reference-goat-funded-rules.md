---
name: reference-goat-funded-rules
description: "Goat 100K Sprint FUNDED rules (founder-authoritative 2026-07-19) — EOD $3k trail, $600 daily loss, 30% consistency, payout mechanics; supersedes older intraday-DD notes"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-20T14:01:25.550Z
---

**Goat 100K Sprint — FUNDED account rules (founder-stated 2026-07-19, authoritative). Two live funded
accounts.** Supersedes any older vault note that said Goat DD is intraday-trailing — the real rule is EOD.

**Drawdown (the account-killer):**
- **EOD trailing, $3,000 max** on a 100K. Floor updates AFTER the day closes based on your **highest
  END-OF-DAY balance** — the floor MOVES daily, not intraday. Track it dynamically; don't assume static.
- **Drawdown LOCK (funded only):** once balance reaches the **starting balance ($100k)**, the trailing DD
  **stops moving and locks in place** (i.e. locks at breakeven ~$97k→$100k once you're up the DD amount).
- **HARD breach = account closed IMMEDIATELY** (eval + funded). A breach CAN happen intraday: floating/
  unrealized P&L counts toward the floor even if you're "up" on the day realized. So a −$3.1k intraday
  dip that recovers by close STILL blows it. Leave a buffer; never risk to the limit.

**Loss / sizing:**
- **Daily loss limit $600 — SOFT circuit-breaker (Sprint only), based on EQUITY not realized.** Floating/
  unrealized loss COUNTS — the pause can trigger with a trade still open. On hit: all positions liquidated,
  trading paused till next day; the account is NOT closed (unlike a DD hard-breach). Intraday hard-stop must
  use current equity (incl. floating), not just closed P&L.
- **Contract limits: 7 minis OR 70 micros PER ACCOUNT.** Two funded accounts = **two separate 7-mini caps**;
  accounts are INDEPENDENT (no requirement to mirror — can mirror, split, or run different methods). Up to 5
  Sprint accounts allowed. Start small (1–2 micros) and scale — sizing is the founder's, firm gives only the
  max + rules.
- **Start FRESH at $100k** (eval profit does NOT carry). Floor starts $97k, trails up on new equity highs,
  locks permanently at $100k once the FLOOR reaches $100k (i.e. once equity highs hit ~$103k).
- No overnight, no weekend holds — flatten before session end.
- Microscalping: trades closed **< 2 min** after open are **NOT payout-eligible**; ultra-fast (seconds)
  entries can be reviewed and profit removed as unrealistic execution.
- **News: 2-min buffer before AND after high-impact news** — no open/close/trigger inside the window. A
  position opened BEFORE the pre-window can be held through and closed after. Trade executed INSIDE the
  window → its profit can be deducted at payout.

**Payout / consistency:**
- Split **90/10** (90% to Jonathan) from the first dollar. Up to **50% of available profit per request**,
  **$500 minimum**. Payout windows: **5th–8th or 20th–23rd** of each month. **Processing ≤2 business days.**
- Winning days required: **Sprint = 5, EOD/Instant = 7**; a winning day = net **≥ 0.2% = ≥ $200** on a 100K.
- **Consistency (payout-time, funded only): Sprint = 35%, EOD = 30%.** 5 even days = 20% each clears both.
  **Eval: NO consistency, NO time limit, 6% target.**
- **COMBINE-CAP = why live is a CAPITAL downgrade (founder 2026-07-20):** hold **up to 5 funded** accounts
  (Sprint/EOD/Flex mix); **live = ONE.** Move-to-live **combines all ≥1-payout funded accounts into a single
  live capped at $150K** → 5×$100K=$500K surface **collapses to $150K** (lose $350K + 4 accounts). Uncapped-
  daily can't offset losing 70% of capital + 4/5 accounts. Funded stack ~2× the monthly withdrawal AND
  compounds the retained 50%. Move-to-live = DISCRETIONARY firm REVIEW (consistency/risk/track-record), can't
  be timed → **game = max the 5-funded stack, milk all, present steady-consistent (not outlier), eval-factory
  refills any slot; NEVER want the combine.** Open Q: funded + live simultaneously allowed? Funded = SIM.
- **KYC GATE (Gate 0):** payouts route through **Rise / Riseworks** — must complete KYC before ANY payout
  processes. Do it before the first window; blocks everything, unrelated to trading.
- **Per-cycle caps ($100K, sim/funded ONLY; request ≤50% profit AND ≤ cap, other 50% stays as buffer):**
  EOD $2,000 / $2,750 / $3,250 / $3,750(4th+); Sprint $2,500 / $3,000 / $3,500 / $4,500(4th+).
- **LIVE IS THE EXIT YOU DELAY, NOT THE PRIZE (founder-corrected 2026-07-20).** Sim is throttled twice
  (per-cycle cap + 2 windows/mo); live removes both (uncapped, daily, $500 min). BUT sim/funded payouts are
  **firm-subsidized** and accounts **STACK** (up to 5 Sprint + EOD); live collapses the book to ONE
  real-capital account the firm risk-manages tight → **one live account earns LESS than N stacked funded
  accounts** (stacking multiplies profit surface N×; live = 1×). Pros hate the forced graduation for this.
- **THE ENGINE = STACK + MILK, delay forced-live:** (1) max funded-account COUNT (the multiplier); (2) milk
  each acct to 50%-of-profit every window (50% rule binds before the cap early; retained 50% builds the +$3k
  DD-lock buffer); (3) steady-state each at the 4th+ cap ($3,750 EOD / $4,500 Sprint) × 2 windows/mo; (4) the
  eval-passing bots (2 Goat Sprints passed via relay TP) are the FACTORY — when the firm forces an acct to
  live, REPLACE it with a fresh funded acct, keeping the max in the funded-milking phase; (5) confirm the
  forced-live trigger (N payouts? $X? time?) to AVOID tripping it early, not to chase it. KYC on Rise first;
  +$3k DD-lock before scaling; aggression = account-count/frequency/window-claiming, never oversizing.
  See [[project-mym-best-playbook]] (stack ≤5 + withdrawal-cadence law).

**Behavioral failure modes (what actually blows funded accounts — not rule ignorance):** treating limits
as targets (risk to the $600/$3k instead of leaving buffer); oversizing (the #1 cause, not bad direction —
one oversized trade erases days); emotional drift after wins (upsizing a streak, moving stops); not
tracking the moving EOD floor; forgetting floating P&L can breach. **The edge that keeps accounts alive =
track DD dynamically + size conservatively + never treat limits as targets.** See [[project-mym-entry-edge-verdict]]
(no certified mechanical sleeve — trade the tape-validated discretionary method small), [[user-prop-accounts-no-apex]].
