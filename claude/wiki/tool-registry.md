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
| `playwright` | E2E test runner semantics, multi-tab, network mock | When you need test runner behavior | Heavier than chrome-devtools |
| `auto-browser` | Supervised browser with approval gates | Sensitive flows: login, payment, account ops | Built-in human-takeover |
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

### Retired (do not use, removed)
| MCP | Why retired | Date | Replacement |
|---|---|---|---|
| `browser-use` | Redundant with chrome-devtools + auto-browser + playwright (4 browser MCPs was 1 too many) | 2026-05-03 | chrome-devtools (default), auto-browser (supervised) |

## Tool selection priority order

When multiple tools could do a job, prefer in this order:
1. **Built-in tool** (Read/Edit/Bash) over MCP — fewer moving parts
2. **MCP** over Bash subprocess — type-safe, schema-validated
3. **Agent** over inline work — when context isolation or parallelism helps
4. **WebSearch + WebFetch** as last resort — most token-expensive, hallucination-prone

## Output contract conventions

Every tool result Claude receives is a string. Tools that produce structured data should:
- Return JSON inside a code fence when the consumer needs to parse
- Return markdown tables when the consumer is human-reading
- Return concise summary + reference path when output is large (write to file, return path)
