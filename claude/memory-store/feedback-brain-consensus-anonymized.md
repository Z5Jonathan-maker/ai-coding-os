---
name: feedback-brain-consensus-anonymized
description: "For Dosecraft Coach UI — surface brain depth via anonymized aggregate trust signals (consensus score, evidence breadth, tier breakdown). Never expose creator names. Companion rule to [[feedback-mentor-corpus-no-attribution]]."
metadata:
  type: feedback
  originSessionId: c965723c-215a-44b0-be03-c8a9f39935a1
---
For the Coach chat UI in dosecraft-companion: surface the brain's depth and
synthesis power through ANONYMIZED AGGREGATE SIGNALS, not by naming sources.

**Why:** User explicitly chose this pattern on 2026-05-31 after weighing
three options (keep wall / tear down wall / hybrid). The editorial-credibility
rationale in EDITORIAL-POSTURE.md (line 91) — "Dosecraft cites the
peer-reviewed literature" as a stronger trust position than mentor-derivative
framing — is load-bearing. Healthcare-adjacent partnerships depend on it.
The user wants the moat VISIBLE without changing the brand byline.

**How to apply:**

Allowed signals (anonymized, count-based, no identity leak):
- Consensus score: `Strong consensus · 6 of 8 high-authority sources align`
- Evidence breadth: `Synthesized from N passages across M sources`
- Tier breakdown: `4 peer-reviewed · 2 clinical-practitioner records · 1 regulatory · 7 research dossiers`
- Confidence chip: `High confidence` / `Mixed evidence` / `Single source — verify`
- Coverage depth bar: `Evidence depth: Deep / Moderate / Thin` (based on chunk count for compound)
- Aggregated dose range: `Reported range: 250–750 µg/day (median 500 µg, n=12)`
- Minority view flag: `Minority position exists: <paraphrased counter-claim>` (no identity)

Banned (still — same as [[feedback-mentor-corpus-no-attribution]]):
- Any creator name (Bachmeyer, Greenfield, Huberman, Attia, Niddam, Trigili, etc.)
- Any channel handle or brand (SmashweRx, MPMD, The Spartan, etc.)
- The word "mentor" in any user-facing copy — use "source", "research",
  "clinical-practitioner record", or evidence-tier names
- Per-mentor chat modes ("Ask Bachmeyer") — abandoned

**Implementation surface:**
- `lib/retrieve.ts` computes evidence metadata on every retrieval
- `app/api/brain/query/route.ts` (bridge for dosecraft Coach) passes
  evidence through anonymized
- `app/api/chat/route.ts` (companion's own chat) renders chips in UI
- `EDITORIAL-POSTURE.md` UNCHANGED — sanitize.ts still strips names

**Evidence tier mapping (mentor identifier → public tier label):**
| Mentor brain id | Public tier label |
|---|---|
| `peptide-research` | `peer-reviewed` |
| `dosecraft-research` | `research dossier` |
| `mentor-*` (all) | `clinical-practitioner record` |
| (future regulatory) | `regulatory` |

The mapping happens server-side. The client only ever sees the public label
in counts. Creator names never cross the network to the browser.

**Test the wall holds:**
- `rg -i 'bachmeyer|greenfield|huberman|attia|niddam|trigili|koniver|bramlett'
  $(find . -path './node_modules' -prune -o -name "*.tsx" -print -o
  -name "*.ts" -print | xargs grep -l "evidence\|consensus\|breadth")` —
  should return ZERO matches outside server-side mapping code
- The SHIP-CHECKLIST grep gate continues to block names anywhere they
  could ship to the client
