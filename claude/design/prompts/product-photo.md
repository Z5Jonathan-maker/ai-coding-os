# Prompt — Product photography

For pharmaceutical / research-grade vial + carton renders. Tool: `cc-image` (gpt-image-2) via `~/dotfiles/bin/cc-image`.

## Master template

```
Pharmaceutical research vial photography. {PRODUCT_NAME} {DOSE} ({CAS_OR_COMPOUND}).
Single {VIAL_TYPE — clear glass / amber glass} vial, lyophilized white powder visible inside,
crimp-sealed with {CAP_COLOR — silver / blue / red} flip-off cap.
Label: {BRAND_NAME} in custom serif display, compound name in clean sans, dose prominent,
batch ID in monospace tabular figures, "Research use only" disclaimer in 6pt regular.

Composition: 3/4 view, 15-25° tilt, label fully legible. Vial centered with 30% negative space.
Lighting: soft directional from upper-left, gentle rim light from right, no harsh specular hotspot,
shadow falls 4 o'clock at 0.4 opacity onto neutral surface.
Background: {BACKDROP — paper #FAFAFA / charcoal #18181B / lab counter neutral}.

Shot like real product photography for a precision instrument company —
think teenage.engineering catalog or augen.pro hardware shots.
Hyperreal. Print-quality. 300DPI minimum.
NOT mockup, NOT 3D render aesthetic, NOT illustration, NOT SVG silhouette.

Negative: no cartoon, no neon, no gradient backgrounds, no floating product, no glow effects,
no emoji, no hands holding, no model on label, no purple/violet, no Stripe-related imagery.
```

## Slot fillers

- `{PRODUCT_NAME}`: e.g. "BPC-157"
- `{DOSE}`: e.g. "10mg"
- `{CAS_OR_COMPOUND}`: from `lib/research-data.ts` cas field
- `{VIAL_TYPE}`: clear (default for Aurex) | amber (light-sensitive compounds)
- `{CAP_COLOR}`: silver (default) | blue (peptide growth) | red (research signal compounds)
- `{BRAND_NAME}`: "Aurex" or whatever brand the asset is for
- `{BACKDROP}`: paper (default catalog) | charcoal (hero / dramatic) | lab counter (lifestyle)

## Aurex defaults

```
Pharmaceutical research vial photography. {PRODUCT_NAME} {DOSE} (CAS {CAS}).
Single clear glass vial, lyophilized white powder visible inside, crimp-sealed with silver flip-off cap.
Label: "Aurex" in serif display, compound name in clean sans, dose prominent, batch ID monospace,
"For research use only — not for human use" in 6pt.

3/4 view, 18° tilt, label fully legible, 30% negative space.
Soft directional light upper-left, gentle right rim, shadow 4 o'clock 0.4 opacity.
Background: paper #FAFAFA seamless.

Style: teenage.engineering catalog precision. Print-quality 300DPI.
NOT mockup, NOT 3D render, NOT illustration, NOT silhouette.

Negative: no cartoon, no gradient, no glow, no emoji, no hands, no purple/violet,
no patient imagery, no medical claims, no Stripe imagery.
```

## Iteration tips

- If output looks "too 3D-rendery": add "shot on Phase One IQ4, 80mm macro, f/8" to the front
- If label looks fake: add "label is professionally printed paper wrap with subtle embossing"
- If light is flat: specify "key light at 45° upper-left, fill at -2 stops, rim from camera-right"
- If background drifts: lock it: "seamless backdrop, no horizon line, no surface texture"
- If shape is wrong: include vial dimensions in mm ("standard 2mL serum vial, 20mm cap")

## Variants to generate

- Hero shot (3/4 view, dramatic charcoal backdrop, single vial)
- Catalog shot (straight-on, paper backdrop, single vial — for /products/<slug> page)
- Detail shot (extreme close-up of label area, depth-of-field collapsed)
- Tilted shot (already exists at `public/products/<slug>-tilted.png` — match aesthetic)
- Vial-only no-context (already exists at `public/products/<slug>-vial.{jpg,png}`)

## Save path

```bash
cc-image -o ~/code/projects/aurex/public/products/<slug>-<variant>.png \
  -s 2048x2048 \
  "<prompt>"
```

Then optimize:
```bash
cd ~/code/projects/aurex && npm run images:optimize
```

## When to NOT use this prompt

- User wants packaging mockup (carton, outer box) → use [box-packaging.md](box-packaging.md)
- User wants label-only (printable PDF) → use [vial-label.md](vial-label.md)
- User wants social post composition (vial + headline + CTA) → use [social-post.md](social-post.md), reference an existing vial photo, don't re-render
