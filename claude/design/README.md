# Design Intelligence Suite

Sibling to the routing brain. Same architecture: source-of-truth in dotfiles, symlinked to `~/.claude/design/`, queryable by every session, version-controlled.

**Goal:** Every design output is brand-consistent, premium, conversion-aware, platform-specific, print-ready when needed, and never looks AI-generated.

## Read-before / Follow-during / Write-after protocol

### BEFORE creating any design
1. Identify task type (brand / social / product mockup / label / packaging / web section / ad / deck / carousel / product photo / UI / marketing / print)
2. Read [routing.md](routing.md) — pick the tool/workflow
3. Read [brands/<brand>.md](brands/) — load brand memory (logo rules, palette, typography, do-not-use)
4. Check [logs/winning-patterns.md](logs/winning-patterns.md) — has a similar design worked before?

### DURING creation
- Use the prompt from [prompts/<type>.md](prompts/) as starting point — adapt, don't fabricate
- Apply the [checks/quality-control.md](checks/quality-control.md) checklist before claiming done
- Match dimensions/format to [exports/<platform>.md](exports/)

### AFTER delivery
- If output scored ≥95% → append to [logs/winning-patterns.md](logs/winning-patterns.md) (what to reuse)
- If output failed → append to [logs/anti-patterns.md](logs/anti-patterns.md) (what to never repeat)
- If brand rule emerged → update [brands/<brand>.md](brands/)
- If new prompt structure worked → update [prompts/<type>.md](prompts/)

## Suite structure

```
design/
├── README.md                 — this file (read protocol)
├── routing.md                — task type → tool/workflow router
├── brands/                   — per-brand memory
│   └── aurex.md              — Aurex full brand spec (seeded from DESIGN.md + globals.css)
├── prompts/                  — proven prompts per design type
│   ├── product-photo.md
│   ├── vial-label.md
│   ├── box-packaging.md
│   ├── social-post.md
│   ├── web-section.md
│   ├── ad-creative.md
│   ├── deck-slide.md
│   ├── carousel.md
│   └── ui-screen.md
├── assets/                   — pointers to logos, fonts, palettes, references
│   └── REGISTRY.md
├── templates/                — reusable layout specs (Figma JSON, HTML scaffolds, Canva briefs)
├── checks/
│   └── quality-control.md    — pre-delivery scoring rubric (8 axes, 95% threshold)
├── exports/                  — per-platform export specs
│   ├── instagram.md
│   ├── web.md
│   ├── print.md
│   ├── pdf.md
│   ├── label-printer.md
│   └── README.md
└── logs/                     — append-only learning
    ├── winning-patterns.md
    ├── anti-patterns.md
    └── prompt-iterations.md
```

## Roles consolidated into one brain

The suite operates as: **Creative Director + Brand Manager + Production Designer + Conversion Strategist + Print Technician + Prompt Engineer**. Each role's logic lives in this directory, queried per-task by the routing layer.

## Hard quality rules (apply to every output)

NEVER produce:
- Generic Canva-looking layouts
- Overcrowded designs
- Weak typography (Inter/Roboto/Arial as display)
- Random color choices outside brand palette
- Unbalanced spacing (no 4/8pt rhythm)
- Low-contrast text (<4.5:1 for body)
- Unclear hierarchy
- AI artifacts (warped faces, melting text, generic gradients)
- Inconsistent branding within a deliverable
- Unprintable label specs (wrong DPI, wrong color space)

ALWAYS produce:
- Premium hierarchy (one hero element per view, supporting elements subordinated)
- 4/8pt spacing rhythm
- Brand palette only (no ad-hoc hex)
- Strong contrast (4.5:1 body, 3:1 large)
- Platform-native dimensions
- Conversion-focused messaging when commercial
- High-end visual restraint (less is more)
