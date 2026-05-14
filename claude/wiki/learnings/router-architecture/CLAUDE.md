# Claude Code Router — 10-Tier AI-OS Control Plane

> **This is the scoped Claude Code instance for `claude-code-router`.**
> For non-router work, exit this workspace.
> Project constitution: [`AGENTS.md`](./AGENTS.md) · Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · Session state: [`SESSION-HANDOFF.md`](./SESSION-HANDOFF.md) · Design system: [`DESIGN.md`](./DESIGN.md)

## What This Is

A modular routing layer that dispatches prompts across 10 tiers — chat, shadow, cheap, precision, codex, design, image, swarm, octagents, **compute** — with automatic failover, circuit breakers, and MCP tool integration. Lives in `lib/` and persists across sessions.

On top of the tiers, the router runs three cross-cutting **router-layer behaviors** that wrap every `ask()` call: a SQLite-backed **task queue** with parent/child trees and content-addressed artifact spill (Phase 0), a **semantic verifier** that gates code-touching outputs through a different runtime than the producer (Phase 1), and a **repo-state vector store** that injects semantically-retrieved source context into the system prompt (Phase 3). The full architectural intent — including which manifesto sections each piece realizes — is documented in [AI_OS_MANIFESTO.md](./AI_OS_MANIFESTO.md).

## The Tiers

| Tier | Class | Backend | Purpose | Cost | Auth |
|---|---|---|---|---|---|
| T1 | `chat` | Ollama local (`llama3.2:3b`) | Greetings, light chat, mechanical tasks | $0 | Local |
| TS | `shadow` | Ethical free API providers (Groq, Together, Cerebras, SambaNova) | Zero-cost inference for chat/cheap tasks | $0 | Free API keys |
| T2 | `cheap` | DeepSeek API (`deepseek-v4-pro`) | Summaries, refactor, long context, cheap reasoning | ~$0.001-0.01 | `DEEPSEEK_API_KEY` |
| T2-fb | `cheap` (fallback) | DeepSeek API (`deepseek-v4-flash`) | Auto-fallback when T2-pro 429s/5xx | ~$0.0005 | `DEEPSEEK_API_KEY` |
| T3 | `precision` | Claude Code CLI (`claude-opus-4-7`) | Architecture, audits, high-stakes code, hard-floor purposes | Max plan | Subscription |
| T5 | `codex` | OpenAI Codex CLI (`gpt-5.5`) | Implementation, bug fixes, test gen, scaffolds, CLI tools | ChatGPT Pro/Teams | OAuth |
| TD | `design` | Kimi Bridge (camoufox → kimi.com) | UI/UX, branding, mockups, visual systems | $0 (subscription) | Browser session |
| TI | `image` | ChatGPT Image Bridge (camoufox → gpt-image-2.0) | Logos, banners, illustrations | $0 (subscription) | Browser session |
| TS | `swarm` | swarm-research augmenter → precision | Research, scrape, deep-dive, competitive analysis | varies (web fetches) | — |
| TO | `octagents` | 8-agent intel platform → precision | Recon, scraper, analyst, mapper, monitor, hunter, archivist, synthesizer | varies | — |
| TC | `compute` | browser-harness wrapper (CDP-level Chrome control) | Operator capability — navigate, click, screenshot, fill forms, extract from pages | $0 (local browser) | Local Chrome |
| TF | `fastpath` | Free API direct-call augmentation (chatanywhere et al.) via `api-fastpath.cjs` | Augments `cheap` requests with free-API results when registry has a match | $0 | Free API registry |
| TU | `ui_tars` | UI-Tars bridge via `ui-tars-bridge.cjs` | Screenshot understanding + click prediction for browser-driven UI tasks | varies | Bridge session |

**Fallback graph** (BFS in `dispatch()`, see TIER_DEFS in `lib/tiered-ask.cjs`):
- chat → shadow → cheap → precision
- shadow → cheap → precision → chat
- cheap → shadow → tier2fb → precision → chat
- codex → cheap → precision → chat
- design → precision → cheap → chat
- image → precision → design
- swarm → precision
- octagents → precision → swarm
- compute → (no fallback — fails closed; surfaces COMPUTE_TIER_DOWN / COMPUTE_EXEC_FAILED / COMPUTE_TIMEOUT / COMPUTE_TRANSLATION_*)
- fastpath → cheap → precision (fastpath is an augmenter not a standalone destination; appears in `tier (actual)` column only when its free-API result is returned directly)
- ui_tars → cheap → precision (specialized; selected by `ui_tars` purpose set + flag set, see `UI_TARS_P` / `UI_TARS_F` in `tiered-ask.cjs`)

**Bridge-state caveat** (added 2026-05-13): the canned `tier <tier>.ping()` calls in `router-ping` only check binary/profile presence, NOT runtime capability. Kimi can be `ok=true` in router-ping while `kimi-bridge.cjs ping` returns "Not logged into Kimi". Image bridge can be `ok=true` while `~/.claude/bridge-alerts.log` records continuous failures. **Source of truth for actual generation capability**: invoke `node lib/<bridge>.cjs ping` directly + read `~/.claude/bridge-alerts.log`.

**Autotuner dead-zone** (added 2026-05-13): `self-improve.cjs:computeThresholdAdjustments` sets `cbAdjustment` only at extremes — `+1` (lenient) when failure > 40%, `-1` (strict) when failure < 5%. Anything in between (e.g. cheap tier at 30%) gets `0` no matter how slow. `latencyConcern: true` is recorded when p95 > 60s but no code path consumes it. If you ever feel cheap-tier latency dragging, that's why: the autotuner sees the problem but the policy doesn't act on it. Fix path: extend the adjustment ladder to handle the middle band + wire `latencyConcern` into circuit-breaker decisions.

## Router-Layer Behaviors

These wrap every `ask()` call regardless of which tier serves it. None are auto-on by default — they activate via opt-in args or env flags.

### Task Queue (Phase 0)

SQLite at `~/.claude/state/tasks.db` (WAL, content-addressed artifact spill at `~/.claude/state/artifacts/<sha>.txt` for prompts/results > 100KB). Every `ask()` writes a row with parent/child links, full event timeline (enqueue → claim → complete | fail), tier (classified vs actual), model, latency, and the full prompt + result. Verifier calls and gate retries automatically appear as child tasks of the producer.

```bash
cc-tasks list [--status <s>] [--purpose <p>] [--tier <t>] [--limit N]
cc-tasks show <id>          # full row + prompt + result
cc-tasks tree <id>          # task + descendants (verifier children, retries, etc)
cc-tasks events <id>        # event timeline
cc-tasks recent             # inject-ready recent context
cc-tasks stats              # counts by status/tier + artifact bytes
cc-tasks prune --before <iso-date>
```

`ask()` opts: `parentTaskId`, `caller`, `contextLimit` (inject N most recent task excerpts of same purpose into system prompt).

### Verifier-as-Gate (Phase 1)

Manifesto §9: "checked by a different runtime than the one that produced it." Asymmetric reviewer map (`codex → cheap`, `cheap → precision`, `precision → cheap`, `design → precision`; chat/image/swarm/octagents skip). Every verifier call is a child task of the producer in `cc-tasks tree`.

Three modes via `ask({ verify })`:

- `false` (default) — off
- `'flag'` — verify, attach `result.verification = { verdict, findings, reviewerTier, reviewerModel, taskId }`, never block
- `'gate'` — verify; on `BLOCK` retry on producer's first fallback tier with findings injected into the retry prompt; surface both via `result.verify_retry`

Auto-mode: `CC_AUTO_VERIFY=cheap,codex,precision,design` env enables flag mode for those producer tiers.

### Repo-State Vector Store (Phase 3)

SQLite at `~/.claude/state/vectors.db`, Ollama `nomic-embed-text` (768-dim) for embeddings. Language-aware chunking: markdown by H2 headers, code by 100-line windows with 15-line overlap, hard char cap 4000 to fit the embedder context. Git-aware file walker (`git ls-files` when in repo). Brute-force cosine over Float32 BLOBs. Incremental reindex (sha256 check skips unchanged files).

```bash
cc-vec index <project> <dir> [--force]
cc-vec query <project> "<text>" [--limit N] [--file <glob>] [--lang <lang>]
cc-vec list                   # all indexed projects
cc-vec stats <project>
cc-vec forget <project>
```

`ask()` opt: `repoContext: { project, query?, limit, fileGlob?, language?, maxTotalChars? }` injects top-K relevant chunks (capped at 24KB total) before the system prompt; `result.repo_context = { project, hits, injected }` reports back.

## MCP Tools (15 connected, global)

Claude Code has access to these Model Context Protocol servers in ALL directories:

| Server | Capability |
|---|---|
| `github` | Repo management, file ops, GitHub API |
| `mcp-filesystem` | Read/write files in `~`, `~/Claude Code`, `~/DoseCraft` |
| `mcp-fetch` | Scrape any URL into clean markdown |
| `mcp-memory` | Persistent knowledge graph across sessions |
| `mcp-sequential-thinking` | Multi-step reasoning chains |
| `mcp-git` | Search/manipulate git repos |
| `mcp-time` | Timezone conversions |
| `mcp-glif` | Run AI workflows from glif.app (needs `GLIF_API_TOKEN`) |
| `mcp-firecrawl` | JS-aware web scraping (needs `FIRECRAWL_API_KEY`) |
| `playwright` | Browser automation |
| `chrome-devtools` | Chrome debugging |
| `context7` | Upstash vector search |
| `mempalace` | Semantic memory search |
| `webclaw` | Web scraping |
| `auto-browser` | HTTP browser proxy (localhost:8000) |

## Swarm Arsenal (50 commands)

Multi-agent web scraper ecosystem. All commands prefixed with `cc-`:

- `cc-swarm` — multi-agent crawler
- `cc-swarm-query` — FTS5 search across scraped data
- `cc-swarm-analyze` — content analysis (entities, tech stack, APIs)
- `cc-swarm-map` — site graph builder
- `cc-swarm-report` — intelligence report generation
- `cc-swarm-diff` — page change tracking
- `cc-swarm-structured` — JSON-LD/OpenGraph extraction
- `cc-swarm-export` — JSON/CSV/Markdown/DOT export
- `cc-swarm-bulk` — bulk URL import
- `cc-swarm-secrets` — credential scanning
- `cc-swarm-daemon` — background continuous crawler
- `cc-swarm-learn` — autonomous research + skill generation
- `cc-swarm-intel` — unified intelligence pipeline
- `cc-swarm-screenshot` — visual capture
- `cc-swarm-classify` — page type classifier
- `cc-swarm-wayback` — Archive.org integration
- `cc-swarm-status` — system status
- `cc-swarm-list` — list all commands
- `cc-enrich` — auto-generate skills from swarm data
- `cc-octagents` — 8-agent intelligence platform
- `cc-ghmon` — GitHub grey-area repo monitor

## Grey-Area Arsenal

Monitors 100 controversial GitHub repos across 19 categories. 90 alive, 10 removed. Archived locally (5.1GB, 101 dirs). Daily scan at 06:00.

**Categories:** ai_leaks, media_downloaders, drm_circumvention, osint_scraping, crypto_privacy, reverse_engineering, adblock_paywall, game_cheats, free_apis, llm_apis, free_claude, vpn_proxy, exploits, trading_bots, social_bots, ios_jailbreak, deepfake, console_modding, academic_piracy

Commands:
- `cc-ghmon --archive` — full scan + archive
- `cc-ghmon --repo owner/repo` — check single repo

## Octagents (8-Agent Platform)

Autonomous intelligence platform: Recon, Scraper, Analyst, Mapper, Monitor, Hunter, Archivist, Synthesizer.

```bash
cc-octagents <target>    # Deploy all 8 agents against a target
```

## Bridges

Both bridges use camoufox-browser (launchd auto-restart + cron health check every 5 min).

**ChatGPT Image Bridge:**
- Model: `gpt-image-2.0`
- Status: `node lib/chatgpt-image-bridge.cjs ping`
- Generates images via ChatGPT Plus/Pro subscription (no API cost)

**Kimi Bridge:**
- Model: `kimi-k2`
- Status: `node lib/kimi-bridge.cjs ping`
- Routes design tier through Kimi web interface (no API cost)
- **Requires:** Log into `https://www.kimi.com` in Camoufox window once

## Compute Tier (Operator)

Manifesto §13 "operator" capability via local `browser-harness` (CDP-level Chrome control). Three modes via `ask({ flags: ['compute'], computeMode })`:

- `script` — prompt IS the harness Python (deterministic, fast)
- `nl` — natural-language intent translated to harness Python via cheap tier
- `auto` (default) — heuristic; auto-detects Python via harness API names; falls through to `nl`

Translated scripts are preserved in `result.meta.script_used` so any prior compute call is replayable from `cc-tasks show <id>`.

**Chrome lifecycle** (managed via `cc-compute`, isolated `--user-data-dir=~/.claude/state/chrome-profile/` so user's main Chrome is never touched):

```bash
cc-compute up [--headless] [--port N]   # launch Chrome with --remote-debugging-port
cc-compute down                          # SIGTERM only what we launched
cc-compute status                        # port + CDP probe + managed PID
cc-compute ensure [--headless]           # up if not up, no-op if already up
cc-compute logs [-n N]                   # tail Chrome's stderr/stdout
cc-compute ping                          # quick CDP probe (exit 0 if responsive)
```

The compute tier does NOT auto-launch Chrome — call `cc-compute up` once before using `--flags compute`. PID file: `~/.claude/state/chrome.pid`. Log: `~/.claude/state/chrome.log`.

## iOS / DoseCraft Toolchain

DoseCraft ecosystem (Swift SPM + 2 Xcode apps) at `~/DoseCraft/`:

- `Apps/DoseCraft/DoseCraft.xcodeproj` — Peptide toolkit
- `Apps/CoachByDoseCraft/CoachByDoseCraft.xcodeproj` — Coach app
- `fastlane` — App Store deployment
- `maestro` — UI test automation
- `scripts/` — App Store pipeline (privacy manifest, review guard, preflight)

## Health & Monitoring

```bash
router-ping              # Probe all 10 tiers + bridges + MCP servers (now includes tierCompute)
node lib/shadow-router.cjs status   # Shadow tier health
node lib/shadow-router.cjs keys     # Key acquisition guide
cc-swarm-status          # Swarm system status
cc-ghmon --archive       # Run grey-area scan
node lib/chatgpt-image-bridge.cjs ping
node lib/kimi-bridge.cjs ping
cc-compute status        # Compute tier — Chrome remote-debug port + managed PID
cc-tasks stats           # Task queue counts + artifact bytes
cc-vec list              # Repo vector projects + chunk counts
```

## Environment

Global env loaded from `~/.claude/.env` (mirrored in `~/Claude Code/.env`):
- `DEEPSEEK_API_KEY` — cheap tier
- `OPENAI_API_KEY` — image API fallback
- `GITHUB_TOKEN` — ghmon + MCP
- `CODEX_CLI` — codex tier
- `KIMI_CLI` — kimi CLI fallback

**Router-layer behavior toggles** (all opt-in):

- `CC_AUTO_VERIFY=cheap,codex,precision,design` — auto-enable flag-mode verification for those producer tiers
- `CC_TASK_DB` — override task queue DB path (default `~/.claude/state/tasks.db`)
- `CC_TASK_INLINE_CAP` — artifact spill threshold in bytes (default 102400)
- `CC_VEC_DB` — override vector DB path (default `~/.claude/state/vectors.db`)
- `CC_VEC_EMBED_MODEL` — Ollama embedding model (default `nomic-embed-text`)
- `CC_COMPUTE_CHROME_BIN` — Chrome binary (default `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`)
- `CC_COMPUTE_PROFILE_DIR` — `--user-data-dir` (default `~/.claude/state/chrome-profile`)
- `CC_COMPUTE_PORT` — Chrome remote-debugging port (default 9222)

**Dependencies added by router-layer behaviors:**

- `better-sqlite3` (npm) — task queue + vector store
- Ollama `nomic-embed-text` (~274 MB) — vector store embeddings (`ollama pull nomic-embed-text`)

## Architecture

```
ask(prompt) → classifyTask() → applyQuota() → swarmAugment() / octagentsAugment()?
                                    ↓
                  taskQueue.enqueue() → markStarted()    [Phase 0]
                                    ↓
              optional: contextLimit → recentContext injection [Phase 0]
              optional: repoContext  → repo-vector inject      [Phase 3]
                                    ↓
                            dispatch() → BFS failover
                                    ↓
                    tier-specific call() → normalizeResponse()
                                    ↓
                  taskQueue.complete() | taskQueue.fail()  [Phase 0]
                                    ↓
              optional: verify=flag|gate → semanticVerify()    [Phase 1]
                                    ↓                  └─ BLOCK + gate → retry on fallback tier
                                    ↓
                              return result
```

Key files:

- `lib/tiered-ask.cjs` — main router (10 tiers, all router-layer behaviors wired here)
- `lib/tiered-ask.cjs` TIER_DEFS — tier definitions
- `lib/task-queue.cjs` — SQLite task queue + artifact spill (Phase 0)
- `lib/semantic-verify.cjs` — cross-tier verifier with VERDICT/FINDINGS parser (Phase 1)
- `lib/repo-vector.cjs` — repo-state vector store + cc-vec CLI (Phase 3)
- `lib/compute-client.cjs` — browser-harness wrapper, NL→Python translation (Phase 4)
- `lib/compute-chrome.cjs` — Chrome lifecycle + cc-compute CLI (Phase 5)
- `lib/shadow-router.cjs` — zero-cost inference tier
- `~/.claude/shadow-config.yaml` — shadow tier config
- `swarm/coordinator.py` — swarm engine
- `swarm/octagents.py` — octagents engine
- `swarm/ghmon.py` — grey-area monitor
- `lib/chatgpt-image-bridge.cjs` — image bridge
- `lib/kimi-bridge.cjs` — design bridge
- `lib/kimi-client.cjs` — design client (bridge primary, CLI fallback)
- `AI_OS_MANIFESTO.md` — north-star architecture doc; phase plan; gap analysis vs current stack

## Shadow Router

Zero-cost inference tier using legitimate free API providers.
- Module: `lib/shadow-router.cjs`
- Config: `~/.claude/shadow-config.yaml`
- State: `~/.claude/shadow-state.json` (quota tracking, key cooling)

**Providers:**
- **Groq** (`console.groq.com`): 20 req/min, Llama 3.3 70B, Mixtral, Gemma
- **Together AI** (`together.xyz`): 60 req/min, Llama 3.1, Qwen 2.5
- **Cerebras** (`cerebras.ai`): Free tier, Llama 3.1
- **SambaNova** (`sambanova.ai`): Free tier, Llama 3.1

**Setup:**
```bash
node lib/shadow-router.cjs init     # Create config template
node lib/shadow-router.cjs keys     # Show key acquisition instructions
node lib/shadow-add-key.cjs groq <key>    # Add a Groq key
node lib/shadow-add-key.cjs together <key> # Add a Together key
```

**Features:**
- Multi-provider rotation with per-key quota tracking
- Automatic cooling of exhausted keys
- Fallback to paid tiers when all shadow keys fail
- Health probes integrated into `router-ping`

## CLIProxyAPI

Wraps Claude Code, Codex, and Gemini CLI as OpenAI-compatible API endpoints.
- Binary: `~/.local/bin/cliproxy`
- Config: `~/.claude/cliproxy-config.yaml`
- API: `http://127.0.0.1:8317`
- Auth: `cliproxy -claude-login`, `cliproxy -codex-login`, `cliproxy -login`
- Service: `launchctl start com.cliproxy`
