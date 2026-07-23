---
name: feedback-image-gen-canonical-anchors
description: "When generating brand images via image-2.0 / gpt-image-2 / nano-banana / any text-to-image pipeline, ALWAYS feed canonical reference images as input anchors — never text-only prompts. This is how Aurex maintains brand consistency."
metadata:
  type: feedback
  originSessionId: 7ca6b78d-a40a-41a5-85df-7ca126a674d3
---
When generating any brand image (product shots, marketing renders, social assets, vial photography, packaging mocks) via image-2.0, gpt-image-2, nano-banana, or any equivalent text-to-image model, ALWAYS feed the project's canonical reference images as input anchors alongside the prompt. Never run text-only generation for brand assets.

**Why:** Text-only prompts drift. The Aurex mark, vial silhouette, label layout, palette, and lighting style all degrade across generations when the model has no visual anchor. The 2026-05-04 logo-fidelity incident (34 marketing PNGs rendered with a fabricated stacked-arrows mark instead of the canonical layered-A) was caused by a `scripts/generate-logo.mjs` pipeline that prompted the model with a text description of the mark rather than passing the canonical PNG as a reference. Anchoring fixes this categorically.

**How to apply:**
- Aurex canonical references live at `public/brand/lockups/aurex-mark-real.png`, `brand/reference/aurex-canonical-packshot.png`, `brand/reference/aurex-vial-hero.png`, `brand/reference/aurex-vial-template.png`, `brand/reference/templates/`, `brand/reference/templates-v2/`.
- Any new image-gen script under `scripts/` must accept and forward canonical anchor images to the model's image-input slot — not just a text prompt.
- When writing prompts that request brand-asset generation, name the specific anchor file(s) and the role each plays (e.g., "anchor: aurex-mark-real.png for the logo geometry; anchor: aurex-vial-template.png for the vial silhouette + label proportions").
- Verify post-generation: compare output against canonical anchor pixel-by-pixel for mark accuracy before committing renders to `public/`.
