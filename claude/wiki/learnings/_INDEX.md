# Learnings Index — Mega-Brain Catalog

Per-topic knowledge brains. Currently **8 mentor brains** + **1 research corpus** = 843 videos, 4,114,812 words.

## How to use

1. **Find the right brain** — see Mentor Brains table below or `_COMPOUND_INDEX.md`.
2. **Read the mentor profile** — each `_README.md` says when to consult vs skip.
3. **Recall via mempalace** — semantic search across all mined content (recommended).
4. **Or scan with rg** — direct keyword grep into per-mentor folders.

## Mentor brains (peptide / TRT / biohacking domain)

| Brain | Videos | Words | Specialty |
|---|---|---|---|
| [Dr. Trevor Bachmeyer (SmashweRx / The Spartan)](mentor-bachmeyer/_README.md) | 472 | 2,998,329 | Peptide protocols (BPC-157, TB-500, GHK-Cu, retatrutide, MOTS-c) |
| [Ayubace (Peptide Lifestyle Educator)](mentor-ayubace/_README.md) | 167 | 83,651 | Peptide transformation case studies |
| [Dr. Trevor Bachmeyer — Rumble channel (rumble:thespartan)](mentor-bachmeyer-rumble/_README.md) | 102 | 323,617 | Topics censored on YouTube (off-label, controversial protocols) |
| [Nathalie Niddam (Longevity Educator)](mentor-nathalie-niddam/_README.md) | 28 | 338,137 | Bioregulator peptides (Khavinson short peptides) |
| [Jay Campbell (TRT/Peptide Author)](mentor-jay-campbell/_README.md) | 21 | 105,651 | TRT optimization |
| [Nick Trigili (Biohacking & Performance Specialist)](mentor-nick-trigili/_README.md) | 20 | 65,086 | Retatrutide cycling |
| [More Plates More Dates (Derek)](mentor-moreplatesmoredates/_README.md) | 17 | 47,452 | Compound breakdowns (mechanism + side effects) |
| [Dr. Craig Koniver (Performance Medicine MD)](mentor-dr-craig-koniver/_README.md) | 16 | 152,889 | Peptide stacking for performance optimization |

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