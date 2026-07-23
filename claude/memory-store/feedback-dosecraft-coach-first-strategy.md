---
name: feedback-dosecraft-coach-first-strategy
description: "Jonathan's strategic WHY for DoseCraft: Coach chat is THE product (one-of-one bet), affiliate links are intentional dual-purpose (monetization + vetted safe sources), everything else is secondary moat"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8e280efd-2794-495a-a19b-28e8d47bc7ec
---

Jonathan's strategic rationale for DoseCraft (stated 2026-06-10, after the market research):

1. **Coach chat is THE product, not a feature.** Built for the "where do I even begin?" person —
   the five questions: Where do I buy? What do I buy? How do I take? When do I take? Why do I
   take? One chat answers all five. He considers it one-of-one in the industry (nearest neighbor:
   PeptIQ's AI protocol builder — adjacent but not a corpus-grounded conversational coach). This
   is WHY the 60M-word brain got so much investment.
2. **Affiliate links are intentional and dual-purpose:** monetization the business model needs
   AND a genuine answer to the vendor-trust pain point — people need safe, vetted places to buy.
   Do NOT recommend removing them; the play is to ARMOR them (disclosure + public vetting
   criteria + testing data) so they read as a trust feature, not astroturf.
3. **Everything else (tracker, logs, side effects, calculators) = secondary value moats** to
   widen the gap so no competitor comes close. He accepts the bloat critique and the cuts.
4. **Open to changing:** pricing, verbiage, aesthetics. Ambition: #1 app in the world.

5. **B2B partnership wedge (the "RUO gap" play):** RUO peptide vendors legally CANNOT give dosing
   advice — their buyers order a vial off an Instagram hype video and land with no idea how to
   use it (ChatGPT restricts/garbles peptide dosing). DoseCraft Coach is the only worldwide
   peptide chat with expert dosing/protocols/cycles/interactions, so vendors partner (discounted
   member access, bundled codes) and DoseCraft does the heavy lifting they're barred from. This
   is ALREADY how Jonathan secured affiliate partnerships + free product placement. Pitch:
   "you sell it, we teach it." Compliance edge to design around: arm's-length structure —
   DoseCraft is an independent education layer, never the vendor's marketing arm, and partner
   money NEVER tilts Coach answers (editorial independence IS the licensed asset; FDA's 2026
   enforcement targets RUO-labeling games, so the wall must be visible).

6. **Vendor directory model (refined 2026-06-10):** ~3 approved vendors today incl. their OWN RUO
   brand AUREX. Old behavior: aggressive in-chat CTAs (ask about reta → end-of-answer affiliate
   link, "forcing conversions"). New direction per Jonathan: **dial the in-chat CTAs down** —
   Coach stays neutral; vendors live in a "vetted vendor" directory users can choose from.
   Monetization = pay-to-play AFTER passing the quality gate (COA/QC testing first, THEN
   placement fees / rev splits / 30-40% affiliate cuts / free product). Answer to the "you house
   our competition" objection: "become an approved vendor — here's how it works." Payment is the
   toll after passing vetting, never a way around it. AUREX needs prominent first-party
   disclosure (platform that vets vendors also sells its own brand = the #1 thing partners/users
   will probe).

**Why:** he wants changes grounded in this strategy — Coach-first, affiliates-as-vetted-sources,
vendor-partnership B2B wedge, neutral-chat + paid vetted directory — not generic SaaS playbook
moves.
**How to apply:** position/copy/design everything Coach-first (the five questions ARE the hero
copy); frame affiliates as transparent vetted sourcing; treat trackers as supporting cast;
never propose cutting the Coach or the affiliate model — improve their execution instead.

**Pricing (confirmed 2026-06-11):** $19.99/mo · $149/yr · $399 Founder Lifetime. Source of truth
packages/shared TIER_PRICES; Paddle dashboard must match (user action); post-founder lifetime
price = open decision before 2026-08-31 (code holds $399 at expiry — a stale $99 was defused).

**STRIPE WIRED + SMOKE-TESTED IN PROD (test mode) 2026-06-11:** product prod_UgDxfXvY0b8BLn,
prices (monthly/annual/lifetime) + webhook we_1TgrWQJtVw24RPmbUBUInvGi created via API; keys/whsec/
price-ids in macOS Keychain (services: dosecraft-stripe-secret/-publishable/-whsec/-prices);
5 fresh env vars on dosecraft-web Vercel (8 LEGACY pre-rip STRIPE_* rows deleted — vercel env add
fails silently-ish on duplicates, always check ages); live smoke: unsigned→400, signed
checkout.session.completed→200 (resolved hello@dosecraftapp.com, entitlement upsert ran — admin
sub row now has test data cus_smoke_test, harmless), replay same event id→200 duplicate:true
(dedup ledger proven). LIVE-MODE FLIP REMAINING: user completes Stripe activation, stores sk_live
in Keychain, re-run same setup (~2min) + new live webhook secret.

**PAYMENTS EXECUTED 2026-06-11 (8ee45ce3): Stripe-direct IS the single rail** — Paddle removed
(never processed a payment), BTCPay deleted from product, iOS/IAP paused. stripe-provider.ts +
/api/stripe-webhook live in code; env needed: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
NEXT_PUBLIC_STRIPE_{PRO_MONTHLY,PRO_ANNUAL,LIFETIME}_PRICE_ID. The repo pre-push hook now
enforces no-BTCPay/no-Paddle (stripe-ban hook repurposed). Jonathan has NO prior processor
terminations (MATCH-clean, confirmed).

**Payments verdict (2026-06-11, canon at dosecraft/docs/launch/PAYMENTS-DUE-DILIGENCE-2026-06.md):**
Paddle AUP explicitly prohibits "Medical advice... (e.g., weight loss, muscle building)" — the
direct hook against an AI dosing coach — AND Paddle is under a June-2025 $5M FTC order mandating
high-risk merchant screening → moderate re-underwriting risk. Stripe-direct is the
best-documented rail for software-only peptide education (conditional pseudo-pharma language,
education carve-out, live comparables PeptIQ + PeptideUniv on Stripe). Recommendation: DUAL-RAIL
(keep Paddle + stand up Stripe-direct under a clean entity, Apple IAP iOS hedge, BTCPay last
resort). NOTE: the global "Stripe is BANNED" rule is RUO-brands-only per
[[feedback-stripe-ban-scope]] — DoseCraft-the-SaaS may use Stripe; VERIFY first that Jonathan has
no prior Stripe termination/MATCH listing from peptide ventures. RED LINES: never process
vendor/affiliate transactions through our checkout; present as education/tracking software w/
not-medical-advice disclaimers; zero shared entity/bank/domain/descriptor with AUREX; no
individualized "treatment"-style dosing copy in marketing.
Related: [[project-dosecraft-cleanup-audit-2026-06]]
