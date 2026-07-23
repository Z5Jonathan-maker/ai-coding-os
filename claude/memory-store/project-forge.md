---
name: project-forge
description: "Two backend-agnostic React packages at ~/code/projects/forge — @forge/forms (multi-step branching form, Typeform replacement) and @forge/recorder (browser MediaRecorder + Player, Loom replacement). Used across DoseCraft, Aurex, and any future project that needs a waitlist or screen-share."
metadata:
  type: project
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
forge lives at `~/code/projects/forge/` (created 2026-05-06). Two packages:

- `@forge/forms` — multi-step branching form. Field types: short_text, long_text, email, number, single_choice, multi_choice, rating, yes_no. Branching engine in `branching.ts` (pure — testable). Default CSS in `src/styles.css` (forge-* classes, override via classPrefix prop).
- `@forge/recorder` — browser screen+mic recorder via MediaRecorder API. Hook (`useRecorder`), drop-in component (`Recorder`), playback (`Player`) with view-time tracking. Default mime VP9-WebM.

**Why:** every project Jonathan ships has at least one of these surfaces. Building per-project = wasted code; SaaS = wasted money. forge is the one-time install. There's a `/forge` skill at `~/.claude/skills/forge/SKILL.md` that documents the wire-into-new-project pattern.

**How to apply:**
- **Backend-agnostic**: both packages take callbacks (Submitter / Uploader). Don't suggest forge handles storage — it doesn't. Consumer plugs Neon/Prisma/Supabase/R2/whatever.
- **Wiring a consumer**: `"@forge/forms": "file:../../forge/packages/forms"` in consumer's package.json (path relative; npm install — works in monorepos as a workspace too).
- **Aurex waitlist reference**: see `~/code/projects/forge/examples/aurex-waitlist/{page.example.tsx, api-route.example.ts}` — full Next.js App Router setup with Neon/Prisma/Resend backend variants commented in.
- **DoseCraft mobile context**: forge-forms is React-DOM only. For native, the existing `apps/mobile/app/onboarding.tsx` step machine is the reference pattern; a forge-RN port is on the backlog but unbuilt. Don't try to import @forge/forms into React Native — it'll break.
- **Default video mime is WebM-VP9** which doesn't play in old iOS Safari (<14.1). For public-facing video, suggest Mux or Cloudflare Stream as the playback layer above forge.
- **Status**: forms + recorder both shipped with working code 2026-05-06 by Claude session. No tests yet. No DoseCraft consumer wired yet (mobile blocked on RN port). Aurex consumer in `examples/` but not yet committed in the aurex repo itself.
