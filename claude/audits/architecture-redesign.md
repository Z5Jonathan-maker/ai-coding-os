# Autonomous Brain — Architecture Redesign (Steps 3-8)

**Iteration 1 deliverable.** Maps to user's STEP 3 (Architecture), STEP 4 (Automation), STEP 5 (Infra), STEP 6 (Tool unification), STEP 7 (Self-improvement), STEP 8 (Execution plan).

---

## STEP 3 — Architecture redesign

### The brain (Opus 4.7 in Claude Code)

```
                    ┌─────────────────────────────────────────────┐
                    │         CENTRAL BRAIN (Opus 4.7)            │
                    │  loads CLAUDE.md @ session start            │
                    │  → routing tables = first-class context     │
                    └──────┬──────────────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┬─────────────────┐
       ↓                   ↓                   ↓                 ↓
  ┌─────────┐        ┌──────────┐       ┌──────────┐      ┌──────────┐
  │ SKILLS  │        │  AGENTS  │       │   MCPs   │      │  HOOKS   │
  │ (22)    │        │  (5)     │       │  (~13)   │      │  (13)    │
  │ verbs   │        │ delegated│       │ external │      │ lifecycle│
  └─────────┘        └──────────┘       └──────────┘      └──────────┘
       │                   │                   │                 │
       └───────┬───────────┴────────┬──────────┴────────┬────────┘
               ↓                    ↓                   ↓
         ┌─────────────┐     ┌──────────────┐    ┌──────────────┐
         │ SHORT-TERM  │     │  LONG-TERM   │    │   EXTERNAL   │
         │  context    │     │ auto-memory  │    │  MemPalace   │
         │  (turn N)   │     │ (per-user)   │    │  (episodic)  │
         └─────────────┘     └──────────────┘    └──────────────┘
```

### Components and responsibilities

| Layer | Component | Responsibility | Authoritative file |
|---|---|---|---|
| **Brain** | Opus 4.7 | Reasoning, routing, synthesis | (model) |
| **Routing layer** | CLAUDE.md | Skill / agent / MCP routing tables | `~/dotfiles/claude/CLAUDE.md` |
| **Capability layer** | Skills (22) | Verbs the brain can invoke | `~/dotfiles/claude/skills/*/SKILL.md` |
| **Delegation layer** | Agents (5: code-reviewer, deploy-runner, memory-curator, skill-router, research-scout) + 5 built-ins | Sub-tasks with isolated context | `~/dotfiles/claude/agents/*.md` |
| **Tooling layer** | MCP servers | External system access | per-project `.mcp.json` + app-level config |
| **Reflex layer** | Hooks (13) | Lifecycle automation (resume, guard, notify, checkpoint) | `~/dotfiles/claude/hooks/*.sh` |
| **Memory: working** | Tool results, current convo | Volatile, per-turn | (in-context) |
| **Memory: facts** | Auto-memory | Persistent user/project facts | `~/.claude/projects/.../memory/` |
| **Memory: episodic** | MemPalace | Cross-session semantic recall | `mempalace` MCP |
| **Telemetry** | Langfuse plugin + OTLP | Performance tracing | `enabledPlugins` in settings |
| **Persistence** | Dotfiles repo | Version-controlled config | `~/dotfiles/claude/` |

### Data flow (one turn)

```
USER PROMPT
    │
    ↓
[UserPromptSubmit hooks]  ← secret-paste-guard, environment-details
    │
    ↓
[CLAUDE.md routing tables]  → brain decides: skill X + agent Y + MCP Z
    │
    ↓
[PreToolUse hooks]  ← loop-guard
    │
    ↓
[Tool execution]  → skill / agent / MCP
    │
    ↓
[PostToolUse hooks]  ← context-monitor, error-gate, git-shadow-checkpoint
    │
    ↓
[Synthesis + response]
    │
    ↓
[Stop hooks]  ← nonstop, no-ask-human, wired-up-stop, session-handover, ntfy-notify
    │
    ↓
USER (or auto-loop)
```

---

## STEP 4 — Automation & autonomy upgrades

### What's already autonomous
- ✓ Auto-resume from session checkpoints
- ✓ Auto-detect tool thrash (loop-guard) and fail fast
- ✓ Auto-notify via ntfy on Stop
- ✓ Auto-checkpoint git working tree (git-shadow-checkpoint)
- ✓ Cron self-update + memory prune + weekly health check
- ✓ Cloud Routines for shipped projects (via `route` skill)
- ✓ Langfuse OTLP tracing

### What should be automated next (priority order)

| ROI | Automation | How |
|---|---|---|
| 🔴 Highest | **Auto-promote Vercel deploys** when domain drift detected | Already shipped for aurex (`auto-promote.yml`); generalize as a `deploy-runner` agent invocation |
| 🔴 Highest | **Auto-curate auto-memory** weekly | New `memory-curator` agent + cron entry |
| 🔴 High | **Auto-route user intent** | New `skill-router` agent (created this iteration) |
| 🟡 Medium | **Auto-research before high-stakes claims** | `research-scout` agent (created this iteration) |
| 🟡 Medium | **Auto-PR for audit punch list items** | `cc-loop` dispatches one PR per Critical, runs `code-reviewer` agent before merge |
| 🟡 Medium | **Auto-rotate stale OAuth tokens** | Watch `mcp-needs-auth-cache.json`, ntfy when refresh needed |
| 🟢 Low | **Auto-screenshot every UI change** | chrome-devtools MCP + diff archive |

### Self-healing additions
- **MCP health probe:** add to `health` skill — ping each MCP, surface unauthenticated/down servers
- **Skill consistency check:** validate every SKILL.md has frontmatter + composition section + skip rules
- **Routing-table drift:** weekly diff between CLAUDE.md routing table and actual `~/.claude/skills/` + `~/.claude/agents/` directory listings — flag missing entries either way

---

## STEP 5 — Infrastructure optimization

### Compute map

| Workload | Current | Optimal |
|---|---|---|
| Local Claude Code sessions | iMac (24/7, no sleep) | ✓ keep |
| Cloud Routines | Anthropic-hosted | ✓ for shipped-product maintenance |
| Telegram bot (Aurex) | launchd `bio.aurex.botd` | ✓ keep |
| Web scraping / browser automation | Local Playwright + remote browser-use | Move parallel-agent runs to cloud browser-use |
| Vercel deploys | Hobby (Aurex) | Upgrade to Pro if traffic justifies (currently no) |
| Database (Aurex orders) | Upstash Redis | ✓ keep — already serverless |

### Latency bottlenecks (measured/inferred)
- **5 Stop hooks fire sequentially** — likely 2-5s dead air per turn. Profile + parallelize where safe (most are independent file-writes).
- **Session-resume hook** reads checkpoint disk → fast (<50ms).
- **MCP cold starts** — chrome-devtools and playwright spawn Chromium on first use (~2s). Pre-warm on SessionStart for repos that frequently use them? Risky — adds always-on memory cost.
- **Auto-memory MEMORY.md grows** — currently ~16 entries, well within budget. Cap at 200 lines (already documented in policy).

### Cost optimizations
- ✓ Claude Max subscription, not API per-token (correct mode for high-volume)
- ✓ MCP tools mostly local/free (chrome-devtools, playwright, github)
- 🟡 **Langfuse plugin** — verify it's emitting somewhere useful, otherwise OTEL config wastes cycles
- 🟡 **Cloud Routines** — review which ones are still firing weekly that don't need to (audit logs in `~/.claude/cc-*.log`)

---

## STEP 6 — Tool + API unification

### Universal tool interface (de-facto, already enforced by Claude Code)

Every tool the brain calls follows the same shape:
```
{ name: string, description: string, input_schema: JSONSchema }
```

Outputs are strings or structured tool results. This is enforced by the Claude Code runtime and applies uniformly to: built-in tools (Read/Bash/Edit/Write/Agent), skills (via Skill tool wrapper), MCP servers (via JSON-RPC), and hooks (via stdin/stdout).

### What's NOT yet uniform
- 🔴 **No shared schema for skill outputs.** Each skill returns markdown of varying structure. Recommendation: every skill that produces a "report" (audit, research-scout, memory-curator, deploy-runner) should produce JSON-frontmatter + markdown body so downstream automation can parse.
- 🟡 **MCP server precedence undefined.** 4 browser MCPs available with overlapping capability. CLAUDE.md routing table now defines `chrome-devtools` as default — enforce via skill compositions.
- 🟡 **Hook naming convention inconsistent.** Some hooks describe trigger (`session-resume`), some describe behavior (`loop-guard`). Rename for consistency on next dotfiles refactor.

### Integration plan
1. **Skill report schema** (proposal): every report-producing skill writes `### Frontmatter\n\`\`\`json\n{ "skill": "...", "version": "1", "produced_at": "...", "summary": "..." }\n\`\`\`` at top of output. Downstream agents parse the JSON, render the markdown.
2. **MCP probe in `health` skill:** enumerate available MCPs, ping each, report status. Use as gate for routing decisions.
3. **Routing-table drift check:** weekly cron walks `~/.claude/skills/`, `~/.claude/agents/`, current MCP list, diffs against CLAUDE.md tables, opens an issue/notification on drift.

---

## STEP 7 — Self-improvement system

### Recursive improvement loop

```
1. Every session generates: token usage, tool-call frequency, error rate (Langfuse)
2. Weekly cron: aggregate logs → produce `~/.claude/audits/<week>.md` performance digest
3. Punch list of inefficiencies (slow MCP, frequent hook errors, skills never invoked)
4. Dispatch fixes via cc-loop or cloud Routine
5. Code-reviewer agent gates all auto-generated fixes
6. Merge → telemetry resumes → loop
```

### Feedback mechanisms

| Signal | Source | Action |
|---|---|---|
| Tool error rate >5% | error-gate hook + Langfuse | `audit` skill investigates |
| Hook avg latency >500ms | context-monitor hook | Profile + parallelize or trim |
| Skill invocation count = 0 over 30d | session log analysis | Mark skill for review (deprecate or improve description) |
| MEMORY.md > 180 lines | memory-curator agent | Consolidate |
| Auto-memory entry stale >90d | memory-curator agent | Flag for user review |
| Routing collision (user picks wrong skill) | manual user feedback | Update routing table + skill description |

### Simulation before applying
- For risky changes (skill rewrites, hook order changes), run in a `bypassPermissions:false` shadow session first. Compare behavior diff.
- For routing-table changes, dry-run via `skill-router` agent on a corpus of past prompts (from `~/.claude/projects/.../jsonl`) — does the new routing match what actually got picked?

---

## STEP 8 — Execution plan (priority-ordered)

### ✅ Done this iteration
1. ✅ Audit map — `~/.claude/audits/master-config-audit.md`
2. ✅ Routing graph — `~/.claude/audits/routing-graph.md`
3. ✅ CLAUDE.md rewritten with skill/agent/MCP routing tables (the central brain)
4. ✅ 4 new agents created: deploy-runner, memory-curator, skill-router, research-scout
5. ✅ Architecture doc — this file

### 🔴 Critical (next 1-2 iterations)
6. Sync `~/.claude/audits/` to dotfiles (currently local-only)
7. Verify ruflo MCP — is it actually loaded? If yes, document; if no, remove the line from CLAUDE.md
8. Add MCP-health probe to `health` skill
9. Add `wired-up`/`nonstop` cross-references to each other's SKILL.md
10. Disambiguate the 5 design skills with explicit "skip when…" sections

### 🟡 High (next 5 iterations)
11. Consolidate browser MCPs — pick chrome-devtools as default, retire one of the others
12. Add `user_role.md` to auto-memory (the most-referenced missing fact)
13. Profile the 5 Stop hooks — parallelize where safe
14. Verify Langfuse plugin is actually emitting; remove if not
15. Backfill "Composition with the rest of the stack" sections in 17 skills
16. Add weekly `memory-curator` cron entry
17. Add weekly routing-table drift check
18. Document hook ordering in settings.json with comments

### 🟢 Medium (eventual)
19. Skill report schema (JSON frontmatter)
20. Pre-warm chrome-devtools / playwright on SessionStart for repos that need it
21. Build skill-invocation-frequency tracker (which skills never get used)
22. Generalize the `auto-promote.yml` Vercel pattern as a reusable workflow

### Approval gates the user must clear
- 🛑 Sync `audits/` to dotfiles? (modifies dotfiles structure)
- 🛑 Remove ruflo line from CLAUDE.md if MCP not loaded?
- 🛑 Retire one of the 4 browser MCPs?
- 🛑 Disable Langfuse plugin if not emitting?
