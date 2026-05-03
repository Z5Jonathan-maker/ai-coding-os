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

## (Add new entries above this line as designs reveal failure modes in production.)
