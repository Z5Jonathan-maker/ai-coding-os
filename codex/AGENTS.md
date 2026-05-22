# Global preferences for Codex — Autonomous Brain v1

This file is the **central routing layer**. Every session loads it. Keep it dense and load-bearing.

## Identity & environment

- macOS Apple Silicon, zsh, VS Code (`code` in PATH)
- Tools live under `~/local/bin` + Homebrew
- Real name: Jonathan Cimadevilla (macOS handle says "leonardofibonacci" — ignore it)
- GitHub: `Z5Jonathan-maker`. Dotfiles: `github.com/Z5Jonathan-maker/dotfiles`
- Anthropic access: Codex Max subscription. Wire third-party tools via `CLAUDE_CODE_OAUTH_TOKEN`, NOT `ANTHROPIC_API_KEY`. **Exception:** `autobrowse` skill needs raw `ANTHROPIC_API_KEY` (separate billing); store at `op://Personal/Anthropic-API/credential`.
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

## EXECUTION MODE CLASSIFIER

Adapted from PAI v6.3.0 — auto-select operating mode by task class, with explicit effort overrides.

### Modes

- **MINIMAL** — pure acknowledgments, ratings, single-line answers. No tool calls. No preamble. Match the request's energy.
  - *When*: "ok", "thanks", single-line factual lookups, "rate this 1-10."
- **NATIVE** — direct response, light tool use (1-3 calls), no orchestration. The default mode.
  - *When*: explain code, fix one bug, edit one file, run one command, answer a how-do-I.
- **ALGORITHM** — multi-step disciplined work. Mandatory chain: `brainstorming` → `isa` → `writing-plans` → `nyquist-gate` → `executing-plans` → `verification-before-completion`. Spawns parallel agents when independent. Logs to wiki on completion.
  - *When*: features touching ≥3 files, redesigns, audits, refactors, autonomous loops, content commissions, cross-repo work, anything payment/auth/compliance.

### Effort tiers (explicit override)

Append "E1"–"E5" inline ("do X, E3") to force a tier. Higher = more depth, more verification, more agents.

- **E1 (Standard, fast-path)** — NATIVE mode, skip mandatory pre-work. Use when user explicitly says "just do it" or for known-trivial scopes.
- **E2 (Extended)** — NATIVE mode + brainstorm. One round of clarifying thought before action.
- **E3 (Advanced)** — ALGORITHM mode without parallel agents. Sequential discipline.
- **E4 (Deep)** — ALGORITHM mode + parallel agent dispatch where independent + full verification.
- **E5 (Comprehensive)** — ALGORITHM mode + multi-agent + research-scout corroboration + ISA-first + post-cycle reflection log + memory update.

Default tier per mode: MINIMAL→E1, NATIVE→E2, ALGORITHM→E4.

### Composes with

- `/caveman` (output density) and `/pulse` (code density) are orthogonal — on at any tier.
- ALGORITHM REQUIRES `/brainstorming` first (superpowers hard rule), then `/isa` if the task lacks a crisp done-state.
- E5 writes to `~/.Codex/memory/recent-memory.md` for next-session continuity.

---

## MULTI-MODEL ROLE SPLIT

This system is multi-model routed. Roles:

- **Codex (you)** = engineering, system architecture, execution, production-ready code, backend logic, APIs, automations, data pipelines, system-level work. **PRIMARY for everything except design-first tasks.**
- **KIMI (K2.6)** = UI/UX implementation + browser/design operator. **PRIMARY for turning approved visual direction into real layouts, components, spacing, alignment, responsive UI, and browser-verified code.**
- **ChatGPT / Image 2.0** = creative direction + canonical brand/image engine. **PRIMARY for static visual concepts, hero/background direction, canonical product/brand assets, product listing images, ad creatives, and style-reference mockups.**
- **KIMI free path** = `cf_kimi` tier — `@cf/moonshotai/kimi-k2.6` via Cloudflare Workers AI, 100K-250K tokens/day free. Slots into `design` fallback chain BEFORE `precision`. Direct invoke: `router-ask purpose=bulk_kimi`.
- **OpenRouter gateway** = `openrouter` tier. Free-first (DeepSeek-v4-flash:free, Qwen3-coder:free), escalates to `gemini-2.5-flash` ($0.30/$2.50 per M) when prompt > 128k chars. Registered as fallback for `cheap` and `precision`. Direct invoke: `router-ask purpose=long_context_query` or `purpose=openrouter_query`.
- **Other models** may handle reasoning or local tasks.

### Design-first triggers

Any of: "design a UI / mockup / landing page / dashboard", layout composition, visual hierarchy, spacing-alignment, branding structure, "make it look more premium/glassmorphism/biotech", net-new component design, "redesign X".

If the request asks for **creative direction**, a **static visual example**, a **hero/background concept**, a **canonical brand/product asset**, or "show me what this should look like", route to ChatGPT/Image 2.0 first. Then route the approved reference to Kimi for functional UI implementation.

### What you do on a design-first task

1. **Choose the design phase.** Static creative direction/reference asset → ChatGPT/Image 2.0 (`purpose: 'creative_direction'`, `style_reference`, `hero_image`, `product_photography`, etc.). Functional UI/code/browser execution → KIMI (`purpose: 'ui_design'` or relevant DESIGN_P purpose).
2. **For Image 2.0 work, preserve continuity.** Use canonical reference images when available, save the prompt/manifest, and treat the generated reference as the source of truth for Kimi's implementation pass.
3. **For Kimi work, execute the approved reference.** Kimi owns layout/code/browser verification from the Image 2.0 reference or existing brand memory; it should not reinvent the visual direction unless explicitly asked.
4. **Codex orchestrates + reviews + ships.** Validate KIMI's output against brand memory ([design/brands/](file:///Users/leonardofibonacci/.Codex/design/brands/)), apply quality control ([design/checks/quality-control.md](file:///Users/leonardofibonacci/.Codex/design/checks/quality-control.md), 95% threshold / 98% print), commit to the production stack.
5. **Multi-step design loop?** Spawn the `design-director` agent — it runs Phase 1-6 (ingest → strategy → execute → QC → log) end-to-end without per-step coordination.

### What stays Codex-primary, no deferral

Backend logic / APIs / schemas / migrations, system architecture, infra, CI/CD, deploy pipelines, data pipelines + scraping (mega-brain-ingest), automation/scripts/hooks/agents, bug fixes inside existing UI code, audit-driven copy fixes, brand-fidelity execution (rasterizing canonical SVG, swapping wrong refs).

**Routing rule (one-line):** Creative direction/static visual reference → ChatGPT/Image 2.0. Functional UI/browser execution → KIMI. Backend/system/data → Codex. Multi-step design → `design-director` agent.

## SKILL ROUTING TABLE (read this before invoking anything)

When the user describes a task, match it against this table FIRST. Don't reinvent.

| User intent / task class | Skill to invoke | Notes |
|---|---|---|
| "Write me a prompt for X tool" | `prompt-master` | Single-shot, never loop |
| "Audit this project / what's broken" | `audit` | Outputs to `./audits/<date>.md` |
| "Onboard / clean up this messy repo" | `onboard` | Generates AGENTS.md/AGENTS.md/DESIGN.md |
| **CREATIVE-DIRECTION** (static visual direction, "show me an example", hero/background concepts, canonical brand/product assets, style references, product listing images) | ChatGPT/Image 2.0 via `router-ask purpose=creative_direction`; fallback `cc-image` only when API billing is acceptable | Use canonical references. Save prompt/manifest. Kimi implements approved references into functional UI. |
| **DESIGN-FIRST / IMPLEMENTATION** (UI/UX code, layouts, landing pages, dashboards, visual hierarchy, branding structure, full-page composition) | KIMI via `router-ask purpose=ui_design`; fallback `design` skill | KIMI owns execution/code/browser verification from approved direction. Multi-step → spawn `design-director`. |
| "Chinese 高保真 hi-fi prototype style" | `huashu-design` | Only when explicitly asked |
| "Build design tokens / design system" | `design-system` (Codex executes) | primitive→semantic→component. NOT routed to KIMI — token systems are systematic execution. |
| "Build this in shadcn/Tailwind/React" | `ui-styling` | Implementation, not mockup |
| "What style/palette should I use" | `ui-ux-pro-max` | Lookup library — read, don't output |
| "Brand voice / identity / messaging" | `brand` | — |
| "Banner / social ad / hero asset" | `banner-design` | — |
| "Slide deck / presentation" | `slides` | HTML + Chart.js |
| "What can you do / show capabilities / arsenal" | `arsenal` | Full capability index + status commands |
| "Open cockpit / AI-HQ workspace" | `00-open-cockpit` | Slash command: opens the AI-HQ control workspace |
| "System status / AI-SYSTEM-V2 dashboard" | `01-system-status` | Slash command: live status dashboard |
| "Route this task through AI-SYSTEM-V2" | `02-route-task` | Slash command: route via the control plane |
| "Load Aurex workflow" | `10-wf-aurex` | Slash command: project workflow context |
| "Load browser workflow" | `10-wf-browser` | Slash command: browser automation workflow |
| "Load claims workflow" | `10-wf-claims` | Slash command: claims project workflow |
| "Load coding workflow" | `10-wf-coding` | Slash command: coding workflow |
| "Load creative workflow" | `10-wf-creative` | Slash command: creative workflow |
| "Load DoseCraft workflow" | `10-wf-dosecraft` | Slash command: DoseCraft workflow |
| "Load website workflow" | `10-wf-website` | Slash command: website workflow |
| "What did we do in past sessions" | `recall` | MemPalace semantic search |
| "Save state / checkpoint" | `checkpoint` | `~/.Codex/checkpoints/` |
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
| "Log what worked / left a learning behind / reflect on this cycle" | `cc-reflect` (CLI, not a skill) | `cc-reflect optimization\|cycle\|failure --flags…` — queues to `~/.Codex/state/reflection-queue.jsonl`; Stop hook drains to `wiki/logs/optimization-log.md` (or `failure-log.md`). Use after non-trivial work so the wiki accumulates structured history instead of hand-curated entries. |
| "Is everything actually working / single truth across stack" | (no skill — run `~/AI-SYSTEM-V2/scripts/ai-control.sh status`) | Live dashboard for router tiers, bridges, MCP daemons, memory, browser lane, TEL, launch agents, projects, and drift signals. `cc-health` was retired in the 2026-05-19 cleanup. |
| "Is my prod actually getting my pushes / autonomous loop reaching prod" | `cc-deploy-watch` (CLI, not a skill) | `cc-deploy-watch <owner/repo> <domain>` — cross-references GitHub HEAD vs check-runs vs Vercel deploy vs live HTTP. Writes alerts to `~/.Codex/state/deploy-alerts.log`; surfaced by AI-SYSTEM-V2 status. Caught the 2026-05-14 "autonomous loop pushing into void" pattern: 20+ cycles failing GHA billing → stale prod. |
| "Create or modify a skill" | `skill-creator` | New skill scaffold or upgrade existing one |
| "Find what's new / scout for X / challenge existing knowledge" | `research-scout` *(skill — quick, in-session)* | Stages findings in long-term-memory.md `new_learnings`. For long-form delegated research, use the `research-scout` agent (see Agent Routing Table). |
| "Use TEL / call gamma/notion/vercel/etc" | `tel` | Credentialed action gateway — credentials stay out of the transcript. **Status:** daemon live; Keychain-first auth works now, with 1Password only as optional fallback for unmigrated services. |
| "Show me brain state / system snapshot" | (no skill — run `~/.Codex/scripts/snapshot.sh`) | Single-command full state report |
| "Use my logged-in browser / open a page / screenshot / click around" | `kimi-webbridge` | Default real Chrome bridge with user session/cookies preserved |
| "Build a self-improving browser skill / autobrowse a site" | `autobrowse` | Karpathy iterative loop. **Exception:** requires raw `ANTHROPIC_API_KEY` (the only routed skill that does — see Identity §). Composes with Kimi WebBridge or Playwright depending on task shape. |
| "Monitor controversial repos / grey-area archive" | `grey-area-arsenal` | GitHub monitor + local archive tooling |
| "Build me a website / landing page / marketing site / 3D hero" | `website-design-stack` | Animation-tier classifier (conservative/moderate/aggressive/editorial/static), 6 mandatory landing-page sections, ship gate, on-demand reference-repo cloning. From the augen-clone Wassim Younes April-2026 bundle. |
| "Start the self-paced autonomous loop / mega-cycle" | `mega-cycle` | Self-paced depth-ladder loop. Each cycle ≥ previous (surface→diagnostic→root-cause→refactor→audit→foundation). Anti-pattern memories auto-apply. Pairs with `nonstop` + `wired-up`. Slash command at `~/.Codex/commands/mega-cycle.md`. |
| "Check if I'm regressing to surface fixes" | `depth-check` | Meta-audit of recent cycles. Flags depth-drift (agent regressing to 1-line edits). Slash command at `~/.Codex/commands/depth-check.md`. |
| "Go nuclear / godmode / max autonomy this session" | `godmode` | Activates max-autonomy mode (terse + pulse + parallel + no clarifying questions). Slash command at `~/.Codex/commands/godmode.md`; CLI at `~/.Codex/bin/cc-godmode`. Composes with `/caveman` + `/pulse`. |
| "Spawn new skill / memory / diagnostic mid-loop" | `evolve` | On-the-fly self-evolution. Creates new capabilities based on patterns the agent notices. Slash command at `~/.Codex/commands/evolve.md`. |
| "Register a new scheduled / recurring task right now" | `schedule-task` | Cross-platform cron registration (macOS/Linux/Windows). The agent can register its own recurring tasks mid-loop. Slash command at `~/.Codex/commands/schedule-task.md`. |
| "Set up the self-improvement loop / autonomous loop" | `autonomous-loop` | 2-min self-improvement loop scaffold — `memory/HUMAN.md` override, counter-action discipline, null-result-as-health, theme detection. Composes with `/loop` (interval) and `/nonstop` (no early termination). |
| "Brainstorm before I build / explore intent" | `brainstorming` | **MUST** run before any creative work — features, components, behavior changes. From the superpowers bundle. |
| "Define done before starting / PRD-style WHAT-DONE-LOOKS-LIKE" | `isa` | Generates `.ai/ISA-<slug>.md` — Vision (present tense) + numbered ISCs (atomic, verifiable) + anti-goals + constraints. Run AFTER `/brainstorming`, BEFORE `/writing-plans`. ISCs feed `/nyquist-gate` and `/verification-before-completion`. Adapted from PAI v5.0.0. |
| "Validate test coverage before execution / one signal per requirement" | `nyquist-gate` | Generates `.ai/NYQUIST.md` mapping requirement→test command. **Mandatory** before `/executing-plans` on plans with ≥3 requirements OR any payment/auth/compliance work. Fails loud if any requirement lacks a sampler. Adapted from GSD's Nyquist Validation primitive. |
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
| "Wire openhuman / voice-first assistant / @senamakel / tinyhumans" | `openhuman-bridge` | Composition map vs tinyhumansai/openhuman desktop app — what overlaps with your stack (skip those), what's genuinely novel (lift them: 20-min auto-fetch, TokenJuice compression, mascot UX pattern), what can't lift cleanly. Clone preserved at `~/code/research/openhuman/`. |

| "Register a new skill or CLI into the routing tables" | `cc-skill-register` (CLI, not a skill) | Auto-inserts row into SKILL ROUTING TABLE in AGENTS.md + adds CLIs to drift-checker allowlist. Closes the drift loop that bit us 4× during today's audit. Idempotent (no-op if already routed). |
| "Block pre-push if typecheck fails / catch broken commits before they leave dev machine" | `cc-push-gate` (CLI, not a skill) | Installed as .git/hooks/pre-push in repos with autonomous-loop pushers. Runs typecheck (fast, ~1-5s) when pushing to main/master, skips feature branches, fail-soft if no scripts present. Bypass: `git push --no-verify`, `CC_PUSH_GATE=off`, or `touch .git/cc-push-gate-off`. Defense-in-depth for the 2026-05-14 'autonomous loop pushing into void' lesson. |
**Built-in Anthropic skills** (always available, no routing — type `/<name>` to invoke): `Codex-api`, `fewer-permission-prompts`, `init`, `keybindings-help`, `loop`, `review`, `schedule`, `security-review`, `simplify`, `update-config`.

## AGENT ROUTING TABLE

| Task | Agent | When |
|---|---|---|
| Independent code review of diff | `code-reviewer` | Any non-trivial diff (>50 lines or security-sensitive) |
| Long-form web research | `research-scout` | When you need authoritative external sources |
| Codebase exploration / find symbol | `Explore` | Read-only, fast file/symbol search |
| Implementation planning | `Plan` | Before non-trivial implementation work |
| Generic multi-step delegation | `general-purpose` | When no specialist fits |
| Vercel/Next.js deploy + alias chain | `deploy-runner` | Ship to prod, fix domain drift |
| Walk + dedupe ~/.Codex memory | `memory-curator` | Weekly hygiene, after big sessions |
| Map vague intent → skill+agent+MCP | `skill-router` | When user request is fuzzy |
| Audit deps: outdated, unused, CVEs | `dependency-warden` | Weekly on shipped projects, pre-release |
| Maintain LLM Wiki (dedupe, drift) | `wiki-curator` | Monthly, or after long autonomous sessions |
| Orchestrate full design loop (Phase 1-6) | `design-director` | Multi-step design tasks needing brand memory + QC + logging |
| Codex / API / SDK questions | `Codex-guide` | Anything about Codex products |
| Status line setup | `statusline-setup` | When user asks |
| Awesome-AI-Apps catalog dispatcher (111 Python agents) | `aaa` | "run the X agent", any intent that matches a built-in agent at `~/code/research/awesome-ai-apps/` |
| Parallel multi-agent due diligence (AG2 + TinyFish) | `aaa-due-diligence` | "due diligence on X", "vet this startup", "background check" |
| Production PDF RAG (hybrid Qdrant + rerank + citations) | `aaa-rag-rerank` | "chat with these PDFs", "RAG over a doc corpus", knowledge base |
| arXiv research + Memori v3 persistent memory | `aaa-arxiv-research` | "find papers on X", "continue my literature review", paper-thread memory |
| AI consultant w/ Memori v3 + Tavily research | `aaa-ai-consultant` | "strategic consulting on X", standing consultant for a client/project |
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

> **MCP delivery — 3 layers (added 2026-05-18 audit):**
>
> 1. **Deferred MCPs** — Codex/Claude session injection exposes MCPs as needed; do not assume a local mcp-hub checkout exists on this machine.
> 2. **OAuth-injected by Codex.ai** — `claude_ai_Figma`, `claude_ai_Gmail`, `claude_ai_Google_Calendar`, `claude_ai_Google_Drive`, `claude_ai_Gamma`, `claude_ai_Amplitude`, `claude_ai_Vibe_Prospecting`. Session-scoped. No local config. Re-auth in Codex.ai UI when one stops surfacing tools.
> 3. **Project-scoped** — `.mcp.json` per project (e.g. webclaw inside scraping projects, shadcn inside design projects). Only loads inside that project's working tree.
>
> Mempalace / context7 / mcp-fetch / mcp-git / mcp-filesystem / mcp-memory / mcp-sequential-thinking / mcp-time / open-design appear via the system as deferred MCPs (Codex.ai-injected or via npm `Codex` channel) — they may show as "still connecting" at session start.
>
> **Naming note:** Rows below labeled "(CLI/REST, not MCP)" are NOT loaded as `mcp__*` tools. They are invoked via Bash/HTTP. Listed here only for routing-table cohesion. Never call `mcp__agent-browser__*` or `mcp__camofox-browser__*` — those handles do not exist.

| Need | MCP | Notes |
|---|---|---|
| Library / SDK / API docs | `context7` | Always prefer over web search for docs |
| GitHub issue/PR/repo ops | `github` | Native `gh` CLI also works |
| **Browser automation — DEFAULT** (real Chrome, user's logged-in sessions, cookies preserved) | **`kimi-webbridge`** *(local daemon on `:10086` + Chrome extension; invoke via `/kimi-webbridge` skill)* | **NEW DEFAULT 2026-05-18.** Drives the user's real Chrome session so auth-walled pages with active logins work (trial flows, Vercel dashboard, Gmail, etc.). REST API at `127.0.0.1:10086/command`. Status check: `~/.kimi-webbridge/bin/kimi-webbridge status` — both `running:true` AND `extension_connected:true` required before tool calls. Skill: [`~/.Codex/skills/kimi-webbridge/SKILL.md`](file:///Users/leonardofibonacci/.Codex/skills/kimi-webbridge/SKILL.md). |
| Page inspect / Lighthouse / DevTools panels | `chrome-devtools` | **Demoted from default 2026-05-18** — keep for performance traces, Lighthouse audits, DevTools-protocol inspection of public pages. Doesn't share user session. |
| Throwaway / ephemeral browser automation (no user session needed) | `playwright` MCP | Use when the task spins up fresh sessions, scrapes public pages, or runs CI-style smoke tests. Clean slate every run. |
| Browser automation, clean sites (CLI alt) | `agent-browser` *(CLI, not MCP)* | Fast Rust-native CLI from vercel-labs/agent-browser; ships skills via `agent-browser skills get core --full`; no MCP — invoke via Bash |
| Browser automation, anti-bot-protected sites (Cloudflare/Google/etc.) | `camofox-browser` *(optional REST API on `localhost:9377`, not MCP)* | Optional archived lane; not installed by default on this machine. Prefer Kimi WebBridge first, then restore camofox from archive only if a task truly needs Firefox fingerprint spoofing. |
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
| HTTP fetch any URL → clean markdown | `mcp-fetch` | Stateless, parallel-safe utility |
| Git read/inspect repos | `mcp-git` | Read-friendly; ⚠️ same-repo writes serialize (see parallel-safety.md) |
| Filesystem read/write within `~`, `~/Claude Code`, `~/DoseCraft` | `mcp-filesystem` | Reads parallel-safe; writes to same path = last-write-wins |
| In-session knowledge graph (entity/relations/observations) | `mcp-memory` | Backing file `~/.Codex/state/mcp-memory.jsonl`. For cross-session/episodic, prefer `mempalace`. ⚠️ concurrent writes can race — single-agent only |
| Multi-step reasoning chains | `mcp-sequential-thinking` | Pure compute, parallel-safe |
| Timezone math / current time | `mcp-time` | Pure compute, parallel-safe |
| Open Design (design daemon: skills, design systems, projects) | `open-design` | Local daemon wrapping CLI; single-instance — agents share it, queue under load. Repo: `~/code/projects/open-design` |

## SKILL COMPOSITION RULES

- `pulse` + `caveman` stack — code-density + conversation-density. Both can be on.
- `nonstop` + `wired-up` stack — arm `wired-up` first (gates ship), then `nonstop` (no question-end). Order matters.
- `audit` produces a punch list → `loop` (session) or cloud Routines (durable) dispatch the fixes.
- `onboard` runs a mini-audit inline; `audit` is the deep version on demand.
- `recall` (MemPalace, episodic) ≠ auto-memory (`~/.Codex/projects/.../memory/`, factual). Don't conflate.
- `karpathy-guidelines` is active by default during code review.

### Design-family skill picker (5-way disambiguator — see [decision-rules.md D5](file:///Users/leonardofibonacci/.Codex/wiki/decision-rules.md))

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

Auto-memory (`~/.Codex/projects/-Users-leonardofibonacci-Claude-Code/memory/`) is the long-term user-fact store. Always check `MEMORY.md` first before asking the user about themselves. Save new facts as they emerge. Curate weekly via `memory-curator` agent.

MemPalace (`recall` skill + `mempalace` MCP) is for cross-session semantic search of *what was discussed before* — episodic, not factual.

**3-tier memory layer at `~/.Codex/memory/`** (Roman Knox pattern, added 2026-05-04):
- `recent-memory.md` — rolling 48hr distilled context (auto-loaded inline at session start when AGENTS.md @-include is added)
- `long-term-memory.md` — distilled facts/preferences/patterns + `new_learnings` staging section (research-scout writes here)
- `project-memory.md` — active project state (Aurex / brain / mega-brains tracked)
- `/consolidate-memory` skill (nightly) — distills past 24hr session jsonls → updates these 3 files
- `/research-scout` skill (3x nightly + weekly review) — hunts new info to challenge existing knowledge, stages in `new_learnings`
- Both skills opt-in via cron/launchd; not auto-installed

Sibling layers compose: auto-memory (per-fact files) + 3-tier memory (auto-distilled prose) + mempalace (episodic verbatim semantic search) + wiki/learnings (external corpus).

## MULTI-SESSION ORCHESTRATION

- **In-session parallel** — Brain's Agent tool — multiple agents within one session, single coordinator. **CAVEAT:** 600s stream watchdog kills agents doing long chrome-devtools sequences (navigate + screenshot + evaluate_script without text emission). Use ONLY for tasks that emit text every ~5min. For heavy chrome/file work, route through **cc-dispatch** below.
- **Watchdog-free fire-and-forget** — `cc-dispatch` (`~/.Codex/scripts/dispatch-agent.sh`, see `~/.Codex/scripts/CC-DISPATCH-README.md`) — spawns `Codex -p` as detached Unix subprocess. State at `~/.Codex/jobs/<id>/`. Inspect via `cc-jobs`, `cc-job-status <id>`, `cc-job-output <id> [--tail N|--error]`. **Use for swarms of 5+ agents OR chrome-devtools-heavy work.** Survives session close.
- **Cross-session, CLI/scripted** — `octogent` is archived/not installed by default. Restore it only for multi-day tentacle orchestration; otherwise use `cc-dispatch`.
- **Cross-session, GUI** — Conductor.app (Mac, `brew install --cask conductor`)

**Dispatch decision rule:**
- 1–3 agents, short task, lots of text streaming → Agent tool (cheapest, in-session memory)
- 4+ agents OR chrome-devtools-heavy OR >5min runtime → `cc-dispatch` (watchdog-free)
- Multi-day cross-session orchestration → restore `octogent` or use Conductor.app

## MEGA-BRAIN LEARNINGS LAYER

Source of truth: `~/.Codex/wiki/learnings/`. Per-topic brains from external corpora (currently **8 mentor brains + dosecraft-research = 843 videos / 4.1M words**, peptide/TRT/biohacking).

Before any domain question → check `wiki/learnings/_INDEX.md` + `_COMPOUND_INDEX.md`. Recall via `mempalace` MCP (semantic) or `rg` into `mentor-<slug>/` (keyword). Build/extend via `mega-brain-ingest`. See decision rule D14.

## LLM WIKI

Source of truth: `~/.Codex/wiki/`. Read [decision-rules.md](file:///Users/leonardofibonacci/.Codex/wiki/decision-rules.md) + [workflow-templates.md](file:///Users/leonardofibonacci/.Codex/wiki/workflow-templates.md) before non-trivial actions; check [logs/failure-log.md](file:///Users/leonardofibonacci/.Codex/wiki/logs/failure-log.md) for prior tried+failed paths. After: log structured fail/optimization entries; update [tool-registry.md](file:///Users/leonardofibonacci/.Codex/wiki/tool-registry.md) on tool/agent changes (drift-checker at `~/.Codex/scripts/check-routing-drift.sh` enforces sync).

## DESIGN INTELLIGENCE SUITE

Source of truth: `~/.Codex/design/`. For multi-step design tasks, spawn the `design-director` agent — it runs the full Phase 1-6 loop (routing → brand-memory → prompt → QC at 95%/98% print → exports → log to winning/anti patterns). For single-step, use the appropriate skill from the design-family picker above.

## TRUSTED EXECUTION LAYER (TEL)

Source of truth: `~/.Codex/tel/`. Credentialed action gateway — credentials stay out of the transcript, with Keychain as the preferred backend and 1Password as optional fallback. **Status:** daemon live on this machine; GitHub is already Keychain-backed, and other services can be migrated the same way. Use when: no working MCP exists for a credentialed service, an MCP is down, or strict whitelisting/audit/undo tokens are required. Invoke via `~/.Codex/tel/client/tel-call.sh <service> <action> '<args-json>'`. See decision rule D13.

## TELEMETRY

Self-hosted container telemetry is retired from the core stack.
Use lightweight local logs and router/session ledgers by default.

## IMPORTED SKILLS

@~/code/research/browser-harness/SKILL.md

---

## PLATFORM ROUTING (AI-SYSTEM-V2)

When given a task, you MUST classify it and route appropriately.

| Task Type | Platform | Why |
|-----------|----------|-----|
| Browser, UI/UX, screenshots, web crawling, implementation | **Kimi** | Primary operator, WebBridge, browser automation |
| Architecture, security review, hard debugging, final QA | **Codex** | Strategic brain, high-context reasoning |
| Summaries, extraction, JSON transforms, compression, bulk | **DeepSeek** | Worker layer, cheap, fast |
| Images, visual concepts, hero/background direction, ads, branding, canonical product assets | **ChatGPT** | Creative engine, Image 2.0 |

### Routing Rules
1. BEFORE acting on any task, run `~/AI-SYSTEM-V2/scripts/intent-route.sh --dry-run "<task>"` to confirm routing.
2. If the task involves browser interaction (screenshots, page audit, UI testing), use Kimi WebBridge — NOT your built-in web tools.
3. If the task involves image generation, static visual direction, canonical brand/product images, or style references, defer to ChatGPT/Image 2.0 — do NOT approximate it with text-only design.
4. If the task is mechanical (summarize, extract, transform JSON), use DeepSeek via the API — do NOT waste tokens doing it yourself.
5. For architecture or hard bugs, you (Codex) are the correct platform — proceed directly.

### When to defer
- Browser screenshots → Kimi (`~/.kimi-webbridge/bin/kimi-webbridge`)
- Image generation / visual direction → ChatGPT (`/Applications/ChatGPT.app`) or `cc-image` when API billing is explicitly acceptable
- Bulk summaries → DeepSeek API
- Everything else → You (Codex) or route via `intent-route.sh`

### Commands
- `~/AI-SYSTEM-V2/scripts/ai-control.sh dry-run "task"` — preview routing
- `~/AI-SYSTEM-V2/scripts/ai-control.sh ask "task"` — execute via router
- `~/AI-SYSTEM-V2/scripts/ai-control.sh status` — system status
