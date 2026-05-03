# Export spec — Web

For images served by `next/image`, OG tags, hero sections, blog illustrations, etc.

## Format

- **AVIF** (preferred — best compression-to-quality)
- **WebP** (fallback, good support)
- **JPG** (legacy fallback only — `next/image` auto-serves WebP/AVIF)
- **PNG** only for transparency or pixel-art
- **SVG** for logos, icons, simple illustrations

## Dimensions

- Hero / banner: master at 2400×1200 (1.91:1) — `next/image` downscales for breakpoints
- Product photo: master at 2048×2048 — works for catalog grid (downscaled to 600×600), PDP gallery (downscaled to 1200×1200), and social re-export
- Thumbnail: 400×400 (or 600×600 if retina)
- OG tag image: 1200×630 (Twitter/Facebook/LinkedIn standard)
- Blog inline: 1600 wide × variable height

## Color space

- sRGB (Display P3 acceptable for premium product shots IF site is configured for it; check globals.css)

## Quality

- AVIF: q=60-70 visually indistinguishable from original
- WebP: q=80-85
- JPG: q=82-88
- PNG: lossless, but use only when transparency is needed

## File naming

`<slug>-<variant>.<ext>` — e.g.:
- `bpc-157-10mg.png` (catalog default)
- `bpc-157-10mg-tilted.png` (PDP angle)
- `bpc-157-10mg-vial.png` (close-up)
- `bpc-157-10mg-hero.avif` (large hero)

## Placement

For Aurex (Next.js):
- Product images: `~/code/projects/aurex/public/products/`
- Hero / brand assets: `~/code/projects/aurex/public/brand/`
- OG images: `~/code/projects/aurex/app/opengraph-image.tsx` (generated, not static)
- Logos: `~/code/projects/aurex/components/brand/`

## next/image best practices

```tsx
import Image from 'next/image'

<Image
  src="/products/bpc-157-10mg.png"
  alt="BPC-157 10mg vial — Aurex Research Series"
  width={2048}
  height={2048}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={blurPlaceholder}
/>
```

## Optimization

```bash
cd ~/code/projects/aurex && npm run images:optimize
```

Existing repo: 44 PNGs in `public/products/`, 41 over the 300KB threshold, top 7 are 2.5-2.7MB each — sharp-cli converts to AVIF/WebP automatically.

## Pre-publish checklist

- [ ] Master at largest needed dimension (don't store small assets and upscale)
- [ ] AVIF + WebP variants generated (next/image does this automatically when source is PNG/JPG)
- [ ] Alt text describes the image semantically
- [ ] sRGB color space
- [ ] File size: hero AVIF < 200KB, product AVIF < 150KB
- [ ] Aspect ratio matches the slot it fills (no implicit cropping)
- [ ] No watermark unless intentional
- [ ] No emoji as graphic element
- [ ] Aurex compliance: no patient imagery, no therapeutic implication
