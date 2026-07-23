---
name: reference-tailwind-v4-theme-inline-dark-mode
description: "Tailwind v4 gotcha — semantic tokens referencing runtime-flipped CSS vars must be `@theme inline`, or dark mode silently renders light values"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 30d30640-e9d6-47cc-9733-84ca2af078f8
---

Tailwind v4 CSS-first: a plain `@theme { --color-card: hsl(var(--card)); }` emits the token on `:root`, where CSS custom-property substitution resolves `var(--card)` immediately against `:root`'s (light) value. Descendants inherit the baked literal, so `.dark { --card: … }` overrides flip variables nothing reads — dark mode silently renders light surfaces under flipped ink (illegible half-state), while `.dark .bg-x` literal remaps still work, producing a confusing mix.

**Fix:** put semantic tokens that reference runtime-flipped vars in `@theme inline { … }` — utilities then carry `hsl(var(--card))` themselves and resolve per-element, seeing `.dark` ancestors. Keep static scales/shadows/fonts in a plain `@theme`.

Diagnosis tell: `getComputedStyle(darkEl).getPropertyValue('--card')` shows the flipped value while `--color-card` shows a light literal. Hit on UniFi (stewardship-app) 2026-07-04, cycle 71.

Related: [[project-unifi-monarch-clone]]
