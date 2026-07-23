---
name: reference-codebase-memory-mcp
description: codebase-memory-mcp — code-structure knowledge-graph MCP (find symbol/call-chains/architecture without re-reading files)
metadata: 
  node_type: memory
  type: reference
  originSessionId: bbebfc06-e8d6-4f7a-8224-4abe435df6ac
  modified: 2026-07-23T19:17:35.253Z
---

codebase-memory-mcp (DeusData, v0.9.0, MIT) — a code-intelligence MCP that indexes a repo into a tree-sitter + Hybrid-LSP knowledge graph so an agent queries code STRUCTURE (symbols, call-chains, routes, architecture) instead of grep+read. Installed + wired 2026-07-23.

- **Binary:** `~/local/bin/codebase-memory-mcp` (installed via CONTROLLED manual download + SHA-256 verify vs the release's authenticated checksums.txt — NOT their `curl|bash` auto-installer, which rewrites ~/.claude.json + injects agents/hooks across 43 client surfaces). 100% local; code never leaves the machine.
- **Registered:** user-scoped stdio in `~/.claude.json` (`claude mcp add codebase-memory-mcp -s user -- <binary>`), `✓ Connected`.
- **Index a repo:** `codebase-memory-mcp cli index_repository --repo-path <abs>` (auto-excludes .venv/.git/__pycache__/logs). mym-autotrader: ~17s → 212k nodes / 588k edges, **~0.5GB graph**. Auto-sync keeps it fresh (`config set auto_index true`).
- **Indexed so far:** mym-autotrader (2026-07-23). Each graph is ~0.5GB — mind the 228GB disk ([[project-device-disk-constraint]]); index only active big repos, not everything.
- **15 tools:** search_graph, trace_path (call-chains), get_architecture, search_code, get_code_snippet, get_graph_schema, query_graph, detect_changes, list_projects, index_status, delete_project, index_repository, manage_adr (persist Architecture Decision Records across sessions), ingest_traces.
- **Query gotcha:** tools need a `project` arg (from `list_projects`), not repo_path; search_code wants `pattern`. mym-autotrader project name = `Users-leonardofibonacci-code-projects-mym-autotrader`. Raw-JSON CLI is deprecated → prefer flags / `--args-file` / piped stdin.
- **Why it matters:** cheap O(1) structural code lookups for the autonomous loops ([[project-brain-architecture]]) — mega-cycle / autonomous-loop / cc-dispatch swarms stop re-reading files each cycle. ~10× fewer tokens on code exploration per the arXiv 2603.27277 eval (the reel's "99%" is marketing). COMPLEMENTS, does NOT replace, the fact/episodic/corpus memory (auto-memory, mempalace, wiki/learnings) — different layer (code structure vs knowledge).
