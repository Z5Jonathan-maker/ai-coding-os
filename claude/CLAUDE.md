# Global preferences for Claude Code — Autonomous Brain v1

This file is the **central routing layer**. Every session loads it. Keep it dense and load-bearing.

## Identity & environment

- macOS Apple Silicon, zsh, VS Code (`code` in PATH)
- Tools live under `~/local/bin` + Homebrew
- Real name: Jonathan Cimadevilla (macOS handle says "leonardofibonacci" — ignore it)
- GitHub: `Z5Jonathan-maker`. Dotfiles: `github.com/Z5Jonathan-maker/dotfiles`
- Anthropic access: Claude Max subscription. Wire third-party tools via `CLAUDE_CODE_OAUTH_TOKEN`, NOT `ANTHROPIC_API_KEY`
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

## SKILL ROUTING TABLE (read this before invoking anything)

When the user describes a task, match it against this table FIRST. Don't reinvent.

| User intent / task class | Skill to invoke | Notes |
|---|---|---|
| "Write me a prompt for X tool" | `prompt-master` | Single-shot, never loop |
| "Audit this project / what's broken" | `audit` | Outputs to `./audits/<date>.md` |
| "Onboard / clean up this messy repo" | `onboard` | Generates CLAUDE.md/AGENTS.md/DESIGN.md |
| "Design a UI / mockup / landing page" | `design` | HTML/CSS, browser-previewable |
| "Chinese 高保真 hi-fi prototype style" | `huashu-design` | Only when explicitly asked |
| "Build design tokens / design system" | `design-system` | primitive→semantic→component |
| "Build this in shadcn/Tailwind/React" | `ui-styling` | Implementation, not mockup |
| "What style/palette should I use" | `ui-ux-pro-max` | Lookup library — read, don't output |
| "Brand voice / identity / messaging" | `brand` | — |
| "Banner / social ad / hero asset" | `banner-design` | — |
| "Slide deck / presentation" | `slides` | HTML + Chart.js |
| "What did we do in past sessions" | `recall` | MemPalace semantic search |
| "Save state / checkpoint" | `checkpoint` | `~/.claude/checkpoints/` |
| "Morning standup / what's on my plate" | `morning` | Open PRs + brew + commits |
| "Is my dev env healthy" | `health` | Symlinks, gh auth, MCPs |
| "Push my dotfiles" | `sync` | Auto-commit message |
| "Don't stop / keep going autonomously" | `nonstop` | Pairs with `wired-up` |
| "Don't end turn until shipped" | `wired-up` | Pairs with `nonstop` |
| "Should this run cloud or local" | `route` | cc-loop vs Routines |
| "Be terse" | `caveman` | Strips conversational filler |
| "Compress generated code" | `pulse` | Dense functions, no restate-comments |
| "Apply Karpathy rules" | `karpathy-guidelines` | Surgical, simplicity-first |
| "Use TEL / call gamma/notion/vercel/etc" | `tel` | Credentialed action via 1Password — credential never enters transcript |
| "Show me brain state / system snapshot" | (no skill — run `~/.claude/scripts/snapshot.sh`) | Single-command full state report |
| "Build a self-improving browser skill / autobrowse a site" | `autobrowse` | Karpathy iterative loop on browser tasks (browserbase/skills v0.1, MIT). Requires ANTHROPIC_API_KEY (separate from Claude Max — see skill .env). 3 security scanners flagged warnings — risk accepted 2026-05-03, see wiki/logs/failure-log.md. Composes with auto-browser MCP (already loaded). |

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

## MCP ROUTING TABLE

| Need | MCP | Notes |
|---|---|---|
| Library / SDK / API docs | `context7` | Always prefer over web search for docs |
| GitHub issue/PR/repo ops | `github` | Native `gh` CLI also works |
| Page inspect / Lighthouse / DevTools | `chrome-devtools` | **Default browser MCP** |
| Browser automation, clean sites (no anti-bot) | `agent-browser` (CLI via Bash) | Fast Rust-native CLI from vercel-labs/agent-browser; ships skills via `agent-browser skills get core --full`; no MCP — invoke via Bash |
| Browser automation, anti-bot-protected sites (Cloudflare/Google/etc.) | `camofox-browser` (REST API on `http://localhost:9377`) | Camoufox-powered Firefox fork with C++-level fingerprint spoofing (navigator/WebGL/AudioContext/WebRTC). Curl HTTP endpoints; OpenAPI at `/openapi.json`. Source: `~/code/research/camofox-browser/`. Start: `cd ~/code/research/camofox-browser && nohup npm start > ~/Library/Logs/camofox-browser.out.log 2>&1 &`. To autostart at login: `launchctl load -w ~/Library/LaunchAgents/bio.aurex.camofox.plist` (plist available but not auto-installed). |
| Sensitive supervised browse (auth, payment) | `auto-browser` | Approval gates built-in |
| Read Figma design / get_design_context | `claude_ai_Figma` | URL parsing built-in |
| Email read/send | `claude_ai_Gmail` | OAuth-gated |
| Calendar | `claude_ai_Google_Calendar` | OAuth-gated |
| Drive files | `claude_ai_Google_Drive` | OAuth-gated |
| Long-term semantic memory across sessions | `mempalace` | Pair with `recall` skill |
| Slide generation (cloud) | `claude_ai_Gamma` | OAuth-gated |
| shadcn component install (project-level) | `shadcn` | Inside aurex etc. |
| Web scraping with full browser control | `webclaw` | Local agent, structured extraction |
| Product analytics queries | `claude_ai_Amplitude` | OAuth-gated, currently needs re-auth |
| B2B prospect enrichment | `claude_ai_Vibe_Prospecting` | Explorium-backed, OAuth-gated |

## SKILL COMPOSITION RULES

- `pulse` + `caveman` stack — code-density + conversation-density. Both can be on.
- `nonstop` + `wired-up` stack — arm `wired-up` first (gates ship), then `nonstop` (no question-end). Order matters.
- `audit` produces a punch list → `cc-loop` / cloud Routines dispatch the fixes.
- `onboard` runs a mini-audit inline; `audit` is the deep version on demand.
- `recall` (MemPalace) is for **prior sessions / external context**. Auto-memory at `~/.claude/projects/.../memory/` is for **this user's facts**. Don't confuse the two.
- `karpathy-guidelines` should be active by default during code review, not just on request.

### Design-family skill picker (resolves the 5-skill overlap)

| User says | Pick |
|---|---|
| "design this", "mock up", "make a landing page" | `design` (HTML/CSS, browser-previewable) |
| "高保真 hi-fi prototype", or Chinese-language design intent | `huashu-design` only |
| "build the design tokens / token system" | `design-system` (primitive→semantic→component) |
| "build it in shadcn/Tailwind/React" (after visual approved) | `ui-styling` |
| "what style/palette/font should I use" | `ui-ux-pro-max` (lookup library — read, don't output) |

**Hard rule:** never invoke two design skills in the same task. Visual mockup → `design`. Implementation → `ui-styling`. Token system → `design-system`. Lookup → `ui-ux-pro-max`. Chinese hi-fi → `huashu-design`.

## STOP CONDITIONS FOR AUTONOMOUS LOOPS

When `nonstop` or auto-mode is active, STOP and surface a question if you hit any of:
- Anything destructive: `rm -rf`, dropping DB tables, `git push --force` to main, deleting MCP entries, modifying API keys
- Anything paid: new SaaS subscription, dependency that costs money, new MCP server with billing
- Anything cross-user: posting to Slack, sending email, creating GH issue/PR with `@mentions`
- Anything irreversible: `git rebase` on shared branches, force-pushing to anyone's main, schema migrations
- Two consecutive iterations of the same task with zero progress

## MEMORY POLICY

Auto-memory (`~/.claude/projects/-Users-leonardofibonacci-Claude-Code/memory/`) is the long-term user-fact store. Always check `MEMORY.md` first before asking the user about themselves. Save new facts as they emerge. Curate weekly via `memory-curator` agent.

MemPalace (`recall` skill + `mempalace` MCP) is for cross-session semantic search of *what was discussed before* — episodic, not factual.

## MEGA-BRAIN LEARNINGS LAYER

Source of truth: `~/.claude/wiki/learnings/`. Per-topic knowledge brains built from external corpora (transcripts, articles, PDFs, mentor content). Currently **8 mentor brains + dosecraft-research = 843 videos / 4.1M words** of peptide/TRT/biohacking domain knowledge.

**Always check before answering domain questions:**
1. `~/.claude/wiki/learnings/_INDEX.md` — catalog of all brains
2. `~/.claude/wiki/learnings/_COMPOUND_INDEX.md` — peptide → mentor coverage map (find which mentor has the most coverage on a given compound)
3. Per-mentor `_README.md` — credibility, tone, when-to-consult-vs-skip

**Recall** via `mempalace` MCP for semantic, or `rg` directly into `mentor-<slug>/` for keyword. See decision rule D14.

**Build / extend:** `mega-brain-ingest` CLI auto-routes URL/local-path → trafilatura/pypdf/transcribe-video → wiki/learnings. See workflow W11 (greenfield) and W12 (recover from DB-only corpus).

## TELEMETRY

Langfuse plugin is live and emitting to `http://127.0.0.1:3000` (verified). Every session is traced. To inspect: open the local Langfuse UI. Don't disable.

## LLM WIKI — central knowledge layer

Source of truth: `~/.claude/wiki/` (symlinked from `~/dotfiles/claude/wiki/`).

**Read-before / Follow-during / Write-after protocol:**

- BEFORE non-trivial action: read [wiki/decision-rules.md](file:///Users/leonardofibonacci/.claude/wiki/decision-rules.md) + [wiki/workflow-templates.md](file:///Users/leonardofibonacci/.claude/wiki/workflow-templates.md). Check [wiki/logs/failure-log.md](file:///Users/leonardofibonacci/.claude/wiki/logs/failure-log.md) — has this been tried + failed before?
- DURING: follow the matched workflow template
- AFTER: if something failed + was fixed → append to `wiki/logs/failure-log.md`. If something got faster/better → append to `wiki/logs/optimization-log.md`. New workflow → append to `wiki/workflow-templates.md`. Tool/agent change → update `wiki/tool-registry.md` AND CLAUDE.md routing tables (drift checker enforces sync).

**Rule:** If knowledge isn't in the wiki, it doesn't exist for future intelligence.

The Stop hook `wiki-writeback.sh` captures session heartbeats automatically; structured failure/optimization entries are written by Claude during the session via Edit on the log files.

## DESIGN INTELLIGENCE SUITE — sibling to the wiki, dedicated to visual output

Source of truth: `~/.claude/design/` (symlinked from `~/dotfiles/claude/design/`).

For ANY design task (brand / social / vial label / box / web section / ad / deck / carousel / product photo / UI / marketing / print):

1. **Read** [design/routing.md](file:///Users/leonardofibonacci/.claude/design/routing.md) — pick the tool/workflow
2. **Read** [design/brands/<brand>.md](file:///Users/leonardofibonacci/.claude/design/brands/) — load brand memory
3. **Read** [design/prompts/<type>.md](file:///Users/leonardofibonacci/.claude/design/prompts/) — start from proven prompt
4. **Apply** [design/checks/quality-control.md](file:///Users/leonardofibonacci/.claude/design/checks/quality-control.md) — 95% threshold (98% for print)
5. **Match** [design/exports/<platform>.md](file:///Users/leonardofibonacci/.claude/design/exports/) — exact dimensions/format

After delivery: log to `design/logs/winning-patterns.md` (≥95% scored) or `design/logs/anti-patterns.md` (failed).

The `design-director` agent orchestrates the full Phase 1-6 design loop end-to-end when the task spans multiple steps.

## TRUSTED EXECUTION LAYER (TEL) — credentialed action gateway

Source of truth: `~/.claude/tel/` (symlinked from `~/dotfiles/claude/tel/`).

**Why it exists:** The harness (correctly) blocks programmatic credential capture from transcripts. TEL removes the need to bypass this by separating planning from credentials. Claude never sees secrets — TEL holds them via 1Password and executes whitelisted actions on Claude's behalf.

**Status:** Architecture + code shipped. **Not yet running** — requires `pip install` + `launchctl load` (see [tel/ops/INSTALL.md](file:///Users/leonardofibonacci/.claude/tel/ops/INSTALL.md), needs your nod for the dep install).

**Routing rule:** Use TEL when:
- A service has no working MCP and you have credentials for it
- An MCP is down and you need a fallback for the same service
- You want strict whitelisting on a credentialed service (audit + rate limits + undo tokens)

**Use directly via shell:** `~/.claude/tel/client/tel-call.sh <service> <action> '<args-json>'`. Returns structured JSON with `audit_id` and optional `undo_token`. The credential never enters this conversation.

See [wiki/decision-rules.md](file:///Users/leonardofibonacci/.claude/wiki/decision-rules.md) D13 for the full TEL-vs-MCP-vs-Bash routing rule.

## OCTOGENT — multi-session orchestration

Installed at `~/code/projects/octogent/` (cloned from github.com/hesamsheikh/octogent, 698 stars, MIT). Claude Code multi-session dashboard. Each "tentacle" = scoped job container with its own `CONTEXT.md`, `todo.md`, notes — agents read/write durable files instead of reconstructing chat history.

**When to use vs. our brain's parallel agents:**
- **Brain's Agent tool (current default)** — parallel agents WITHIN one session, single coordinator, results compose into one response
- **Octogent (use when)** — running 3+ truly independent Claude Code sessions for different repos/scopes simultaneously (e.g. Aurex feature work + brain config + research scrape, all needing persistent state across days). Tentacles preserve context per-scope. Inter-session messaging coordinates handoffs.

**Run:** `cd ~/code/projects/octogent && pnpm dev` — launches local API + UI. Bookmark for when the multi-session pattern is the right fit.

**NOT a replacement** for the routing brain (CLAUDE.md, wiki, design, tel) — Octogent is the meta-coordinator across sessions; the brain is the in-session intelligence layer. They compose: Octogent spawns sessions, each session runs the brain.

## IMPORTED SKILLS

@~/code/research/browser-harness/SKILL.md
