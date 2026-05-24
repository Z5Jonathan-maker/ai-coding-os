# Image 2.0 Creative Direction Workflow

Source: attached `HOW-TO.pdf` plus the May 2026 brand-image workflow.

## Core Rule

Image 2.0 is the creative-reference lane. Kimi is the implementation lane.

For design-first missions that need original art direction, use the Creative
Direction Kernel in `docs/CREATIVE-DIRECTION-KERNEL.md`. The executable proof is
`cc-creative-kernel-check`.

Use Image 2.0 when the user needs to discover or lock a visual direction:

- landing-page example
- hero/background concept
- product listing image
- canonical label or product render
- ad creative
- page divider, texture, button motif, or visual style reference
- brand-consistent component direction

Use Kimi after the reference is approved:

- convert the reference into real HTML/CSS/React
- preserve the background or generated asset
- overlay native text/buttons/forms
- make it responsive and accessible
- verify in browser with screenshots

## Project Scaffold

For design-heavy projects, add:

```text
PLAN.md
.prompts/
.logs/
public/generated/
```

`PLAN.md` should define:

- dev command
- local URL
- generated asset folder
- component/file that consumes each asset
- canonical reference images
- approved style words

## Continuity Protocol

Before generating:

1. Read the latest relevant `.prompts/*.md`.
2. Attach canonical reference images when identity must remain stable.
3. Preserve palette, lighting direction, label hierarchy, proportions, and
   material vocabulary.
4. Generate one clear artifact for the current purpose.
5. Save the exact prompt and output manifest.

After approval:

1. Put the selected image into `public/generated/` or the project asset path.
2. Ask Kimi to implement from the approved reference.
3. Keep text, buttons, forms, and interaction native in code.
4. Verify with a browser screenshot.
5. Log the iteration under `.logs/<date>.md`.

## Canonical Product/Brand Asset Loop

For products, labels, packaging, and repeated catalog images:

1. Generate or choose one canonical reference.
2. Use that image as the edit reference for variants.
3. Only change the requested fields, such as compound name, dose, size, or
   milligrams.
4. Do not allow layout, logo, label hierarchy, camera angle, lighting, or
   packaging shape to drift unless explicitly requested.

This is the catalog consistency lever: one approved label/product render can
be duplicated across a full SKU set without visual mismatch.

## Routing Examples

| Prompt | Route |
|---|---|
| "Show me an example of a hero for this peptide site" | ChatGPT/Image 2.0 |
| "Create the canonical product listing image for this label" | ChatGPT/Image 2.0 |
| "Use this image as the hero background and build the section" | Kimi |
| "Make the buttons responsive and accessible" | Kimi |
| "Refactor the asset pipeline that stores these images" | Codex |
| "Review whether this brand system is coherent" | Claude/Codex precision |

## What Not To Do

- Do not ask Codex/Kimi/Claude to invent the static visual direction when
  Image 2.0 can produce the reference directly.
- Do not bake text into hero images when it should be native HTML.
- Do not regenerate from scratch after a direction is approved; edit from the
  canonical reference.
- Do not mix unrelated style references inside the same catalog batch.
- Do not spend paid API image calls when ChatGPT Desktop/session generation is
  the intended path.
