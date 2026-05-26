# LLM Wiki — Central Knowledge System

**Status:** Source of truth for the autonomous brain. Every session reads here before acting; writes here after.

Per CLAUDE.md mandate: **if knowledge is not stored in the wiki, it does not exist for future intelligence.**

## Read-before / Follow-during / Write-after protocol

### BEFORE acting on a non-trivial task
1. Identify task class (debug / refactor / research / deploy / design / audit / present / etc.)
2. Read [decision-rules.md](decision-rules.md) — pick the path
3. Read [workflow-templates.md](workflow-templates.md) — find the matching recipe
4. Check [failure-log.md](logs/failure-log.md) — has this been tried + failed before?

### DURING execution
- Use the tool selection from [tool-registry.md](tool-registry.md)
- Use the agent roles from [agent-definitions.md](agent-definitions.md)
- Follow the workflow steps; deviate only when reality contradicts the recipe

### AFTER execution
- If something **failed and was fixed:** append to [failure-log.md](logs/failure-log.md)
- If something **got faster/better:** append to [optimization-log.md](logs/optimization-log.md)
- If a **new workflow emerged:** add to [workflow-templates.md](workflow-templates.md)
- If **decision logic changed:** update [decision-rules.md](decision-rules.md)
- If a **tool/agent was added or retired:** update [tool-registry.md](tool-registry.md) or [agent-definitions.md](agent-definitions.md) AND CLAUDE.md routing tables (they must stay in sync — `routing-drift-check.sh` enforces this weekly)

## Wiki structure

| File | Purpose |
|---|---|
| [tool-registry.md](tool-registry.md) | Every tool, MCP, and built-in — trigger conditions, output contracts |
| [agent-definitions.md](agent-definitions.md) | Every agent — when to invoke, composition with skills |
| [workflow-templates.md](workflow-templates.md) | Proven multi-step recipes |
| [decision-rules.md](decision-rules.md) | "When X, pick Y not Z" routing logic |
| [logs/failure-log.md](logs/failure-log.md) | What broke + root cause + fix (so future Claude doesn't repeat the mistake) |
| [logs/optimization-log.md](logs/optimization-log.md) | What got faster/better + the change that did it |
| [workflows/](workflows/) | Per-workflow detail files (one per recipe, when too long for templates.md) |

## Local-only learning corpora

`learnings/` can hold large transcript, article, and research corpora on the local machine. Git tracks only corpus navigation files: root indexes, per-corpus `_README.md`, and `_manifest.json` files. Do not re-add generated body files from `learnings/`; they are intentionally ignored to keep the repo usable as an operating layer instead of a content dump.

## Synchronization with CLAUDE.md

The CLAUDE.md routing tables are the **fast lookup** loaded into every session.
The wiki is the **deep reference** read on-demand for non-trivial tasks.

Any drift between the two is caught weekly by `~/.claude/scripts/routing-drift-check.sh`.

## How the wiki self-heals

A Stop hook (`wiki-writeback.sh`) captures session outcomes and proposes wiki updates. The `wiki-curator` agent runs monthly to dedupe and refactor.
