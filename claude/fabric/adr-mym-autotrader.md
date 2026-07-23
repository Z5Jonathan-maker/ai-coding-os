## PURPOSE
A routed knowledge-intelligence fabric powering a self-learning / self-healing / evolving autonomous trading-R&D engine. One owner per data type; value is the feed loops, not the indexes. This ADR lives in the graph and is wiped by a full re-index — canonical copy is ~/.claude/wiki/KNOWLEDGE-FABRIC.md; self_heal.sh re-applies this file after re-index.

## STACK
codebase-memory-mcp (code, 5 trading repos), Obsidian vault/ (synthesis), wiki/learnings + ripgrep (712M mentor corpus, never re-indexed), mempalace (episodic), auto-memory (facts), gap-miner (LOCAL InfraNodus reimplementation, Jina-embeddings-enhanced — NOT the SaaS), Jina (live: embeddings/reranker/reader), DuckDB/pandas (raw data/ at query time).

## ARCHITECTURE
Route, don't merge. code->codebase-memory; runtime->ingest_traces+forensics; decisions->manage_adr+wiki; synthesis->vault; corpus->wiki ripgrep; episodic->mempalace; facts->auto-memory; raw data->filesystem/DuckDB; blind spots->gap-miner (local); doc Q&A->NotebookLM (manual). Feed edges connect them.

## PATTERNS
W1 doctrine-vs-code (Jina-semantic); W2 failed-research resonance (SELF-HEAL, ~/.claude/fabric/w2_resonance.py); W3 trace-to-ADR (SELF-LEARN); W4 gap-miner blind-spot (EVOLVE, ~/.claude/fabric/gap_miner.py); W5 morning brief (AUTONOMOUS, ~/.claude/fabric/w5_morning_brief.sh); self_heal (~/.claude/fabric/self_heal.sh — detect eviction + re-index + re-apply ADR). detect_changes keeps graphs fresh.

## TRADEOFFS
Code tiny (~40M->756M graph all repos) so index ALL code; data huge (6.4G) so index NO data. Turf rule: codebase-memory never sees prose, mempalace never stores verdicts, gap-miner holds concept graphs not source text, nothing indexes data//.venv/.git/engine/state. Graphs evict under disk pressure -> self-heal detects+re-indexes.

## PHILOSOPHY
Self-learning / self-healing / evolving autonomous engine. Index code not data. A new index must name the query no existing tool answers. Verdict written once (auto-memory), elaborated once (vault), else referenced. Full blueprint: ~/.claude/wiki/KNOWLEDGE-FABRIC.md
