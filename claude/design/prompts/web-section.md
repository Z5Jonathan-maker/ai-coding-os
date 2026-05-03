# Prompt — Web section / landing page

For HTML/CSS mockup output via the `design` skill. Self-contained, browser-previewable, anchored to brand tokens.

## Pre-flight

1. Read `~/code/projects/<project>/DESIGN.md` if it exists — that's the source of truth
2. Read `brands/<brand>.md` from this suite — brand memory layer
3. Read existing components at `~/code/projects/<project>/components/` — match aesthetic, don't reinvent

## Master prompt template (handed to the `design` skill)

```
Design a {SECTION_TYPE — hero / feature row / testimonial band / pricing / FAQ / CTA / footer}
for {BRAND_NAME} using their existing token system from globals.css and DESIGN.md.

Brand voice: {VOICE_DESCRIPTOR — calm authority / playful confidence / etc.}
Target audience: {AUDIENCE}
Conversion goal: {GOAL — book demo / start trial / view catalog / read research / etc.}

Layout direction: {LAYOUT_KEYWORD — Swiss editorial / asymmetric grid /
                  centered hero / split 60-40 / bento grid / single-column long-form}
Density: {DENSITY — generous whitespace / mid / data-dense}

Hard requirements:
- Use ONLY tokens from {project}/app/globals.css (paper, paper-2, ink, ink-2, steel)
- Display typography matches {project}/app/layout.tsx next/font choice
- Spacing on 4/8pt rhythm
- Single primary CTA per section
- 4.5:1 body contrast minimum
- Mobile-first: design at 375px FIRST, then scale up to 768/1024/1440
- {BRAND_SPECIFIC_RULES — for Aurex: no purple, no emoji as icons, RUO compliance copy}

Output: single self-contained HTML file with inline <style>. Inline SVG icons (Lucide-style line, 1.5px stroke). Include a screenshot via chrome-devtools MCP at 375 / 768 / 1440 viewports.
```

## Section archetypes

### Hero
- One headline (1 sentence, 36-72pt)
- One supporting line (1-2 sentences, 18-22pt)
- One CTA (button), one secondary action (text link)
- One visual (hero image, product render, or typographic-only)
- NO carousel, NO multi-CTA grid

### Feature row
- 3 columns desktop / 1 column mobile
- Per column: icon (line, 1.5px stroke) + label + 1-2 sentence description
- NO emoji, NO heavy shadows on icons

### Pricing
- Cards in a row (max 3-4)
- Highlight one plan (subtle ring, not heavy gradient)
- Show price prominently (tabular figures!), per-period subtext
- List features with line-icon checkmarks
- Single CTA per card

### Testimonial band
- Real quote, real attribution (or stage-name)
- Person photo OR brand logo (not both)
- Number/metric callout if available

### CTA section
- Single big headline
- Single button
- Optional one-line below the button (trust element)
- NO form on the CTA section unless the conversion goal IS the form

### Footer
- Sitemap (4 columns: Catalog / Stacks / Research / Company)
- Legal small-print: company name, address (if shipping), compliance disclaimer
- Newsletter signup OR none (don't put it everywhere)

## After delivery

The `design` skill already saves to `./.design-mocks/<slug>.html` and runs `chrome-devtools` lighthouse. Take the output and:

1. Score against [checks/quality-control.md](../checks/quality-control.md)
2. If ≥ 95%: log to `logs/winning-patterns.md` with the prompt + screenshot + lighthouse score
3. If < 95%: revise the lowest axis, re-render, re-score
4. If user approves, hand off to `ui-styling` skill for shadcn/Tailwind implementation
