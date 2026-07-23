---
name: project-dosecraft-demo-video
description: DoseCraft has a 60s Remotion pitch video (PR
metadata: 
  node_type: memory
  type: project
  originSessionId: 3d1c8e52-61b5-4b92-be5d-257861cd7321
---

DoseCraft's landing demo/pitch video — built 2026-06-17 (PR #84, branch `feat/demo-video`).

**Where:** `~/code/projects/dosecraft/video/` — a STANDALONE Remotion project, deliberately
OUTSIDE the turbo workspace globs (`apps/*`/`packages/*`) so it never enters the Next builds.
Own `package.json` + `node_modules`. Renders into `apps/landing/public/demo/`.

**Re-render:** `cd video && npm i && npm run render` (mp4). Live preview: `npm run studio`.
Then re-encode webm + webp poster with ffmpeg (see the PR / playbook). The deploy mp4 is
carved out of the repo's global `*.mp4` ignore via `!apps/landing/public/demo/*.mp4`.

**Arc (the "study order better" steer = derive order from the real product):** five beginner
questions → "we read the science for you" → brand stinger → benefit-slide + product-proof ×5
(Coach → Library → Protocol → Tracker → Bloodwork) → emotional payoff → "we sell no peptides"
trust → risk-reversal CTA. Persistent logo bug + completion progress bar.

**Design tokens used** (match the app): Space Grotesk / Inter / JetBrains Mono; premium-clinical
light canvas `#f7f7f5`, accent `#0038BD`, evidence lanes Clinical `#0891b2` / Expert `#F59E0B` /
Experimental `#7c3aed`. Logo (`apps/landing/public/logo.png`) is the dark glowing-flask mark,
shown as a dark app-icon squircle on the light canvas.

**Music:** CC0-1.0 "And Just Like That" (freepd.com / Kevin MacLeod, public domain — commercial
OK, no attribution). Picked by librosa from 9 candidates (123 BPM, best beat-presence + energy).

**Embed:** `apps/landing/src/components/demo-video.tsx` — click-to-play `<video preload="none"
poster>` (webm+mp4 sources), placed before `<CoachShowcase />` in `app/page.tsx`.

Gotcha hit: SVG `pathLength`/`strokeDashoffset` line-draw rendered as a stray dash in Remotion's
Chromium — use a width-clip reveal (overflow-hidden parent animating width 0→100%) instead.

Playbook: [[reference-product-demo-video-playbook]] (`~/.claude/wiki/product-demo-video-playbook.md`).
