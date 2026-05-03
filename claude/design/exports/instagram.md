# Export spec — Instagram

| Format | Dimensions | Aspect | Safe zone | File |
|---|---|---|---|---|
| Square post | 1080×1080 | 1:1 | 5% all edges | JPG (no text) / PNG (with text) |
| Portrait post | 1080×1350 | 4:5 | crops to 1080×566 in feed | JPG / PNG |
| Landscape post | 1080×566 | 1.91:1 | none | JPG / PNG |
| Story | 1080×1920 | 9:16 | center 1080×1080 | PNG |
| Reel cover | 1080×1920 | 9:16 | center band | JPG |
| Carousel slide | 1080×1350 (preferred) | 4:5 | 5% all edges | JPG / PNG |

## Color

- sRGB color space (NOT CMYK, NOT Display P3)
- Embed sRGB profile if exporting from Photoshop / Figma

## File size limits

- JPG: < 8MB recommended
- PNG: < 8MB recommended
- Larger gets re-compressed by Instagram and degrades

## Carousel rules

- All slides same aspect ratio (use 1080×1350 for max screen real estate)
- Slide 1 is the hook — must work at 1080×1350 AND at 1080×566 thumbnail
- Slide N can be a CTA slide ("Read more at aurex.bio")
- Don't put critical info in the bottom 20% (gets covered by IG UI on some devices)

## Typography for legibility

- Headline ≥ 48px at 1080px wide (renders ≈ 18pt on phone)
- Body ≥ 22px (≈ 8pt on phone)
- Stroke contrast ≥ 4.5:1
- Letter-spacing tight on display, 0 on body, +0.05em on uppercase kickers

## Aurex-specific

- Always include "Research use only" in story posts (compliance)
- Brand mark "AUREX" in top-left or bottom-left, 14px tracking 0.18em uppercase
- aurex.bio URL in footer, never bigger than the body copy
- No CTA buttons styled as Instagram-blue (looks AI-generated). Use ink #09090B on paper #FAFAFA.

## Output checklist

- [ ] Dimensions exactly match spec
- [ ] sRGB color space
- [ ] File size < 8MB
- [ ] Thumbnail readable at 25% scale
- [ ] Safe zones respected
- [ ] Brand mark present
- [ ] No emoji as content
- [ ] No Stripe / payment imagery on Aurex
- [ ] Compliance copy present where required (RUO disclaimer in stories)
