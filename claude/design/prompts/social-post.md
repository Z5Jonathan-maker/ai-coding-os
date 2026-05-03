# Prompt — Social post

For Instagram, X, LinkedIn. Single-frame square or portrait. Tool: HTML+CSS render OR `cc-image` for image-led posts.

## Default specs

| Platform | Dimensions | Safe zone | File format |
|---|---|---|---|
| Instagram square | 1080×1080 | 5% all edges | JPG (low motion) / PNG (with text) |
| Instagram portrait | 1080×1350 | crops to 1080×566 in feed | JPG / PNG |
| Instagram story | 1080×1920 | center 1080×1080 | PNG |
| X (Twitter) | 1600×900 OR 1080×1080 | none | JPG / PNG |
| LinkedIn | 1200×627 (link) / 1080×1080 (post) | none | JPG / PNG |

## Two production paths

### A. HTML+CSS render (preferred for typography-led posts)

Brand-consistent, version-controlled, infinitely re-renderable. Use when the post is text-driven (announcement, quote, stat, batch release).

```html
<!DOCTYPE html>
<html><head><style>
  @import url('https://fonts.googleapis.com/css2?family={DISPLAY_FONT}&family={BODY_FONT}&display=swap');
  body { margin: 0; }
  .post {
    width: 1080px; height: 1080px;
    background: #FAFAFA; color: #09090B;
    padding: 80px;
    box-sizing: border-box;
    font-family: '{BODY_FONT}', sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .brand { font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: #71717A; }
  .headline { font-family: '{DISPLAY_FONT}', serif; font-size: 88px; line-height: 1.05;
              font-weight: 600; letter-spacing: -0.02em; max-width: 880px; }
  .body { font-size: 22px; line-height: 1.5; color: #27272A; max-width: 720px; }
  .footer { display: flex; justify-content: space-between; align-items: end;
            font-size: 14px; color: #71717A; }
  .footer .url { letter-spacing: 0.05em; }
</style></head>
<body>
  <div class="post">
    <div class="brand">{BRAND_KICKER}</div>
    <div>
      <div class="headline">{HEADLINE}</div>
      <div class="body" style="margin-top:24px">{SUPPORTING}</div>
    </div>
    <div class="footer">
      <span>{CONTEXT_TAG}</span>
      <span class="url">aurex.bio</span>
    </div>
  </div>
</body></html>
```

Render via Playwright:
```bash
npx playwright screenshot <html> <output>.png --viewport-size=1080,1080 --device-scale-factor=2
```

### B. cc-image render (for image-led posts)

Use when the visual IS the post (vial, lab equipment, abstract texture). Reference [product-photo.md](product-photo.md) for vial composition. Add the headline/CTA in HTML+CSS overlay AFTER the image is generated — DON'T let cc-image render text (it warps).

## Aurex post archetypes

### 1. Batch release announcement
- Headline: "{COMPOUND} batch released."
- Body: Lot ID + HPLC-UV % + Janoshik tested date + replacement guarantee mention
- Visual: vial photo on left half (square crop), text on right half OR overlay top-third
- CTA implicit: "aurex.bio" in footer

### 2. COA / verification highlight
- Headline: "≥99.0% purity. Verified by Janoshik."
- Body: One-line on the verification process (HPLC-UV at 214nm + ESI-MS)
- Visual: cropped chromatogram OR vial close-up
- CTA: "Lot AUR-XX-XXX-XXX · live at aurex.bio/research"

### 3. Stack-tier / catalog post
- Headline: "{Stack name}" or "Healing Stack"
- Body: 3-line list of compounds in the stack
- Visual: 3 vials clean composition
- CTA: "From $XXX · aurex.bio/stacks"

### 4. Compliance / education post (no commercial pitch)
- Headline: A scientific fact (e.g. "Lyophilization preserves peptide integrity at room temp.")
- Body: 2-line technical explanation
- Visual: macro shot of lyophilized cake OR illustrative diagram
- CTA: Subtle — just brand wordmark in corner

## Hard rules for Aurex social

- NEVER claim therapeutic effects. NEVER show a person consuming/injecting.
- NEVER use emoji as content (only as functional icon if absolutely needed)
- NEVER use stock "lab guy with beaker"
- ALWAYS tag posts with the batch ID or stack slug for downstream attribution
- ALWAYS include the disclaimer "Research use only" in story posts (compliance)

## Pre-publish QC

Run [checks/quality-control.md](../checks/quality-control.md). For social: minimum 95%. Special focus on axis 6 (Platform fit) and axis 8 (Non-AI appearance).

## After publish

Track engagement → if a post performs well (CTR > 2%, save rate > 1%), append the prompt + visual approach to `logs/winning-patterns.md` with the metrics. Future posts in that archetype get to start from this proven template.
