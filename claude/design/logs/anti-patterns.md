# Anti-Patterns

Append-only. Designs that scored < 95% OR violated brand rules in production. Future sessions check this BEFORE picking a direction.

## Format

```
## YYYY-MM-DD · <one-line title> · <brand>
- **Type:** <web section / social / etc.>
- **What failed:** <which axis dropped points, or what got rejected>
- **Why it failed:** <root cause>
- **What to do instead:** <correction>
```

---

## 2026-04-XX · CSS-silhouette product render in launch animation · DJI (illustrative cross-brand lesson)

- **Type:** Animation / motion graphic
- **What failed:** Generic-looking "tech animation" — black background + orange accent + CSS-drawn product silhouette. Could have been any tech product. No brand identity.
- **Why it failed:** Used CSS rectangles to "draw" the product instead of finding/generating the real product photo. Result is what huashu-design calls AI slop — visually plausible but identity-less.
- **What to do instead:** ALWAYS find the real product image (official press kit, product page hero, launch video frames) before designing around it. If unavailable, generate via cc-image with the official reference as input. NEVER use CSS/SVG silhouettes for real products.

## 2026-04-XX · Generic carousel template (Canva-default look) · (illustrative)

- **Type:** Social carousel
- **What failed:** Used Canva-style rounded cards with left-border accent + emoji icons. Composite scored 78% (low premium-feel + low non-AI score).
- **Why it failed:** Three AI-slop signatures stacked: rounded-card-with-border (Material 2020-2024 pattern), emoji as functional icon, no typographic personality.
- **What to do instead:** Use brand display typeface as the design driver. One color, generous whitespace, line icons (Lucide 1.5px stroke, never emoji). If a slide doesn't have something interesting to say typographically, it doesn't earn a slot — cut it.

## 2026-05-10 · v1 Claude-draft RUO editorial page · Helion Reagents (demo)

- **Type:** Web — full editorial marketing/catalog page
- **What failed:** Five compounding SaaS tropes that pulled a clinical catalog into consumer-landing-page register: (1) h1 at 64px (marketing-scale, not catalog-scale); (2) alternating tinted section bands (`--bg-soft`) breaking the single-ground hairline rule; (3) HPLC chromatogram drawn with straight-line segments rather than Bézier curves — read as wireframe, not instrument; (4) hero tagline "Reagents that behave the same way twice" — performative pun instead of specification statement; (5) ticker status dots using `border-radius: 50%` (rounds into circles, violates ≤4px rule) plus CSS transitions on buttons and hover effects on catalog rows.
- **Why it failed:** Default LLM code-generation maps "marketing site" onto a SaaS landing page mental model. Type scale inflates for visual impact; section banding adds rhythm; transitions add "polish." All three are correct for SaaS; all three are wrong for a laboratory catalog that must read as an instrument output.
- **What to do instead:** For RUO/lab-catalog editorial tier: clamp h1 ≤42px; strip all section background fills (hairline grid is the only structural element); draw data visualizations with Bézier curves + graticule; write the hero headline as a specification claim, not a tagline; set `border-radius: 0` globally and `transition: none` globally. Add a one-line CSS reset at the top of the editorial tier template: `*, *::before, *::after { border-radius: 0 !important; transition: none !important; }` — then allow only deliberate exceptions.

## (Add new entries above this line as designs reveal failure modes in production.)
