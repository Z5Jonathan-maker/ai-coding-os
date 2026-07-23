---
name: project-aurex
description: "Aurex is the user's primary live project — Next.js 16 e-commerce/research site at aurex.bio with a Telegram bot sidecar, peptide-research wiki SSG, and strict compliance posture. Don't propose to "create" or "scaffold" — it exists and ships."
metadata:
  type: project
  originSessionId: aeda5184-d147-4d61-98c9-daa4117a8a76
---
Aurex is a Next.js 16 site living at `/Users/leonardofibonacci/code/projects/aurex`, deployed to **aurex.bio** via Vercel. It is the dominant project of essentially every session — assume context unless told otherwise.

**Stack & layout:**
- Next.js 16 App Router, TypeScript, Tailwind. Production deploy on Vercel (preview-on-PR + prod-on-main).
- Telegram bot sidecar at `bot-telegram/` (separate package, `tsx src/index.ts`, run under launchd `bio.aurex.botd` — plist at `~/Library/LaunchAgents/bio.aurex.botd.plist`, launcher script `bot-telegram/launch.sh`, env in `bot-telegram/.env.local`).
- Wiki SSG at `app/wiki/[...slug]/` rendering peptide research pages (`/wiki/*`). Cross-linked with `/learn/[slug]` long-form research hub.
- Env source-of-truth: **`lib/env.ts`** — every secret/config goes through this typed accessor. Don't `process.env.X` from feature code.

**Payment rails (compliance-sensitive):**
- **BTCPay (crypto): live.** Primary checkout path.
- **NMI (card): scaffolded** but not the default — gated/feature-flagged.
- **Stripe: BANNED.** Don't propose, don't scaffold, don't suggest fallback. Stripe will not underwrite this category. Mentioning it as an option is a regression.

**Quality / verification:**
- **Janoshik third-party COA verification** is the canonical lab-result provenance — UI surfaces link out to Janoshik certificates. Don't replace with first-party "trust us" badges.

**Compliance copy (LOAD-BEARING):**
- All customer-facing surfaces (PDP, shop, /learn, wiki, footer, checkout, bot replies) must frame product as **"in-vitro research applications only"** — never therapeutic, never dosing-for-humans, never medical claims. This is the legal posture that lets the site exist. Edits that drift toward consumer-health framing must be reverted.

**Don't:**
- Propose Stripe.
- Write therapeutic/medical/dosing copy.
- Bypass `lib/env.ts` for secrets.
- Treat the bot as a separate project — it ships from the same repo.
