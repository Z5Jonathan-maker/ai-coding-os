---
name: project-unifi-founder-punchlist-2026-07
description: "UniFi founder punch list shipped 2026-07-10 — new pricing (Steward $7.99 / Steward+ $13.99), logo geometry fix, tour video lightbox, full-bleed app, goal-account links; commit b3f06d6 on rename/unifi"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3b3f726-65ae-4dca-bcb1-3326d99aa5c8
---

2026-07-10: founder punch list shipped in one pass on `stewardship-app` (commit `b3f06d6`, branch `rename/unifi`, pushed). **Vercel prod deploy was classifier-blocked in auto mode — Jonathan must run `vercel deploy --prod` (or ask for it interactively) unless git auto-deploy picks it up.**

Durable decisions:
- **Tiers renamed/re-priced:** Steward $7.99/mo annual ($11.99 monthly), **Steward+** $13.99/mo annual ($19.99 monthly). ".99 psychology" everywhere; "Generous" tier name retired. Structured data + FAQ + coach-comparison line updated to match.
- **"Generosity" is banned copy** ("corn ball central") — swept to "giving" across marketing + app UI labels (budget cat now "Giving & Offerings", goal "Giving Fund", health pillar "Giving"). Solomon brain dossiers intentionally untouched.
- **Logo mark geometry:** each leaf needs TWO 44-radius arcs (NW + SE corners) with crisp NE/SW tips — the old single-arc trace was the "messed up" look. `Logo tone="white"` = pure-white mono lockup, used in footer.
- **Demo persona is Evan** (was Jonathan) — mock-data members, auth placeholder, settings email.
- **Landing:** hero is h-[calc(100svh-7.5rem)] so the video isn't cut by the fold; hero card halved (max-w-md). "Take the tour" opens `/marketing/tour.mp4` (60s Remotion pitch) in a lightbox — MUST be portaled to body (Reveal's transform breaks `fixed`). "Open full live demo" removed from landing; /demo CTA lives on /features; footer keeps one Live demo link.
- **App layout:** all tabs full-bleed — `(app)/layout.tsx` has no width cap and pages must NOT re-add `mx-auto max-w-*` wrappers (dashboard-skeleton too). Solomon included.
- **Goals:** lifestyle image art from `/marketing/life-*.webp` keyed by goal-name regex (GOAL_ART in goal-card.tsx), emoji-tile fallback; goal→account link = `Goal.accountId` seed + `goalAccounts` override in household-store (`GoalAccountLink` client component shows funding-account balance).
- **Dashboard:** compact `CreditScoreCard` variant (`compact` prop — gauge only, factors stay on /health); net worth KPI renders whole dollars (`formatCurrency({whole:true})` / CountUp "currency-whole") so six figures don't clip the tile.
- **Giving page:** `GivingConnections` (Tithe.ly/Pushpay/Givelify, `givingPlatforms` in store). **Legacy page:** FreeWill.com card (churches' will partner).
- **Screenshot pipeline that works:** Playwright `chromium.launch({channel:"chrome"})` against `next start`, viewport 1200×1099 @2x, `addInitScript` seeds `unifi-cookie-consent=accepted` (never capture from `next dev` — dev-tools button bakes in). New assets shot-debt.png + shot-health.png; debt/health feature pages now use them.

Related: [[project-unifi-monarch-clone]], [[project-unifi-audit-loop-2026-07]]

**2026-07-10 (later, same day): brutal flow/UX audit + full fix pass shipped (`e3581a9`).** Audit + resolution log live at `stewardship-app/audits/2026-07-10-flow-uiux.md`. Durable patterns:
- **One-verdict rule:** `lib/goal-pace.ts` `goalPace().verdict` ("on-track"/"buffer-reached"/"behind") is THE pace verdict — Goals/Advice/insights all read it; never compute per-page pace math again. Same for debt: `DEFAULT_METHOD`/`DEFAULT_EXTRA` in `lib/debts.ts` — every debt-free date quoted anywhere must come from `buildPlan(DEFAULT_METHOD, DEFAULT_EXTRA)`.
- App layout frame is `max-w-[1600px]` in `(app)/layout.tsx` — tabs identical width, ultra-wide capped; pages still must not self-cap.
- Nav is grouped (Plan/Grow/Purpose) via `appNavGroups` in nav-items.ts; `appNav` stays flat for command menu.
- PageHeader `range` renders as plain text — never chip-style a non-control.
- **OPEN (founder):** Clerk signup still collects username+phone — `clerk auth login` expired; fix in Clerk dashboard (User & Authentication → disable username + phone). Also verify prod Clerk isn't dev-keyed. Prod deploy still pending (`vercel deploy --prod`).

**2026-07-11 (investor-demo eve): ultracode perfection run shipped** (`98dcb50`+`9dd7b56`+`b349661`+`e36dc14`, all deployed to prod). Three agent fleets (finders→verify, fixers, demo rehearsal) = ~2.9M subagent tokens. Key durable facts:
- **Dark theme class now applies at `<html>` via ThemeProvider effect** (portals — dialogs/command-menu/notifications — were rendering light on dark; PortalContext approach was dead code). Cleanup on unmount keeps marketing light.
- **Mobile bottom tab bar** `components/app/mobile-tabbar.tsx` (Home/Budget/Activity/Giving/Solomon, data-tabbar attr; cookie banner + demo-tour pill lift above it; demo layout mirrors app layout).
- Solomon offline fallback **typewriters** its answer + shimmer "Reading your numbers…" (real streaming server+client already existed).
- **Vercel bot-challenge gotcha:** uunifi.com serves `x-vercel-mitigated: challenge` 403 to curl/headless (no project WAF configured — platform bot-scoring). Real browsers pass. Verify via deployment URLs or browser-harness, never curl the domain repeatedly.
- Vercel Analytics/SpeedInsights gated on `process.env.VERCEL` (no console 404s off-platform).
- Investor-copy decisions: church partnership = committed-future tense EVERYWHERE (never present-tense until live); "12,000+ institutions via Plaid" (never 13k); no "bank-level" cliché (use concrete 256-AES/TLS/read-only claim); About = founder-led/aligned-incentives (no anti-investor line); EF goal = "$30k stretch" framing.
- **Founder prep still open:** Clerk signup username+phone OFF (dashboard), ANTHROPIC_API_KEY not set (Solomon demos on canned fallback — feels live via typewriter), demo data May-pinned (say "sample household"), have a one-liner ready for the UniFi/Ubiquiti trademark question.

**2026-07-11 (later): Monarch craft-parity certified at 95 and deployed** (`5439029`). Method that worked: measure-don't-opine (8 agents diffing Monarch's live-extracted computed styles at `docs/design/monarch-teardown/capture-2026-06-18/css/*.json` + real captures vs UniFi) → systemic token fixes → blind judge panel, 3 rounds. **The Monarch formula, now UniFi law:** `--shadow-soft: 0 2px 4px 0 rgba(34,32,29,.10)` single layer, borderless rounded-xl cards, ZERO uppercase micro-labels (13px sentence-case medium), numerals ≤1.75rem/semibold, ~56px hairline-free list rows, no chart glow/gradients + honest axes, tonal (never outlined) secondary buttons + light-gray active segments, category dot+text not tinted chips, ornament-free stat tiles. Certification set: `docs/design/monarch-teardown/certification-2026-07-11/` (SCORES.md). Judge caught a real bug: reports' giving-exclusion filtered "Tithe & Offering" but budget category is "Tithe" — reports now derives ALL totals from one group-filtered basis ($3,389.86 everywhere). Waived as brand: calm-voice subtitles, no fake range selectors/chevrons.

**2026-07-12: backend ARMED dormant-safe** (`3527166`, deployed, demo byte-identical). Read seam A2 COMPLETE — all app pages fetch via `lib/data/selectors.ts` granular getters (mock fallback; one TODO: investments/holdings needs a table). Write tier A3 COMPLETE — app/actions/{budgets,transactions,rules,seeds,household}.ts + 4 new tables (rules, txn_meta, legacy_values, giving_platforms) + goals.account_id, migration `drizzle/0002`. Stripe billing (checkout+webhook+getPlan, plan state lives IN Stripe), AWS KMS envelope path (`kms1:` versioned format; plaid-repo must switch to encryptSecretAsync when armed), Resend email (weekly-recap/bill-due templates, CRON_SECRET route with ?preview=1), lib/recurring-detect.ts + lib/transfer-match.ts (pure, 35 tests; 181 total). **Founder checklist with every env var: `docs/ARMING.md`** — Neon → Clerk (username/phone OFF!) → ANTHROPIC_API_KEY → Plaid+KMS → Stripe prices → Resend. Each credential switches its subsystem on; nothing breaks absent.
