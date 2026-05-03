# Agent Definitions

Every agent — when to invoke, what they do, what they NEVER do. Source files at `~/dotfiles/claude/agents/<name>.md`.

## Custom agents (6)

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
