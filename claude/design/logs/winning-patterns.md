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

## (Add new entries above this line as designs prove themselves.)
