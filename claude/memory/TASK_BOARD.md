# TASK_BOARD.md — Autonomous Work Queue for cc-loop

## How it works
cc-loop reads this file every cycle. Tasks are executed top-to-bottom.
When a task completes, it's moved to the `## Completed` section with a timestamp.

## Active Tasks

### [ ] T1 — ROUTING LAYER: Build router-ask CLI surface
- **Type:** system_architecture
- **Priority:** P0
- **Assigned:** main session
- **Description:** The cc-router lib has 116 modules but no CLI entry point. Build router-ask command that wraps tiered-ask.cjs.
- **Dependencies:** none
- **ETA:** 2026-05-18

### [ ] T2 — ROUTING LAYER: Wire cc-loop to task board
- **Type:** automation
- **Priority:** P0  
- **Assigned:** cc-loop
- **Description:** cc-loop currently shows "last_event=paused" and has no task board. Make it read TASK_BOARD.md, pick tasks, route to correct tier, execute, log, mark complete.
- **Dependencies:** T1
- **ETA:** 2026-05-18

### [ ] T3 — ROUTING LAYER: Model-aware cc-loop
- **Type:** automation
- **Priority:** P1
- **Assigned:** cc-loop
- **Description:** When cc-loop encounters a task, it should use router-ask to choose the right model tier (design→KIMI, backend→Claude, cheap→OpenRouter, etc.)
- **Dependencies:** T1, T2
- **ETA:** 2026-05-19

### [ ] T4 — TOKEN OPTIMIZATION: Throttle Stop hooks
- **Type:** system_optimization
- **Priority:** P1
- **Assigned:** main session
- **Description:** 3 Stop hooks (wiki-writeback, mempalace-stop, skill-metrics) run on every turn. Throttle to every N turns or only when output > threshold.
- **Dependencies:** none
- **ETA:** 2026-05-19

### [ ] T5 — CONFIG: Install.sh guard
- **Type:** system_optimization
- **Priority:** P1
- **Assigned:** main session
- **Description:** install.sh can destructively overwrite settings.json. Add a guard: check if symlink, backup before overwrite, or skip if live config is newer.
- **Dependencies:** none
- **ETA:** 2026-05-19

## Completed

### [x] 2026-05-18 — Emergency token burn stop
- **Type:** system_optimization
- **Result:** Disabled alwaysThinkingEnabled + showThinkingSummaries
- **Burn reduction:** ~40-60%

### [x] 2026-05-18 — Fix broken toolchain
- **Type:** system_architecture
- **Result:** Restored 56 dead symlinks, fixed router paths, restored settings.json
- **Impact:** All cc-* tools functional

### [x] 2026-05-18 — Fix MCP npx path
- **Type:** system_architecture
- **Result:** Updated 6 MCP server commands to use working npx
- **Impact:** All npx-based MCPs functional

### [x] 2026-05-18 — Fix model string
- **Type:** system_architecture
- **Result:** Changed gpt-5.5 → gpt-4o in config.toml and .env
- **Impact:** Prevents API failures

### [x] 2026-05-18 — Disable dormant MCPs
- **Type:** token_optimization
- **Result:** Commented out 6 dormant MCP servers
- **Burn reduction:** ~2-4K tokens/turn

### [x] 2026-05-18 — Dedupe AGENTS.md + trim MEMORY.md
- **Type:** token_optimization
- **Result:** Symlinked AGENTS.md, trimmed MEMORY.md 203→36 lines
- **Burn reduction:** ~4.5K tokens/turn

## Backlog (not yet prioritized)

- [ ] Rename ~/Claude Code/ → ~/code/projects/aurex/ to eliminate confusion
- [ ] Build bridge health dashboard command
- [ ] Consolidate launchd agents (5 agents → 2-3)
- [ ] Hook → action routing (make hooks actually DO things)
- [ ] Skill auto-invocation from natural language
- [ ] Episodic router self-improvement (learn from routing decisions)
- [ ] Quota rebalancing visualization
- [ ] Circuit breaker dashboard
