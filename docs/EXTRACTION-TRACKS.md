# EXTRACTION-TRACKS.md

This is the extraction plan for reference systems. It is not a casual research
dump. Every reference is reduced to a track, a native AI Coding OS capability,
and a verification gate.

Code-level study before Agent Runtime Adapter implementation:
`docs/CODE-EXTRACTION-STUDY-2026-05-23.md`.

## Rule

Extract primitives, not product clutter.

Use reference systems to identify missing capability classes. Add only the
parts that strengthen the existing cockpit, router, trust, mission, and proof
architecture.

## Tracks

| Source | Primitive To Extract | Native AI Coding OS Form | Proof Gate |
|---|---|---|---|
| Claude Code | Subagents, hooks, MCP, skills, permission modes, context discipline | Agent runtime adapter, trust hooks, skill registry, pre-route permission checks | `cc-trust-gate`, `cc-ai-checks`, future `cc-agent-runtime-check` |
| Cursor | Continuation UX, background agents, repo indexing, project memories, multi-file editing, visual proof surfaces | Mission continuation cockpit, repo map/index, mission feed, proof bundle previews | `cc-cockpit-webview-smoke`, `cc-dogfood-day` |
| OpenHands | Sandboxed autonomous execution, issue-to-PR flow, transparent logs, local/cloud agent architecture | Mission runtime with bounded execution, timeline, proof bundle, future sandbox adapter | `cc-mission-kernel --check`, future sandbox benchmark |
| OpenCode | Provider-agnostic model abstraction, terminal-first UX, simple install, multi-provider config | Lane registry, provider adapter contract, portable CLI gates | `cc-lane-registry-check`, `cc-public-ci-check` |
| Devin | Persistent AI employee model, task ownership, environment continuity, PR delivery, status reporting | Mission object with owner, status, blockers, next action, proof, and verdict | `cc-mission-kernel --check`, `cc-mission-ledger --check` |
| Windsurf / Kimi-style UX | Calm cockpit, visible momentum, browser/screenshot proof, polished task transitions | Continuation-first VS Code cockpit with browser proof and hidden routing mechanics | `cc-cockpit-webview-smoke`, `cc-browser-proof` |
| Token-router strategies | Quality/cost lane selection, fallback paths, token discipline | Router receipt, token ledger, lane fallback chain | `cc-router-smoke`, `cc-token-ledger --check` |

## Build Order

1. **Mission Kernel**
   - `mission.json`
   - `route.receipt.json`
   - `trust.decision.json`
   - `cost.ledger.json`
   - `proof.bundle.json`
   - `agent.timeline.json`

2. **Agent Runtime Adapter**
   - one launch/status/result shape for Codex, Claude, Kimi, DeepSeek, Image,
     Playwright, and TEL
   - permission/trust decision before execution
   - timeline event after execution

3. **Proof Bundle**
   - changed files
   - verification commands
   - screenshots when visual
   - token/cost summary
   - final pass/fail verdict

4. **Cockpit Consumption**
   - read the current mission kernel first
   - fall back to mission ledger/session ledger
   - display mission, next action, blockers, proof, and permission state

5. **Benchmarks**
   - add real repo tasks
   - add UI/browser visual scoring
   - add sandbox/autonomous execution fixture

## Non-Goals

- Do not clone Cursor, Cline, OpenHands, or OpenCode UX wholesale.
- Do not add another IDE shell.
- Do not expose routing mechanics as the main product experience.
- Do not add agents unless the mission object can track their status and proof.

## Sources Checked

- Claude Code docs: subagents, hooks, skills, MCP, and permission modes.
- Cursor docs/product pages: background agents and codebase indexing.
- OpenHands docs/papers: sandboxed autonomous software agents.
- OpenCode docs/product pages: provider-agnostic terminal agent model.

These references support the extraction tracks above; the repo remains
AI-Coding-OS-native.
