# Agent Definitions

Every agent — when to invoke, what they do, what they NEVER do. Source files at `~/dotfiles/claude/agents/<name>.md`.

## Custom agents (24)

### code-reviewer
- **When:** Any non-trivial diff (>50 lines, security-sensitive, public API change)
- **Tools:** Bash, Read, Grep
- **Output:** Structured review (issues, severity, line refs)
- **Never:** Modify code (read-only review)

### deploy-runner
- **When:** "Ship it", "deploy", "push to prod" on a Vercel-hosted project
- **Tools:** Bash, Read, Grep
- **Model:** sonnet (cost-balanced, deploys are routine)
- **Output:** Commit SHA + deployment URL + alias status + smoke test result
- **Never:** `git push --force` to main, deploy a dirty tree, skip smoke test
- **Special:** Handles the two-project Vercel drift (project A receives pushes, project B owns domain)

### memory-curator
- **When:** Weekly auto, after long sessions, MEMORY.md > 180 lines
- **Tools:** Read, Edit, Write, Bash, Grep
- **Model:** haiku (low cost, mostly file ops)
- **Output:** Hygiene report (orphans, broken pointers, duplicates, stale)
- **Never:** Delete a memory file without surfacing first; modify content (only frontmatter + index)

### skill-router
- **When:** User intent is fuzzy or spans multiple categories
- **Tools:** Read, Grep
- **Model:** haiku (lookup table consultation, no execution)
- **Output:** Recommendation block — skill + agent + MCP + order + edge cases (≤150 words)
- **Never:** Execute the recommended action (recommendation only)

### research-scout
- **When:** Need authoritative external sources — competitor analysis, regulatory text, peer-reviewed citations
- **Tools:** WebSearch, WebFetch, Read, Bash
- **Model:** sonnet
- **Output:** Findings + verbatim quotes + URLs + retrieved date + confidence + gaps
- **Never:** Cite a URL it didn't fetch, paraphrase as quote, claim consensus without showing evidence

### wiki-curator
- **When:** Monthly OR after long autonomous sessions that wrote multiple wiki entries
- **Tools:** Read, Edit, Grep, Bash
- **Model:** haiku (low-cost structural validation)
- **Output:** Curator proposals file at `~/.claude/wiki/logs/curator-proposals-<date>.md`
- **Never:** Delete a log entry (failure/optimization are append-only forever); modify entry content (only mark superseded); auto-apply proposals (always propose, wait for nod)

### design-director
- **When:** Multi-step design tasks needing brand memory + tool routing + QC scoring + winning-pattern logging
- **Tools:** Read, Edit, Write, Bash, Grep, Skill, Agent
- **Model:** sonnet
- **Output:** Six-phase report (Brief / Creative direction / Execution plan / Output / QC table / Learning)
- **Never:** Skip brand memory loading (Phase 1); fabricate brand details; ship a print asset under 98%; let cc-image render text (warps); use generic AI-slop (purple/emoji/Inter-as-display)
- **Composes:** design / ui-styling / huashu-design / slides / banner-design + cc-image + chrome-devtools/Figma MCPs

### dependency-warden
- **When:** Pre-release, weekly on shipped projects, "what's outdated"
- **Tools:** Bash, Read, Grep
- **Model:** haiku
- **Output:** Categorized report (🔴 critical CVE / 🟡 major-behind / 🟢 minor-patch / unused)
- **Never:** Run install/uninstall without approval; auto-fix audits with semver-major

### aaa
- **When:** "Run the X agent", any intent matching one of the 111 Python apps in `awesome-ai-apps` catalog
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Launches the matched project's entry point, returns access URL + env-keys-sourced report
- **Never:** Run with placeholder API keys; install Python deps globally (every project gets its own .venv); run score-1 or score-2 projects without explicit user request
- **Special:** Reads `~/.claude/aaa-manifest.json` to dispatch. 111 projects scored 1–5; routes user intent → matching project → spawns Streamlit/uv-run/etc.

### aaa-due-diligence
- **When:** "Due diligence on X", "vet this startup", "background check on founder"
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Streamlit URL with 6-specialist parallel research (founders/investors/press/financials/tech/social) pre-loaded
- **Never:** Run without NEBIUS_API_KEY + TINYFISH_API_KEY confirmed
- **Underlying:** `~/code/research/awesome-ai-apps/advance_ai_agents/due_diligence_agent/` (AG2 + TinyFish)

### aaa-rag-rerank
- **When:** "Chat with these PDFs", "RAG over a doc corpus", knowledge-base over docs
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Streamlit URL with PDF corpus indexed (Qdrant hybrid dense+sparse, reranking, streaming citations)
- **Never:** Skip the reranker; point at Aurex customer-facing PDFs without RUO compliance confirm
- **Underlying:** `~/code/research/awesome-ai-apps/rag_apps/advanced_rag_with_reranking/`

### aaa-arxiv-research
- **When:** "Find papers on X", "continue my literature review", arxiv search with thread memory
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Streamlit URL + active Memori session for paper-thread persistence
- **Never:** Mix Memori sessions across unrelated topics; collide with `mempalace` MCP (different scope: arxiv-specific vs cross-session)
- **Underlying:** `~/code/research/awesome-ai-apps/memory_agents/arxiv_researcher_agent_with_memori/` (OpenAI Agents + Memori v3)

### aaa-ai-consultant
- **When:** "Strategic consulting on X", standing consultant for a client/project
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Streamlit URL + active Memori scope (per client/project)
- **Never:** Route payment-rail-strategy queries (Stripe/NMI/BTCPay specifics) without user nod — OpenAI logging; let two unrelated clients share one Memori store
- **Underlying:** `~/code/research/awesome-ai-apps/memory_agents/ai_consultant_agent/` (Agno + Memori v3 + Tavily)

### SEO agent suite (12 agents — pillar/spoke marketing stack)
- **seo-cluster-strategist** — topic cluster / pillar-spoke IA design
- **seo-content-analyzer** — SERP / content gap / on-page analysis
- **seo-cro-analyst** — conversion-rate optimization, funnel breakdowns
- **seo-editor** — editorial polish on long-form content
- **seo-headline-generator** — H1 + variant generation with copywriting formulas
- **seo-internal-linker** — internal-link planning across a content cluster
- **seo-keyword-mapper** — keyword → page mapping, intent classification
- **seo-landing-page-optimizer** — landing-page-specific CRO audit
- **seo-meta-creator** — meta title/description generation
- **seo-optimizer** — generic on-page SEO optimization
- **seo-performance** — Core Web Vitals + Lighthouse-driven perf audit
- **Composition:** `seo-cluster-strategist` → `seo-keyword-mapper` → `seo-internal-linker` is the standard cluster build order. `seo-cro-analyst` + `seo-landing-page-optimizer` + `seo-headline-generator` stack for conversion work. Outputs feed into the design tier when a redesign is needed.

## Built-in agents (provided by Claude Code)

| Agent | When | Notes |
|---|---|---|
| `Explore` | Read-only file/symbol search | Fast, scoped to "where is X" questions |
| `Plan` | Implementation planning | Returns step-by-step plan, no edits |
| `general-purpose` | Multi-step delegation, no specialist fits | Catch-all |
| `claude-code-guide` | Questions about Claude Code, API, SDK | Documentation lookup |
| `statusline-setup` | Status line config | When user asks |

## Composition rules

- `code-reviewer` runs ON the output of other agents (deploy-runner produces a diff → code-reviewer audits before push)
- `skill-router` runs BEFORE other agents when intent is fuzzy
- `memory-curator` runs in isolation — never mid-task
- `research-scout` outputs feed into other workflows (e.g. competitor data → design decisions)
- `dependency-warden` runs as part of pre-release checklist alongside `audit` skill

## When to NOT delegate to an agent

- Task is single-step and the main thread already has context
- Sub-agent would just re-read what's already in main context (wasteful)
- Time-sensitive task where agent spawn overhead > the delegation benefit

## Adding a new agent

1. Write `~/dotfiles/claude/agents/<name>.md` with frontmatter (name, description, tools, model)
2. Add row to this file's "Custom agents" table
3. Add row to CLAUDE.md AGENT ROUTING TABLE
4. Run `~/.claude/scripts/routing-drift-check.sh` to verify sync
