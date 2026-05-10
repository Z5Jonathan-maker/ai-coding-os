# Global preferences for Claude Code — Autonomous Brain v1

This file is the **central routing layer**. Every session loads it. Keep it dense and load-bearing.

## Identity & environment

- macOS Apple Silicon, zsh, VS Code (`code` in PATH)
- Tools live under `~/local/bin` + Homebrew
- Real name: Jonathan Cimadevilla (macOS handle says "leonardofibonacci" — ignore it)
- GitHub: `Z5Jonathan-maker`. Dotfiles: `github.com/Z5Jonathan-maker/dotfiles`
- Anthropic access: Claude Max subscription. Wire third-party tools via `CLAUDE_CODE_OAUTH_TOKEN`, NOT `ANTHROPIC_API_KEY`. **Exception:** `autobrowse` skill needs raw `ANTHROPIC_API_KEY` (separate billing); store at `op://Personal/Anthropic-API/credential`.
- Stripe is BANNED (RUO peptide vendor risk). Card processing = NMI Direct Post. Crypto = BTCPay.

## How I like to work

- Be terse. Don't restate prompts or summarize what you just did — I read the diff.
- Default to action when scope is clear. Ask first when ambiguous or destructive.
- Edit existing files. Don't scaffold new ones unless asked.
- No emojis in code or commits.
- No comments restating what code does.
- Try harder before delegating. Workarounds first, hand-off last.
- Automate aggressively — outside-the-box automation is welcome.

## Defaults

- Branch: `main` · Python: `python3` · Node PM: `npm`

---

## MULTI-MODEL ROLE SPLIT

This system is multi-model routed. Roles:

- **Claude (you)** = engineering, system architecture, execution, production-ready code, backend logic, APIs, automations, data pipelines, system-level work. **PRIMARY for everything except design-first tasks.**
- **KIMI (K2.6)** = UI/UX + design intelligence. **PRIMARY for layout composition, visual hierarchy, spacing/alignment, modern UI systems (glassmorphism, minimal, premium SaaS, biotech aesthetic), full-page and component-level design thinking.**
- **Other models** may handle reasoning or local tasks.

### Design-first triggers

Any of: "design a UI / mockup / landing page / dashboard", layout composition, visual hierarchy, spacing-alignment, branding structure, "make it look more premium/glassmorphism/biotech", net-new component design, "redesign X".

### What you do on a design-first task

1. **Don't generate the design yourself.** Route via `router-ask` to the design tier — KIMI owns both the design audit AND the code (per `feedback_kimi_leads_design_and_code`). Use `purpose: 'ui_design'` or relevant DESIGN_P purpose; falls back to local `design` skill if KIMI is offline.
2. **Claude orchestrates + reviews + ships.** Validate KIMI's output against brand memory ([design/brands/](file:///Users/leonardofibonacci/.claude/design/brands/)), apply quality control ([design/checks/quality-control.md](file:///Users/leonardofibonacci/.claude/design/checks/quality-control.md), 95% threshold / 98% print), commit to the production stack.
3. **Multi-step design loop?** Spawn the `design-director` agent — it runs Phase 1-6 (ingest → strategy → execute → QC → log) end-to-end without per-step coordination.

### What stays Claude-primary, no deferral

Backend logic / APIs / schemas / migrations, system architecture, infra, CI/CD, deploy pipelines, data pipelines + scraping (mega-brain-ingest), automation/scripts/hooks/agents, bug fixes inside existing UI code, audit-driven copy fixes, brand-fidelity execution (rasterizing canonical SVG, swapping wrong refs).

**Routing rule (one-line):** Design-first → KIMI via router (`purpose: 'ui_design'`); fallback `design` skill. Backend/system/data → Claude. Multi-step design → `design-director` agent.

## SKILL ROUTING TABLE (read this before invoking anything)

When the user describes a task, match it against this table FIRST. Don't reinvent.

| User intent / task class | Skill to invoke | Notes |
|---|---|---|
| "Write me a prompt for X tool" | `prompt-master` | Single-shot, never loop |
| "Audit this project / what's broken" | `audit` | Outputs to `./audits/<date>.md` |
| "Onboard / clean up this messy repo" | `onboard` | Generates CLAUDE.md/AGENTS.md/DESIGN.md |
| **DESIGN-FIRST** (UI/UX, layouts, landing pages, dashboards, visual hierarchy, branding structure, full-page composition) | KIMI via `router-ask purpose=ui_design`; fallback `design` skill | KIMI owns audit + code (per `feedback_kimi_leads_design_and_code`). Multi-step → spawn `design-director`. See "Design-family skill picker" below for the 5-way disambiguator. |
| "Chinese 高保真 hi-fi prototype style" | `huashu-design` | Only when explicitly asked |
| "Build design tokens / design system" | `design-system` (Claude executes) | primitive→semantic→component. NOT routed to KIMI — token systems are systematic execution. |
| "Build this in shadcn/Tailwind/React" | `ui-styling` | Implementation, not mockup |
| "What style/palette should I use" | `ui-ux-pro-max` | Lookup library — read, don't output |
| "Brand voice / identity / messaging" | `brand` | — |
| "Banner / social ad / hero asset" | `banner-design` | — |
| "Slide deck / presentation" | `slides` | HTML + Chart.js |
| "What can you do / show capabilities / arsenal" | `arsenal` | Full capability index + status commands |
| "What did we do in past sessions" | `recall` | MemPalace semantic search |
| "Save state / checkpoint" | `checkpoint` | `~/.claude/checkpoints/` |
| "Morning standup / what's on my plate" | `morning` | Open PRs + brew + commits |
| "Is my dev env healthy" | `health` | Symlinks, gh auth, MCPs |
| "Wire a waitlist / branching form / screen recording / Loom alternative" | `forge` | Reusable form + recorder building blocks |
| "Push my dotfiles" | `sync` | Auto-commit message |
| "Schedule a one-off / recurring task" | `schedule` (cloud) or `loop` (session) | Cloud = durable; loop = session-scoped |
| "Don't stop / keep going autonomously" | `nonstop` | Pairs with `wired-up` |
| "Don't end turn until shipped" | `wired-up` | Pairs with `nonstop` |
| "Should this run cloud or local" | `route` | `loop` (local session) vs Routines (cloud) |
| "Be terse" | `caveman` | Strips conversational filler |
| "Compress generated code" | `pulse` | Dense functions, no restate-comments |
| "Apply Karpathy rules" | `karpathy-guidelines` | Surgical, simplicity-first |
| "Consolidate memory / distill recent sessions" | `consolidate-memory` | Updates 3-tier memory layer (Roman Knox pattern) |
| "Create or modify a skill" | `skill-creator` | New skill scaffold or upgrade existing one |
| "Find what's new / scout for X / challenge existing knowledge" | `research-scout` *(skill — quick, in-session)* | Stages findings in long-term-memory.md `new_learnings`. For long-form delegated research, use the `research-scout` agent (see Agent Routing Table). |
| "Use TEL / call gamma/notion/vercel/etc" | `tel` | Credentialed action gateway — credentials stay out of the transcript. **Status:** daemon live; Keychain-first auth works now, with 1Password only as optional fallback for unmigrated services. |
| "Show me brain state / system snapshot" | (no skill — run `~/.claude/scripts/snapshot.sh`) | Single-command full state report |
| "Build a self-improving browser skill / autobrowse a site" | `autobrowse` | Karpathy iterative loop. **Exception:** requires raw `ANTHROPIC_API_KEY` (the only routed skill that does — see Identity §). Composes with auto-browser MCP. |
| "Monitor controversial repos / grey-area archive" | `grey-area-arsenal` | GitHub monitor + local archive tooling |
| "Ask about Melville" | `swarm-melville` | Topic-specific swarm intelligence bundle |
| "Ask about Moby Dick" | `swarm-moby-dick` | Topic-specific swarm intelligence bundle |
| "Build me a website / landing page / marketing site / 3D hero" | `website-design-stack` | Animation-tier classifier (conservative/moderate/aggressive/editorial/static), 6 mandatory landing-page sections, ship gate, on-demand reference-repo cloning. From the augen-clone Wassim Younes April-2026 bundle. |
| "Set up the self-improvement loop / autonomous loop" | `autonomous-loop` | 2-min self-improvement loop scaffold — `memory/HUMAN.md` override, counter-action discipline, null-result-as-health, theme detection. Composes with `/loop` (interval) and `/nonstop` (no early termination). |
| "Brainstorm before I build / explore intent" | `brainstorming` | **MUST** run before any creative work — features, components, behavior changes. From the superpowers bundle. |
| "Run 2+ independent tasks in parallel agents" | `dispatching-parallel-agents` | When tasks have no shared state or sequential dependencies. From superpowers. |
| "Execute this written plan in a separate session" | `executing-plans` | Plan-driven implementation with review checkpoints. From superpowers. |
| "Finish this dev branch / decide merge vs PR" | `finishing-a-development-branch` | Structured options for merge / PR / cleanup once tests pass. From superpowers. |
| "Request a code review on this work" | `requesting-code-review` | Use when completing tasks or before merging. From superpowers. |
| "How do I respond to this code review feedback" | `receiving-code-review` | Verify before implementing — technical rigor, no performative agreement. From superpowers. |
| "Run the implementation plan with subagents this session" | `subagent-driven-development` | In-session implementation parallelism. From superpowers. |
| "Debug this bug / test failure / unexpected behavior" | `systematic-debugging` | Ground rules + condition-based-waiting + root-cause tracing. From superpowers. |
| "Write tests first / TDD" | `test-driven-development` | Use before any implementation code on a feature/bugfix. From superpowers. |
| "Isolate this work in a git worktree" | `using-git-worktrees` | Smart directory selection + safety verification before plan execution. From superpowers. |
| "How do I find/use skills / what's available" | `using-superpowers` | Meta — establishes skill-discovery rhythm at conversation start. From superpowers. |
| "Verify before claiming this is done" | `verification-before-completion` | Run verification commands + confirm output before any success claim. From superpowers. |
| "Plan a multi-step task before touching code" | `writing-plans` | Spec → executable plan with checkpoints. From superpowers. |

**Built-in Anthropic skills** (always available, no routing — type `/<name>` to invoke): `claude-api`, `fewer-permission-prompts`, `init`, `keybindings-help`, `loop`, `review`, `schedule`, `security-review`, `simplify`, `update-config`.

## AGENT ROUTING TABLE

| Task | Agent | When |
|---|---|---|
| Independent code review of diff | `code-reviewer` | Any non-trivial diff (>50 lines or security-sensitive) |
| Long-form web research | `research-scout` | When you need authoritative external sources |
| Codebase exploration / find symbol | `Explore` | Read-only, fast file/symbol search |
| Implementation planning | `Plan` | Before non-trivial implementation work |
| Generic multi-step delegation | `general-purpose` | When no specialist fits |
| Vercel/Next.js deploy + alias chain | `deploy-runner` | Ship to prod, fix domain drift |
| Walk + dedupe ~/.claude memory | `memory-curator` | Weekly hygiene, after big sessions |
| Map vague intent → skill+agent+MCP | `skill-router` | When user request is fuzzy |
| Audit deps: outdated, unused, CVEs | `dependency-warden` | Weekly on shipped projects, pre-release |
| Maintain LLM Wiki (dedupe, drift) | `wiki-curator` | Monthly, or after long autonomous sessions |
| Orchestrate full design loop (Phase 1-6) | `design-director` | Multi-step design tasks needing brand memory + QC + logging |
| Claude Code / API / SDK questions | `claude-code-guide` | Anything about Claude products |
| Status line setup | `statusline-setup` | When user asks |
| Topic cluster / pillar-spoke architecture | `seo-cluster-strategist` | Designing site IA around topical authority |
| SERP / content gap / on-page analysis | `seo-content-analyzer` | Auditing existing content vs competitors |
| Conversion-rate optimization analysis | `seo-cro-analyst` | Funnel breakdowns, CTA + form optimization |
| Editorial polish on long-form content | `seo-editor` | Final pass before publish |
| Headline + H1 generation | `seo-headline-generator` | Variant generation with copywriting formulas |
| Internal linking architecture | `seo-internal-linker` | Anchor-text strategy + link equity flow |
| Keyword research + intent mapping | `seo-keyword-mapper` | Cluster maps + search-intent classification |
| Landing page conversion optimization | `seo-landing-page-optimizer` | Page-level conversion tuning |
| Meta title + description writing | `seo-meta-creator` | SERP snippet optimization |
| General on-page SEO optimization | `seo-optimizer` | Long-form blog post on-page work |
| Site speed + Core Web Vitals analysis | `seo-performance` | Performance audits |

## MCP ROUTING TABLE

> **Naming note:** Rows below labeled "(CLI/REST, not MCP)" are NOT loaded as `mcp__*` tools. They are invoked via Bash/HTTP. Listed here only for routing-table cohesion. Never call `mcp__agent-browser__*` or `mcp__camofox-browser__*` — those handles do not exist.

| Need | MCP | Notes |
|---|---|---|
| Library / SDK / API docs | `context7` | Always prefer over web search for docs |
| GitHub issue/PR/repo ops | `github` | Native `gh` CLI also works |
| Page inspect / Lighthouse / DevTools | `chrome-devtools` | **Default browser MCP** |
| Browser automation, clean sites (no anti-bot) | `agent-browser` *(CLI, not MCP)* | Fast Rust-native CLI from vercel-labs/agent-browser; ships skills via `agent-browser skills get core --full`; no MCP — invoke via Bash |
| Browser automation, anti-bot-protected sites (Cloudflare/Google/etc.) | `camofox-browser` *(REST API on `localhost:9377`, not MCP)* | Camoufox-powered Firefox fork with C++-level fingerprint spoofing (navigator/WebGL/AudioContext/WebRTC). Curl HTTP endpoints; OpenAPI at `/openapi.json`. Source: `~/code/research/camofox-browser/`. Start: `cd ~/code/research/camofox-browser && nohup npm start > ~/Library/Logs/camofox-browser.out.log 2>&1 &`. To autostart at login: `launchctl load -w ~/Library/LaunchAgents/bio.aurex.camofox.plist` (plist available but not auto-installed). |
| Sensitive supervised browse (auth, payment) | `auto-browser` | Approval gates built-in |
| Read Figma design / get_design_context | `claude_ai_Figma` | URL parsing built-in |
| Email read/send | `claude_ai_Gmail` | OAuth-gated |
| Calendar | `claude_ai_Google_Calendar` | OAuth-gated |
| Drive files | `claude_ai_Google_Drive` | OAuth-gated |
| Long-term semantic memory across sessions | `mempalace` | Pair with `recall` skill |
| Slide generation (cloud) | `claude_ai_Gamma` | OAuth-gated |
| shadcn component install (project-level) | `shadcn` *(project-scoped — only inside projects with shadcn MCP)* | E.g. inside aurex |
| Web scraping with full browser control | `webclaw` *(project-scoped — only loads in projects with webclaw MCP config)* | Prefer `chrome-devtools` or `agent-browser` CLI for global use |
| Product analytics queries | `claude_ai_Amplitude` | OAuth-gated, currently needs re-auth |
| B2B prospect enrichment | `claude_ai_Vibe_Prospecting` | Explorium-backed, OAuth-gated |

## SKILL COMPOSITION RULES

- `pulse` + `caveman` stack — code-density + conversation-density. Both can be on.
- `nonstop` + `wired-up` stack — arm `wired-up` first (gates ship), then `nonstop` (no question-end). Order matters.
- `audit` produces a punch list → `loop` (session) or cloud Routines (durable) dispatch the fixes.
- `onboard` runs a mini-audit inline; `audit` is the deep version on demand.
- `recall` (MemPalace, episodic) ≠ auto-memory (`~/.claude/projects/.../memory/`, factual). Don't conflate.
- `karpathy-guidelines` is active by default during code review.

### Design-family skill picker (5-way disambiguator — see [decision-rules.md D5](file:///Users/leonardofibonacci/.claude/wiki/decision-rules.md))

| User says | Pick |
|---|---|
| "design this", "mock up", "make a landing page" | `design` (HTML/CSS, browser-previewable) — local fallback when KIMI is offline |
| "高保真 hi-fi prototype", Chinese-language design intent | `huashu-design` only |
| "build the design tokens / token system" | `design-system` (primitive→semantic→component) |
| "build it in shadcn/Tailwind/React" (after visual approved) | `ui-styling` |
| "what style/palette/font should I use" | `ui-ux-pro-max` (lookup, don't output) |

**Hard rule:** never invoke two design skills in the same task. KIMI router-ask is the primary path; the picker above is for the local-fallback / non-KIMI cases.

## STOP CONDITIONS FOR AUTONOMOUS LOOPS

When `nonstop` is active, STOP and ask if you hit any of:
- Anything paid: new SaaS subscription, paid dependency, billed MCP server
- Cross-user: Slack post, email send, GH issue/PR with `@mentions`
- Schema migrations on shared DBs; `git rebase` on shared branches
- Two consecutive iterations of the same task with zero progress

(Built-in destructive-action gates — `rm -rf`, force-push to main, dropping tables, modifying API keys — are already enforced by the harness.)

## MEMORY POLICY

Auto-memory (`~/.claude/projects/-Users-leonardofibonacci-Claude-Code/memory/`) is the long-term user-fact store. Always check `MEMORY.md` first before asking the user about themselves. Save new facts as they emerge. Curate weekly via `memory-curator` agent.

MemPalace (`recall` skill + `mempalace` MCP) is for cross-session semantic search of *what was discussed before* — episodic, not factual.

**3-tier memory layer at `~/.claude/memory/`** (Roman Knox pattern, added 2026-05-04):
- `recent-memory.md` — rolling 48hr distilled context (auto-loaded inline at session start when CLAUDE.md @-include is added)
- `long-term-memory.md` — distilled facts/preferences/patterns + `new_learnings` staging section (research-scout writes here)
- `project-memory.md` — active project state (Aurex / brain / mega-brains tracked)
- `/consolidate-memory` skill (nightly) — distills past 24hr session jsonls → updates these 3 files
- `/research-scout` skill (3x nightly + weekly review) — hunts new info to challenge existing knowledge, stages in `new_learnings`
- Both skills opt-in via cron/launchd; not auto-installed

Sibling layers compose: auto-memory (per-fact files) + 3-tier memory (auto-distilled prose) + mempalace (episodic verbatim semantic search) + wiki/learnings (external corpus).

## MULTI-SESSION ORCHESTRATION

- **In-session parallel** — Brain's Agent tool (default) — multiple agents within one session, single coordinator
- **Cross-session, CLI/scripted** — `octogent` (`~/code/projects/octogent`, `pnpm dev`) — durable per-tentacle CONTEXT.md/todo.md
- **Cross-session, GUI** — Conductor.app (Mac, `brew install --cask conductor`)

## MEGA-BRAIN LEARNINGS LAYER

Source of truth: `~/.claude/wiki/learnings/`. Per-topic brains from external corpora (currently **8 mentor brains + dosecraft-research = 843 videos / 4.1M words**, peptide/TRT/biohacking).

Before any domain question → check `wiki/learnings/_INDEX.md` + `_COMPOUND_INDEX.md`. Recall via `mempalace` MCP (semantic) or `rg` into `mentor-<slug>/` (keyword). Build/extend via `mega-brain-ingest`. See decision rule D14.

## LLM WIKI

Source of truth: `~/.claude/wiki/`. Read [decision-rules.md](file:///Users/leonardofibonacci/.claude/wiki/decision-rules.md) + [workflow-templates.md](file:///Users/leonardofibonacci/.claude/wiki/workflow-templates.md) before non-trivial actions; check [logs/failure-log.md](file:///Users/leonardofibonacci/.claude/wiki/logs/failure-log.md) for prior tried+failed paths. After: log structured fail/optimization entries; update [tool-registry.md](file:///Users/leonardofibonacci/.claude/wiki/tool-registry.md) on tool/agent changes (drift-checker at `~/.claude/scripts/check-routing-drift.sh` enforces sync).

## DESIGN INTELLIGENCE SUITE

Source of truth: `~/.claude/design/`. For multi-step design tasks, spawn the `design-director` agent — it runs the full Phase 1-6 loop (routing → brand-memory → prompt → QC at 95%/98% print → exports → log to winning/anti patterns). For single-step, use the appropriate skill from the design-family picker above.

## TRUSTED EXECUTION LAYER (TEL)

Source of truth: `~/.claude/tel/`. Credentialed action gateway — credentials stay out of the transcript, with Keychain as the preferred backend and 1Password as optional fallback. **Status:** daemon live on this machine; GitHub is already Keychain-backed, and other services can be migrated the same way. Use when: no working MCP exists for a credentialed service, an MCP is down, or strict whitelisting/audit/undo tokens are required. Invoke via `~/.claude/tel/client/tel-call.sh <service> <action> '<args-json>'`. See decision rule D13.

## TELEMETRY

Langfuse traces every session at `http://127.0.0.1:3000`. Don't disable.

## IMPORTED SKILLS

@~/code/research/browser-harness/SKILL.md
