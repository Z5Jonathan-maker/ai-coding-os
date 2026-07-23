---
name: project-unifi-aplus-brand-pass
description: "A+ brand/marketing pass 2026-07-11 — 30-day trial, calculator lead capture, /learn SEO hub (10 articles), giving-green leaf signature; name UniFi cleared by founder"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3b3f726-65ae-4dca-bcb1-3326d99aa5c8
---

A+ brand/marketing execution shipped 2026-07-11 (branch rename/unifi, commits bd9c251→2b47b9f, deployed to uunifi.com):

- **Name decision (founder, final):** UniFi stays; founder searched and found no conflicting registration; uunifi.com was the quick-buy domain. Don't re-raise except as a diligence-prep one-liner (fintech = different trademark class than Ubiquiti's networking gear).
- **Trial is 7 days** — founder reverted the 30-day experiment 2026-07-15 (final; don't propose lengthening again). Sidebar card "7 days left" / 40% bar. The 30-day money-back GUARANTEE is a separate promise — don't conflate, and never sweep it when touching trial copy.
- **Lead capture:** both calculators have PlanCapture ("Email me my plan") → `captureLead` in app/actions/leads.ts → `leads` table (drizzle/0003) + plan email via Resend. Dormant-safe: DATABASE_URL stores, RESEND_API_KEY sends, neither = graceful ok. Privacy line on calculators reworded to "unless you ask for it by email below". Fires `track("lead_submitted")`.
- **/learn SEO hub:** 10 articles as data files in lib/learn/articles/*.ts (type contract lib/learn/types.ts, registry lib/learn/index.ts). Renderer at app/(marketing)/learn/[slug] with Article+Breadcrumb+FAQ JSON-LD; hub, header/footer nav links, sitemap auto-derives from registry. New articles = add data file + registry import only.
- **Giving-green signature:** leaf scale added to globals.css (`--color-leaf-50/100/200/500/600/700` + `.dark` remaps). Leaf = giving surfaces ONLY (payday nudge, streak chip, firstfruits, giving KPIs incl. dashboard `accent="leaf"` StatTile, HeartHandshake goal tiles, marketing MiniGivingCard/"Give" bar). Blue stays money/interaction. "Blue is money, green is giving."
- shot-dashboard.png + shot-goals.png regenerated (1200×1099 css @2x, full-page at that viewport).
- **Remaining A+ gaps (blocked):** social proof needs 3 real beta households (founder); referral mechanics need billing/auth armed; palette question "logo navy vs product blue" deliberately left — leaf promotion was the unification move.
- Session-limit lesson: 6-agent fleet died on Max session cap mid-flight; work completed solo. Agents leave PARTIAL edits — always `git status` + re-grep before assuming a sweep finished.

Related: [[project-unifi-founder-punchlist-2026-07]], [[project-unifi-audit-loop-2026-07]], [[project-unifi-solomon-brain]]
