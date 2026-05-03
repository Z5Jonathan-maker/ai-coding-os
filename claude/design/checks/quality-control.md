# Quality Control Engine

Every design output must pass this checklist before delivery. Score each axis 0-10. Composite ≥ 95% to ship; ≥ 98% for print-bound assets.

## Scoring rubric (8 axes × 10 points = 80 max → normalize to %)

### 1. Brand consistency (10pts)
- Palette: only tokens from `brands/<brand>.md` (-10 for any ad-hoc hex)
- Typography: matches brand display + body fonts (-3 for system fallback used as display)
- Voice: matches brand tone register (-2 for hype words on a clinical brand)
- Logo usage: correct version, correct clear-space (-2 for distortion or wrong reverse)

### 2. Visual hierarchy (10pts)
- Single primary action per view (-3 for two competing CTAs)
- Type scale clear: display > heading > body > caption (-2 for ambiguous middle layer)
- Reading order matches importance (-2 for buried hero)
- Whitespace separates sections (-3 for crammed)

### 3. Premium feel (10pts)
- No AI-slop signatures: no purple gradient, no emoji icons, no SVG human faces (-3 each)
- Restraint: minimum effective dose of color/effects (-2 for overdone)
- Typography has character (not Inter/Roboto/Arial as display) (-3)
- Photography is real, not mockup-y SVG silhouettes (-2)

### 4. Readability (10pts)
- Body contrast ≥ 4.5:1 (-3 if below)
- Large text contrast ≥ 3:1 (-2 if below)
- Line-height ≥ 1.5 for body (-2 if below)
- Line length 65-75ch desktop, 35-60ch mobile (-3 for edge-to-edge paragraphs)

### 5. Conversion power (commercial only, 10pts)
- Single CTA, action-verb starts copy (-3)
- Trust elements visible (badges, guarantees, social proof) (-2 each missing for the brand's load-bearing trust signals)
- Friction-free: hero answers "what, why, what now" in 5 seconds (-3)
- Compliance copy doesn't undercut conversion (e.g. RUO disclaimer placement) (-2)

### 6. Platform fit (10pts)
- Dimensions match destination spec exactly (-5 for wrong aspect)
- Safe zones respected (Instagram 5%, Stories center band) (-2)
- Thumbnail readability at 25% scale (-2)
- File format/codec matches platform (PNG vs JPG vs MP4 vs SVG) (-1)

### 7. Print/export readiness (print-bound only, 10pts)
- Color space CMYK (or device link if specified) (-3 for RGB-only)
- DPI ≥ 300 at final size (-3 if below)
- Bleed 3mm where required (-2 if missing)
- Crop marks present on press-ready PDF (-1)
- Vector elements stay vector (no raster of logo at >100% scale) (-1)

### 8. Non-AI appearance (10pts)
- No melting text, warped faces, extra fingers, glitched logos (-5 for any)
- Shadows physically plausible (light source consistent) (-2)
- No emoji-substitute icons (-2)
- No "AI render" telltales (overly soft glow, perfect symmetry where humans don't expect it) (-1)

## Scoring decision

- **≥ 95%** (76/80) → ship, log to `winning-patterns.md`
- **90-94%** → revise the 1-2 lowest-scoring axes, re-score
- **< 90%** → restart from prompt; this output is not redeemable

## Print-bound override

For label / box / print-collateral: **threshold = 98% (78/80)**. Print mistakes are unrecoverable.

## Anti-patterns (instant fail regardless of score)

- Any therapeutic / dosage / "human use" copy on Aurex assets (compliance violation)
- Any Stripe-related imagery on Aurex (banned vendor)
- Patient photography on RUO assets
- Generic Canva templates with the corner watermark visible
- Stock photo "lab guy with beaker" energy

## Self-improvement after every score

If a deliverable scores < 95%:
1. Note which axis dropped points → write to `logs/anti-patterns.md`
2. Note the prompt change that fixed it → write to `logs/prompt-iterations.md`
3. If a brand rule was violated → update `brands/<brand>.md` to make the rule explicit
