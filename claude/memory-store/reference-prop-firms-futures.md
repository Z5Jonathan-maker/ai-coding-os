---
name: reference-prop-firms-futures
description: "2026 futures prop firm landscape for MYM/YM — automation policy, drawdown type, copier rules (researched 2026-06-14)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Futures prop firm research for the MYM/YM quarter-figure system (2026-06-14, triangulated from official ToS + recent reviews; verify before committing — terms change monthly).

**Full automation (unattended bot/algo/EA):**
- BANNED: Apex ("set-and-forget" = forfeiture), Alpha Futures, TopOne. (Aggregator sites falsely call Apex/TopOne "EA-friendly" — believe the official ToS.)
- ALLOWED (conditional — sole owner, no HFT): Tradeify, Bulenox, MyFundedFutures (post-Jul 2025). Topstep allows algo in eval + Express but BANS API automation on the Live Funded tier (local-only, no VPS).

**Copy trading across own accounts (≠ automation):** Apex allows up to 20 own accounts (best for scaling). Tradeify/Topstep/TPT-PRO+ cap at 5. MyFundedFutures + Bulenox BAN it.

**Instrument:** MyFundedFutures has YM/MYM effectively suspended (2% price-limit buffer) — disqualified for this system.

**Drawdown:** mostly EOD trailing (Apex/Topstep/Tradeify lock at starting balance). MyFundedFutures Flex = static. Avoid intraday-trailing tiers (TPT PRO) for scalping.

**Two operating models for Jonathan's system:**
- Model A (recommended for scale): semi-auto + Apex copy-scale — present ~1hr at the 09:30-10:30 open, copy 1 master → up to 20 Apex accounts via Tradecopia. Apex bans unattended bots but allows human-present + copier.
- Model B (hands-off): full-auto on Tradeify (5-account cap). But DD limits force the $150K account ($9K eval) and at drawdown-safe size strategies earn only ~$7-8K/yr/acct → ~1yr to first payout. Slow.

**Key economic finding:** at drawdown-safe contract sizing, the strategies earn ~$7-8K/yr per account. Small-target accounts (Apex $50K, $3K target) pass far faster than big ones (Tradeify $150K, $9K target). Combined-portfolio on one account passes ~3x faster but its drawdown ($3.8K recent / $7.2K full on 3 micros) exceeds Tradeify's biggest account safely.

For Jonathan's own-money Tradovate account, full automation is allowed (no prop firm in between) — see [[project-mym-live-config]].

**DECISION 2026-06-18 (deep cross-firm research, ~hundreds screened → ~5 pass full-auto+payout+instrument+API):**
- **FUTURES LEG (our built system — Tradovate connector + 4 lanes): TRADEIFY.** Only top-tier futures
  firm on **Tradovate (our connector works zero-rewrite)** + full-auto (own bot, non-HFT) + EOD trailing
  DD + **Select Funded has NO consistency rule** (clean for breakout's big-day variance) + 4.6-4.8★ daily
  payouts + cheap one-time eval ($59-369). Catches: 10s min hold (we clear it; watch breakout quick exits),
  exclusive-use (bot only at Tradeify). **ORDER-PATH CORRECTION (2026-06-18, found online — NOT email):
  raw Tradovate API-key access is BLOCKED on prop accounts** (Tradovate community confirms). Our
  connectors/tradovate.py (direct api.tradovate.com) WON'T drive a Tradeify account. Automation works via a
  **webhook bridge — TradersPost (or PickMyTrade)**: bot → webhook → Tradovate → Tradeify, supported on eval
  AND funded, no Tradovate API add-on needed, ~$20-50/mo. So the futures leg needs a small **TradersPost
  emitter** (HTTP POST each signal), NOT zero-rewrite as I'd said — but strategy/validation/rails all carry.
  **HEDGING is a NON-issue within one account:** Tradovate futures accounts NET (can't hold long+short same
  contract — they offset to flat), so opposing lanes on one account just cancel/interfere, not a hedge. The
  hedging BAN is CROSS-account (long acct A + short acct B). **Architecture: ONE LANE PER ACCOUNT** (5-cap:
  MYM-morning / MYM-breakout / MNQ-morning / MNQ-breakout / +1) — clean isolated state, no netting interference,
  no hedge flag if lanes are genuinely independent (don't mirror to lock P&L). Plan: lean Select (no funded consistency)
  but confirm Select EVAL uses EOD not intraday DD; else Growth (EOD, 35% funded consistency). Bulenox =
  broadest bot allowance but RITHMIC (connector rewrite) + 40% consistency rule killed 3/6 test payouts;
  MyFundedFutures = best rep (4.9★) but "autonomous bot" gray + 2% price-limit halts MYM/MNQ.
- **CFD LEG (US-eligible, locked): FTMO × OANDA (ftmo.oanda.com).** THE only reputable CFD prop path open to
  US persons running a bot — built for US (Aug 2025, FTMO owns OANDA so no MetaQuotes US block), **MT5 (full
  EA/MQL5 + MetaTrader5 Python lib)**, US30.sim + US100.sim (**ROLLING — no expiry, immune to the roll-freeze
  that killed signals 2026-06-18**), EAs/algos explicitly allowed. Requires MT5 rewrite of the execution layer
  (Jonathan OK with rewrite). GATE BEFORE building: backtest US30/US100 CFD-with-tweaks to verify Jonathan's
  "CFD numbers are better" claim FIRST — verify the edge, then rebuild. Verify FL state eligibility at signup.
- **US-CFD-bot REALITY (why the search felt impossible):** every other CFD firm either EXCLUDES US (Alpha
  Capital, Blueberry, FundingPips, FXIFY) or steers US traders to a NO-BOT platform (FundedNext→Match-Trader,
  E8→TradeLocker — neither supports EAs). FTMO×OANDA is the lone exception. DNA Funded = maybe (accepts US +
  allows EAs, but US platform/API unverified — email support).

**UPDATE 2026-06-22 — automation × OVERNIGHT-SESSION sweep (for the cracked overnight scalp, ~25 firms, 3 deep agents):**

- NEW CONSTRAINT: the scalp trades the EVENING GLOBEX SESSION 6PM-9:30AM ET. KEY REFRAME — it's flat by 9:30 AM, so it never crosses the afternoon flatten cutoff; we DON'T need true swing/overnight-hold firms, just "evening session tradeable + flat by morning." But several firms read 6PM->9:30AM as a banned midnight-spanning hold. CONFIRM PER FIRM IN WRITING, never assume.
- ⚠️ EXISTENTIAL: TRADEIFY's overnight policy is now CONTESTED. Funded Trader Agreement reads permissive; Help Center (fetched) says "flat by 4:59 PM ET, no overnight holds, ALL account types incl Live." The entire aggressive scalp playbook ([[project-mym-best-playbook]]) ASSUMES Tradeify allows the 6PM-9:30AM scalp — MUST confirm with Tradeify support BEFORE funding $1,200.
- APEX 4.0 (Mar 2026) now bans BOTH overnight AND bots (was the 20-acct copier vehicle — dead).
- MFFU still DEAD for MYM (2% CME price-limit blocks YM/MYM overnight) — confirmed again.
- BEST #2 STACK FIRM = TRADEDAY: custom NinjaScript bots explicitly allowed + overnight-within-session allowed + Tradovate/NinjaTrader + scales to 90/10, 5 acct. Other full-auto-but-confirm-evening: Topstep, Take Profit Trader. ETF Diamond Hands = overnight+weekend but SEMI-AUTO only (fails). Phidias Premium = overnight+weekend, auto policy CONFLICTED.
- STACK PLAN: multi-firm universally allowed (no cross-firm visibility) → Tradeify x5 + TradeDay x5 (+Topstep/TPT) = 10-15+ accts. Unattended copier: Replikanto (NT-native/VPS) or TradeSyncer (cloud, desktop-off survivable).
- ACTION: one written question per candidate — "VPS NinjaScript bot, MYM 6PM-9:30AM ET evening session, flat by morning, fully unattended, funded account — allowed?" Tradeify first.

**UPDATE 2026-07-09 (firm-written, founder-relayed): GOAT = strictly INTRADAY-ONLY for ALL account types
including bots.** No overnight, no weekend; their system auto-flattens at 15:55 CT. The earlier "Goat
Sprint = overnight Mon-Thu swing home" reading is DEAD — Goat can never host swing/overnight strategies
(gold-swing prop-home idea falsified at vessel level). Canon: mym-autotrader vault/01-prop-firms/goat-funded-futures.md.
**Exclusivity RESOLVED 2026-07-09 (founder-relayed): Tradeify permits other-firm accounts — the parallel
Goat lane is cleared; the 2026-07-02 strict reading is superseded.**
