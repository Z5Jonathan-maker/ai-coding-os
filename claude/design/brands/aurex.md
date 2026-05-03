# Brand Brain — Aurex Research Series

**Last updated:** 2026-05-03 (seeded from `~/code/projects/aurex/DESIGN.md` + `app/globals.css`)
**Brand owner:** Jonathan Cimadevilla / DoseCraft LLC
**Site:** aurex.bio

## Identity

| Field | Value |
|---|---|
| Name | Aurex Research Series |
| Tagline | Independently verified research-grade peptides |
| Voice | Calm authority, scientific precision, never hype |
| Audience | Researchers (21+), QC-conscious buyers, pharmacology-literate readers |
| Compliance posture | "In-vitro research applications only" — never therapeutic claims, never dosage guidance, never "for human use" |
| Legal entity | DoseCraft LLC (Florida) |

## Color palette (canonical)

| Token | Hex | Use |
|---|---|---|
| `--color-paper` | `#FAFAFA` | Page background (zinc-50) |
| `--color-paper-2` | `#FFFFFF` | Cards, spotlights, elevation tier 2 |
| `--color-paper-3` | `#F4F4F5` | Inset surfaces (zinc-100) |
| `--color-paper-tint` | `#E6EDF6` | Hero gradient bottom-right tint |
| `--color-ink` | `#09090B` | Foreground / headlines (zinc-950) |
| `--color-ink-2` | `#27272A` | Body copy (zinc-800) |
| `--color-steel` | `#71717A` | Tertiary text, metadata (zinc-500) |
| `--color-accent` | `#2563EB` | Blue-600 — single sanctioned accent (was lab-teal #006B6B, swapped per /ui-ux-pro-max recommendation) |
| `--color-accent-2` | `#3B82F6` | Blue-500 hover lift |
| `--color-accent-glow` | `rgb(37 99 235 / 0.35)` | Soft glow on accent surfaces |
| `--color-cobalt` | alias of `--color-accent` | Legacy name kept for component compat |

**Hard rule:** Components reference tokens only. No raw hex in components.

**Accent policy (revised 2026-05-03 iter 17):** The palette is paper+ink dominant with a single sanctioned accent (blue `--color-accent`). Use accent sparingly — hero highlight word, primary CTA, batch-COA verification badge, link hover. Never as a fill on cards or page backgrounds. Do NOT introduce additional chromas (purple, teal, orange, pink) — those remain banned per the AI-slop rule.

**History:** Original brand brain (iter 7) said "monochromatic-on-paper, no accents." Codebase evolved to add blue accent for hierarchy + UI affordance after the spec was seeded. Audit iter 17 self-corrected: the accent is intentional + load-bearing, not a violation. The brain is updated to reflect reality.

## Typography

- **Display / headlines:** Flat ink, sharper tracking, 620 weight ("printed-bond bite")
- **Body:** Standard weight, 1.5-1.75 line-height, color `--color-ink-2`
- **Tertiary:** `--color-steel`, 12-14px
- **Numerics:** Tabular figures for prices, batch IDs, timers (prevents layout shift)
- **Hard rule:** No Inter/Roboto/Arial as display. Pull display from a typeface with character (the existing site's choice should be the source of truth — check `app/layout.tsx` `next/font` imports).

## Visual style

- **Approach:** Editorial / Swiss / instrumental. References: linear.app, teenage.engineering, augen.pro.
- **Whitespace:** Generous. Sections breathe. Density only where data lives (tables, batch lists, COA grids).
- **Shadows:** Real elevation, no glow. Stepped scale `shadow-sm` → `shadow-md` → `shadow-lg`.
- **Borders:** Hairline (`border-ink/15`). Avoid heavy borders.
- **Radii:** Small (≤8px on cards, ≤4px on inputs). No bubbly shapes.
- **Iconography:** Lucide line icons, 1.5px stroke. NO emoji as structural icons.

## Photography style

- **Vials:** Clean white seamless OR moody dark Janoshik-lab context. Shot from slight tilt (15-25°) showing label legibly. No floating product mockup vibes.
- **Boxes / cartons:** Real product on neutral surface. Existing renders at `~/code/projects/aurex/public/products/<slug>.png` — match this aesthetic.
- **Hero / lifestyle:** Lab adjacency without medical claims. Researcher in gloved hand, gloved hand on instrument, microscope, etc. NO patient/treatment imagery (compliance violation).
- **Photo backdrop:** Paper neutral or deep charcoal. No gradients.

## Layout preferences

- **Grid:** 12-column desktop (max-w-6xl/7xl), 4-column mobile, 4/8pt spacing rhythm
- **Breakpoints:** 375 / 768 / 1024 / 1440
- **Hero:** Single hero element per view. Headline, supporting line, single CTA. No carousel as hero.
- **Density:** Catalog grids 2-3 cards across desktop, 1 across mobile. PDP is single-column with batch picker, COA links, research data block, FAQ.
- **Trust elements:** Janoshik COA badges, Replacement Guarantee, batch IDs visible. These are the conversion levers.

## Tone of voice

- "Independently re-verified at Janoshik Analytical (HPLC-UV at 214 nm + ESI mass spectrometry)"
- "Distributed strictly for in-vitro laboratory research by qualified researchers 21+"
- "Not FDA approved. Not for human or veterinary use."
- Use **plain technical language**. Don't write "purest peptides on the market" — write "≥99.0% HPLC-UV at 214 nm".
- Numerals + units always. Never round vague.

## Do-not-use rules

- NO purple/violet gradients — AI-slop signature
- NO emoji as icons (compliance + brand)
- NO hype words ("revolutionary", "breakthrough", "best-in-class")
- NO patient imagery, medical claims, dosage guidance, therapeutic implications
- NO Stripe imagery / branding (Stripe is banned for RUO peptide vendors)
- NO Inter/Roboto/Arial as display
- NO bubbly shapes, heavy gradients, glow effects, neon
- NO mockup-y SVG product silhouettes — always use real photos at `public/products/`
- NO emoji in commits, code comments, or design copy unless user explicitly requests

## Reference assets

- **Tokens source-of-truth:** `~/code/projects/aurex/app/globals.css`
- **DESIGN.md:** `~/code/projects/aurex/DESIGN.md`
- **Product photos:** `~/code/projects/aurex/public/products/<slug>.png` (44 PNGs, top 7 = 2.5-2.7MB each — over-spec, optimize to WebP via `npm run images:optimize`)
- **Logo:** Check `~/code/projects/aurex/components/brand/Logo.tsx`
- **Living competitor reference:** elitebiogenix.com (premium aesthetic worth borrowing), truepeptidelabs.com (DON'T copy their thin PDP)

## Platform-specific rules

| Platform | Spec |
|---|---|
| Instagram square post | 1080×1080, 5% safe-zone, no headline overlay below 60px from edge |
| Instagram portrait | 1080×1350, hierarchy works at 1080×566 thumbnail too |
| Instagram story | 1080×1920, primary content in middle 1080×1080 zone |
| X (Twitter) | 1600×900 OR 1080×1080 |
| Web hero | 2400×1200 master, downscaled per breakpoint via `next/image` |
| Vial label | See [exports/label-printer.md](../exports/label-printer.md) — 60×30mm, 4-color process, 300DPI |
| Outer carton | See [exports/print.md](../exports/print.md) — bleed 3mm, 300DPI, CMYK |

## Best-performing past designs

- **Hero with dark vial atmosphere:** Currently live on aurex.bio — high TTFB, low CLS, monochromatic, conveys "research-grade" without graphic noise
- **PDP with stack-tier table inline:** Volume math visible pre-cart, lifted from competitor scrape (truepeptidelabs hides theirs) — converts better
- **COA batch picker on PDP:** Trust element, every released batch links to its Janoshik verification

## Provisional / TBD

- Custom display typeface — current site uses `next/font` choice; capture exact font name once verified
- Brand mark / logo SVG — not yet centralized in design suite (still lives in components/brand/)
