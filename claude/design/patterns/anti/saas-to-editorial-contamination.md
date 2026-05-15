---
pattern: SaaS-to-editorial contamination vectors
surfaced: 2026-05-10
context: RUO peptide editorial-tier polish (Helion Reagents v1 → v2)
---

# Five SaaS contamination vectors that creep into editorial-tier work

When generating editorial-tier (augen.pro / teenage.engineering / Sigma-Aldrich lineage) the LLM's default polish reflex pulls toward SaaS conventions. Watch for these specifically — every one was present in v1 and required KIMI to flag.

## The five vectors

1. **Inflated type scale.** h1 at 64px, body at 15px, mono at 12px. Editorial silhouette wants sub-50px h1, 14px body, 11px mono. Density should come from information, not font size.
2. **Tinted section bands.** `--bg-soft` alternation (`#EFEDE6` between sections) is a SaaS rhythm device. It breaks the hairline-grid integrity. Strip; use 1px borders alone on a continuous ground.
3. **Straight-line SVG traces.** A wireframe-looking chromatogram immediately reads as schematic / fake. Editorial demands cubic Bézier curves and faint graticule.
4. **Tagline-style hero copy.** "Reagents that behave the same way twice" is consumer-marketing wordplay. Editorial buyers want literal spec alignment ("Reference compounds, *verified* per lot"), not puns.
5. **Covert interactive flourishes.** Circular ticker dots (`border-radius: 50%`), 0.15s color transitions on hover, hover states on rows/cards, 5-column footer sitemap. Each one is small but they compound.

## Defensive reset

Add this to the top of any editorial-tier template stylesheet, then add deliberate exceptions:

```css
* {
  border-radius: 0 !important;
  transition: none !important;
}
```

This blocks the LLM's default "polish = smooth corners + transitions" reflex at the CSS layer. Anything that needs a radius or transition has to be added back consciously, which makes the SaaS reflex visible and reviewable.

## Why this anti-pattern matters

Editorial tier is fragile under iteration. Each polish pass tends to drift back toward SaaS unless an explicit rubric pulls the other way. The five vectors above are the load-bearing checks for a polish pass; if any one is present, the document has lost editorial integrity.
