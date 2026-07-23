---
name: project-dosecraft-cleanup-audit-2026-06
description: "2026-06-09 monorepo excision (instagram/outreach evicted, brain-v2+Fly app destroyed) + full pre-launch audit punch list at audits/2026-06-09.md; launch deliberately deferred until punch list cleared"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8e280efd-2794-495a-a19b-28e8d47bc7ec
---

**UPDATE 2026-06-16 (verified by 2-repo deep study):** Active monorepo is `~/code/projects/dosecraft`
(lowercase, github Z5Jonathan-maker/dosecraft); `~/DoseCraft` (capital) is the STALE pre-cleanup
monorepo (last commit 2026-05-16) — ignore it, it's the source of the bad `docs/SESSION-HANDOFF.md`.
**PAYMENT RAIL REVERSED: Paddle was REMOVED 2026-06-11 (commit 8ee45ce3 "migrate to Stripe-direct —
single rail, Paddle removed pre-first-payment"); rail is now STRIPE-DIRECT.** No live Paddle code in
apps/web|api. `stripe@^22.2.0` is now a dep + `scripts/create-stripe-products.ts`. Pricing single
source: **$19.99/mo · $149/yr · $399 Founder Lifetime** (commit b631f40f). ⚠️ This conflicts with the
standing global "Stripe BANNED (RUO peptide vendor risk)" rule — founder cleared it via
`docs/launch/PAYMENTS-DUE-DILIGENCE-2026-06.md`; DoseCraft sells app subscriptions not peptides, but
affiliate-vendor links remain an account-risk surface (flag once, don't block).
**STALE ARTIFACTS that now FIGHT the shipped code (fix before launch):** `apps/web/.env.example` still
says "Stripe is BANNED" + ships Paddle vars/`PAYMENT_PROVIDER=paddle`; repo `CLAUDE.md` line ~38 still
describes a pre-push `stripe-audit` gate blocking `@stripe/*` imports ("Paddle-only since 2026-05-11")
— will block pushes now that stripe is a dep; `docs/launch/USER-ACTIONS-NOW.md` documents the dead
Paddle 2-week underwriting flow.
**Design:** "instrument-grade" clinical-monochrome redesign sprint shipped 2026-06-11 (retired neon trio).
**Companion (`dosecraft-companion`, tip 9f76b25 2026-06-11):** 209 tests passing / 5 skipped, typecheck
clean, pushed to GH, Neon Tier A retrieval LIVE (text-embedding-3-small 1536-dim, ~246K chunks). Clerk
wired (dummy-mode-gated), 11 OG images + Linktree done, billing consolidated onto apex (companion
checkout = 410 Gone). Brain-quality P0s from the 2026-06-11 reaudit (dose-grounding verifier + eval
harness 344ed9c, query-dilution fix 47589b8, inferMentor passthrough, condition-reversal routing
9f76b25) all SHIPPED in companion. Only genuinely-open companion item = Tier B mempalace stub
(`lib/retrieve.ts:10`, moot since Tier A live). Related: [[project-dosecraft-brain-architecture]],
[[feedback-stripe-ban-scope]].

DoseCraft 2026-06-09: Jonathan chose **excise + audit + level-up over a 2.0 rewrite**, and is
deliberately NOT launching until the codebase is tight (despite being 3 env vars from launch-ready).

**Repo restructure (done, pushed e19ccef3/17f37e1e/bde70f53):**
- Monorepo is now only `apps/* + packages/* + scripts + content + docs + audits`.
- Instagram bot → `~/code/projects/dosecraft-instagram` (own git repo, local-only, no GH remote yet;
  launchd plists updated to new paths, none currently loaded — bot dormant).
- outreach-engine → `~/code/projects/dosecraft-outreach` (own repo, local-only).
- Everything else archived at `~/code/archive/dosecraft-excised-20260609/` (brain-v2, agents, n8n,
  thoughts, research, solynt, screenshots, output, tools, render.yaml, codemagic.yaml, ff-profile,
  bible PDFs, audit screenshots).
- **Old LightRAG Fly app `dosecraft-brain` DESTROYED** (was idle since May 9; corpus restorable from
  GitHub release `brain-v1.0`). brain-v2/ deleted from repo; related to [[project-dosecraft-brain-architecture]].

**Security handled:** committed Firefox profile (cookies.sqlite/logins.db/key4.db) untracked +
archived; leaked Cerebras key scrubbed from docs/ops/DEPLOY-COWORK-PROMPT.md; deps patched to
0 critical/0 high both repos (companion Next 16.2.4→16.2.9 middleware-bypass fix; shell-quote/tmp
overrides — note shell-quote needed `rm -rf node_modules/shell-quote && npm update` to take).
**Still in git HISTORY (purge decision pending): ff-profile + Cerebras key.**

**Open USER actions:** (1) rotate Cerebras key, (2) `flyctl tokens create deploy -a dosecraft-api
--name gha-deploy | gh secret set FLY_API_TOKEN` — fly-deploy.yml has NEVER succeeded (API deploys
were always manual), (3) rotate Gumroad webhook token after header fix, (4) check Render dashboard
for zombie services.

**Audit (the level-up map): `dosecraft/audits/2026-06-09.md`** — 8 critical / 15 high / 17 medium
with file:line evidence. Headline criticals: marketplace payment bypass (api), fake mock purchase
flow live (web), unauthenticated Gumroad webhook (landing), TRIAL entitlements broken server-side,
companion anon LLM cost faucet + missing maxDuration on /api/chat, Gumroad secret in logs,
companion `inferMentor()` mis-weights 65% of brain corpus (~3-line fix, biggest retrieval win).
Lighthouse perf: landing 79 / app 66 (target 95). ~Half the NestJS API modules are dead-but-routable.

**Gotchas learned:** repo pre-push hook blocks main pushes — bypass `MAIN_PUSH_OK=1 git push`;
repo has its own audit hooks (stripe/brand/timing-safe/silent-catch/coach-prompt) that run on push;
npm installs need `--legacy-peer-deps` (expo peer conflict); turbo workspace names are
`@dosecraft/web` etc., not `web`.

**Criticals SHIPPED + live-verified 2026-06-10 (commits c3fbcb7b/4acd8936/fea1833c + companion
65c371e):** marketplace 503s paid purchases; TRIAL/TRIALING entitlements fixed (ENTITLED_STATUSES
pattern in coach-chat + billing); pino strips query strings; web /marketplace ComingSoon-gated
(NEXT_PUBLIC_ENABLE_MARKETPLACE flag); landing gumroad-webhook requires timing-safe ?token=
(secret in Keychain `gumroad-webhook-token` + landing Vercel env GUMROAD_WEBHOOK_TOKEN —
live-tested 401/200); companion anon budget = Neon `anon_chat_usage` 5/day/IP (live-tested
5×200→402; NOTE: test burned Jonathan's home-IP anon budget for 2026-06-10) + maxDuration 90/30/30.
**Fly CI deploy FIXED and working** (first green run ever): token set, deploy must run from repo
root (`--config apps/api/fly.toml`, Dockerfile COPYs packages/*) + `--build-arg GIT_SHA=${{
github.sha }}` keeps /health.commit drift signal alive. Remaining user items: rotate Cerebras key
+ API Gumroad ping token; history purge decision. Next: HIGH punch list (inferMentor first).
The global `error-gate` PostToolUse hook misfires (flags successes as 3-in-a-row failures) — fix it.

**HIGH batch shipped 2026-06-10 (companion 52b5f6d; dosecraft 53c4f772/ea5e2e3a/0c3d8fb2, all
live-verified on Fly):** inferMentor passthrough (65%-corpus fix) + embed/Neon deadlines +
contentless doc fetch + notebook clipping + TTL-cached brain stats/health; web SEO domain split
(web canonicals/sitemap/robots → app.dosecraftapp.com; blog/research/free-guides/links/partners
stay apex-canonical, removed from web sitemap); /launch 308→/pricing; web Sentry
instrumentation.ts; trial copy 7→14-day; landing Upstash rate limiter (needs UPSTASH_* env on
landing Vercel project, falls back in-memory until then); forum/marketplace emails → masked
handles; Paddle webhook event-id dedup (webhook_events) + custom_data.user_id resolution +
cancel-resurrection guard; PAST_DUE 7-day grace.
**DB facts settled 2026-06-10:** prod app-DB was built via `prisma db push` — `migrate deploy`
replays ALL history and breaks on `20260315_add_pg_trgm_search` (CONCURRENTLY in txn); apply new
migrations as direct DDL via neon client (DATABASE_URL from `vercel env pull` apps/web, USER must
paste the command — classifier blocks). Hot-path indexes + webhook_events + users.tokenVersion all
APPLIED+VERIFIED in prod. users.coachProfile EXISTS (H-4 resolved). Migration-history baselining
still TODO. **Auth hardening shipped 2865f682 + live-verified:** register returns message-only
(no JWT pre-verification, enumeration closed — tested against prod), tokenVersion epoch kills
sessions on password change/reset (legacy tokens = v0), auth emails via retrying queue, mobile
verify-then-sign-in flow, 8 dormant modules unregistered (forum 404s in prod;
ENABLE_DORMANT_MODULES=true re-arms). **No Upstash database exists anywhere in the stack** —
render.yaml-era keys never migrated; user must create one (console.upstash.com) and set env on
Fly + web + landing Vercel; all rate limiters degrade to in-memory until then.

**Mediums round shipped 2026-06-10 (dosecraft 1fde779d/37b5fbe6, companion 0c0ea45):** API stream
idle-abort + generic SSE errors + real 1MB body limit (useBodyParser; old express.json never ran)
+ fail-fast env + health detail behind x-internal-api-key (commit stays public for drift tooling);
web PROTECTED_PAGE_PREFIXES single-source (pure module lib/protected-routes.ts — middleware matcher
must stay literal, drift caught by middleware-protection.test.ts parsing the file as text;
next-auth can't be imported in vitest) + 6 newly-enforced private pages + **web mintApiToken now
includes tv claim (would break Coach after password change otherwise)** + cron fail-closed + orphan
sweep (theme-toggle was a false positive, header.tsx imports it) + premium-gate teal; companion
vestigial billing rails DELETED (env.ts kept — health reads BILLING_MODE) + docs refreshed to
OpenAI-1536 reality. Companion gotcha: stale `.next/dev/types` fails typecheck after route
deletions — `rm -rf .next && build` first; its pre-push ship-checklist blocks on typecheck.
**Content dedupe DONE 2026-06-10 (cec24e9f, live-verified):** web's diverged blog/research/
free-guides/links/partners pages DELETED (+blog.ts/blog-data.ts/research.ts, sole-use); same-path
308s to apex in next.config redirects(). lib/landing/lead-magnets + components/landing KEPT (live
consumers: library compound-page, lead-magnet API, marketing tools pages). **Lighthouse truth:**
the audit's "app 66" measured the anon auth-redirect chain — real app content pages (e.g.
/peptides) score perf 91 / a11y 93. Landing = 79 (3D hero LCP; needs a focused visual session).
RSC conversion of dashboard pages deprioritized — all 4 candidates are framer-motion+hooks heavy,
high regression risk for little gain at app-91.
**Still open:** landing hero perf (79→95) + a11y last mile (93→95), Stripe-era column renames
(prod DDL), prisma migration-history baselining, Upstash creation, Cerebras+Gumroad rotations,
history purge decision.

**Launch-focus pass shipped 2026-06-10 (dosecraft b322f4ba, companion 8b02b6b) — Jonathan approved
the product critique ("full steam ahead"):** canon doc = `dosecraft/docs/launch/FOCUS.md` (the
page-by-page cut list + rationale + restore criteria). Sidebar 27→16 (cut rows' routes stay live);
fabricated landing testimonials ("Dr. Sarah K." — invented) DELETED, replaced by EvidenceStrip
(real corpus stats + evidence-tier pitch, server component); creators/MOCK_CREATORS ComingSoon-
gated via FEATURES.marketplace; companion coach/pricing 308s to apex pricing (one pricing story;
OG image + test removed). **Standing product directives from the approved critique:** subtract
before adding; no fake social proof ever; evidence tiers are THE pitch; spine =
Library→Protocols→Tracker→Coach. Next: golden-path onboarding, analytics wiring (PostHog removed
from companion, Amplitude unauthed — launching blind without it), landing hero perf session.

**MARKET RESEARCH 2026-06-10 (Jonathan's directive: no structural changes without evidence) —
canon at `dosecraft/docs/launch/MARKET-RESEARCH-2026-06.md`** (adversarially verified: 17
confirmed / 8 killed claims). Key verified facts: Shotsy = GLP-1 incumbent (4.8★/25K, $40-90/yr
band — DoseCraft annual PRO $168 is ABOVE it) but no peptides/reconstitution/protocols; PeptIQ
already ships FREE reconstitution calc + AI protocol builder (our builders are NOT differentiating);
trust is collapsing (Finnrick: 8% endotoxins, zero-active BPC-157 vials; r/biohackers banned
peptide posts over brand astroturf; FDA 30 warning letters Mar-2026) → market screams for TRUST/
sourcing/side-effect tracking, NOT learning curricula (university demand claim REFUTED 0-3);
evidence tiers validated but as honest low-evidence flag on hype (GLP-1 microdosing = zero
evidence per STAT), not as education; reviewers score privacy 25% and PENALIZE vendor-affiliate
commerce next to health data — **DoseCraft has affiliate vendor links = direct conflict to
decide**; retatrutide surging (>75% of sema search interest); don't bet on Reddit growth.
NEVER cite: '41% fake COA' or Shotsy-$2.25M-funding figures (killed 0-3). Decisions pending
Jonathan: affiliate conflict, pricing band, University de-emphasis, trust-feature roadmap.
