---
name: project-dosecraft-brain-mentor-roster
description: "DoseCraft brain mentor roster + expansion priorities and the WHY per mentor (Bachmeyer = condition-reversal wedge; Kyal = deep technical, guest-spot-only; Jay = broad ecosystem)"
metadata: 
  node_type: memory
  type: project
  originSessionId: d56ff06a-695a-44c5-8abe-fdbfcb02f99c
---

The DoseCraft brain's mentor corpora and Jonathan's expansion rationale
(2026-06-11). Live roster: Ben Greenfield (largest, capped by diversity),
Mark Hyman, Nathalie Niddam, Trevor Bachmeyer (+Rumble), MorePlatesMoreDates,
Attia, Jay Campbell, Koniver, Huberman, Ayubace (= the "AC" YouTube channel
UC5CGkTCWS1KMp00M-c8GJ9Q), Nick Trigili, Lyle McDonald, Layne Norton, Rhonda
Patrick + peptide-research (PubMed) + dosecraft-research (in-house dossiers).
Names NEVER reach users — anonymized to tier labels server-side.

**Expansion priorities (Jonathan, 2026-06-11):**
- **Bachmeyer = top priority.** Not just peptides: diabetes/autoimmune/cancer
  REVERSAL protocols — Jonathan sees this as the ad/SEO wedge ("people
  struggling with these things with no solution stumble across our app").
- **MorePlatesMoreDates, Ayubace, Nick Trigili** — more of each.
- **Jay Campbell** — broader peptide ecosystem, injectables, clinics,
  optimization. Lives mostly in guest appearances (no dominant own channel).
- **Lucas Aoun (NEW mentor, mentor-lucas-aoun)** — "Boost Your Biology"
  channel (UC4O8s5Eir3A0ULQ-0HOJr8Q). Nootropics-first with ergogenics/
  hormones/peptides overlap — strengthens the cognitive/nootropic intent
  categories (semax/selank/cerebrolysin etc.).
- **Kyal Van Der Leest (NEW mentor, mentor-kyal-van-der-leest)** — much less
  famous than Jay but "one of the sharper technical minds": oral peptide
  delivery, mechanisms, mitochondrial health, gut repair, next-gen compounds.
  LVLUP Health founder/formulator. NO own channel — recurring guest on Ben
  Greenfield Life + Gary Brecka's Ultimate Human + longevity pods. Key eps:
  "Peptides 101" (Brecka), "Coolest, Craziest Peptides" (Greenfield). Also
  posts on Instagram (not harvestable via mentor-expand — YouTube only).

**Pipeline:** `mentor-expand` (scrapling-lab/bin) — channel sweeps + ytsearch
queries, dedupes via corpus _manifest.json, auto-CC first. Then
dosecraft-companion scripts/embed-brain.mjs (freshness ingest — only new
files embed). karpathy + external-references corpora were purged 2026-06-11
and are SKIP_DIRS-gated (AI content contaminated the peptide brain).

**How to apply:** when expanding the brain, harvest guest-appearance queries
for Jay/Kyal (not just channel sweeps); VET search-mode pulls (keep only if
mentor's channel uploaded it or transcript names them — 80% of Kyal's raw
haul was other creators); route condition-reversal content questions toward
Bachmeyer authority; never propose surfacing mentor names in-product.

**HARD RULE (learned 2026-06-11, Hyman leak):** adding a mentor corpus
REQUIRES a NAME_REPLACEMENTS entry in companion lib/sanitize.ts BEFORE
ingest — Mark Hyman was ingested in May without one and his name leaked
verbatim into retrieval contexts until a prod smoke caught it. After
ingest also run scripts/build-compound-index.mjs (authority index).
