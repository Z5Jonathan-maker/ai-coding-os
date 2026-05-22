# Arsenal

The complete capability index for this system. Invoke with `/arsenal` or reference this skill when the user asks "what can you do", "what tools do you have", or "run the arsenal".

## Quick Status

```bash
~/AI-SYSTEM-V2/scripts/ai-control.sh status   # System dashboard
router-ask --health                           # Router health
cc-swarm-status                               # Swarm system status
cc-ghmon --archive       # Run grey-area scan now
```

## Router

Main entry: `router-ask` and `~/AI-SYSTEM-V2/scripts/ai-control.sh`.

| Class | Trigger | Backend |
|------|---------|---------|
| cheap | summarize, extract, transform, bulk | DeepSeek |
| design | UI/UX, screenshots, browser work | Kimi |
| precision | architecture, security, hard debugging, final QA | Codex/Claude |
| image | mockups, hero assets, ads, branding | ChatGPT |

Ollama/local-model routing is retired in AI-SYSTEM-V2. Do not revive it
unless the user explicitly reintroduces a local model tier.

**Auto-trigger swarm augmentation** when prompt contains: `research`, `scrape`, `crawl`, `deep_dive`, `competitive_analysis`, `extract`.

## MCP Tools (15 Connected)

All tools execute silently — 59 permissions pre-approved.

| Server | Key Tools | Use When |
|--------|-----------|----------|
| **filesystem** | read_file, write_file, edit_file, list_directory | File ops across `~`, `~/Claude Code`, `~/DoseCraft` |
| **memory** | read_graph, search_nodes, create_entities | Persistent knowledge across sessions |
| **sequential-thinking** | sequentialthinking | Multi-step reasoning chains |
| **github** | get_file_contents, search_repositories, create_issue | GitHub API ops |
| **fetch** | fetch URL → markdown | Scrape any web page |
| **git** | git search, status, log | Repo introspection |
| **time** | timezone conversion | Time math |
| **playwright** | browser_navigate, screenshot | Browser automation |
| **chrome-devtools** | evaluate_script, snapshot, network | Chrome debugging |
| **context7** | vector search | Upstash knowledge retrieval |
| **mempalace** | semantic search | Long-term memory recall |
| **webclaw** | scrape | Web extraction |
| **glif** | run workflows | AI workflows (needs `GLIF_API_TOKEN`) |
| **firecrawl** | scrape + JS exec | Deep web scraping (needs `FIRECRAWL_API_KEY`) |

## Swarm Arsenal (50 Commands)

All prefixed with `cc-`.

### Core
- `cc-swarm <urls>` — Multi-agent crawler (BFS, depth-limited)
- `cc-swarm-query <query>` — FTS5 search across scraped pages
- `cc-swarm-analyze <url>` — Content analysis (entities, tech stack, APIs)
- `cc-swarm-map <url>` — Site graph builder (DOT output)
- `cc-swarm-report <url>` — Intelligence report generation
- `cc-swarm-diff <url>` — Page change tracking
- `cc-swarm-status` — System health
- `cc-swarm-list` — List all 50 commands

### Extraction
- `cc-swarm-structured <url>` — JSON-LD / OpenGraph extraction
- `cc-swarm-secrets <url>` — Credential/token scanning
- `cc-swarm-screenshot <url>` — Visual capture
- `cc-swarm-classify <url>` — Page type classifier

### Automation
- `cc-swarm-daemon <urls>` — Background continuous crawler
- `cc-swarm-learn <topic>` — Autonomous research + skill generation
- `cc-swarm-intel <target>` — Unified intelligence pipeline
- `cc-swarm-scheduler` — Cron job management
- `cc-swarm-bulk <file>` — Bulk URL import

### Utilities
- `cc-swarm-export` — JSON/CSV/Markdown/DOT export
- `cc-swarm-wayback <url>` — Archive.org integration
- `cc-swarm-broken <url>` — Broken link detection
- `cc-swarm-dedupe` — Duplicate detection
- `cc-swarm-xref` — Cross-reference analysis
- `cc-swarm-timeline <url>` — Change timeline

## Octagents (8-Agent Platform)

```bash
cc-octagents <target>    # Deploy all 8 agents
```

| Agent | Role |
|-------|------|
| Recon | Domain/OSINT discovery |
| Scraper | Content extraction |
| Analyst | Pattern/intent analysis |
| Mapper | Relationship graphing |
| Monitor | Change detection |
| Hunter | Threat/opportunity spotting |
| Archivist | Data preservation |
| Synthesizer | Report generation |

## Grey-Area Monitor

100 controversial repos across 19 categories. 90 alive, 10 removed. Archived locally (5.1GB, 101 dirs).

```bash
cc-ghmon --archive              # Full scan + archive
cc-ghmon --repo owner/repo      # Check single repo
cat ~/.claude/gh-mon/report.md  # Latest report
```

**Categories:**
| Category | Key Repos | Risk |
|----------|-----------|------|
| `ai_leaks` | claude-code leaks, system prompts | High |
| `media_downloaders` | yt-dlp, youtube-dl, spotify-dl | Medium |
| `drm_circumvention` | widevine-l3-decryptor variants | High |
| `osint_scraping` | sherlock, spiderfoot, theHarvester | Low |
| `crypto_privacy` | tornado-cash, monero | High |
| `reverse_engineering` | sm64ex, ILSpy, Ghidra scripts | Low |
| `adblock_paywall` | uBlock, bypass-paywalls | Medium |
| `game_cheats` | Cheat Engine, GuidedHacking | Low |
| `free_apis` | GPT_API_free, FREE-openai-api-keys | Medium |
| `llm_apis` | uni-api aggregator | Low |
| `free_claude` | free-claude-code | High |
| `vpn_proxy` | v2rayN, v2rayNG, shadowsocks, sing-box, Xray | Medium |
| `exploits` | metasploit, sqlmap, PhoneSploit | Medium |
| `trading_bots` | freqtrade | Low |
| `social_bots` | InstaPy, twikit | Medium |
| `ios_jailbreak` | unc0ver, palera1n, Dopamine | Medium |
| `deepfake` | DeepFaceLab, SimSwap | High |
| `console_modding` | RPCS3, Dolphin, Xenia, Cemu, Azahar | Medium |
| `academic_piracy` | Openlib, annas-mcp | Medium |

**Auto-scan:** Daily at 06:00 via cron.

## Bridges

### ChatGPT Image Bridge
- Model: `gpt-image-2.0`
- Path: `lib/chatgpt-image-bridge.cjs`
- Auth: ChatGPT Plus/Pro subscription (no API cost)
- Auto-restart: `launchd KeepAlive` + cron health check every 5 min
- Test: `node lib/chatgpt-image-bridge.cjs ping`

### Kimi Design Bridge
- Model: `kimi-k2`
- Path: `lib/kimi-bridge.cjs`
- Auth: Kimi subscription (no API cost)
- Status: Needs one-time login at `https://www.kimi.com` in Camoufox
- Fallback: Kimi CLI (`kimi`) if bridge session expires
- Test: `node lib/kimi-bridge.cjs ping`

## iOS / DoseCraft Toolchain

Location: `~/DoseCraft/`

```bash
# Xcode projects
open ~/DoseCraft/apps/DoseCraft/DoseCraft.xcodeproj
open ~/DoseCraft/apps/CoachByDoseCraft/CoachByDoseCraft.xcodeproj

# App Store pipeline
cd ~/DoseCraft && fastlane ios deploy    # Build + upload
maestro test maestro/screenshot-flow-ios.yaml  # UI tests

# Scripts
scripts/preflight-check.ts       # Pre-submission validation
scripts/review-guard.ts          # Review checklist
scripts/generate-privacy-manifest.ts  # Privacy manifest
```

## Environment

Global env loaded from `~/.claude/.env` (mirrored in `~/Claude Code/.env`):

| Var | Purpose |
|-----|---------|
| `DEEPSEEK_API_KEY` | Cheap tier |
| `OPENAI_API_KEY` | Image API fallback |
| `GITHUB_TOKEN` | ghmon + GitHub MCP |
| `CODEX_CLI` | Codex tier path |
| `KIMI_CLI` | Kimi CLI fallback |
| `GLIF_API_TOKEN` | Glif MCP (placeholder) |
| `FIRECRAWL_API_KEY` | Firecrawl MCP (placeholder) |

## Files

| File | Purpose |
|------|---------|
| `lib/tiered-ask.cjs` | Main router (9 tiers) |
| `lib/tiered-ask.cjs` TIER_DEFS | Tier definitions + fallback graph |
| `lib/shadow-router.cjs` | Zero-cost inference tier (free APIs) |
| `~/.claude/shadow-config.yaml` | Shadow tier configuration |
| `~/.claude/shadow-state.json` | Shadow key usage + cooling state |
| `swarm/coordinator.py` | Swarm engine |
| `swarm/octagents.py` | Octagents engine |
| `swarm/ghmon.py` | Grey-area monitor |
| `lib/chatgpt-image-bridge.cjs` | Image bridge |
| `lib/kimi-bridge.cjs` | Design bridge |
| `lib/kimi-client.cjs` | Design client (bridge primary, CLI fallback) |
| `~/.claude/gh-mon/repos.json` | Tracked repo catalog |
| `~/.claude/gh-mon/report.md` | Human-readable report |
| `~/.claude/gh-archive/` | Cloned repo archive |

## Health Monitoring

- **Bridge keeper:** `~/.claude/scripts/bridge-keeper.sh` — runs every 5 min via cron
- **Camofox:** `launchd KeepAlive` + cron restart if dead
- **Grey-area scan:** Daily at 06:00
- **Alert log:** `~/.claude/bridge-alerts.log`

## CLIProxyAPI

Location: `~/.local/bin/cliproxy`  
Config: `~/.claude/cliproxy-config.yaml`  
API: `http://127.0.0.1:8317`

Wraps paid CLI tools as OpenAI-compatible API endpoints:
- Claude Code → Anthropic-compatible API
- Codex CLI → OpenAI-compatible API
- Gemini CLI → Gemini-compatible API

**Auth (run in terminal, opens browser):**
```bash
cliproxy -claude-login      # Claude OAuth
cliproxy -codex-login       # Codex OAuth
cliproxy -login             # Gemini OAuth
```

**Use:**
```bash
curl http://127.0.0.1:8317/v1/chat/completions \
  -H "Authorization: Bearer $CLIPROXY_LOCAL_KEY" \
  -d '{"model":"claude-opus-4","messages":[{"role":"user","content":"hi"}]}'
```

**Management UI:** `http://127.0.0.1:8317` (TUI mode: `cliproxy -tui`)
