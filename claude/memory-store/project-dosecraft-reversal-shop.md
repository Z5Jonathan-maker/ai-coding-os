---
name: project-dosecraft-reversal-shop
description: DoseCraft in-app reversal-protocol shop (PR
metadata: 
  node_type: memory
  type: project
  originSessionId: 3d1c8e52-61b5-4b92-be5d-257861cd7321
---

In-app "reversal protocols" shop for DoseCraft — replaces the Gumroad cross-sell.
Branch `feat/reversal-shop`, **PR #86, NOT deployed** (payment code — test in Stripe
test mode first). Built 2026-06-17/18.

**Positioning (founder-directed, advisor-validated):** sell the specialty condition
protocols WITHOUT feeling like a scammer. Value-first → consent (a browsable library,
not a chat ambush) → honest justification + independence ("we sell no peptides"). The
Coach gives the real free answer + ONE soft pointer; the *library* is the sales surface.
Free proof: a few "Included" protocols + every premium shows Step 01 free.

**Architecture (all wired, typecheck-clean):**
- Content = the existing `content/paths/<slug>` system (10-chapter authored protocols).
  ~31 condition reversals already existed in-app as FREE ungated paths — the "content
  migration" was mostly already done.
- Registry: `apps/web/src/lib/reversal-protocols.ts` — server-authoritative tier
  (included/premium) + price ($24 default). Flip tier/price per row freely.
- Entitlements: reuse `gumroad_entitlements` table (NO migration); `apps/web/src/lib/
  entitlements.ts` (canAccessReversal = owns OR Lifetime; included = any plan).
- Stripe ONE-TIME: inline `price_data` (no per-protocol Price IDs) in stripe-provider;
  `/api/protocol-checkout` (auth, server price, already-owned guard). Webhook grants on
  `pack_slug` metadata and STOPS (never hits subscription upsert → would clobber tier).
- UI: `/reversals` library + `/reversals/[slug]` gated reader (dynamic so paid content
  isn't in static HTML; Step 01 preview + paywall). Premium slugs excluded from public
  `/paths` SEO build (isPremiumReversal in paths.ts listPaths).
- Coach: `ENTITY_TO_PACK`/`PACK_TITLES` in coach-chat.service.ts repointed Gumroad →
  in-app `/reversals/<slug>`, owned-aware. GUMROAD_STORE removed.

**Deploy-test harness (2026-06-18, committed):** 20 vitest tests (run with NO Stripe
keys — mock DB+provider): `stripe-webhook.test.ts` (pack_slug→oneTimePackSlug, refund
parse), `protocol-grant.test.ts` (one-time grant inserts entitlement + does NOT run sub
upsert = tier-clobber guard; idempotent; 503 on unresolved buyer; refund revoke),
`protocol-checkout.test.ts` (premium-only, server price, owned-guard, pack_slug meta,
/reversals success URL). Operator runbook = `docs/launch/REVERSAL-SHOP-TEST.md` (stripe
listen + card 4242 walkthrough + go-live checklist). Run: `cd apps/web && npx vitest run
src/__tests__/{stripe-webhook,protocol-grant,protocol-checkout}.test.ts`.
**Bug fixed:** checkout success URL was `/<slug>` (404, no route) → now
`/reversals/<slug>?purchased=1` + an unlocking banner for the redirect-beats-webhook race.
**Refund auto-revoke DONE:** full `charge.refunded` sets refundedAt, matched by the Stripe
PaymentIntent id stored in gumroadSaleId at grant time; refund handler runs BEFORE
user-resolution (refund has no customDataUserId). Partial refunds + pre-change/Gumroad rows
= manual revoke. Must subscribe `charge.refunded` in the Stripe webhook config.

**Still the user's calls (operator-only):** the live test-mode click-through (needs their
Stripe test keys + dev Neon URL — runbook §2); tier/pricing split; "Lifetime includes all
reversals" (currently yes); subscribe `charge.refunded` at go-live; merge PR #86. Gumroad
sunset after live.

**Brain gap list — FULLY WORKED (2026-06-18). Catalog now 44 protocols** (5 included +
39 premium), every slug verified = 10 chapters of real content. Authored:
- hair-loss-reversal (hand, 2-lane Big-3 vs RU58841/GHK-Cu), ed-sexual-performance (hand,
  4-system + PT-141/kisspeptin diagnostic + GLP-1 libido-crash cross-sell).
- Batch 1 (parallel agents): dementia-reversal, eczema-reversal, pcos-reversal,
  endometriosis-reversal, adhd-protocol, kidney-disease-reversal.
- Batch 2 (parallel agents): fibromyalgia-reversal, migraine-reversal, parkinsons-protocol
  (framed slow/arrest NOT reverse), tinnitus-reversal (quiet-not-cure), prostate-bph
  (cancer rule-out), concussion-tbi (emergency-first).
- METHOD THAT WORKED: dispatch general-purpose Agents in parallel batches of 6, each grounds
  in its condition's mentor-bachmeyer* transcript + writes 10 chapters to the house format
  (sample = reverse-hashimoto ch01), anonymized, "Research use only" footer; THEN main loop
  wires registry+PATH_META+Coach (single-writer, no races) + typecheck + commit.
- STILL TODO (integrate, not new): Dr. B extra IBD detail → reverse-ibd; OA/LDN/AOD-9604 →
  reverse-ra. (Lower priority enhancements to existing protocols.)
- Dr. B signature for templating: "three failures (inflammation + insulin resistance +
  ATP/mito)" + core stack (BPC-157, KPV, GHK-Cu, SS-31, MOTS-c, methylene blue) +
  condition-specific agents. He often redacts doses; eczema/ED/concussion are clean-dose.

Authoring bar (paths): ~7.5k-char chapters, `# Title` + `##` sections, mechanism-first
confident-expert voice, "Research use only · Not medical advice" footer. The other 30
were brain-grounded via scripts/paths; hair-loss was hand-authored from MPMD+Dr.B source.
Relates to [[feedback-dosecraft-coach-first-strategy]], [[feedback-brain-in-space-experts-only]].
