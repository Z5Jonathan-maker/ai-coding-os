# Code Harvest Audit — 2026-05-21

Goal: identify actual source code worth importing, adapting, or rebuilding into
the AI cockpit so the system reaches top-tier developer-product quality without
adding shiny noise.

## Scope Scanned

Local docs/history:

- `~/dotfiles/docs/*REFERENCE*`
- `~/dotfiles/docs/CODE-HARVEST-WORKFLOW.md`
- `~/dotfiles/claude/audits/`
- `~/dotfiles/claude/wiki/`
- `~/dotfiles/claude/memory/`
- `~/.Codex`, `~/.agents`, and MemPalace recall

Local and newly cloned reference code:

- `~/code/research/cline` — Apache-2.0, 62k+ stars
- `~/code/research/Roo-Code` — Apache-2.0, archived, 24k+ stars
- `~/code/research/continue` — Apache-2.0, 33k+ stars
- `~/code/research/aider` — Apache-2.0, 45k+ stars
- `~/code/research/hyper-claude-code` — MIT
- `~/code/research/agent-browser` — Apache-2.0
- `~/code/research/browser-harness` — MIT
- `~/code/research/langfuse-claude-code-plugin` — local plugin source
- `~/code/research/open-design` — Apache-2.0
- `~/code/research/awesome-ai-apps` — MIT

External star/license sanity was checked with `gh repo view`.

## Executive Verdict

The biggest real gaps are not another model or another IDE. They are product
surfaces and durable agent-control primitives:

1. context meter and context pruning
2. richer file-change/diff review panel
3. session ledger keyed by cwd
4. lane health/circuit breaker with cooldown
5. standardized JSON event stream
6. codebase indexing / context-provider framework
7. browser automation batch/snapshot output discipline
8. session transcript parsing and feedback loop

Those are the pieces that can move this from strong personal stack to a product
developers would star, clone, and pay attention to.

## Priority Harvests

### P0 — Context Meter

- Gap: cockpit does not show prompt/context pressure before routing.
- Source: `~/code/research/Roo-Code/webview-ui/src/utils/model-utils.ts`
- Related UI: `~/code/research/Roo-Code/webview-ui/src/components/chat/ContextWindowProgress.tsx`
- License: Apache-2.0
- Maintenance: Roo is archived, but this module is small, tested, and stable.
- Decision: **adapt/rebuild now**, do not import wholesale.
- Fit score: 9/10
- Why: This is exactly our `cc-context-meter` candidate. It is small, easy to
  port to our existing cockpit webview, and fills a visible trust gap.
- Verification: `AI: Context Meter` task plus cockpit card; test with selected
  file, attached diff, and large prompt.

### P0 — File Changes Panel

- Gap: current `cc-diff-hunks` is useful but not Cursor/Cline-grade review UX.
- Source: `~/code/research/Roo-Code/webview-ui/src/components/chat/FileChangesPanel.tsx`
- Parser source: `~/code/research/Roo-Code/webview-ui/src/components/chat/utils/fileChangesFromMessages.ts`
- License: Apache-2.0
- Maintenance: archived, but component is narrowly scoped and has tests.
- Decision: **adapt**, not direct import.
- Fit score: 8/10
- Why: The grouping-by-file, aggregate added/removed stats, collapsible hunk UI,
  jump-to-file affordance, and final-content diff merge are exactly the missing
  cockpit polish.
- Verification: add cockpit file-change card reading `git diff --numstat` +
  hunk data; no write/apply behavior until review gate is explicit.

### P0 — Provider Circuit Breaker / Cooldown

- Gap: router has fallback logic, but lane health penalties/cooldown are still
  scattered across scripts and docs.
- Source: `~/code/research/hyper-claude-code/middleware/circuit_breaker.py`
- Related: `~/code/research/hyper-claude-code/middleware/failover.py`
- License: MIT
- Decision: **port concept and tests into router**, probably JS/Node instead of
  Python import.
- Fit score: 9/10
- Why: This maps directly to Kimi extension disconnected, DeepSeek timeout,
  ChatGPT image session challenge, and transient provider errors.
- Verification: router smoke must prove a cooled-down lane is skipped and a
  success reduces penalty.

### P0 — Cost/Token Ledger

- Gap: route receipt exists, but exact cost and budget enforcement are partial.
- Source: `~/code/research/hyper-claude-code/middleware/cost_tracker.py`
- Related: `~/code/research/hyper-claude-code/middleware/pricing.py`,
  `~/code/research/cline/src/utils/cost.ts`
- License: MIT for HCC, Apache-2.0 for Cline
- Decision: **adapt into router telemetry**, do not import server middleware.
- Fit score: 8/10
- Why: Developers trust systems that show cost, tokens, and budget caps.
- Verification: `cc-router-receipt`, `cc-router-metrics`, and cockpit Metrics
  must show available cost when the upstream response supplies token usage.

### P1 — Session Ledger Keyed By CWD

- Gap: cockpit does not yet have a clean project/session resume ledger.
- Source: `~/code/research/langfuse-claude-code-plugin/src/state.ts`
- Related: `~/code/research/langfuse-claude-code-plugin/src/transcript.ts`
- License: check repo license before import; local source exists.
- Decision: **adapt the state pattern**, avoid Langfuse coupling.
- Fit score: 8/10
- Why: `_active_by_cwd`, atomic state updates, lock files, line offsets, and
  stale-session pruning are exactly what a resilient local session ledger needs.
- Verification: `cc-session-ledger` lists current cwd sessions, last prompt,
  last result, transcript pointer, and stale status.

### P1 — Transcript Parser / Turn Grouper

- Gap: our cockpit shows last result, but not structured turn/tool history.
- Source: `~/code/research/langfuse-claude-code-plugin/src/transcript.ts`
- License: check before import.
- Decision: **adapt cautiously**; parser shape is valuable, tracing backend is
  optional.
- Fit score: 7/10
- Why: Grouping JSONL into user prompt -> LLM calls -> tool spans is the basis
  for a developer-grade session timeline.
- Verification: `cc-session-ledger --json` emits turn summaries from a transcript
  without needing Langfuse running.

### P1 — Codebase Indexing / Context Providers

- Gap: `cc-semantic-index` exists, but context-provider composition is still
  primitive.
- Source: `~/code/research/continue/core/context/providers/`
- Indexing source: `~/code/research/continue/core/indexing/`
- License: Apache-2.0
- Decision: **study and selectively port provider architecture**, not the whole
  indexer/runtime.
- Fit score: 8/10
- Why: Continue has mature providers for current file, diff, terminal, problems,
  repo map, docs, search, file tree, URL, rules, and MCP. We need the provider
  interface more than their full stack.
- Verification: `cc-context-snapshot --json` should expose named providers and
  included/ignored sources.

### P1 — Aider Repo Map / History Compactor

- Gap: repo understanding and long chat compaction can be stronger.
- Source: `~/code/research/aider/aider/repomap.py` after deeper inspection
- Related: `~/code/research/aider/aider/history.py`
- License: Apache-2.0
- Decision: **adapt algorithms**, avoid pulling all Aider dependencies.
- Fit score: 7/10
- Why: Aider has mature repo-map and chat-summary behavior; our current
  dependency-free `cc-semantic-index` is good but intentionally simple.
- Verification: compare `cc-semantic-index` output against Aider repo map on
  `~/dotfiles` and `~/code/projects/cc-router`.

### P1 — Browser Output Protocol

- Gap: browser/operator outputs need stable JSON, truncation, and spoof-resistant
  content boundaries when flowing through agents.
- Source: `~/code/research/agent-browser/cli/src/output.rs`
- Related: `~/code/research/agent-browser/cli/src/commands.rs`
- License: Apache-2.0
- Decision: **adapt protocol**, not Rust code.
- Fit score: 8/10
- Why: JSON mode, content boundaries with nonce, max-output truncation, warning
  fields, stream status, and batch command semantics are directly useful for
  cockpit browser proof packets.
- Verification: `cc-browser-proof --json` or Kimi/browser fallback receipts
  include boundaries, origin, truncation metadata, and screenshot path.

### P1 — Browser Harness Domain Skills

- Gap: Kimi WebBridge gives control, but repeated browser tasks do not yet
  self-improve into domain-specific skills.
- Source: `~/code/research/browser-harness/agent-workspace/domain-skills/`
- Related: `~/code/research/browser-harness/interaction-skills/`
- License: MIT
- Decision: **adapt pattern**, not replace Kimi WebBridge.
- Fit score: 7/10
- Why: Domain skills for dropdowns, uploads, downloads, iframes, cookies,
  dialogs, and profile sync are practical gap-fillers.
- Verification: a browser workflow can write/read a local `browser-skills/`
  note and use it next run.

### P2 — Open Design Skill Catalog / Artifact Preview

- Gap: cockpit is not a design studio; Kimi owns design, but reusable skill
  catalog and artifact preview patterns are valuable.
- Source: `~/code/research/open-design/apps/*`, `skills/`, `design-systems/`
- License: Apache-2.0
- Decision: **reuse via open-design MCP/project**, not import into cockpit core.
- Fit score: 6/10 for cockpit core, 9/10 for design lane.
- Why: Open Design is excellent, but importing it wholesale would violate the
  one-cockpit rule. Use it as a design-lane backend/reference.
- Verification: cockpit link/card can open Open Design active project/status.

### P2 — Continue Inline Edit / Apply Manager

- Gap: no router-owned inline edit parity.
- Source: `~/code/research/continue/extensions/vscode/src/apply/`
- Related: `~/code/research/continue/core/edit/lazy/applyCodeBlock.ts`
- License: Apache-2.0
- Decision: **defer until context meter and diff panel are done**.
- Fit score: 7/10
- Why: Inline edit is a major Cursor-quality gap, but it is higher blast radius
  and should follow review/rollback UX.
- Verification: selected text -> route -> patch preview -> explicit apply.

## Reject / Do Not Import

- OpenHuman core: GPL-3.0. Use ideas only unless explicitly approved.
- open-managed-agents: AGPL-3.0. Use ideas only.
- Huashu Design assets/skill: personal-use license; do not integrate into a
  commercial/productized cockpit without separate written permission.
- Whole Cline/Roo/Continue extension shells: would duplicate our cockpit and
  violate direction.
- Whole Open Design app: useful via lane/backend, not as cockpit replacement.

## Next Implementation Order

1. `cc-context-meter` + cockpit card using Roo-style token distribution. Done
   2026-05-21: structured JSON plus visual Context Pressure card.
2. Rich diff/file-change cockpit card using Roo-style file grouping/stats. Done
   2026-05-21: structured JSON plus visual File Changes card.
3. Router lane circuit breaker/cooldown adapted from HCC. Done 2026-05-21:
   SQLite breaker already existed; route receipts now expose per-lane circuit
   state and cooldown visibility.
4. Router cost ledger hardened with HCC/Cline pricing ideas. Done
   2026-05-21: route receipts now expose token input/output, token source, and
   cost fields consistently when upstream usage is supplied.
5. `cc-session-ledger` using Langfuse plugin state/transcript patterns.
6. `cc-context-snapshot --json` provider interface inspired by Continue.
7. Browser proof output protocol inspired by agent-browser.

This order is intentional: visible UX first, router reliability second, durable
session intelligence third.

## GitHub-Quality Bar

For this project to be GitHub-trending worthy, the README/demo must show:

- one-command install
- VS Code cockpit screenshot/GIF
- route/cost/permission/checkpoint cards
- context meter and diff review
- one real workflow: ask -> route -> edit -> diff -> verify -> browser proof
- clear lane philosophy
- no vendor lock-in and no mystery model picker
- green product readiness command

The code harvest should serve that demo. Anything else is noise.
