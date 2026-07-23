---
name: reference-ig-trading-ad-vetting
description: "Structural scam markers for IG/FB-advertised trading products + verdicts on ones already vetted (Sentivue, Nova Quant, WhiteGlove, etc.) — fast-filter future \"research this ad\" requests"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

Jonathan periodically sends Instagram/Facebook trading-product ads to vet (Sentivue, then Nova Quant / Crypto Arsenal / WhiteGlove / Alpha Capital / The Algo Institute on 2026-06-23). Pattern so far: **~95% are lead-gen / marketing fronts; none has been a real shortcut.** They all amount to "outsource your edge to someone else's black box, badge, or discount" — the opposite of the legacy thesis ([[user-trading-legacy-not-money]]). Fast-vet against these structural scam markers before spending research budget:

- **AI-bot framing** ("AI-Powered Gold Bot", XAUUSD/crypto "AI" automation) → CFTC 2024 advisory profile; almost always a signals/affiliate/PAMM funnel. (Nova Quant: site unreachable HTTP 523, zero track record → scam-adjacent.)
- **Implausible returns** (8–15%/mo = 96–180%/yr) + **captive obscure brokers** (e.g. Plexy/Ox Securities) + **no NFA/CFTC registration** + **managed PAMM/MAM** → classic unregistered-managed-account scam. (WhiteGlove Inc: documented $45k-loss complaint, 18/100 trust → DO NOT USE.)
- **"Independent ratings institute"** with anonymous team, opaque funding, "protected weights," no conflict-of-interest policy → likely pay-to-be-rated credentialing front; the rating dimensions are generic and re-derivable. (The Algo Institute: build your own robustness checklist from first principles instead.)
- **Prop-firm discount promos** ("$10k for $40") → verify it's a FUTURES firm (many are forex/CFD), verify automation is actually allowed, verify payout history. (Alpha Capital Group = forex/CFD; its futures sister Alpha Futures BANS all full automation → wrong product.)
- **White-label "launch your own quant platform"** → legit B2B (e.g. Crypto Arsenal, real Taiwan VC-backed co.) but crypto-only reseller economics; irrelevant to a CME-futures stack.

Durable rule: for automated futures, the real path is the founder's own validated edge on the no-babysit stack ([[project-mym-autotrader-assistant]] → TradingView Pine → PickMyTrade → Tradovate), not any advertised product. The only thing worth lifting from the "ratings" angle is a self-built robustness checklist (multi-OOS windows, cost-inclusive fills, single-instrument validation, deflated-Sharpe/PBO).
