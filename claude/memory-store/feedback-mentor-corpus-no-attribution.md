---
name: feedback-mentor-corpus-no-attribution
description: "For Dosecraft content — pull protocols/doses/philosophy from the mentor corpus (Bachmeyer, Huberman, Attia, Koniver, Trigili, Ayubace) but NEVER name them in output. Frame as "practitioner consensus" / "research describes" / "the literature describes."
metadata:
  type: feedback
  originSessionId: 67ad7bbd-3af8-40c1-b265-6ffb86904e5d
---
For all Dosecraft-shipped content (free guides, paid Gumroad packs, Coach
answers, landing copy):

**Use the mentor corpus as a research substrate.** The wiki-corpus mentor
directories (`~/code/projects/dosecraft-companion/wiki-corpus/mentor-*/`)
contain 1000+ scraped transcripts from Trevor Bachmeyer, Huberman, Attia,
Koniver, Trigili, Ayubace. These are the practitioner-protocol authority
the platform is built on. Their content is fair game as a substrate —
their dose ranges, their cycling philosophy, their stack rationales.

**Never name them in output.** The editorial voice frames everything as
"practitioner consensus," "research describes," "the literature describes,"
"research-described as," "trial data describes." This protects against:
- Trademark / right-of-publicity claims
- Implication of endorsement
- Citation-rigor questions ("did this practitioner actually say this exactly")

**Why:** The user explicitly said "we don't cite anybody to avoid issues."
The SHIP-CHECKLIST has a pre-upload posture sweep that scans for names:
`rg -i 'tyler|bramlett|huberman|attia|niddam|trigili|koniver|bachmeyer|elitebiogenix'` —
any hit fails the gate.

**How to apply:**
- Before authoring a condition pack, index which mentor files cover it.
- Read those transcripts (treat as research substrate).
- Synthesize the protocol in Dosecraft voice (Path B framing).
- Never use a mentor's name in the output.
- Run the name-scan grep before commit.

**Reference:**
- Wiki-corpus index: `~/code/projects/dosecraft-companion/wiki-corpus/`
- Mentor brain index: `~/.claude/wiki/learnings/_INDEX.md`
- Editorial posture file: `~/code/projects/dosecraft-companion/EDITORIAL-POSTURE.md`
- Companion rule: `feedback_path_b_be_bold.md` (Path B framing, hedge once)

---

### 2026-05-31 — REVISION (scope clarified, rule NOT relaxed)

User considered relaxing this rule after a legal-posture conversation (citation
is arguably the SAFER fair-use stance than non-citation). After surfacing the
full EDITORIAL-POSTURE.md contract — which names FOUR reasons including
**editorial credibility / brand positioning** as the strongest — user chose
to KEEP the wall as-is and adopt a different pattern:

**Anonymized aggregate trust signals.** Make the brain's depth VISIBLE to
users via consensus scores, evidence breadth counts, and source-tier
breakdowns — without ever naming the underlying creators.

- `Strong consensus · 6 of 8 high-authority sources align` ✓ allowed
- `Synthesized from 14 passages across 7 sources` ✓ allowed
- `4 peer-reviewed · 2 clinical-practitioner records · 1 regulatory` ✓ allowed
- `Bachmeyer says 500 µg` ✗ still banned
- `Mentor coverage: top 5` ✗ still banned ("mentor" is a banned framing word)

See companion sibling memory: [[feedback-brain-consensus-anonymized]].

EDITORIAL-POSTURE.md remains the source of truth. lib/sanitize.ts still
strips creator names. SHIP-CHECKLIST grep gate still active. The rule
above is UNCHANGED — only the surface for trust signals has been clarified.
