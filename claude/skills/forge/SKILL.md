---
name: forge
description: Drop-in building blocks for Typeform-style branching forms (`@forge/forms`) and Loom-style screen recorder (`@forge/recorder`). Backend-agnostic — pass your own Submitter / Uploader function. Use when the user says "wire a waitlist", "branching form", "multi-step quiz", "send a walkthrough", "screen recording", "loom replacement", "typeform replacement", "/forge". Lives at `~/code/projects/forge/`.
---

# /forge — branching forms + screen recorder

Reusable building blocks at `~/code/projects/forge/`. Two packages, one job each. Backend-agnostic — both take a callback so the consumer wires their own DB / storage.

## When to invoke

| User intent | Pick |
|---|---|
| "Add a waitlist to this site" | `@forge/forms` |
| "Build a multi-step onboarding quiz" | `@forge/forms` |
| "Lead capture form with branching" | `@forge/forms` |
| "App Store re-review prep / interstitial form" | `@forge/forms` |
| "Send a quick screen recording" | `@forge/recorder` |
| "In-app screen capture for support" | `@forge/recorder` |
| "Loom alternative" / "Typeform alternative" | the matching package above |

## Wiring a new consumer (any project)

1. Add to consumer's `package.json`:

```jsonc
"dependencies": {
  "@forge/forms": "file:../../forge/packages/forms",        // path relative to consumer
  "@forge/recorder": "file:../../forge/packages/recorder"
}
```

2. Run `npm install` in the consumer.

3. Import + wire callbacks:

```tsx
import { Form } from '@forge/forms';
<Form schema={...} onSubmit={async (answers) => { /* hit YOUR backend */ }} />
```

```tsx
import { Recorder } from '@forge/recorder';
<Recorder uploader={async (blob, meta) => { /* upload to YOUR storage */ }} />
```

4. Copy or import default styles (`packages/{forms,recorder}/src/styles.css` for forms; recorder is class-only — bring your own CSS).

## What NOT to assume

- forge does **not** include any DB, CDN, or auth code. Don't suggest "just use forge for the storage too" — it's literally a callback.
- Default-mime for the recorder is **WebM-VP9** which doesn't play in old iOS Safari (<14.1). For public-facing recordings, the user may want Mux or Cloudflare Stream.
- forge is web-first. The forms component is React-DOM. For React Native (DoseCraft mobile), reference the existing `apps/mobile/app/onboarding.tsx` step machine pattern — a forge-RN port is on the backlog but not built.

## Examples in the repo

- `~/code/projects/forge/examples/aurex-waitlist/page.example.tsx` — full Aurex waitlist page
- `~/code/projects/forge/examples/aurex-waitlist/api-route.example.ts` — backend stub with Neon/Prisma + Resend variants

## Composition

- Backend layer: usually Neon + Prisma (matches the DoseCraft API stack — see `~/DoseCraft/packages/database/`)
- Email-on-completion: Resend (`@resend/resend`)
- Rate-limiting at the API route: Upstash Ratelimit or Vercel KV
- Recorder storage: Vercel Blob, Cloudflare R2, or any S3-compatible (don't ship the Blob through your Vercel function — generate a signed direct-upload URL)
- Player view-tracking: write to a Postgres `recording_views` table or pipe to whatever analytics exists

See [README at `~/code/projects/forge/README.md`](file:///Users/leonardofibonacci/code/projects/forge/README.md) for the full status + non-goals.
