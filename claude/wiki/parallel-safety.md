# MCP parallel-safety map

When you fan out multiple Claude Code sub-agents in parallel (Agent tool with multiple calls in one message), **each sub-agent spawns its own copy of every stdio MCP**. Any MCP that holds a single global resource (lock file, port, shared profile dir) becomes a swarm-killer: the loser sub-agents hang on the resource → the Claude Code tool-call watchdog SIGKILLs them → the failure looks like an "Anthropic infrastructure issue" but it's local contention.

Last incident (2026-05-12): a 6-parallel UI-test swarm in `claude-code-router` died because every sub-agent's `chrome-devtools-mcp` tried to use the same `~/.cache/chrome-devtools-mcp/chrome-profile`. Five lost the SingletonLock race and hung. The watchdog killed them. Diagnosis from inside the dying session: "Anthropic infrastructure issue I can't work around." **Wrong** — it was a profile-contention bug, fixed in 90 seconds with `--isolated`.

## Parallel-safety table

| MCP | Safe to swarm? | Fix applied | Notes |
|---|---|---|---|
| `chrome-devtools` | ✅ now | `--isolated` flag added | Each spawn gets ephemeral profile dir, auto-cleaned |
| `playwright` | ✅ now | `--isolated` flag added | Same fix as chrome-devtools |
| `mcp-memory` | ⚠️ stable file, but write-race risk | `MEMORY_FILE_PATH=~/.claude/state/mcp-memory.jsonl` | Concurrent writes to the JSONL file can clobber; for parallel use, prefer `mempalace` (SQLite WAL) |
| `mempalace` | ✅ | SQLite WAL handles concurrent readers; writes serialized by SQLite | The canonical episodic memory for swarm work |
| `mcp-filesystem` | ✅ for reads, ⚠️ for writes to same file | none needed | Parallel reads always safe; concurrent writes to the same path = last-write-wins |
| `mcp-git` | ⚠️ if same repo | none — by design | Two agents `git commit`-ing the same repo race the index lock. Fan out across DIFFERENT repos OK; single repo = sequential. |
| `mcp-fetch` | ✅ | none needed | Stateless per request |
| `mcp-time` | ✅ | none needed | Pure compute |
| `mcp-sequential-thinking` | ✅ | none needed | Pure compute |
| `mcp-glif` | ✅ | none needed | API wrapper |
| `mcp-firecrawl` | ✅ | none needed | API wrapper, rate-limited but parallel-safe |
| `context7` | ✅ | none needed | Upstash API |
| `github` | ✅ | none needed | GitHub API (token-based rate limits apply) |
| `webclaw` | ✅ probable | none — uses local binary | Local stdio, no shared state observed |
| `open-design` | ⚠️ daemon single-instance | by design | The daemon is single-process; multiple agents share it. Functions don't conflict but heavy load may queue. |
| `claude.ai *` (Gmail, Drive, Calendar, Figma, Gamma, Vibe Prospecting, Amplitude) | ✅ | none needed | HTTP MCPs hosted by providers, parallel-safe by design |

## How to know if a new MCP is parallel-safe

Quick checks before you dispatch a swarm against an MCP you haven't profiled:

1. **Does it wrap a browser?** Look for `--isolated` / `--user-data-dir` / similar profile flags. If absent, assume parallel-hostile.
2. **Does it bind a fixed port?** Single-port servers serialize all access. Fine for one agent, queues under load.
3. **Does it write to a single backing file?** Check the source for `writeFileSync(...)` on a fixed path. Concurrent writers = race.
4. **Does it use SQLite with WAL?** Then concurrent readers are safe and writers are serialized cleanly. WAL is in `journal_mode=wal` PRAGMA.
5. **Is it an HTTP API wrapper?** Almost always parallel-safe; only worry is the upstream's rate limits.

## How to verify the fix worked

From any new Claude Code session (the fixes only take effect on session restart — MCPs are spawned once per session):

```bash
claude mcp get chrome-devtools | grep -i isolated
claude mcp get playwright | grep -i isolated
claude mcp get mcp-memory | grep MEMORY_FILE_PATH
```

All three should show the fix is in place. Then dispatch a 3-parallel test swarm:

```
Agent({ subagent_type: 'Explore', prompt: 'navigate to example.com via chrome-devtools and screenshot, report any errors' })
```

…three times in one message. All three should complete without harness-watchdog kills. Before the fix, ≥1 would die.

## Stale state cleanup

If chrome-devtools still hangs after the config fix, clear stale lock files:

```bash
pkill -f "chrome-devtools-mcp/chrome-profile"
rm -f ~/.cache/chrome-devtools-mcp/chrome-profile/Singleton{Lock,Socket,Cookie}
```

The `--isolated` flag uses fresh temp dirs, so this only matters for legacy lock files left behind by the old config.

## Source

Adapted from the chrome-devtools-mcp + playwright/mcp documented isolation flags. The watchdog SIGKILL behavior is the Claude Code harness defending against stuck tools — not a bug, but it surfaces local contention as if it were an Anthropic infra issue.
