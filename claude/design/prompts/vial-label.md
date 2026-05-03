# Prompt — Vial label (print-ready)

For peptide vial labels. Output is a print-ready PDF or PNG at exact dieline dimensions, NOT a styled photo of a vial.

## Output spec (Aurex default)

- Dimensions: **60mm × 30mm** (wraps a 2mL serum vial, leaves 2mm gap at seam)
- Bleed: 1mm all sides
- DPI: 300 minimum
- Color: 4-color process (CMYK), no spot
- File format: PDF/X-1a for press, PNG fallback for digital proofs
- Fonts: outlined (no live text in PDF)

## Required label content (regulatory + brand)

1. **Brand mark:** "Aurex" wordmark, top-left, 6pt clear-space below
2. **Compound name + dose:** primary visual element, e.g. "BPC-157 · 10mg"
3. **CAS number** (if applicable): e.g. "CAS 137525-51-0"
4. **Batch ID:** monospace, tabular, e.g. "AUR-26Q2-BPC-001"
5. **Test date:** e.g. "Tested 2026-04-15"
6. **Disclaimer:** "For research use only. Not for human or veterinary use." — 5pt regular, can wrap to 2 lines
7. **Storage:** "Store at -20°C lyophilized" or compound-specific
8. **Manufacturer:** "DoseCraft LLC · aurex.bio" — 5pt
9. **QR code** (optional): 8mm square, links to `/research/batch/<id>`

## Layout grid

Wrap the 60×30mm rectangle into 4 zones:

```
+-----------------------------------------+
| AUREX                          [QR]    |
|                                         |
| BPC-157  ·  10mg                       |
| CAS 137525-51-0                        |
|                                         |
| Batch AUR-26Q2-BPC-001 · 2026-04-15    |
| Store at -20°C lyophilized              |
|                                         |
| Research use only. Not for human use.  |
| DoseCraft LLC · aurex.bio              |
+-----------------------------------------+
```

## Generation approach

This is NOT a `cc-image` task. cc-image cannot reliably produce print-grade typography at small sizes. Instead:

1. **Build in Figma** — use the dieline template (TBD: store at `templates/aurex-vial-label.fig`)
2. **OR generate with HTML+CSS** — A4 PDF via Playwright print-to-pdf, then crop to dieline

### HTML+CSS skeleton (reusable)

```html
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  @page { size: 60mm 30mm; margin: 0; }
  body { margin: 0; font-family: 'Söhne', 'Inter Tight', sans-serif; }
  .label { width: 60mm; height: 30mm; padding: 2mm; box-sizing: border-box;
           color: #09090B; background: #FAFAFA; position: relative; }
  .brand { font-weight: 700; font-size: 7pt; letter-spacing: 0.05em; }
  .compound { font-weight: 600; font-size: 12pt; margin-top: 1mm; }
  .cas { font-size: 5.5pt; color: #71717A; }
  .batch { font-family: 'JetBrains Mono', monospace; font-size: 6pt;
           margin-top: 1.5mm; letter-spacing: -0.01em; }
  .storage { font-size: 5.5pt; color: #27272A; }
  .disclaimer { position: absolute; bottom: 2mm; left: 2mm; right: 10mm;
                font-size: 4.5pt; line-height: 1.3; color: #27272A; }
  .footer { font-size: 4.5pt; color: #71717A; margin-top: 0.5mm; }
  .qr { position: absolute; top: 2mm; right: 2mm; width: 8mm; height: 8mm; }
</style></head>
<body>
  <div class="label">
    <div class="brand">AUREX</div>
    <img class="qr" src="qr-{batch_id}.png" />
    <div class="compound">{COMPOUND} · {DOSE}</div>
    <div class="cas">CAS {CAS}</div>
    <div class="batch">Batch {BATCH_ID} · Tested {TEST_DATE}</div>
    <div class="storage">{STORAGE_INSTRUCTION}</div>
    <div class="disclaimer">
      For research use only. Not for human or veterinary use.
      <div class="footer">DoseCraft LLC · aurex.bio</div>
    </div>
  </div>
</body></html>
```

Render to PDF:
```bash
npx playwright pdf <html-file> <output-pdf> --margin=0 --print-background
```

## Pre-print QC checklist (98% threshold required for print)

- [ ] All text outlined (Figma: Outline Strokes; HTML+CSS: render to PDF then verify in Acrobat → Text Recognition tab is blank)
- [ ] CMYK only (no RGB elements; Acrobat Output Preview)
- [ ] 300DPI verified at 60×30mm output size
- [ ] Bleed extends 1mm beyond trim on each side
- [ ] Disclaimer reads at 5pt with no kerning issues
- [ ] QR code resolves to correct batch URL when scanned
- [ ] Brand mark exactly matches `assets/aurex/logo.svg`
- [ ] No emoji, no purple, no hype
- [ ] Compliance copy verbatim (no paraphrasing the disclaimer)
- [ ] Test print on plain paper at 100% scale, hold against a vial — does information survive at vial-curvature?

## Negative space rule

Vials are small. Whitespace makes critical info legible at hand distance. If you're cramming, you have too much info — remove the optional QR before removing the disclaimer.

## After delivery

If the print run reveals an issue (cracked text at curvature, illegible CAS at 5.5pt, etc.):
- Append to `logs/anti-patterns.md`
- Update this prompt's QC checklist to catch it next time
- Update brand memory if it's a brand-level rule (e.g. "minimum body text 6pt")
