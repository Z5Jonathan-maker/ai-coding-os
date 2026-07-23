---
name: image2code-site
description: |
  Build or redesign a REAL multi-page website by using ChatGPT Image 2.0 as creative director and
  faithfully transcribing each page-type's mockup into code (image-to-code). Use this — NOT the KIMI
  design-first router, NOT website-design-stack — whenever the task is "redesign my whole site",
  "rebuild/level up this website", "build the marketing site", or any multi-page site build/revamp
  where there's an existing site or brand to screenshot. Takes precedence over the design-first→KIMI
  route for FULL SITE builds (KIMI stays for one-off single-component design audits).
---

# image2code-site

The perfected lane for full-site builds. Engine + playbook live at
`~/code/projects/image2code/site-engine/` — **read `PLAYBOOK.md` first**, it has the method + every
hard-won gotcha.

## When to use
- "Redesign / rebuild / level up my website" (multi-page, existing brand to screenshot).
- "Build the marketing site / landing pages" where faithful, premium, on-brand output matters.
- Any site where the homepage strategy was screenshot → Image 2.0 → faithful transcription.

NOT for: a single component mockup or a pure design audit (that's the KIMI `router-ask purpose=ui_design`
lane). NOT `website-design-stack` (older animation-tier approach).

## The rule (do not deviate — this is why past attempts failed)
Per page **archetype** (home, city/location, service, article, case-study, about, contact):
**screenshot the real page → feed to ChatGPT Image 2.0 ("keep brand exactly, drastically modernize")
→ transcribe THAT mockup into code faithfully → verify vs mockup → next archetype.**
Never mass-template one page across types. Never route the whole build to KIMI.

## Mechanics (full detail in PLAYBOOK.md)
1. **Image 2.0 via Kimi WebBridge** (`127.0.0.1:10086`, user's real Chrome): upload via
   `atob`→`File`→`DataTransfer`→`input.files`→`change` (CSP blocks native upload + `fetch(dataURL)`).
   Use a **REGULAR chat** (temporary chats block image-gen). Verify upload by **screenshot**, not DOM.
   Retrieve via canvas→`toDataURL`; newest backend-api image with height>1300.
2. **Engines** (`engine/`): `fill_city`, `fill_structured` (photo cards services-only), `fill_content`
   (articles 2-col / case-study result-hero / about-contact), `build_about_contact`, `compile_tw`
   (site-wide union compile), `rebuild.py` (content-first, structured-last; `CCA_LOCALE=es`).
3. **Shared kit** (`kit/`): one `cca.css`/`cca.js` + localized `_chunk_*`. Pure-CSS reveal (always
   visible). Port each page's SEO `<head>` verbatim. GA4 + conversion events emitted by engines.
4. **QC**: render desktop AND mobile(390px); inline `cca.js` to see JS-driven render (headless skips
   deferred JS); scan all `&amp;#\d+;`, broken links (cleanUrls), images, GA, lang, ES leaks.
   `vercel.json` cleanUrls:true; absolute asset paths.

## Invoke
Read `~/code/projects/image2code/site-engine/PLAYBOOK.md`, copy `engine/` + `templates/` + `kit/`
into a working dir, then run the per-archetype loop. Deploy static to Vercel (never build).
