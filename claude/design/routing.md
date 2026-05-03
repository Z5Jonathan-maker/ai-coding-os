# Design Routing

Task type → which tool, which prompt, which template, which export spec, which brand brain.

## Master router table

| Task type | Trigger | Skill / tool | Prompt | Template | Export spec |
|---|---|---|---|---|---|
| Web section / landing page | "design a hero", "/design", "make a landing page" | `design` skill (HTML/CSS) | [prompts/web-section.md](prompts/web-section.md) | `~/code/research/wassim-augen/augen-clone` (Swiss editorial starter) | [exports/web.md](exports/web.md) |
| UI screen (React/shadcn) | "build the UI", "implement the design", after visual approved | `ui-styling` skill | [prompts/ui-screen.md](prompts/ui-screen.md) | shadcn primitives | [exports/web.md](exports/web.md) |
| Hi-fi prototype (Chinese style) | 高保真, "做个原型", explicit Chinese hi-fi | `huashu-design` skill | [prompts/hi-fi-prototype.md](prompts/hi-fi-prototype.md) (TBD) | huashu starter components | n/a |
| Token system | "design tokens", "build the token architecture" | `design-system` skill | n/a (it's a system, not a one-shot) | three-layer template | n/a |
| Style/palette/font lookup | "what palette for fintech", "font for editorial" | `ui-ux-pro-max` skill | n/a (lookup only) | n/a | n/a |
| Brand voice / messaging | "brand voice", "tone for X audience" | `brand` skill | [prompts/brand-voice.md](prompts/brand-voice.md) (TBD) | n/a | n/a |
| Product photography | "render the vial", "product photo", pharmaceutical product | `cc-image` (gpt-image-2) | [prompts/product-photo.md](prompts/product-photo.md) | n/a | [exports/print.md](exports/print.md) |
| Vial label | "design vial label", peptide label | `cc-image` + Figma post-edit | [prompts/vial-label.md](prompts/vial-label.md) | label dieline templates | [exports/label-printer.md](exports/label-printer.md) |
| Box / outer carton | "design carton", packaging, box | `cc-image` + dieline | [prompts/box-packaging.md](prompts/box-packaging.md) | dieline templates | [exports/print.md](exports/print.md) |
| Social post (square) | "Instagram post", "X graphic" | `cc-image` + Figma | [prompts/social-post.md](prompts/social-post.md) | square 1080×1080 / 1080×1350 | [exports/instagram.md](exports/instagram.md) |
| Carousel (multi-slide) | "carousel", "slide series", multi-frame social | `cc-image` per slide + deck shell | [prompts/carousel.md](prompts/carousel.md) | 1080×1350 × N | [exports/instagram.md](exports/instagram.md) |
| Banner / hero asset | "social hero", "ad banner", platform-specific banner | `banner-design` skill + `cc-image` | [prompts/ad-creative.md](prompts/ad-creative.md) | platform-specific dims | [exports/instagram.md](exports/instagram.md) / [exports/web.md](exports/web.md) |
| Slide deck | "presentation", "pitch deck" | `slides` skill (HTML+Chart.js) | [prompts/deck-slide.md](prompts/deck-slide.md) | 1920×1080 deck shell | [exports/pdf.md](exports/pdf.md) |
| Print collateral | "flyer", "business card", print-ready | `cc-image` + InDesign brief | [prompts/print-collateral.md](prompts/print-collateral.md) (TBD) | n/a | [exports/print.md](exports/print.md) |
| Marketing landing copy | "landing page copy", "ad copy" | `brand` + `prompt-master` | [prompts/marketing-copy.md](prompts/marketing-copy.md) (TBD) | n/a | n/a |

## Pre-flight checklist (run before any design tool fires)

1. **Brand identified?** If yes → load `brands/<brand>.md`. If no → ask user OR create provisional profile in `brands/<provisional-name>.md` and refine.
2. **Task type matched in router?** If yes → grab the prompt + template. If no → use closest match + flag the gap to the wiki for next iter.
3. **Dimensions known?** Read the export spec for the destination platform. If multi-platform → produce master at largest dim, downscale per platform.
4. **References available?** Check `assets/REGISTRY.md` for brand-specific references. Add new ones as you discover them.
5. **Quality bar set?** Default 95% per checks/quality-control.md. Print-bound assets = 98%.

## When the router has no match

1. Don't fabricate a tool route. Surface the gap to user with "I don't have a route for X yet — closest matches are A, B."
2. Pick the closest match in the table.
3. After delivery, propose a new row for routing.md (write to logs/router-proposals.md, don't auto-edit routing.md).
