# Devin Public Artifact Study

Date: 2026-05-24

## Boundary

Devin's core agent/runtime codebase is not public. The studyable artifacts are:

- official Devin docs and API docs
- Cognition's public GitHub organization
- `CognitionAI/qa-devin`
- `CognitionAI/devin-extension`
- `CognitionAI/devin-swebench-results`
- `CognitionAI/metabase-mcp-server`

This is therefore a public-artifact study, not a source-code audit of Devin's
closed product internals.

## What Devin Actually Optimizes

Devin is optimized around task ownership, not chat. The product unit is a
session that can start from web, Slack, Linear/Jira, CLI, API, or IDE context,
then move toward a PR or status outcome.

The public docs emphasize:

- autonomous code writing, running, and testing
- Linear/Jira tickets, bug reports, app testing, migrations, refactors, PR
  review, documentation, and internal tools
- explicit completion criteria and easy verification
- web, embedded IDE, shell, browser, and API access
- repository indexing through Ask Devin before starting work
- service-user API access, RBAC, auditability, sessions, knowledge, playbooks,
  secrets, and infrastructure controls

## Code Artifacts Inspected

### `qa-devin`

This is the most useful public implementation artifact.

Patterns:

- QA tasks are prompt-defined checklists.
- Each test creates a Devin session through the API.
- Status is polled until blocked/stopped/timeout.
- The session returns structured output with `success` and `message`.
- Results are summarized and optionally posted to Slack.
- Tests include auth, secrets, Slack integration, sleep/wake, PR creation, and
  GitHub PR comment feedback waking Devin up.

Relevant extraction:

- Our dogfood runner should keep explicit CHECK-style acceptance criteria.
- Mission status should include sleep/awake/blocked equivalents.
- PR comments or external feedback should become mission events.
- Structured output is mandatory for automation; chat text is not enough.

Do not copy:

- raw `.env` credential handling
- Slack-first workflow as the main product surface
- long opaque browser prompts as the only test contract

### `devin-extension`

This is not extension source; it is the marketplace/listing repo. Still useful
for UX pattern extraction.

Patterns:

- IDE entry point starts a new Devin from selected code context.
- Separate action adds selected context to the current Devin.
- A "Your Devins" list is the persistent session list.
- Each session exposes three core actions:
  - connect to Devin's machine by VS Code Remote SSH
  - open the session in browser
  - archive/sleep the session
- Code review exposes global diff and per-file read-only diffs.
- PR can be opened in GitHub or checked out locally for human edits.

Relevant extraction:

- Our cockpit should have a persistent mission list, not only current chat.
- Selected-code context should attach to the current mission.
- Global diff and per-file proof should be first-class.
- "Archive" should map to pause/sleep, not delete.
- Checkout/takeover should be explicit.

Do not copy:

- another heavy IDE shell
- session clutter in the primary surface

### `devin-swebench-results`

This is evaluation harness/methodology, not Devin internals.

Patterns:

- Each benchmark has a reproducible setup script.
- Prompt includes repo path, env activation, issue statement, and setup state.
- Repos are pinned to base commits.
- Remote is removed so newer commits are invisible.
- Evaluation is driven by test directives.

Relevant extraction:

- Our benchmark fixtures should pin upstream issue metadata and expected patch
  surfaces.
- External issue replay should isolate repo state and prevent hidden newer
  context from leaking.
- Prompt packets should name environment setup and verification command.

Do not copy:

- conda-first assumptions
- benchmark-only workflow as the product workflow

### `metabase-mcp-server`

This is not Devin core, but it shows Cognition's tool-surface discipline.

Patterns:

- MCP tools are filtered by mode: essential, read/write, all.
- Credentials are injected through environment variables.
- Tool registration is centralized.

Relevant extraction:

- Our MCP/tool surfaces should default to essential tools.
- Write tools should be explicit and filterable.
- TEL/trust should remain the credential boundary.

Do not copy:

- broad 80-tool default exposure

## Direct Comparison To AI Coding OS

What we already have:

- Mission Kernel: durable mission object, route, trust, cost, proof, timeline
- Agent Runtime Adapter: turns an execution into mission artifacts
- Mission Events: normalized lifecycle event contract
- Dogfood session runner: sustained multi-cycle work proof
- Mutating/public/third-party dogfood runners
- Proof bundles, public CI, AI checks, product verification, 10/10 readiness
- VS Code cockpit continuation UI
- trust gates, permission matrix, TEL, route receipts

What Devin has that we should still close:

- issue/ticket -> branch -> PR as the default public workflow
- live session replay with browser/shell/IDE visibility
- cloud/isolated workspace as a product default
- PR comments and external events waking or updating a mission
- service-user API model with RBAC-style auditability
- session list and archive/sleep lifecycle polished as UX primitives

## Minimal Extraction Plan

Keep the project simple. Add only these primitives when needed:

1. **Mission sleep/wake**
   - Add `paused/sleeping` as visible lifecycle state only if the cockpit needs
     it for long-running work.

2. **External feedback event**
   - Normalize PR comments, issue comments, and user replies as
     `feedback.received` mission events.

3. **PR delivery proof**
   - Strengthen public-repo dogfood so the default end state can be a local
     branch plus optional PR link when credentials are approved.

4. **Global diff surface**
   - Cockpit should expose summary diff and per-file proof without making logs
     the main UI.

5. **CHECK-list acceptance**
   - Long autonomous missions should carry explicit acceptance criteria and
     structured output, not only a natural-language completion note.

## Decision

Do not make AI Coding OS a Devin clone.

Extract only the task-ownership spine:

```text
mission -> scoped context -> execution -> external feedback -> PR/diff proof
```

The current AI Coding OS direction remains:

```text
local-first cognitive OS
  + mission continuity
  + proof-backed execution
  + taste-first frontend wedge
  + invisible model routing
```

Devin validates the mission/session ownership model. It does not require us to
add a heavy hosted employee abstraction before the local workflow is excellent.
