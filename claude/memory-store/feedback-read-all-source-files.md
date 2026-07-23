---
name: feedback-read-all-source-files
description: "When Jonathan references his own materials/docs, find and read ALL of them before building — don't infer from code or partial reads"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

When Jonathan says something was "fed into" the system or references his files,
**locate and read EVERY one before acting.** On 2026-06-08 I rebuilt his trading
dashboard's bias/audit THREE times wrong (SMA → swing-structure → finally BCFX)
because I kept building on partial information instead of reading his actual
source material first. He got (rightly) frustrated: "Man you're being dense."

**Why:** the truth was in his BCFX course PDFs, not inferable from the repo code
(the repo had drifted from the strategy) and not from the web (paid-course
content). Building on a guess wasted his time and mine.

**How to apply:**
- His uploads / docs often live in **iCloud Drive**
  (`~/Library/Mobile Documents/com~apple~CloudDocs/`, esp. `Downloads/`). iCloud
  files may be dataless placeholders — `brctl download "<file>"` first.
- **PDFs are binary — `rg`/`grep` can't read their text.** Find them by NAME/recency
  (`find … -iname "*.pdf"`), then Read each (Read tool handles PDF via `pages=`).
- If the user gives "a list," read the WHOLE list, including numbered/oddly-named
  files (his BCFX 1.0 modules were `1.pdf`–`7.pdf` + `2. Support & Resistance.pdf`).
- Confirm understanding of the source BEFORE rebuilding; don't infer-and-ship.
See [[reference-bcfx-strategy]].
