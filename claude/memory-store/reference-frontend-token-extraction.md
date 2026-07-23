---
name: reference-frontend-token-extraction
description: "Extract a reference app's design system from its PUBLIC CSS as code (tokens/fonts/scales) instead of screenshot-cloning; harness recipe for bot-walled sites"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a3b3f726-65ae-4dca-bcb1-3326d99aa5c8
---

**Inspect competitor UI/UX as code, not by screenshot.** Reference apps ship
their whole design system in the CSS a browser downloads — token values, fonts,
spacing/type scales, radii, shadows. Read those public static assets directly.
Only public front-end assets; NOT authenticated product APIs (those hold data,
not UI, and need an account).

Tool: `stewardship-app/scripts/ref-extract.mjs <url> --out dir` — no deps, mines
custom-property tokens + fonts + top colors + radii + shadows + spacing to JSON.

**Where the gold is:** the app SPA (`app.*` subdomain), NOT the marketing site.
Token-driven React builds expose the full system; WordPress marketing sites
expose only Gutenberg `--wp--*` defaults (real brand = color frequency + font).

**Reachability pattern:** CDN-hosted CSS (`static.*`) usually serves 200 to plain
curl even when the HTML page 403s. When the whole origin is Cloudflare/Vercel
bot-walled, use `browser-harness` (real Chrome, needs one-time "Allow" on
chrome://inspect): load page → `fetch()` stylesheets INSIDE page context (carries
cf_clearance) → mine tokens in-browser → return compact JSON.

**Findings captured 2026-07-17** (docs/design/refs/): Monarch = Create-React-App
on **Radix Colors** + semantic layer; brand orange-9 #ff692d; fonts Graphik/DM
Sans + Copernicus serif + Meslo mono; spacing 4/8/12/14/16/20/24/32/48/64; type
caps at weight 600, 150% line-height; card radius 12px. **UniFi's neutrals already
match Monarch exactly** (gray-12 #22201d=evergreen-900, gray-2 #f6f5f3=cream-50,
shadow 0 2px 4px). SoFi = blue-money (#201747/#3860be) + green accent (#68b631),
Larsseit type — independent validation of UniFi's blue/leaf "blue is money, green
is giving" split.

Related: [[project-unifi-aplus-brand-pass]], [[project-unifi-monarch-clone]]
