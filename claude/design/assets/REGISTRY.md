# Asset Registry

Pointers to logos, fonts, palettes, reference images, templates, mockups. Never duplicate — always reference.

## Aurex

### Brand mark
- React component: `~/code/projects/aurex/components/brand/Logo.tsx`
- SVG export: TBD — propose extracting to `assets/aurex/logo.svg` for non-React use (print, social)
- Clear-space rule: 1× the height of the wordmark on all sides
- Reverse (light on dark): TBD — current site is light-mode dominant

### Color tokens
- Source-of-truth: `~/code/projects/aurex/app/globals.css` (CSS custom properties under `:root`)
- Documented in: [brands/aurex.md](../brands/aurex.md)

### Typography
- Loaded via: `~/code/projects/aurex/app/layout.tsx` (`next/font` imports)
- Fallback: system-ui (avoid Inter/Roboto/Arial as display)

### Product photography
- Catalog defaults: `~/code/projects/aurex/public/products/<slug>.png`
- Tilted angle: `<slug>-tilted.png`
- Close-up vial: `<slug>-vial.{jpg,png}`
- Total: 44 PNGs, top 7 are 2.5-2.7MB each (over-spec — run `npm run images:optimize`)

### Reference designs (lifted from competitor scrapes)
- `elitebiogenix.com` — premium aesthetic worth borrowing (monochromatic, dark mode)
- `truepeptidelabs.com` — DON'T copy their thin PDP, but their volume-tier table inspired ours
- `floridapeptideslab.com`, `apex-peptides.com` — already audited for catalog ideas

### Templates / Starters
- Editorial Swiss starter: `~/code/research/wassim-augen/augen-extracted/augen-clone/`
- Lib bundles (read-only reference): `~/code/research/wassim-augen/augen-extracted/website-repos/`

### Print archive
- TBD — `assets/aurex/print-archive/` will accumulate as physical assets ship

## Other brands

(Provisional folder pattern — populate as new brands enter the system)

```
brands/<brand-name>.md
assets/<brand-name>/
├── logo.svg / logo-white.svg
├── palette.json
├── fonts.txt (font names + license info)
├── reference-images/
└── print-archive/
```

## Provisional brand creation

If a design request mentions a brand that has no profile yet:
1. Search the codebase for existing tokens (globals.css, tailwind.config.*, theme.*)
2. Search for existing logo/brand components
3. Search for any DESIGN.md
4. Pull what's findable into a fresh `brands/<name>.md`
5. Mark fields as "TBD" where info isn't available
6. After delivery, refine the profile based on what worked

## Adding to the registry

When you add a new asset:
1. Move/copy to `assets/<brand>/` (or note its canonical location)
2. Add a row to this REGISTRY.md
3. If the brand has its own profile, also reference from `brands/<name>.md`
