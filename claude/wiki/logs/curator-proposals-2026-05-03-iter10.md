# Wiki curator second-pass proposals — 2026-05-03 (iter 10)

Manual run after iter 7-9 added significant content (design suite, TEL, multiple log entries). Validates structure + cross-references after the recent expansion.

## Structure check
- ✅ All 6 expected wiki files present
- ✅ logs/ has the original 2 (failure, optimization) + curator-proposals-* + session-candidates-*
- ✅ NEW: design/ sibling brain at `~/.claude/design/` (15 files)
- ✅ NEW: tel/ sibling brain at `~/.claude/tel/` (17 files)

## File sizes
| File | Lines | Status |
|---|---|---|
| README.md | 49 | ✓ |
| tool-registry.md | 78 (was 64 in iter 6) | ✓ — expanded with sibling brains section |
| agent-definitions.md | 87 | ⚠️ stale — doesn't reference `dependency-warden`, `wiki-curator`, or `design-director` agents added in iter 5/6/7 |
| workflow-templates.md | 113 (was 99) | ✓ — added W9 |
| decision-rules.md | 97 (was 81) | ✓ — added D13 |
| logs/failure-log.md | 85 | ✓ +3 entries from real iter 9 install (Python 3.9, op timeout, shellcheck) |
| logs/optimization-log.md | 130 | ✓ +3 entries (TEL install validation, MCP fallback, design picker) |

## Hygiene findings

### Stale: agent-definitions.md missing 3 agents
The file lists 5 custom agents (code-reviewer + 4 from iter 1) but the system now has 8: dependency-warden (iter 3), wiki-curator (iter 4), design-director (iter 7) are missing. **Proposal:** Add the 3 missing entries with proper "When/Tools/Output/Never" structure matching the existing format.

### Verified clean
- failure-log entries each have unique root causes (no dedup needed)
- optimization-log entries each track a real change (no superseded marks needed)
- workflow-templates W1-W9 each cite at least one skill/agent/MCP from the registry
- decision-rules D1-D13 have no internal contradictions

### Drift check
✓ No drift between CLAUDE.md routing tables and skills/agents/MCPs

## Proposals to apply

1. **Backfill 3 missing agent entries in agent-definitions.md** (dependency-warden, wiki-curator, design-director)
2. ~~Update D8 to reference resolver~~ — already done iter 6
3. ~~Cross-link W1↔W7~~ — already done iter 6
4. Optional: tool-registry.md "Health monitoring of each layer" added iter 10 — consider adding similar block for MCPs

## What the curator system is doing well
- Real failures from real iterations are landing in failure-log within the same session (iter 9 captured 2 fresh failures live)
- Optimization-log shows cumulative trajectory across 9 iterations
- Workflow-templates grew naturally (W1-W8 in iter 4, W9 in iter 9 as TEL workflow emerged)

## Curator runs going forward
- Agent: `wiki-curator` (~/.claude/agents/wiki-curator.md)
- Cadence: monthly (1st of month) OR on-demand after long autonomous sessions
- Output: `curator-proposals-<date>[-iterN].md` — propose-only, never auto-apply
