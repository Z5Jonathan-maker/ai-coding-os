---
name: design
description: Generate, preview, and iterate on UI/UX designs as self-contained HTML/CSS/SVG mockups, anchored to a project's DESIGN.md visual identity spec. Use when the user says "design this", "mock up", "make a landing page", "build a component", "/design", "iterate on the design", "show me how this looks", or wants visual artifacts that compose with the existing browser stack. Composes with Figma MCP (read brand tokens), chrome-devtools MCP (lighthouse + a11y audit), playwright/browser-use/auto-browser (render + visual regression), DESIGN.md format from google-labs-code/design.md.
---

# /design — visual identity → working mockup loop

A thin orchestration skill that turns the user's existing browser
stack into a design generation + audit loop. No new dependencies.

## The DESIGN.md contract (read this first)

If the project has a `./DESIGN.md` (or `./design.md` or `./.design/DESIGN.md`),
read it before generating anything. It is the source of truth for:

- **Brand identity** — name, voice, mission
- **Color tokens** — palette with semantic roles (primary, accent, neutrals,
  state colors, surface tiers)
- **Typography** — font stacks, scale, line-height, weight roles
- **Spacing scale** — base unit, scale ratio (4-pt, 8-pt, golden, etc.)
- **Grid + breakpoints** — column count, gutter, container widths
- **Component patterns** — buttons, cards, inputs, nav patterns
- **Motion** — easing curves, durations, default transitions
- **Iconography + illustration** — style guide (line weight, fill, mood)
- **Accessibility floor** — WCAG level, contrast minimums, focus styles

Format reference: [google-labs-code/design.md](https://github.com/google-labs-code/design.md).

If no DESIGN.md exists, OFFER to write one before iterating. Don't generate
designs against vibes — get the spec on paper first.

## When the user says `/design <thing>`

### 1. Read context

```bash
# Project DESIGN.md
[ -f ./DESIGN.md ] && cat ./DESIGN.md
# Existing components / pages for visual continuity
ls ./src/components 2>/dev/null
# Figma source-of-truth if mentioned
# (use mcp__figma__* tools to query the file the user names)
```

### 2. Generate self-contained HTML

Produce a single `.html` file with inline `<style>` + inline `<svg>` icons.
Self-contained = no external CSS, no font CDNs unless the DESIGN.md names
them, no JS frameworks. The mockup must render correctly when opened with
`file://` — that's the iteration loop.

Save mockups under `./.design-mocks/<slug>.html` (or `~/Desktop/cc-design/`
if no project dir). Update `./.design-mocks/index.html` as a navigable
contact sheet of all mocks generated.

### 3. Open + audit

```bash
# Visual: open in default browser for the user's eyes
open ./.design-mocks/<slug>.html

# Headless audit via chrome-devtools MCP:
# - mcp__chrome-devtools__navigate_page url="file:///abs/path/<slug>.html"
# - mcp__chrome-devtools__take_screenshot
# - mcp__chrome-devtools__lighthouse_audit (perf + a11y + best practices)
# - mcp__chrome-devtools__take_snapshot (DOM + a11y tree)

# Multi-viewport via playwright MCP:
# - mcp__playwright__browser_resize → 375x812 (mobile), 768x1024 (tablet),
#   1440x900 (desktop) → screenshot each
```

### 4. Iterate

Show the user the screenshot + the lighthouse score. Ask which axis to
push:
- **Visual** — color, spacing, type — edit the HTML, re-screenshot
- **A11y** — fix contrast, focus styles, ARIA — re-audit
- **Responsive** — fix breakpoints, re-screenshot all viewports
- **Motion** — add CSS transitions per the DESIGN.md easing tokens

Keep the iteration in `~/.claude/checkpoints/` via the existing
session-handover hook so the design history is mempalace-searchable
("/recall the v3 of the pricing page").

## When the user says `/design init`

Generate a `./DESIGN.md` for the current project from scratch by:
1. Reading any existing `./README.md` for product positioning
2. Looking at `./tailwind.config.*` / `./src/styles/*` / `./theme.*` for
   inferable tokens
3. Querying Figma if a file URL is provided (via Figma MCP)
4. Asking 5-7 targeted questions ONLY if the above doesn't yield enough:
   - Brand voice (one word: serious / playful / precise / warm / etc.)
   - Density (compact / comfortable / spacious)
   - Type personality (geometric sans / humanist sans / serif / mono)
   - Primary accent hue
   - Motion personality (snappy / gentle / none)
   - Accessibility floor (WCAG AA default; AAA if asked)
   - Reference designs the user admires (URLs)

Write a complete DESIGN.md, commit it, then start generating against it.

## When the user says `/design audit <url|file>`

Run the chrome-devtools MCP audit suite against the URL/file and report:
- Lighthouse perf + a11y + best-practices + SEO scores
- Top 5 actionable fixes per category
- Diff against the project's DESIGN.md (color drift, type drift, spacing drift)

Save the audit to `./.design-mocks/audits/<ts>.md` so successive audits
form a quality timeline.

## When the user asks for image assets

Use **`cc-image`** (wrapper at `~/dotfiles/bin/cc-image`). It calls
OpenAI GPT-Image-2 with the API key auto-resolved from
`op://Personal/OpenAI/credential` at runtime. Outputs land under
`~/.claude/images/<ts>-<slug>.png` and auto-open in Preview.

```bash
# Hero image, landscape
cc-image -s 1536x1024 "brutalist landing page hero, axonometric isometric, sage and ochre"

# Icon set, transparent background
cc-image --transparent -s 1024x1024 "minimal line-art icon: cloud upload, single weight, sage"

# 4 variants of one prompt for selection
cc-image -n 4 "<prompt>"

# Save to a specific path for embedding in the mockup
cc-image -o ./.design-mocks/img/hero.png -s 1536x1024 "<prompt>"
```

After generating, REFERENCE the asset from the mockup HTML via
`<img src="img/hero.png">` (relative path inside `./.design-mocks/`).
The asset and the mockup live together in the project, so the visual
iteration cycle is one directory.

If the 1P "OpenAI" item doesn't exist yet, surface the one-time setup:
```bash
op item create --category="API Credential" --vault=Personal \
  --title="OpenAI" credential[concealed]=sk-...
```

## What this skill EXPLICITLY does not do

- Replace Figma — when the user works in Figma, USE the Figma MCP to
  read the source of truth, don't reinvent it
- Write framework code — generates VANILLA HTML/CSS/SVG. Translating to
  React/Vue/Svelte is a separate step. The mockup is for *visual*
  iteration; the framework binding happens after the visual is approved.
- Local image gen (no ComfyUI / Flux / SD) — gpt-image-2 via OpenAI is
  the wired path. Local would be a separate setup if cost becomes the
  driver (~$0.04/image at high quality).

## Composition with the rest of the stack

| Tool | Role in the design loop |
|---|---|
| Figma MCP | Read brand source-of-truth into DESIGN.md tokens |
| chrome-devtools MCP | `lighthouse_audit`, DOM/a11y snapshots |
| playwright MCP | Multi-viewport screenshots |
| browser-use + cc-browse | Autonomous iteration on existing live sites |
| auto-browser (noVNC) | Phone-side review during AFK iteration |
| caveman | Keep design-iteration responses terse — visual diffs are what matters, not prose |
| session-handover | Each design iteration becomes a checkpoint, /recall searchable later |
| ntfy-notify | Phone push when a long iteration cycle finishes |

## Honesty constraints

- Don't claim a design is "production-ready" from a single mockup — it's a
  *direction*, not a decision
- Always run the lighthouse audit before claiming a11y compliance
- If the DESIGN.md and the generated HTML drift, surface the drift
  explicitly — don't silently let token violations through
- Image assets the user wants generated: surface that it requires an image-
  gen API key (OpenAI GPT-Image-2 or local ComfyUI + Flux) and ask before
  trying to wire one
