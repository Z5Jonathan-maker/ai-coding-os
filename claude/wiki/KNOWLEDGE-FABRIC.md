# Knowledge Intelligence Fabric — the self-learning / self-healing / evolving engine

Source of truth for how the trading R&D brain composes its knowledge tools. Designed 2026-07-23 (Claude + K3 collab, grounded on real `du`/`df`). This is a **routed fabric**, not one tool over everything — and its value is the **feed edges** (the self-* loops), not the indexes.

## Core insight
Your **code is tiny, your data is huge**: 2,101 `.py` + 40 `.cs` = ~40M indexable code → a 479M graph for ALL 5 trading repos. The disk constraint was never about knowledge graphs (<300MB) — it's housekeeping (`data/` 6.4G, `.git`, venvs, `gh-archive` 5.2G). **Index all the code, index none of the data.**

## Routing map (one owner per data type — route, don't merge)
| Data type | Owner | Feeds → |
|---|---|---|
| Code structure (symbols, call chains, arch) | **codebase-memory-mcp** (5 trading repos indexed) | → ADR store (`manage_adr`), → InfraNodus (arch-vs-doctrine gap) |
| Runtime behavior (what the engine did) | **codebase-memory `ingest_traces`** + `forensics/` JSON | → vault `13-evidence-vault`, `09-validation-status-board` |
| Architecture decisions (why) | **codebase-memory `manage_adr`** | → mirror to vault `15-architecture-decisions` + auto-memory |
| Human synthesis (canon, playbooks, verdicts) | **Obsidian vault** (`mym-autotrader/vault/`) | → NotebookLM, → InfraNodus, → auto-memory |
| Mentor corpus (712M transcripts) | **wiki/learnings + ripgrep + `_COMPOUND_INDEX.md`** (stay as-is, NEVER re-index) | → NotebookLM, → InfraNodus |
| Episodic ("what did we discuss") | **mempalace** | informs all, owns nothing |
| Atomic facts/verdicts | **auto-memory** (215 files) | written by the loops below |
| Raw market data (`data/` 6.4G) | **Filesystem only — DuckDB/pandas at query time** | engine only |
| Cross-corpus blind spots | **InfraNodus** (concept graphs only, never source text) | → research questions → vault `07-opportunity-pipeline` |
| Doc Q&A + audio | **NotebookLM** (manual reading room, never a pipeline stage) | audio overviews |

**Turf rule:** codebase-memory never sees prose; mempalace never stores verdicts; InfraNodus never holds source text; nothing indexes `data/`/`.venv`/`.git`/`engine/state`.

## The 5 self-* workflows (the actual engine)
- **W1 Doctrine-vs-Code gap audit** (flagship): `trace_path` the strategy's exit logic → ripgrep the mentor doctrine it claims → InfraNodus gaps between coded logic and doctrine → vault gap-audit note → auto-memory verdict. First subject: `forensics/h165-gated-rsi2-equity`.
- **W2 Failed-research resonance detector** (self-healing): new generator candidate → `search_graph` for reused call chains of past failures + mempalace episodic + ripgrep `vault/03-failed-research` → block a re-test BEFORE burning a gauntlet run. Kills the "re-test the same idea 4 months later" trap.
- **W3 Trace-to-ADR autopsy** (self-learning): gauntlet run → `ingest_traces` → `detect_changes` (did behavior change after an engine edit?) → root-cause → `manage_adr` writes the decision → mirror to vault + auto-memory. Institutional memory for ENGINE changes.
- **W4 Cross-mentor blind-spot mining** (evolving, quarterly): feed compound-index digests (NOT raw 712M) to InfraNodus → concepts no mentor connects → research questions → `07-opportunity-pipeline`.
- **W5 Morning evidence brief** (autonomous, composes with `/morning`): overnight `detect_changes` code delta + new forensics verdicts + open decisions → `vault/24-daily-briefs/YYYY-MM-DD.md` + pin top verdict to auto-memory.

## Wiring into the autonomous loops
The fabric is the memory+sensing layer for the EXISTING self-* infra: `mega-cycle` / `autonomous-loop` / `cc-dispatch` swarms use `search_graph`/`trace_path` instead of re-reading (cheaper → deeper cycles); `detect_changes` keeps the graph fresh (self-heal against graph rot); `manage_adr` + auto-memory are the evolving memory; `cc-reflect` logs each cycle. W2/W3 are the self-healing/self-learning edges.

## Disk plan (reclaim before automating)
Free ~8-10G first: `~/.claude/gh-archive` 5.2G (redundant if on GitHub — VERIFY), dormant venvs (scrapling-lab 1.0G, ClaimPilot-scraper 856M), `git gc --aggressive` on mym-autotrader/open-design/aurex-bio, `~/Downloads` triage. NEVER touch: `.claude/projects` 3.8G (mempalace source), `data/` 6.4G (backtest input; `data/mbo` 2.6G is cold-storage-offload, not delete). New index spend: <300MB (done).

## Phased rollout
- **Phase 1 (this week, disk-safe):** reclaim to ~12G free; all trading code indexed (DONE); establish `manage_adr` habit; first W1 gap audit on h165.
- **Phase 2 (wk 2-3):** automate W3 (trace→ADR) + W5 (morning brief); prove W1 value.
- **Phase 3 (mo 2):** InfraNodus cron (vault export → gap report); W2 into generator review; quarterly W4 + NotebookLM deep dives.

## Anti-patterns (guard rails)
1. "Index everything" — a new index must name the query no existing tool answers (don't vector-index the 712M corpus; ripgrep is instant). 2. Collapsing memory tiers — verdict written once to auto-memory, elaborated once in vault, else reference. 3. Automating NotebookLM (no API → brittle). 4. InfraNodus scope creep (keep peptide mentors OUT of trading-doctrine graphs). 5. Graph rot — `detect_changes` re-index must be in the W5 loop. 6. Forensics hoarding (476M growing — retention rule per active-strategy registry). 7. Building dashboards for the fabric itself — output is notes+verdicts, not more UI.
