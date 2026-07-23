---
name: project-dosecraft-coach-ui
description: DoseCraft Coach web UI (coach.dosecraftapp.com) lives in dosecraft-companion; revamp 2026-06-17 + the local-preview host-bypass trick
metadata: 
  node_type: memory
  type: project
  originSessionId: fd3b4c40-d11a-4bd2-9776-54bac57f8f37
---

⚠️ **ARCHITECTURE (2026-06-18, founder caught the sprawl): there are TWO Coach chats.**
(1) **In-house / CANONICAL** = `dosecraft` monorepo `apps/web/src/app/(dashboard)/chat/page.tsx`
(934 lines, real streaming chat) at **app.dosecraftapp.com/chat** — Stripe billing, the app's
own auth, ALREADY on the landing brand (Archivo as `--font-space`, Persian Blue `#0038BD`,
dc- tokens), and RICHER (EvidenceLaneBadge, SourcesPanel, ChatVendorHint, PremiumGate,
Save-as-PDF/Export, SimplifyButton). `/api/chat` → NestJS `apps/api` `/coach-chat` → brain.
(2) **Standalone / TO-RETIRE** = `~/code/projects/dosecraft-companion` at **coach.dosecraftapp.com**
— its own Clerk + Paddle/BTCPay billing + "Coach by Dosecraft" teal/Crimson-Pro sub-brand; also
ships an `app/(apex)` group that COLLIDES with the monorepo's apps/landing on dosecraftapp.com.
It calls back into app.dosecraftapp.com/api/coach/entitlement. The companion still hosts the
live **brain** (`/api/brain`, 246K chunks) consumed by apps/api via `BRAIN_API_URL`.

**Founder decision: consolidate Coach in-house — EXECUTING (2026-06-18).** Make
app.dosecraftapp.com/chat the one Coach. **The editorial teal+serif "keep it" rule is
OVERRIDDEN** — one brand (the Persian Blue landing). Plan = `dosecraft/docs/launch/COACH-CONSOLIDATION.md`.
DONE so far:
- **In-app chat matched to landing**: apps/web `(dashboard)/chat/page.tsx` was a DARK-CRYPTO
  island (dc-neon-cyan accent, dark vignette rgba(5,5,8), mesh-blob/bg-grid, white→purple
  gradient title, glow-border-animated composer) on a LIGHT app (its :root IS the landing
  system: #f7f7f5 / #0038BD / Archivo as --font-space / white cards; `.dark` is opt-in, no
  theme toggle wired → light default). Converted to light Persian Blue using EXISTING tokens
  + utilities (text-gradient-hero, btn-primary, glass-card, dc-accent). Branch
  `feat/coach-landing-match` (pushed, preview). Typecheck clean. NOTE: chat is auth-gated
  (307→/auth) so couldn't screenshot locally — verify on the Vercel preview after login.
- **Standalone retired + DEPLOYED + VERIFIED (2026-06-18)**: `dosecraft-companion/proxy.ts`
  301s coach.dosecraftapp.com → app.dosecraftapp.com/chat. Pushed to companion `main` (live).
  Verified: coach root → 301→/chat ✓; GET /api/brain → 404 (no redirect); POST /api/brain/query
  → 401 (auth-required, NOT redirected) → **brain alive & serving, dependency intact**. The
  companion re-skin was reverted (dead). Both chat redesign (monorepo main, MAIN_PUSH_OK=1) and
  redirect are pushed.
- **Apex collision = NON-ISSUE (verified)**: dosecraftapp.com is served by the monorepo
  `apps/landing` (returns 0038BD/archivo/dc-accent), NOT the companion `(apex)` group → the
  companion apex is dead code, safe to retire wholesale.
REMAINING (operator-only, needs Paddle dashboard): confirm no live Paddle subscribers, then tear
out the companion's Paddle/Clerk/`(apex)` entirely (the brain `/api/brain` is the only piece to keep).

**LOCAL-PREVIEW TRICK (non-obvious):** `proxy.ts` is a multi-tenant host router that force-redirects `/coach/*` to the canonical host `coach.dosecraftapp.com` even in dev, so plain `localhost:3000/coach/chat` 307s away and won't render. Bypass: append **`?host=coach`** → `http://localhost:3000/coach/chat?host=coach` (proxy.ts line ~32 treats `?host=coach` as the Coach host). Then the public demo empty-state + a real cited answer render locally (the brain API works from `.env.local`). Click a `SuggestedQuestions` button to trigger an answer.

**Revamp 2026-06-17 (founder: "I don't like the interface for coach, needs a ui/ux revamp" → flagged landing + conversation):** (1) Landing suggested-questions were 14 identical cards all mislabeled "Researchers ask" → regrouped goal-first (Healing & recovery / Fat loss & metabolism / Sleep,growth,hair / For researchers) with lucide accent icons + rules; added a trust-pill row. (2) **The real bug:** answers rendered RAW markdown — literal `# ## **` showed as text because Chat.tsx used `whitespace-pre-wrap` + a citation-only parser (`CitationText`). New `AnswerContent.tsx` parses lightweight markdown → real `<h1>/<h2>/<h3>/<p>/<ul>/<ol>/<strong>` so the existing `.prose-dosecraft` typography applies (Crimson Pro headings), preserving the `[paper:…]`/`[trial:…]`/`[research:…]`/`[regulatory:…]` citation badges; streaming-safe. (3) Briefly framed the answer with a teal left-rule + teal evidence chip, but the **Coach HOMEPAGE (`app/coach/page.tsx`) ships a static chat-preview mockup that is the canonical "intended look"** — gray `Synthesized from N references` chip on `bg-paper border-rule` + BARE prose (no left-rule) + accent-glow vendor card. Founder asked "does it match the homepage?" → reverted the teal chip + left-rule to match the mockup exactly (commit 2683410). **Rule: the homepage mockup defines the chat answer styling — keep them in sync.** Pushes 4684bfe + 14cc785 + 2683410, live + verified (chip graphite #5C5C66, border-left 0). Possible next polish: citation badges (`CitationBadge.tsx`), vendor cards (`VendorCard.tsx`) vs the mockup's vendor block. See [[project-dosecraft-brain-architecture]], [[feedback-dosecraft-coach-first-strategy]].
