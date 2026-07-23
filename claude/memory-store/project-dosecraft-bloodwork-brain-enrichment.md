---
name: project-dosecraft-bloodwork-brain-enrichment
description: "DoseCraft Coach brain enriched 2026-06-16 with comprehensive bloodwork-interpretation + enhanced/biohacker-levels content (10 dossiers, 198 chunks live in Neon) + structured biomarker-ranges.yml"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3d1c8e52-61b5-4b92-be5d-257861cd7321
---

DoseCraft Coach brain bloodwork enrichment, shipped 2026-06-16 (live in prod Neon `brain_chunks`):

**What was added** — 10 authored research dossiers in `~/.claude/wiki/learnings/dosecraft-research/bloodwork-01..10.md`:
01 male hormones, 02 female hormones (cycle-phase resolved), 03 thyroid (the biggest prior gap —
FT3/FT4/rT3 were literally zero), 04 glycemic/metabolic, 05 lipids/cardiovascular (added ApoB+Lp(a)),
06 inflammation/iron, 07 CBC, 08 CMP/organ, 09 vitamins/minerals/longevity, **10 enhanced/biohacker
levels** (3-tier read: population vs functional-optimal vs EXPECTED-ENHANCED; what's expected on
TRT/androgen/GH/oral protocols vs hard red flags that override "but I'm enhanced" — e.g. hematocrit
>54%, sustained high ApoB, rising GGT, cystatin-C-confirmed eGFR decline). ~22k words, 198 chunks.

**Structured dataset** — `dosecraft-companion/data/biomarker-ranges.yml`: 86 markers (reference +
functional/optimal ranges, drivers, retest, assay notes) + 20-entry `enhanced_expectations` block.
Companion to existing `data/bloodwork.yml` (which is per-COMPOUND "which labs to run"); this is
per-MARKER "how to read the value". Loaded the same way (yaml parse). Feeds the stubbed
`scan-bloodwork` endpoint + BLOODWORK tracking interpretation when those features light up.

**Pipeline used** (reusable): authored into `dosecraft-research/` (tier = "research dossier", cites
cleanly as `[research:]`, always-included in retrieval) → `node scripts/embed-brain.mjs
--only=dosecraft-research` from companion repo (OpenAI text-embedding-3-small 1536-dim → Neon;
content-hash freshness means only new/changed files embed; --dry to preview; ~$0.002 total).
See [[project-dosecraft-brain-architecture]] for the brain wiring.

**Nutrition / peptide-dieting layer added same day (2026-06-16)** — 7 dossiers `nutrition-01..07.md`
(energy-balance/macros, protein/muscle-preservation, **GLP-1 dieting** [flagship], GH-peptide
nutrition, recomp/cutting, TRT/androgen nutrition, recovery/gut) + `data/nutrition-targets.yml`
(22 macro/calorie targets keyed by goal+peptide context, protein in g/kg LBM). ~14k words, 120 chunks.
Audit finding that drove it: the brain had NO credible in-space diet expert — mentor-layne-norton &
mentor-lyle-mcdonald dirs are broken scrapes (sale pages, 0 teaching content); the real peptide-dieting
expertise was trapped in the app's `content/paths/*` courses, not queryable. Dossiers surfaced that into
citable brain prose. SOURCING STANDARD enforced per [[feedback-brain-in-space-experts-only]] — in-space
experts + in-domain papers only (Helms 2014 contest-prep, Bhasin 1996, GLP-1 trials, Sikiric BPC-157),
NOT generic clinical/RD advice; QC caught+fixed 3 bad citations (fabricated NCT, PMC-as-author,
non-resolving slug).

**Expert-corpus ingest done 2026-06-17 (Jonathan-approved roster, research-scout-vetted):** broken
diet-expert scrapes FIXED + 9 new in-space YouTube experts added. Re-ingested via `mega-brain-ingest`
(yt-dlp enumerate channel → 25 recent videos each → whisper base → embed-brain --only): **Lyle McDonald**
(162 recomp/diet ARTICLES from bodyrecomposition.com nutrition/fat-loss/muscle-gain/research/women →
3,485 chunks; old feud junk wiped), **Layne Norton** (25 vids; 8 Black-Friday/seminar junk files deleted),
+ **Dr. Thomas O'Connor (Anabolic Doc)**, **Broderick Chavez (TeamEvilGSP)**, **Dr. Kyle Gillett
(@GillettHealth)**, **Mike Mutzel (High Intensity Health)**, **Vigorous Steve**, **Greg Doucette**
(breadth-not-depth, some off-topic drama), **Hans Amato**, **Dylan Gemelli** — 25 vids each. Excluded by
the standard: Peptide Science Institute (unverified credentials), Mike Israetel (framing-only), Dr.
William Seeds (no standalone channel). Channel handles/roster + research in research-scout output;
launcher = `~/.claude/wiki/learnings/_ingest-sources/run-ingest.sh` (+ run-lyle.sh, run-gc.sh).
Mentor transcripts are RAW (creator names intact) — sanitized at QUERY time per existing mentor-tier
pattern, never named in output. Gotcha: agent-initiated detached prod-writes + git push-to-main are
gated by the auto-mode classifier — Jonathan fires those one-liners himself.

**Method notes:** ranges grounded in DoseCraft's shipped canon (master-protocol-bible back-matter
optimal-targets table + the ~28 app `content/paths/*/chapter-06-labs-that-matter` files) so new
content can't contradict shipped numbers. Content is MODEL-AUTHORED (posture-safe: zero creator
names/@handles, only real [paper:]/[research:] citations, harm-reduction framing, "not medical/dosing
advice") — flagged to Jonathan that a human/clinical review pass is optional before relying on it.
Editorial posture per [[project-dosecraft-cleanup-audit-2026-06]] / EDITORIAL-POSTURE.md.
