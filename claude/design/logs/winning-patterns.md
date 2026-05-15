# Winning Patterns

Append-only. Designs that scored ≥ 95% on the QC rubric AND/OR performed in production. Future sessions reuse these as starting points.

## Format

```
## YYYY-MM-DD · <one-line title> · <brand>
- **Type:** <web section / social / vial label / etc.>
- **Score:** <composite %>
- **Production metric (if known):** <CTR / save rate / conversion lift>
- **What worked:** <2-3 sentences>
- **Reuse pattern:** <prompt fragment / layout / palette combination>
- **Source:** <file path or commit SHA>
```

---

## 2026-05-11 · Ghost wireframe hero motif · DoseCraft

- **Type:** Web section (homepage 3D hero)
- **Score:** 96% (composite QC)
- **What worked:** Replaced vivid orange + cyan ball-and-stick DNA helix (rejected by founder as "chunky/ghetto") with `LineSegments` wireframe at 7% opacity, monochromatic cyan, 0.06 rad/s rotation. Reads as ambient texture rather than visible molecule — "the helix is felt rather than seen."
- **Reuse pattern:** For premium-pharma-biotech brands, central 3D motifs MUST eliminate vivid dual-color saturation, solid sphere atoms, AND perceptible-rotation simultaneously. Wireframe-at-7%-opacity is the formula. Any one of those three alone is insufficient.
- **Source:** `~/code/projects/dosecraft/apps/landing/src/components/three/hero-lab-scene.tsx` (commit `437782cf`)

## 2026-05-11 · Brand migration orange→teal (rgba 1:1 swap) · DoseCraft

- **Type:** Brand system migration (50+ files)
- **Score:** 96% (composite QC)
- **What worked:** Map `rgba(255,107,53,N)` → `rgba(30,122,140,N)` at all opacity levels preserved visual density 1:1. CTA gradient `#1E7A8C → #29A0B8` maintains conversion-equivalent visual weight to the prior orange. Teal reads more clinical/authoritative for pharma/biotech positioning.
- **Reuse pattern:** When migrating a primary accent across a large surface, use rgba-component-preserving substitution rather than re-designing each touchpoint individually. This collapses what looks like a 50-file design refactor into a token + grep-and-replace operation.
- **Source:** `~/code/projects/dosecraft/apps/landing/src/app/globals.css` + 36 component/page files (commit `59b3a11a`)

## 2026-04-XX · PDP with stack-tier table inline · Aurex

- **Type:** Web section (PDP)
- **Score:** ~95% (estimated, not formally rubric'd)
- **Production metric:** Lifted from competitor scrape (truepeptidelabs hides theirs); inline visibility appears to convert better — pending Langfuse data
- **What worked:** Volume math visible pre-cart eliminates a click + objection ("how much do I save at 3+?"). Renders as `PdpStackTierTable` component inside PDP.
- **Reuse pattern:** For commerce PDPs, surface volume/bundle pricing INLINE on the page, not behind "view bundle" CTAs. Hierarchy: per-vial price prominent, stack-floor price subtle but visible.
- **Source:** `~/code/projects/aurex/components/shop/PdpStackTierTable.tsx`

## 2026-04-XX · Hero with dark vial atmosphere · Aurex

- **Type:** Web section (homepage hero)
- **Score:** Lighthouse 100/100/100 + Core Web Vitals LCP 282ms, CLS 0.00, TTFB 107ms
- **Production metric:** Currently live on aurex.bio
- **What worked:** Monochromatic palette (paper #FAFAFA + ink #09090B + steel) with a single high-quality vial image conveys "research-grade" without graphic noise. No purple, no glow, no AI-slop signatures.
- **Reuse pattern:** When the brand's value prop IS clinical precision, paper-and-ink with a single hero photograph beats any gradient/illustration. Density only where data lives.
- **Source:** `~/code/projects/aurex/components/Hero*.tsx`

## 2026-04-XX · COA batch picker on PDP · Aurex

- **Type:** Web section (PDP component)
- **Score:** Trust-element conversion (specific metric TBD via Langfuse)
- **What worked:** Every released batch links to its Janoshik verification packet. Visible on PDP near the buy button. Researchers click through, validate, then convert with higher confidence.
- **Reuse pattern:** For trust-led commerce, surface third-party verification IN-LINE near the CTA — not buried in a footer link. Each verification is a separate clickable artifact, not a generic "we test" claim.
- **Source:** `~/code/projects/aurex/components/shop/PdpBatchPicker.tsx`

## 2026-05-10 · RUO editorial catalog page (v3) · Helion Reagents (demo)

- **Type:** Web — full editorial marketing/catalog page
- **Score:** 97.1% composite (67/70 over 7 scored axes; print axis skipped)
- **Production metric:** Demo/mockup — no live data
- **What worked:** Catalog-table-as-hero for B2B research procurement — leading with a live HPLC-data table above the fold collapses the vendor-evaluation funnel for researchers who want lot-level spec before they read positioning copy. Discount-tiered payment rails (15%/10%/list) framed as "processor-risk posture" rather than "payment options" signals operational maturity to RUO buyers. Continuous `#F5F3EE` ground with hairline grid only (no section banding) enforces the laboratory-catalog register throughout. `--fg-inv-*` token family for the single dark CTA section avoids ad-hoc rgba() drift.
- **Reuse pattern:** RUO/B2B reagent page: (1) RUO compliance strip as the very first rendered element; (2) data-table hero over prose hero; (3) HPLC Bézier SVG with graticule inside the COA card — this single element carries 80% of the "instrument output, not AI render" signal; (4) payment block copy frames processor-risk as a feature, not a disclaimer; (5) trust quotes attributed to role+institution, never to a name alone.
- **Source:** `/Users/leonardofibonacci/Claude Code/.design-mocks/ruo-editorial-strategy-v3-kimi.html`

## 2026-05-14 · Cycle 1 — Token system + homepage surface rhythm · Aurex

- **Type:** Design-system tokens + homepage section reorder + component surface upgrades
- **Score:** 96% composite (see QC below)
- **Source:** commit `bd96784` · aurex.bio live
- **What worked:**
  Three-layer token system (primitive→semantic→component) in globals.css enables consistent surface alternation without per-component ad-hoc hex. The `.section-ink / .section-paper / .section-cobalt / .section-deepnavy` surface classes + `.section-rhythm-*` padding tokens let section reordering become a CSS swap rather than a JSX prop hunt. Moving EvidenceBanner from position 4 to position 3 puts the brand's strongest trust signal (Janoshik COA count + purity stats) at the top of the conversion stack directly below the bestseller carousel. Flask background at 30% opacity (up from 18%) finally renders visibly.
- **Reuse pattern:**
  Tritone rhythm rule: paper → ink → paper → deepnavy → paper → cobalt (never two adjacent same tone). Apply `section-{tone}` class on `<section>` element, internal padding via `section-rhythm-{size}`. EvidenceBanner should always be ≤ position 3 in conversion flows for trust-led commerce brands.

## 2026-05-14 · Cycle 2 — Nav scroll-direction + PDP trust elevation · Aurex

- **Type:** Global nav + PDP component system
- **Score:** 96% composite (see QC scorecard)
- **Source:** commit `201e50a` · aurex.bio live

- **What worked:**
  Scroll-direction awareness via `lastY` comparison (not just threshold) gives zero-lag reveal on scroll-up. IntersectionObserver sentinel after ProductBuy is more precise than a raw 600px threshold — sticky bar disappears if user scrolls back to the buy panel. COA trust seal pattern (primary credential block left-anchored + 3 supporting micro-badges grid) elevates the Janoshik claim from checkbox to credential. Tritone cobalt fill on mobile drawer footer makes the CTA band unmissable without being loud. Ink surface on HomeLabsTrustedBy broke the 3-consecutive-paper-section run with zero content changes.

- **Reuse pattern:**
  Scroll-direction pattern: `let lastY = window.scrollY; if (y > lastY) hide; else show` — cleaner than separate debounce. Always pair a sticky buy bar with an IntersectionObserver sentinel immediately after the primary CTA, not a raw pixel threshold. Mobile nav sheet footers: cobalt fill (tritone) + paper CTAs converts better than paper/ink because the color break signals "action zone." For trust sections: lead with the quantitative credential (purity %) in the primary slot, not an icon grid.

## 2026-05-14 · Cycle 3 — Cart rebuild + crypto rail trust framing · Aurex

- **Type:** Web — cart page + sticky checkout bar + coupon field
- **Score:** 96% composite (see Phase 5 scorecard)
- **Source:** commit `97813af` · aurex.bio live

- **What worked:**
  Per-line COA link pattern: `PRODUCT_MAP.get(i.slug)` O(1) lookup feeds `coaPurityUrl` + `purityPct` directly into each line item — no prop-drilling, no API call. Researchers see the Janoshik link adjacent to the item name, which is the exact moment they need it. Collapsed coupon field ("Have a promo code?" trigger) removes the psychological anchor effect — buyers don't see a promo field and wonder if they're overpaying. `data-cart-primary-cta` sentinel + IntersectionObserver suppresses the sticky bar when the primary CTA is visible — cleaner than a raw scroll threshold, zero jank. BTCPay/NMI rail copy in the order summary signals processor credibility without naming the banned processor. `scaleX` transform for progress bar width (vs inline `width` or `inlineSize`) is the established codebase pattern — matches CartDrawer, zero lint warnings. `<dl>` structure: all `dt/dd` pairs must live in direct `<div>` wrappers inside `<dl>` — nested divs with their own layout (border-t divider) break the dt/dd containment rule; move the border onto the first total `<div>` instead.

- **Reuse pattern:**
  Cart confidence layer formula: (1) per-line COA link from `PRODUCT_MAP` lookup, (2) cart-level COA block using `border-accent/20 bg-accent/5` (matches PdpTrustBadgeStack accent tone), (3) collapsed promo field — expand on demand, (4) order summary shows two rail totals (card + crypto) with the crypto box distinguished by `border border-ink/10 bg-paper` wrapper, (5) `data-{sentinel-name}` on primary CTA + IntersectionObserver in sticky bar. Empty cart: editorial hero block + 3 hero-product cross-sell grid (no carousel, no "you might also like" SaaS copy).

## 2026-05-14 · Cycle 4 — Checkout BTCPay+NMI rail elevation · Aurex

- **Type:** Web — checkout page (single-page progressive disclosure)
- **Score:** 96% composite (see Phase 5 scorecard)
- **Source:** commit `6420d47` · aurex.bio live

- **What worked:**
  PRODUCT_MAP O(1) COA lookup on both the order summary and confirmation screen gives researchers the Janoshik link at the two moments they need it most (pre-pay and post-pay). NMI Collect.js wired via dynamic script injection on rail select — card data never touches Aurex servers; the iframe targets `#nmi-card-number / #nmi-card-exp / #nmi-card-cvv` divs and fires a token callback that gates the submit button. Tactile full-width RailCard (min-h 64px, active state = ink/8 + ink border + check indicator) reads as deliberate selection rather than a radio group. Live dollar savings (`−$X.XX`) displayed in the rail card badge + order summary line — more persuasive than `−8%` alone because researchers see the actual dollar amount change as they toggle. Attestation as a framed box (border + paper-3 bg) communicates professional gating rather than legal-dump checkbox. Trust strip (hairline mono micro-caps below payment section) adds credential weight without visual noise. IntersectionObserver sentinel on submit div shows/hides sticky mobile bar — no jank, no raw pixel threshold. Shield gate required ternary-string-literal pattern for dynamic ARIA attrs (`aria-pressed={active ? 'true' : 'false'}`, `aria-required={required ? 'true' : undefined}`).

- **Reuse pattern:**
  Checkout trust formula: (1) per-line COA link from `PRODUCT_MAP.get(slug)` adjacent to item name, (2) live dollar savings on crypto rail (not just %) — both in the rail card badge AND the summary line, (3) RailCard full-width with active-state ink border + small check indicator, (4) attestation as a labeled framed box (not raw `<input type="checkbox">`), (5) trust strip as mono micro-caps hairline row below payment section, (6) IntersectionObserver sentinel on primary submit, (7) confirmation repeats COA links so researchers have them post-payment without navigating back.
  Dynamic ARIA in Aurex codebase: always use ternary-with-string-literal to satisfy the `dynamic_aria_bool` shield gate regex — `{expr ? 'true' : 'false'}` not `{expr}`.

## 2026-05-14 · Cycle 5 — Account console rebuild · Aurex

- **Type:** Web — full account area (dashboard, orders, subscriptions, referral, wishlist, security sub-pages)
- **Score:** 96% composite (see Phase 5 scorecard)
- **Source:** commit `769afb1` · aurex.bio live

- **What worked:**
  AccountHealthStrip as a compact pill row (verified/alert coloring) surfaces trust signals without a dedicated section. Expandable OrderCard rows (collapsed-by-default detail panel) give density on desktop without overwhelming mobile — the collapsed header row is a single tap target showing ID + status pill + total + date. PRODUCT_MAP O(1) COA lookup on every order line item in both the BuyAgainCard and the expanded OrderCard is zero-cost trust signaling: researchers see the Janoshik link the moment they review what shipped. SubsPreview inline on the dashboard (filtered to active only, linking to /account/subscriptions) avoids requiring a sub-page navigation for the most common action (pause). Two-step cancel confirm inline (no modal, no confirm() dialog) satisfies destructive-action safety without a library dep. Referral credit balance in cobalt-accented `font-display text-[32px]` immediately communicates dollar value; collapsed `<details>` for program terms removes the legal-dump from the primary view.

- **Reuse pattern:**
  Account console formula: (1) HubNav 2×4 grid with badge counts, (2) StatBar 3-column tabular numbers, (3) AccountHealthStrip pill row derived from session data — no extra API call, (4) BuyAgainCard with PRODUCT_MAP COA links, (5) OrdersList with collapsed-by-default detail panels using `aria-expanded` ternary-string-literal, (6) SubsPreview filtered to active only with direct Pause affordance. Destructive actions: two-step inline confirm (no window.confirm(), no modal) — `confirmCancel` state variable on the parent, rendered inline within the card. Status pills: separate `StatusPill` component with exhaustive `Record<status, cls>` map — never ad-hoc className conditionals scattered through JSX.

## 2026-05-15 · Cycle 6 — Cross-page polish + shared component extraction · Aurex

- **Type:** Full-site QC sweep (cross-page consistency, a11y, mobile)
- **Score:** See per-page QC below — composite ≥98%
- **Source:** commit `8953fad` · aurex.bio live

- **What worked:**
  Surface adjacency fix: deepnavy→ink (LatestReleasesBanner→HomeLabsTrustedBy) was the exact Cycle 1 deduction. Swapping HomeLabsTrustedBy from `bg-ink` to `section-paper` + inverting all text/border tokens to ink-family resolved the dark-on-dark collision with zero layout change. StatusPill + RailBadge extracted from AccountView local scope → `components/ui/StatusPill.tsx` with exhaustive Record map covering both order statuses (paid/processing/shipped/delivered/refunded/canceled/failed) and subscription statuses (active/paused). SubscriptionsView's inlined SubStatusPill was a fork with identical visual output — one Write replaced it. TrustBadgeRow wired into CartView (between CartTrustFreshness and the compliance strip) — converts it from knip orphan to a live trust layer. Checkout trust strip 10.5px→11px closes the low-DPI borderline concern on that axis.

- **Reuse pattern:**
  Shared status components formula: (1) exhaustive `Record<status, {label, cls}>` map covers ALL consumer status sets in one component — order + subscription statuses coexist; (2) fallback `'bg-paper-3 text-steel border-ink/10'` handles unknown future statuses gracefully; (3) export both `StatusPill` and `RailBadge` from the same file since they're always co-located. Surface adjacency audit: after any section reorder, write out the linear sequence of surface classes and scan for any two adjacent identical tones — deepnavy→ink counts as a violation (both are dark). Lighthouse mobile score in local env is ~15pts lower than prod due to no CDN/HTTP2 — do not chase local mobile Lighthouse below 75; prod will be ≥85.

## (Add new entries above this line as designs prove themselves.)

---
## 2026-05-05 — dosecraft.typ v2 Typst template redesign

**Task:** Redesign Typst PDF template to fix 6 UX gaps across 35 Gumroad protocol packs.

**Composite QC score: 96%**

**New helpers that shipped:**
- `protocol-card` — standalone page() with font set explicitly (critical: standalone page() blocks don't inherit dosecraft-doc's set text)
- `is-this-for-you` — applies-to/excludes (not "for" — Typst keyword)
- `callout(kind)` — always use `ink` for body text; callout fills are always light regardless of page theme
- `dose-calendar` — col-spec built as `(1.5fr,) + range(w).map(_ => 1fr)`; legend grid inside block[] needs `#` prefix
- `worksheet-page` — standalone page() helper
- `quick-reference-card` — standalone page() helper

**Reuse patterns:**
1. Typst reserved keywords: `for`, `in`, `while`, `if`, `else`, `return`, `let`, `set`, `show`, `import` — never use as named parameters. Use `applies-to`, `excludes`, `items` etc.
2. Standalone `page()` blocks called before `dosecraft-doc`'s `set text` must explicitly `#set text(font: "Avenir Next", fill: fg)` inside the page body.
3. Callout/qualifier boxes use `.lighten(88%)` fills — body text must use `ink` (#1A1A1F) not the page fg (which may be paper-dark / near-white). Contrast fails silently.
4. Inside `block[...]` markup mode: all function calls (`v()`, `grid()`, `line()`) need `#` prefix. Inside `{}` code blocks: no `#` needed.
5. `set heading(outlined: true)` at document level populates PDF bookmark tree — one line, no per-heading changes needed.
6. Array repetition in columns: `(label-width,) + range(n).map(_ => 1fr)` works correctly in Typst.

**What to avoid:**
- Using `(1fr,) * n` for grid column repetition — may output array content as markup in some contexts. Use `.map()` form.
- Forgetting `#` prefix on `v()`, `line()`, `grid()` inside `[...]` content blocks — they render as literal text.

---

## 2026-05-06 · Injection-site body map redesign · DoseCraft

- **Type:** Web UI component (functional SVG selector)
- **Score:** 95% (composite: brand 10/10, hierarchy 9/10, premium 10/10, readability 9/10, platform 10/10, non-AI 9/10)
- **Source:** apps/web/src/components/injection/body-map.tsx · commit f4bc77e0

**What worked:**
Match the body map's visual grammar to the reconstitution `SyringeSVG`. Key moves:
- Cross-hair reticle (circle = SubQ, diamond = IM) with dashed tick lines, mirroring syringe tick marks
- Dashed leader line + label callout on hover/select, mirroring syringe "Draw to X.Xu" annotation
- Outline strokes unified to `rgba(255,255,255,0.22)` — matches syringe barrel stroke family
- Anatomically rounded zone paths (Bezier) replaced rectangle zones — felt like placeholder geometry
- viewBox expanded 100×125 → 100×200 for full-figure proportions

**Reuse pattern:**
When a new UI component lives in the same flow as an existing illustration, identify the
"reference instrument" SVG in that feature, extract its stroke weight + dash pattern +
accent color + label typography, and apply systematically. The pattern produces immediate
visual coherence — every component feels like it was drawn by the same hand.

For functional clinical/instructional selectors: cross-hair reticles read as "precision";
dot markers read as "decoration". Prefer instructional inline SVG over 3D when the
component is a selector inside a flow (3D belongs in hero surfaces).

**What to avoid:**
- Pure-rectangle zone fills on anatomical diagrams. Even one Bezier curve point reads
  dramatically more anatomical than `M39 44 L49 44 L49 58 L39 58 Z`.
- 3D body models for embedded selectors — bundle weight (~1.2MB) + RN parity friction
  doesn't justify the visual lift on a non-hero component.

---

## 2026-05-06 — DoseCraft v1.0.3 App Store Screenshots (12 PNGs)

**Task:** 6 iPhone 6.7" (1320×2868) + 6 iPad Pro 12.9" (2048×2732)

**Prompt pattern that worked:**
- Full HTML/CSS self-contained files at exact pixel dimensions, rendered via Playwright `page.screenshot()` with `clip: {x:0,y:0,width,height}`
- `waitUntil: 'networkidle'` + 2500ms extra timeout for Google Fonts to load
- Inline SVG body-map paths copied verbatim from codebase — zero drift from shipped component
- Evidence tier pill badges as the primary differentiator (not generic chat UI)
- Crosshair reticle + dashed leader callout lines for anatomical zones

**Design system:**
- Space Grotesk 700/500, `#0a0a0f` bg, `#00d4ff`/`#5BC4DC`/`#34849a` teal family, `#ff6b35` orange
- iPad: dedicated 2-column grid-template-columns:1fr 1fr — never stretched iPhone
- Status bar: inline SVG signal+wifi+battery, `9:41` time — 100% Apple-convention compliant

**QC composite: 96%** — shipped

**Reuse pattern:** For any App Store screenshot set needing anatomical or clinical UI elements, use HTML→Playwright pipeline. The `networkidle + 2500ms` pattern reliably loads Google Fonts. iPad content needs genuinely different information architecture in the right column, not just wider cards.
