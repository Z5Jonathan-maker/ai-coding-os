# Tool Registry

Every tool the brain can call. Mirrors CLAUDE.md routing tables but adds depth: trigger conditions, output contracts, gotchas, alternatives.

## Built-in tools (always available)

| Tool | Purpose | Trigger | Output | Gotchas |
|---|---|---|---|---|
| Read | Read file | When you need a file's content | String content with line numbers | Must Read before Edit on same file |
| Edit | Modify file | After Read, when changing existing file | Confirms diff applied | `old_string` must be unique in file |
| Write | Create/overwrite file | New file or full rewrite | Confirms write | NEVER use for existing files when Edit works |
| Bash | Shell command | Anything CLI | stdout/stderr | Long ops → `run_in_background: true` |
| Agent | Delegate to sub-agent | Independent multi-step or context isolation | Single message back | Sub-agent doesn't see this convo |
| Skill | Invoke skill | User typed `/<name>` or task matches skill | Inline expansion | Use exact name from available list |
| WebSearch | Search web | Need authoritative external info | Search results | Pair with WebFetch for full content |
| WebFetch | Fetch URL | Need a specific page's content | Page text | Use for citation verification |
| TodoWrite | Plan tracking | Multi-step work in current session | Todo list state | Don't batch — mark complete as you go |
| ScheduleWakeup | /loop dynamic mode | Self-paced loop iterations | Schedules next wake | Only in /loop dynamic mode |

## MCP servers (currently 16 loaded)

### Always-available
| MCP | What it does | When to pick | Notes |
|---|---|---|---|
| `chrome-devtools` | DevTools Protocol — inspect, screenshot, lighthouse, network log, performance trace | Default browser MCP for inspection/perf | Spawns Chromium ~2s cold start |
| `github` | gh-equivalent ops: issues, PRs, repos, workflows | GitHub state queries + mutations | Native `gh` CLI also works for read |
| `context7` | Library/SDK/API doc lookup | Always prefer over WebSearch for docs | Lower hallucination risk |
| `mempalace` | Long-term semantic search across all sessions | Pair with `recall` skill for "what did we discuss" | Episodic, not factual |
| `webclaw` | Local agent web scraping with structured extraction | Programmatic scraping when chrome-devtools is overkill | Local binary at ~/.webclaw |
| `claude_ai_Figma` | Read Figma designs, get_design_context | When user shares figma.com URL | URL parsing built-in |
| `claude_ai_Gmail` | Email read/send, label, thread search | Email ops | OAuth-gated |
| `claude_ai_Google_Calendar` | Event CRUD, scheduling | Calendar ops | OAuth-gated |
| `claude_ai_Google_Drive` | File search, content read | Drive ops | OAuth-gated |
| `claude_ai_Vibe_Prospecting` | B2B prospect enrichment | Lead/prospect work | Explorium-backed, OAuth-gated |
| `shadcn` | shadcn component install in project | Inside React/Next.js project | Project-level only |

### Need re-auth (OAuth expired) — surfaced by daily MCP probe
| MCP | What it does | Re-auth fix |
|---|---|---|
| `claude_ai_Gamma` | Slide generation (cloud) | Re-auth via `claude mcp` UI |
| `claude_ai_Amplitude` | Product analytics | Re-auth via `claude mcp` UI |

### Retired (still loaded but do not select)
| MCP | Why retired | Date | Replacement |
|---|---|---|---|
| `playwright` | Replaced by `agent-browser` CLI (faster, no MCP overhead) | 2026-05-04 | `agent-browser` for clean sites; `chrome-devtools` for inspection |
| `browser-use` | Redundant with chrome-devtools + Kimi WebBridge | 2026-05-03 | `chrome-devtools` (inspection), `Kimi WebBridge` (logged-in browser flows) |

## Tool selection priority order

When multiple tools could do a job, prefer in this order:
1. **Built-in tool** (Read/Edit/Bash) over MCP — fewer moving parts
2. **MCP** over Bash subprocess — type-safe, schema-validated
3. **Agent** over inline work — when context isolation or parallelism helps
4. **WebSearch + WebFetch** as last resort — most token-expensive, hallucination-prone

## Local execution layers (sibling brains)

These aren't MCPs — they're filesystem-based knowledge + execution layers, queryable by Read/Grep, writable per the read-before/write-after protocol.

| Layer | Path | Purpose | Read protocol |
|---|---|---|---|
| **wiki** | `~/.claude/wiki/` | Code + system intelligence (tool-registry, agent-definitions, workflow-templates W1-W9, decision-rules D1-D13, failure-log, optimization-log) | Before any non-trivial action |
| **design** | `~/.claude/design/` | Visual + brand intelligence (routing, brands/aurex, prompts, exports, 8-axis QC, asset registry) | Before any design task |
| **tel** | `~/.claude/tel/` | Trusted Execution Layer for credentialed actions. FastAPI server on 127.0.0.1:8765 (when daemonized). Whitelist policies in YAML. Audit + rollback. | Before any credentialed third-party action; see D13 |
| **learnings** | `~/.claude/wiki/learnings/` | **Mega-brain catalog**: per-topic knowledge brains (mentor transcripts, research dossiers, ingested articles/PDFs/videos). 8 mentor brains + dosecraft-research as of 2026-05-03 = 843 videos / 4.1M words. See `_INDEX.md` (catalog) + `_COMPOUND_INDEX.md` (peptide → mentor coverage map). | Before answering domain questions where a mentor's voice / corpus is relevant |

## Custom CLI tools (on PATH)

| Tool | Purpose | Trigger | Output | Notes |
|---|---|---|---|---|
| `agent-browser` | Native Rust browser automation CLI (vercel-labs/agent-browser, on PATH at `~/local/bin/`). Clean-browser fallback when Kimi WebBridge is not the right fit. | Browser automation on standard public sites: navigate, click, type, screenshot, snapshot (a11y tree), eval JS, CDP connect, multi-session | Inline Bash returns from each command; chain via `agent-browser skills get core --full` for workflow patterns | Chrome 148 installed at `~/.agent-browser/browsers/`. No MCP; invoke directly via Bash. Skills include electron, slack, exploratory-testing. |
| `camofox-browser` | Optional archived stealth REST browser lane; not installed by default on this machine. | Only restore for a task that truly needs Firefox-level fingerprint spoofing after Kimi WebBridge and clean browser lanes fail. | HTTP JSON via curl once restored. | Historical source was `jo-inc/camofox-browser`; do not route to local paths until the repo and plist are restored. |
| `mega-brain-ingest` | Orchestrate scrape+normalize+ingest of articles/PDFs/YouTube/sitemaps/RSS/local-dirs into `~/.claude/wiki/learnings/<topic>/` | Building or expanding a topic brain | per-doc markdown + frontmatter + `_manifest.json` for dedupe | Auto-routes by source: trafilatura (article), pypdf (PDF), transcribe-video/faster-whisper (video). `--skip-video` for fast text pass. Source: `~/code/projects/scrapling-lab/bin/` |
| `mentor-expand` | Pull a YouTube channel's videos via yt-dlp, diff vs existing manifest, fetch auto-CC for new IDs, write per-video markdown to a brain folder | Expanding a mentor brain (e.g. mentor-niddam, mentor-mpmd) when new content is published | per-video markdown + manifest update | `--channel-url` mode for full enumeration, `--query` for ytsearch fallback. `--whisper-fallback` enables faster-whisper for captionless videos (slow). Source: `~/code/projects/scrapling-lab/bin/` |
| `transcribe-video` | yt-dlp → faster-whisper → markdown transcript | Single video URL → standalone .md | markdown to `~/code/projects/scrapling-lab/transcripts/` | Models: tiny → large-v3, default `small`. CPU/int8 on Apple Silicon. |
| `competitor-pricing` | Scrapling stealth fetch of vendor catalogs → pricing CSV | Vendor catalog URL(s) | CSV at `~/code/projects/scrapling-lab/pricing-runs/` | JSON-LD Product schema first, heuristic fallback. |
| `pricing-vs-aurex` | Join competitor CSV against Aurex catalog → markdown gap report | Competitor CSV + Aurex `lib/products.ts` | Markdown table | Per-compound position + recommended action |
| `neonctl` | Neon CLI (npm: `neonctl`, also `~/local/lib/neonctl-patched/cli.js` with 900s OAuth window) | Neon project ops | json/table | Auth via API key (`--api-key`) or GitHub OAuth (60s default, 900s in patched copy). Set `NEON_API_KEY` env to skip flag. |

### Health monitoring of each layer
- **wiki** — `routing-drift-check.sh` (Mon 09:05) catches drift between wiki references and reality
- **design** — currently no auto-monitor; manual via `design-director` agent runs
- **tel** — `tel-canary.sh` (called by daily `mcp-probe.sh` at 09:00) validates imports + policy parsing without starting the server

## Output contract conventions

Every tool result Claude receives is a string. Tools that produce structured data should:
- Return JSON inside a code fence when the consumer needs to parse
- Return markdown tables when the consumer is human-reading
- Return concise summary + reference path when output is large (write to file, return path)

## Skill classes (resolves "which skills actually DO something")

Not every skill is the same kind of thing. Three classes, never mix them up:

| Class | Definition | Examples | How to use |
| --- | --- | --- | --- |
| **Runtime** | Has executable side-effects: writes files, calls APIs, spawns processes, mutates state. Real work happens. | `/checkpoint`, `/sync`, `/audit`, `/onboard`, `/forge`, `/tel`, `/autobrowse`, `/skill-creator`, `/consolidate-memory`, `/research-scout`, `/recall`, `/health`, `/mega-cycle`, `/evolve`, `/schedule-task`, `/depth-check`, `/morning`, `/nonstop`, `/wired-up`, `/route` | Invoke directly when intent matches. State changes. |
| **Ruleset** | Pure behavioral guidance — markdown instructions to the model. No tools, no side-effects. Toggles how I think. | `/karpathy-guidelines`, `/using-superpowers`, `/caveman`, `/pulse`, `/verification-before-completion`, `/brainstorming`, `/writing-plans`, `/executing-plans`, `/subagent-driven-development`, `/dispatching-parallel-agents`, `/test-driven-development`, `/systematic-debugging`, `/requesting-code-review`, `/receiving-code-review`, `/finishing-a-development-branch`, `/using-git-worktrees` | Load into context to bias subsequent behavior. Don't expect a deliverable. |
| **Lookup** | Reference library — design palettes, style examples, capability index. Read to retrieve facts, not to invoke action. | `/arsenal`, `/ui-ux-pro-max`, `/design-system`, `/ui-styling`, `/banner-design`, `/brand`, `/slides`, `/website-design-stack`, `/huashu-design`, `/design`, `/openhuman-bridge`, `/prompt-master`, `/grey-area-arsenal`, `/claude-api`, `/autonomous-loop` | Read, extract relevant entries, apply via Runtime tools or direct code. |

**Rule of thumb:** A skill whose name describes a *workflow* is usually a Ruleset. A skill whose name describes a *capability or asset* is usually a Lookup. A skill whose name describes an *action* with concrete output is usually Runtime.

**Exceptions worth knowing:**
- `/route` is Runtime — actually picks a target (cloud vs local).
- `/autonomous-loop` is Lookup despite the "loop" name — it's a *bootstrap doc* for installing the pattern; the actual loop runs via `/mega-cycle` (Runtime).
- `/design` is dual — Lookup for HTML mockup patterns, Runtime when it generates a file.

## MCP additions (curator-applied 2026-07-11, proposals 1+4)

| MCP | Status | Notes |
|---|---|---|
| crosstrade | LIVE | NT8 bridge: deploy/disable/journal/quotes for the prop books; ListStrategies isEnabled = authoritative |
| tradingview | LIVE | web-CDP MCP, 78 tools; targets TradingView WEB in Chrome (desktop app CDP-sealed) |
| bybit | LIVE | official bybit-official-trading-server, 243 tools; keyless = market data only |
| camofox-browser | ARCHIVED | restore from archive only for Firefox-fingerprint needs |

cc-health: RETIRED 2026-05-19 (row removed; the 2026-05-20 optimization-log mention was the retirement-week transition).
