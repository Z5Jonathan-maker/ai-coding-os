---
name: project-mym-two-parallel-challenges
description: "Founder-locked 2026-07-04: two parallel challenges — (1) Roadmap→$500k/mo (Tradeify) + (2) Goat Sprint→$40k/mo net ($280 start); Goat compliance closed in writing; awaiting 2-eval purchase"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

**The two parallel challenges (founder-locked 2026-07-04):**

1. **Roadmap → $500k/mo** — primary, Tradeify-anchored, accounts-buy-accounts
   (`vault/04-playbooks/roadmap-500k-2026-07.md`). Now carries the **binding-constraint rule**: every prop
   account is bound by the LOWEST of withdrawal-cap / trailing-DD-leash / consistency-rule — diagnose per firm,
   size to that, never past it. Fleet is heterogeneous (DD-bound firms like Tradeify Select ~$12.8k/acct out-earn
   cap-bound ~$9k); flat $9k in the timeline = conservative floor.
2. **Goat Sprint → $40k/mo net** — parallel aggressive lane
   (`vault/04-playbooks/goat-sprint-40k-challenge.md`). $280 → 2× Sprint 100K evals ($140 ea, target $6k,
   trailing DD $3k, NO daily loss limit) → payouts self-fund to the 5-account stack cap → payout caps
   $2.5k→$4.5k/cycle ×2 windows/mo (5th–8th, 20th–23rd) = **~$40k/mo net ceiling at ~10–12 weeks**. Three-phase
   sizing (cap-bound firm → pass big, cruise small): PASS UnitQty 5 (15 MNQ, one §12-NQ winner passes), LOCK
   UnitQty 3 (+$3k locks floor), CRUISE UnitQty 1 + ORB5 ×1 (ORB = winning-day decorrelation backstop;
   ~15 losses to bust). First $10k payouts/acct = 100% split. Cash-out is metered (5 winning days + windows +
   caps) — the "$30k in days" is balance, not cash; never promise a 7-day cash-out.

**Goat compliance — fully closed in writing (vendor tickets, founder-relayed):** unattended NinjaScript
automation OK (eval+funded, intraday-only, flat by session close); same-strategy copy across own accounts OK
(no hedging/offsetting); **CrossTrade-as-wrapper over Tradovate(CQG) OK** (CrossTrade isn't a "supported
platform" but wrapping Tradovate is fine). Checkout rule: platform switches post-purchase only within the same
feed → **always buy evals as Tradovate (CQG)**.

**Execution = the EXISTING Tradeify path, zero new code:** bot → `connectors/crosstrade.py` webhook → Tradovate
→ account. $29/mo flat unlimited accounts (already paid). Goat = own config instance: `crosstrade.routes` = the
5 Goat accounts, `crosstrade.quantity` = phase size. dry_run=True until explicit go. (Scrapped my PickMyTrade
recommendation — it re-derived the same vendor-bridge at 2× the price; founder corrected to "exactly like
Tradeify".)

**Next trigger:** founder purchases the 2 evals → build the Goat config instance → 1 dry-run + 1 approved live
test trade → unattended.

Related: [[project-mym-best-playbook]], [[project-mym-live-config]], [[reference-tradovate-api-access]],
[[project-mym-mtf-gate-golden-standard]]
