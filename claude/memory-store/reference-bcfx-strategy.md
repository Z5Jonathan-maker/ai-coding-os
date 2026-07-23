---
name: reference-bcfx-strategy
description: "Jonathan's trading strategy is Brandon Carter FX (BCFX) / Area 61 — canon lives in mym-autotrader/docs/ai-memory/STRATEGY.md; source PDFs in iCloud + docs/strategy-source/"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Jonathan's US30/Dirty-30 method = **Brandon Carter FX (BCFX) + AREA 61**. The
`mym-autotrader` repo was built from his transcriptions of the BCFX videos.
**Canonical spec: `~/code/projects/mym-autotrader/docs/ai-memory/STRATEGY.md`**
(distilled from ALL 10 transcripts). Source PDFs: iCloud
`Downloads/` (`AREA 61.pdf`, `BCFX Online Trading Course 2.pdf`=2.0, `BCFX 2.pdf`=2.5,
numbered `1.pdf`–`7.pdf` = BCFX 1.0 modules) + preserved in
`mym-autotrader/docs/strategy-source/` (gitignored). Originals/videos:
iCloud `untitled folder/BCFX 1.0` + `BCFX 2.0` + `BCFX 2.5` + `BCFX Area 61`.

**The method (no indicators — "I am the indicator"):**
- Key levels = **Quarter Figures**: large quarters every **250** (thick), halfway
  points every **125** (thin). US30: 50,000/50,250/50,500… + 50,125/50,375…. Plus
  HTF S/R zones + whole numbers + Fib (61.8/78.6) as confluence.
- Bias = price at a QF **support** (look long) or **resistance** (look short),
  inverted vs the crowd.
- **AREA 61 contrarian entry** (what he trades): LONG = enter on the CLOSE of a
  strong **BEARISH** candle into a QF support; SHORT = strong **BULLISH** close
  into a QF resistance. Body-dominant, wick not > body.
- Stop **just beyond the QF/candle** (NOT a fixed distance). Target **next large
  quarter**; trail. Wait for the candle close; no FOMO; over-tested level = more
  likely to break.

His 50,250 example = LONG the 50,250 large-quarter support on a strong bearish
close, stop 50,125 (halfway QF below), targets 51,000/51,750 (next large quarters).

**NOT his strategy (purged from the dashboard 2026-06-08):** SMA/any indicator,
swing HH/HL `bias_engine` as the read, fixed 150-175 stops, fixed 125/250/375
targets. The quarter-figure grid (`grid_engine`) IS correct (Area 61 component 1).
US30 Command dashboard ([[project-trading-ai-stack]]) bias + audit now run on this.
