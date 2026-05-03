# Export spec — Print collateral

For boxes, cartons, flyers, business cards, anything press-bound. Print mistakes are unrecoverable, so the bar is **98%** (vs 95% for screen).

## Color

- **CMYK** (ISO Coated v2 ECI for offset, GRACoL 2013 for digital — confirm with printer first)
- Total ink coverage ≤ 300% (avoid 400% deep blacks → bleeds + cracks)
- Rich black for body text: C 60 / M 40 / Y 40 / K 100 (NOT pure 100K which looks washed)
- NO RGB elements anywhere — Acrobat Output Preview must show 0 RGB warnings
- Convert all imported images to CMYK before placing

## DPI

- 300DPI minimum at final output size
- 600DPI for line art / monochrome (vector preferred)
- Vector elements stay vector — never raster the logo at >100% scale

## Bleed + safe zone

- Bleed: 3mm beyond trim on all sides (unless printer specifies different)
- Safe zone: 3mm INSIDE trim (no critical content closer to edge than 3mm)
- Crop marks: required on press-ready PDF, offset 3mm from trim
- Registration marks: required for multi-color jobs

## Fonts

- ALL TEXT OUTLINED (Figma: Outline Strokes / Illustrator: Create Outlines / InDesign: export with embedded fonts)
- Verify in Acrobat → Preflight → Profile "PDF/X-1a" passes
- Minimum body text: 6pt (5pt only for legal small-print, never below)
- Avoid hairline strokes <0.25pt — they disappear on press

## File format

- **PDF/X-1a** for offset printing (required by most US printers)
- **PDF/X-4** for digital with transparency (less common, ask printer)
- **PNG/TIFF** only as a fallback for digital proofs, never for press

## Color matching

- For brand colors: use Pantone PMS spot OR provide CMYK build that's been press-tested
- Aurex monochromatic palette converts cleanly: paper #FAFAFA → no print (paper white), ink #09090B → rich black build
- For brand mark: provide vector AI / EPS / SVG, never raster

## Carton / box specifics

- Dieline supplied by printer — request before designing
- Folding lines marked in non-printing color (typically magenta or a designated tech layer)
- Ink-free zones on glue tabs (or printer rejects the job)
- Leave 5mm clear-space around any panel edge for cracking-on-fold
- Top-of-box and bottom-of-box should both be brand-recognizable when stacked

## Pre-press QC checklist (98% threshold)

- [ ] PDF/X-1a profile passes in Acrobat Preflight
- [ ] All text outlined (Acrobat → Tools → Print Production → Output Preview → Object Inspector shows no live text)
- [ ] CMYK only (Output Preview shows 0 RGB elements)
- [ ] 300DPI verified at final size (Output Preview → ink coverage)
- [ ] Bleed 3mm (or per-printer spec) on all sides
- [ ] Safe zone 3mm inside trim
- [ ] Crop marks present and correctly offset
- [ ] Total ink coverage ≤ 300% (Output Preview → Ink Manager)
- [ ] Rich black for body, not 100K
- [ ] Brand color match: Pantone or press-tested CMYK
- [ ] No transparency on hidden layers (flatten if PDF/X-1a)
- [ ] File name follows printer's convention (typically `<brand>_<sku>_<date>_v<n>.pdf`)
- [ ] Test print on plain paper at 100% scale — proof-read at actual size

## Common printer specs (US)

| Job | Bleed | DPI | Color |
|---|---|---|---|
| Business card | 3mm | 300 | CMYK PDF/X-1a |
| Flyer (8.5×11") | 3mm | 300 | CMYK PDF/X-1a |
| Outer carton | per dieline | 300 | CMYK PDF/X-1a |
| Vial label (60×30mm) | 1mm | 300+ | CMYK PDF/X-1a |
| Sticker | 3mm | 300 | CMYK + die line |

## After delivery

- Save the production PDF + the press proof + the printed sample (photo) to `assets/<brand>/print-archive/<job>-<date>/`
- If a print issue surfaced: log to `logs/anti-patterns.md` with what went wrong + how to avoid
- If a printer is reliable: note their preferred specs in `assets/<brand>/printers.md` for future jobs
