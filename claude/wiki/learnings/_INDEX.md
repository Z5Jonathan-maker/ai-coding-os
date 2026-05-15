# Learnings Index — Mega-Brain Catalog

Per-topic knowledge brains. Currently **8 mentor brains** + **1 research corpus** = 2,059 videos, 23,050,335 words.

## How to use

1. **Find the right brain** — see Mentor Brains table below or `_COMPOUND_INDEX.md`.
2. **Read the mentor profile** — each `_README.md` says when to consult vs skip.
3. **Recall via mempalace** — semantic search across all mined content (recommended).
4. **Or scan with rg** — direct keyword grep into per-mentor folders.

## Mentor brains (peptide / TRT / biohacking domain)

| Brain | Videos | Words | Specialty |
|---|---|---|---|
| [More Plates More Dates (Derek)](mentor-moreplatesmoredates/_README.md) | 506 | 4,911,434 | Compound breakdowns (mechanism + side effects) |
| [Dr. Trevor Bachmeyer (SmashweRx / The Spartan)](mentor-bachmeyer/_README.md) | 472 | 2,998,329 | Peptide protocols (BPC-157, TB-500, GHK-Cu, retatrutide, MOTS-c) |
| [Nathalie Niddam (Longevity Educator)](mentor-nathalie-niddam/_README.md) | 467 | 10,823,827 | Bioregulator peptides (Khavinson short peptides) |
| [Jay Campbell (TRT/Peptide Author)](mentor-jay-campbell/_README.md) | 214 | 2,312,922 | TRT optimization |
| [Ayubace (Peptide Lifestyle Educator)](mentor-ayubace/_README.md) | 175 | 117,491 | Peptide transformation case studies |
| [Dr. Trevor Bachmeyer — Rumble channel (rumble:thespartan)](mentor-bachmeyer-rumble/_README.md) | 102 | 323,617 | Topics censored on YouTube (off-label, controversial protocols) |
| [Dr. Craig Koniver (Performance Medicine MD)](mentor-dr-craig-koniver/_README.md) | 81 | 1,343,165 | Peptide stacking for performance optimization |
| [Nick Trigili (Biohacking & Performance Specialist)](mentor-nick-trigili/_README.md) | 42 | 219,550 | Retatrutide cycling |

<!-- non-mentor-brains:start -->

## Non-mentor brains

| Brain | Kind | Docs | Words | Use when |
|---|---|---|---|---|
| [Andrej Karpathy — ML/AI Mentor](karpathy/) | ML/AI mentor | 8 | 28,383 | Neural network design intuition, training recipes, RNNs, RL, LLM internals, software 2.0 framing |
| [Peer-reviewed peptide literature](peptide-research/) | Citation-grade research corpus | 396 | 4,373,129 | Aurex copy/compliance backing — anything that needs paper-grade evidence (BPC-157, GHK-Cu, Selank/Semax, TB-500, Epitalon, CJC-1295/Ipamorelin) + FDA 503A bulks list |
| [DoseCraft research dossiers + protocol bible](dosecraft-research/) | Internal research corpus | 87 | 200,462 | Vendor pricing context, creator intelligence, master protocol bible chapters, white-label rankings |
| [G0DM0D3 jailbreak corpus](jailbreak-corpus/_README.md) | Defensive red-team test material | 27 | ~5k | Verifying classifier + cross-tier verifier behavior on jailbreak vectors. Used by router's pre-commit gauntlet and `cc-jailbreak-verify` CLI. NOT runtime prompts. |

_Sources noted in each brain's manifest._

<!-- non-mentor-brains:end -->

## Topical indexes

- [_COMPOUND_INDEX.md](_COMPOUND_INDEX.md) — which mentors cover which peptides
- `_compound-index.json` — same data, programmatic

## Other corpora

- [dosecraft-research/](dosecraft-research/) — 87 docs, 198K words (creator dossiers, vendor pricing analyses, master protocol bible chapters)

## Adding a new brain

```bash
# YouTube/video URL list → transcribe + ingest
mega-brain-ingest --topic <new-mentor> --sources sources.txt

# Local files (PDFs, transcripts, articles) → ingest
mega-brain-ingest --topic <new-topic> --url /path/to/dir

# Then re-run this index builder
~/code/projects/scrapling-lab/.venv/bin/python /tmp/build-mentor-index.py
```

## Archive

- `_archive/` — intermediate / superseded brains (kept for traceability)

Generated 2026-05-03 from Neon `transcript_embeddings` (DoseCraft project, 8,826 chunks).