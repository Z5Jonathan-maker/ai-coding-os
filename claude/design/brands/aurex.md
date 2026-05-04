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

## Canonical hero visual identity (2026-05-03 — user-supplied references)

User supplied 16+ reference compositions establishing the canonical Aurex hero/marketing visual standard. Future image-gen work (ChatGPT Image 2.0 / gpt-image-1) MUST match this aesthetic.

### Composition rules
- **Subject:** single vial centered OR product family lineup on dark base/podium
- **Vial spec:** clear glass body, brushed-silver textured label, black stippled rubber stopper, **single cobalt-blue accent stripe at base of label**, white lyophilized cake visible through glass
- **Label hierarchy:** three-nested-triangular-strokes layered A mark → "AUREX RESEARCH SERIES" → boxed compound name → dose in cobalt blue → "LYOPHILIZED POWDER" → "PURITY > 99%" → divider → "RUO"
- **Background:** dark navy/black with soft blue-lit lab glassware bokeh (Erlenmeyer flasks, beakers, test tubes, microscopes); often a faint Aurex monogram watermark on a back panel
- **Lighting:** cinematic, premium, soft directional with cobalt rim/key light, occasional vertical light cone behind subject; high specular highlights on glass + cap
- **Decorative elements (optional, never noisy):** DNA helix, molecular ball-and-stick structures, hexagonal HUD panels with faux-data, water droplets, glass shatter, particle dispersal — always cool blue, never warm

### Typography lockup
- **Wordmark + subtitle:** "AUREX" all-caps with three-nested-triangular-strokes layered A mark, "RESEARCH SERIES" subtitle in tracking
- **Headline pattern:** "SCIENCE. PURIFIED. PERFORMANCE." (period-separated, all-caps, white) with cobalt rule beneath + "LYOPHILIZED PURITY > 99%" sublabel in cobalt
- **Compound headline pattern:** compound name (white, large), dose (cobalt blue, same-size or slightly smaller) — e.g. "RETATRUTIDE 20MG", "MOTS-C 10MG", "KLOW 80MG"
- **Trust badges (icon + label):** RESEARCH GRADE (shield), HIGH PURITY (DNA helix), LAB VERIFIED (microscope/flask), RUO RESEARCH USE ONLY (boxed)
- **Alternate badges:** PRECISION MANUFACTURED, PREMIUM QUALITY, CONSISTENT PURITY, TRUSTED BY RESEARCHERS — same icon vocabulary
- **Section headlines (used in collage layouts):** "ENGINEERED FOR EXCELLENCE", "RESEARCH WITHOUT COMPROMISE", "BUILT ON SCIENCE. BACKED BY PURITY.", "ADVANCED FORMULATIONS. PRECISE RESULTS. ELEVATED STANDARDS."
- **Trust subline pattern:** "PURITY YOU CAN TRUST. RESULTS YOU CAN SEE." / "HIGH PURITY. SUPERIOR PERFORMANCE." / "FOR THOSE WHO DEMAND MORE."

### Color palette (canonical for visual gen)
- Background: `#0a0d14` to `#0f1521` (navy-black gradient)
- Accent (cobalt): `#1e40af` to `#2563eb` range — note `--color-accent` removal is staged in audit P3 but the **brand visual reference DOES use cobalt** as the accent — this conflicts with audit's monochromatic-on-paper rule for web; resolve before web-side application
- Vial silver: `#c0c4cc` brushed metal
- Vial cap: `#1a1a1a` matte black with stipple texture
- Vial cake: `#f5f5f5` warm off-white
- Glass highlights: cool white `#e8f0ff` with cobalt fringing
- Trust-badge icons: `#3b82f6` cobalt at 80% opacity

### Composition variants observed
1. **Hero portrait** — single vial centered, label specs panel left side, lab background bokeh right
2. **Hero landscape** — single vial right-third, headline+specs+badges left-third, lab background full
3. **Family lineup** — 5-7 vials staggered on dark podium, monogram + tagline above, badge bar below
4. **Family scattered** — 7 vials in 3D scatter composition with DNA helix decorative + molecular structures
5. **Collage / contact sheet** — 6-9 panels mixing hero + lifestyle + closeup label + lineup + microscope-context
6. **Single product hero with full HUD** — vial centered, hexagonal data panels around it (molecular weight, peptide structure, advanced formulation, stability enhanced, lab grade)
7. **Single vial on illuminated podium** — minimal black void, podium with under-glow ring, faint Aurex monogram watermark behind
8. **Glass-shatter explosion** — vial mid-air with shattered crystal/glass particles dispersing, cinematic motion-frozen

### Image-gen prompt template (for gpt-image-1)
```
Premium product photography of an Aurex Research Series peptide vial:
clear glass cylindrical vial, brushed-silver textured label with stacked-arrows
"A" monogram and "AUREX RESEARCH SERIES" wordmark, boxed compound name "{COMPOUND}"
with cobalt-blue dose "{DOSE}MG" beneath, "LYOPHILIZED POWDER PURITY > 99%" sublabel,
"RUO" research-use-only marker, single cobalt-blue accent stripe at label base,
matte black stippled rubber stopper cap, white lyophilized cake visible inside.

Composition: {COMPOSITION_VARIANT}
Background: dark navy lab interior with soft blue-lit Erlenmeyer flasks and test
tubes in shallow-DOF bokeh, faint Aurex monogram watermark on back wall.
Lighting: cinematic premium, soft directional key with cobalt rim light,
high specular highlights on glass and cap.
Color grade: monochromatic blue-black with cobalt accents only, no warm tones.
Style: photorealistic 8K product photography, ultra-detailed, sharp focus on
label, shallow depth of field on background.

Aspect ratio: {AR}
Negative: warm light, gold/amber tints, hand-drawn elements, clip-art icons,
photorealistic humans, off-brand fonts, decorative serifs in the label,
liquid inside the vial (must be dry lyophilized cake), generic pharmacy aesthetic.
```

### Reference asset locations (to be populated)
- **User-supplied source images:** `~/Pictures/aurex-references/` (user to drop originals from Photos.app — see image-gen workflow note)
- **Generated assets (output dir):** `~/code/projects/aurex/public/marketing/<section>/<slug>.{webp,png}`
- **Image-gen prompt scripts:** `~/.claude/design/prompts/aurex-website-section-<section>.md` (one per website section: hero, peptide-grid, science-section, evidence-section, footer-cta)

### When using as reference inputs to gpt-image-1
1. Pick 2-3 user-supplied originals as `image[]` inputs (style anchor)
2. Use the prompt template above with `COMPOUND`/`DOSE`/`COMPOSITION_VARIANT` filled
3. Set `quality: "high"`, `size: "1024x1536"` (portrait) or `"1536x1024"` (landscape) or `"1024x1024"` (square)
4. Output to `~/code/projects/aurex/public/marketing/...` directly
5. Optimize via `cwebp -q 85` before committing

## Pricing model (audit iter 17)

**Per-vial pricing:** msrp ≥ list ≥ sale ≥ subscribe ≥ stackFloor (verified monotonic across all 18 SKUs).

**Stack pricing — CURATION PREMIUM, not items-savings.** All 7 stacks cost MORE than buying their included SKUs à la carte at `pricing.sale`. Examples:
- healing-stack: $289.97 stack vs $150 items + $118 bonusItems = $268. Premium = $22.
- longevity-stack: $329.97 stack vs $136 items.
- flagship-bundle: $1,299.97 stack vs $566 items.

**This is intentional brand model**: stacks are curated kits with bonus value (bac water, syringes, protocol guides, replacement guarantees, COA QR lookup). The `perceivedStackValue` field on each stack ($494 for healing) reflects marketing-claimed total worth.

**Audit finding flagged for product-strategy review:** A skeptical buyer who computes items-at-sale will see the stack costs more. Two paths to resolve:
1. Reprice stacks down so itemized + bonuses ≤ stack price (real savings)
2. Tighten copy: never claim "save vs itemized" — only frame as "curated kit + bonuses + protocol"

Until decided: do NOT add "save vs itemized" framing to any stack PDP. Use "curated research kit" / "co-formulated for protocol X" framing only.

**Discount stacking order** (`lib/pricing.ts` + `lib/preorder-derive.ts`):
1. Stack-tier discount (3+ unique non-accessory vials → stackFloor pricing)
2. Coupon (% off post-stack subtotal)
3. Gift card (clamped to remaining balance + remaining due)
4. Rail discount (-8% crypto only, on post-everything-else)
5. Shipping (free at $200+ post-discount, else $18 flat)

**Hard rule:** Server-side recompute via `deriveOrderTotals()` in `/api/preorder` — client subtotal/total fields NEVER trusted. Discrepancy >$1 = 409.

## Provisional / TBD

- Custom display typeface — current site uses `next/font` choice; capture exact font name once verified
- Brand mark / logo SVG — not yet centralized in design suite (still lives in components/brand/)
