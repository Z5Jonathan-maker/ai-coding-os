# Wiki curator first-pass proposals — 2026-05-03

Manually executed iter 6 (agent will run this monthly going forward).

## Structure check
- ✅ 6/6 expected files present (README, tool-registry, agent-definitions, workflow-templates, decision-rules, logs/{failure,optimization}-log)
- ✅ logs/ subdir present with both required files + new `.session-heartbeat`
- ✅ workflows/ subdir present (empty — reserved for per-workflow detail files when templates.md gets too big)

## File sizes (post-iter-5)
| File | Lines | Status |
|---|---|---|
| README.md | 49 | ✓ healthy |
| tool-registry.md | 86 | ✓ |
| agent-definitions.md | 87 | ✓ |
| workflow-templates.md | 99 | ✓ — room for ~6 more workflows before split |
| decision-rules.md | 102 | ✓ |
| logs/failure-log.md | 49 | ✓ append-only |
| logs/optimization-log.md | 95 | ✓ append-only |

## Hygiene findings

### failure-log.md — 5 entries
- ✅ All entries unique root causes (no dedup needed)
- ✅ All entries follow format (Context / Failure / Root cause / Fix / Lesson)
- 🟢 No proposals — log is healthy

### optimization-log.md — 9 entries
- ✅ All entries follow format (Before / Change / After / Why it matters)
- ✅ No superseded entries
- 🟢 No proposals

### workflow-templates.md — 8 entries (W1-W8)
- ✅ Each workflow references at least one tool, agent, OR decision rule
- 🟢 W1 (Audit→ship) and W7 (Dependency upgrade) have overlap in step 4-5 (`code-reviewer` + push). **Proposal:** Reference W7 from W1 step 5 to avoid duplication when both run together.

### decision-rules.md — 12 entries (D1-D12)
- ✅ Each rule has a clear "X then Y" structure
- ✅ No internal contradictions detected
- 🟢 D8 (When MCP fails) now has a concrete implementation (mcp-fallback-resolver.sh from iter 5). **Proposal:** Update D8 to reference the resolver script.

## Cross-references check
- ✅ tool-registry references all 16 live MCPs from `claude mcp list`
- ✅ agent-definitions references all 7 custom agents in ~/.claude/agents/
- ✅ Routing-drift checker passes clean
- ✅ Workflow templates W1-W8 each cite at least one skill/agent/MCP from the registry

## Drift check
```
✓ No drift. CLAUDE.md routing tables are in sync.
```

## Proposals to apply (low risk, all backward-compatible)

1. **Update D8** in decision-rules.md to reference the new fallback resolver
2. **Cross-link W1↔W7** in workflow-templates.md to avoid duplicate step descriptions
3. **No deletions** — all entries earn their place

## Curator runs going forward
- Agent: `wiki-curator` (~/.claude/agents/wiki-curator.md)
- Cadence: monthly (1st of month) OR on-demand after long autonomous sessions
- Output: this file pattern (`curator-proposals-<date>.md`) — propose-only, never auto-apply
