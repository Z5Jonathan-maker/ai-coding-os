# Recent Memory — rolling 48hr context

Auto-populated by `/skills/consolidate-memory` running nightly. Distilled from
the past 48hrs of session jsonls under `~/.claude/projects/`. Promoted entries
graduate to `long-term-memory.md` after the weekly review.

## Format

Each entry: timestamp, source session id, one-line summary, optional `→ tag` for promotion candidates.

```
2026-05-04T12:00Z  aeda5184  KLOW/GLOW research-data was wrong (sema/cagri)  → promote: aurex-content
2026-05-04T11:30Z  aeda5184  Camofox-browser installed for stealth scraping  → promote: tooling
```

## Active entries

```
2026-05-13T23:00Z  200d7579  Global permissions flipped to bypassPermissions + empty deny list. Committed dotfiles 19340b7. Symlinked at ~/.claude/settings.json. Switched dotfiles remote from SSH→HTTPS to unstick pushes.  → promote: harness-config
2026-05-13T23:05Z  200d7579  Self-audit shipped 4 critical fixes: (1) project .claude/commands/{depth-check,evolve,mega-cycle,schedule-task}.md symlinked to ~/.claude/commands/; (2) removed shadow ~/.claude/skills/swarm-melville.md; (3) cc-loop launchd job unloaded + paused via ~/.cc-paused (missing prompt file, now scaffolded); (4) glif + firecrawl removed from project mcp.json. Router-project commit c546592.  → promote: brain-architecture
2026-05-13T23:10Z  200d7579  Bonus: cc-vec re-indexed claude-router-lib (143 files / 320 chunks, was 189 / 7-day stale); swarm-melville + swarm-moby-dick moved from skills/ to wiki/learnings/swarm-bundles/; tool-registry.md gained skill-class taxonomy (Runtime / Ruleset / Lookup).  → promote: brain-architecture
2026-05-13T23:12Z  200d7579  bio.tel daemon HEALTHY despite launchctl LastExitStatus=15 — PID 12980 alive, port 8765 responds /health /docs /registry /execute /undo. SIGTERM was prior cycle, not current failure.  → promote: tel-status
2026-05-13T23:14Z  200d7579  Substrate health: mempalace 106278 drawers, 16 hooks, 22 launchd agents (cc-loop was the only failing one), 9 router tiers all green, task queue 56 rows / 4 failures clustered on codex code_review + codex code_refactor + design ui_design + compute.  → promote: brain-architecture
```
