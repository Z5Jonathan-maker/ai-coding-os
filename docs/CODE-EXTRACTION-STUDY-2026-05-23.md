# CODE-EXTRACTION-STUDY-2026-05-23.md

This is the code-level extraction pass before implementing the Agent Runtime
Adapter.

Reference checkouts studied:

- `OpenHands/OpenHands` at `5e311f7`
- `cline/cline` at `8a6441f`
- `sst/opencode` at `7fe7b9f`

Closed-source references:

- Claude Code, Cursor, Windsurf, Devin, and Kimi do not expose full product
  source code. They are treated as docs/behavior references only.

## What The Open Code Actually Shows

### OpenHands

Files studied:

- `openhands/app_server/app_conversation/app_conversation_models.py`
- `openhands/app_server/app_conversation/app_conversation_service.py`
- `openhands/app_server/sandbox/sandbox_models.py`
- `openhands/app_server/event/event_service.py`
- `frontend/src/types/v1/core/openhands-event.ts`

Useful primitives:

- **Conversation as durable task object**: conversation metadata includes repo,
  branch, trigger, PR numbers, parent/sub-conversations, agent kind, metrics,
  selected model, and timestamps.
- **Start task progression**: startup is not binary. It moves through explicit
  phases: waiting for sandbox, preparing repo, setup scripts, git hooks, skills,
  starting conversation, ready/error.
- **Sandbox as first-class runtime**: sandbox status is separated from agent
  execution status. A runtime can be starting/running/paused/error/missing.
- **Event service abstraction**: events are searchable by conversation, kind,
  timestamp, sort order, and pagination.
- **Exportable trajectory**: conversation export is modeled as events plus
  metadata in a portable bundle.

What to extract:

- Agent Runtime Adapter must separate **mission status**, **runtime status**,
  and **execution status**.
- Mission Kernel needs startup phases, not just `planned/running/passed`.
- Proof bundles should be exportable as a trajectory, not only a final summary.
- Parent/child missions should exist before we add serious subagents.

Do not extract:

- Docker-first architecture as the default path. AI Coding OS is local-first.
  Sandbox should be optional/adapted, not mandatory.

### Cline

Files studied:

- `src/core/task/index.ts`
- `src/core/task/TaskState.ts`
- `src/core/task/ToolExecutor.ts`
- `src/core/permissions/CommandPermissionController.ts`
- `src/shared/getApiMetrics.ts`
- `src/integrations/checkpoints/CheckpointTracker.ts`
- `src/services/browser/BrowserSession.ts`

Useful primitives:

- **Task state is explicit and rich**: streaming flags, tool flags, context
  tracking, loop detection, file-read cache, retry state, checkpoint errors,
  focus/todo state, and active hook execution are all explicit state.
- **Tool execution is centralized**: a ToolExecutor owns validation, auto
  approval, browser/session services, terminal execution, diff provider, MCP,
  context manager, and callbacks.
- **Command permission parser**: command approval is not string-matching only.
  It parses shell structure, separators, redirects, and subshells before allow
  or deny evaluation.
- **Cost metrics from messages**: token/cost accounting is derived from
  task-message events and includes subagent usage.
- **Shadow-git checkpoints**: checkpoints are isolated from the user Git repo
  and keyed to task/workspace identity.
- **Browser session abstraction**: browser state distinguishes local, remote,
  detected Chrome, bundled Chromium, connection info, and action telemetry.

What to extract:

- Agent Runtime Adapter should have one central execution path with typed
  callbacks into Mission Kernel events.
- Trust engine should become more structural for shell commands: parse
  separators, redirects, subshells, and command segments.
- Mission Kernel timeline should record tool attempts, tool results, retries,
  loop warnings, and file-read repetition.
- Cost ledger should eventually read per-mission events, not just global router
  telemetry.
- Checkpoint integration should become a first-class mission proof item.

Do not extract:

- Cline-style visible tool chatter as the main UX. AI Coding OS should show
  mission momentum first and hide mechanics until expanded.

### OpenCode

Files studied:

- `packages/opencode/src/session/session.ts`
- `packages/opencode/src/session/schema.ts`
- `packages/opencode/src/session/llm.ts`
- `packages/opencode/src/permission/index.ts`
- `packages/opencode/src/provider/provider.ts`
- `packages/opencode/src/tool/*.ts`
- `specs/v2/session.md`
- `specs/v2/provider-model.md`

Useful primitives:

- **Session schema is strong**: session state includes project, workspace,
  parent session, summary diffs, cost, token buckets, model/provider, agent,
  permissions, revert data, and created/updated/compacting/archive times.
- **Provider abstraction is deep**: providers and models are separate typed
  concepts, with default-model selection, model lookup, small-model lookup,
  closest-model matching, custom provider loading, and auth separation.
- **Permission requests are evented**: permission ask/reply events are first
  class. Replies support once/always/reject. Rejection can carry corrective
  feedback.
- **LLM streaming is adapter-based**: stream input is typed around session,
  model, agent, permission, system messages, tool set, retries, tool choice, and
  abort signal.
- **Tool registry is explicit**: read/write/edit/shell/grep/glob/webfetch/
  websearch/lsp/task/todo/skill tools each have contracts and tests.

What to extract:

- Agent Runtime Adapter should use typed `AgentRunInput` and `AgentRunResult`,
  not ad hoc command text.
- Provider and model identity must stay separate in our lane model.
- Permission decisions should support `once`, `always`, `reject`, and
  corrective feedback.
- Mission Kernel should add parent mission/session and revert/checkpoint fields.
- Tool results should be normalized into mission timeline events.

Do not extract:

- A full OpenCode runtime clone. Our existing router/lane architecture already
  covers provider selection. We need a thin adapter contract over it.

## Closed-Source Reference Findings

### Claude Code

Public docs confirm the relevant primitives:

- subagents with independent contexts, tools, permissions, MCP servers, hooks,
  skills, memory, background/isolation, and max-turn fields
- hooks at tool/session/prompt/permission boundaries
- skills as reusable instruction bundles with optional scripts/templates

Extraction:

- Adapter must support per-agent tool restrictions, permission mode, skills,
  max-turn budget, and lifecycle hooks.

### Cursor

Public docs/product behavior confirm:

- background agents running asynchronously in isolated environments
- codebase indexing and context retrieval
- polished agent sidebar/status handoff

Extraction:

- Mission Kernel must support background runs, follow-up input, takeover, and
  visible status without exposing raw machinery.

### Windsurf / Kimi-Style UX

Public docs confirm:

- continuation/memory/rules/workflow model
- code/chat modes
- live awareness of editor/terminal context
- todo/plan state for longer tasks
- browser/UI proof as a first-class experience

Extraction:

- Cockpit should keep one main continuation surface and use rules/mission
  context before route mechanics.

### Devin

Public docs/product behavior confirm:

- task ownership
- environment continuity
- prompt-to-PR workflow
- draft PRs/status reporting as the delivery model

Extraction:

- Mission object must be the product unit. A mission ends with a verdict and
  proof bundle, not with a chat response.

## Agent Runtime Adapter Requirements

Do not start implementation until the adapter satisfies these requirements.

### Input

`AgentRunInput` must include:

- `mission_id`
- `task`
- `repo`
- `cwd`
- `agent`
- `lane`
- `provider`
- `model`
- `permission_mode`
- `tools_allowed`
- `tools_denied`
- `context`
- `budget`
- `timeout_ms`
- `requires_browser`
- `requires_visual_proof`
- `parent_mission_id`

### Runtime State

The runtime must track:

- `runtime_status`: `starting`, `running`, `paused`, `error`, `missing`
- `execution_status`: `queued`, `planning`, `acting`, `waiting_permission`,
  `verifying`, `done`, `failed`
- `startup_phase`: `preflight`, `trust_check`, `route`, `context_pack`,
  `launch`, `ready`, `error`

### Output

`AgentRunResult` must include:

- `mission_id`
- `agent`
- `lane`
- `provider`
- `model`
- `status`
- `changed_files`
- `commands`
- `screenshots`
- `artifacts`
- `tokens`
- `cost`
- `permission_requests`
- `errors`
- `next_action`
- `verdict`

### Events

Every run must write Mission Kernel timeline events:

- `preflight.started`
- `trust.decided`
- `route.selected`
- `context.attached`
- `runtime.started`
- `tool.requested`
- `permission.requested`
- `permission.replied`
- `tool.completed`
- `verification.started`
- `verification.completed`
- `proof.bundle.updated`
- `mission.completed`

## Immediate Changes To Make After This Study

1. Extend `mission.json` with runtime/execution/startup phase fields.
2. Extend `agent.timeline.json` with normalized event names.
3. Add `cc-agent-runtime` as a thin local adapter over existing lanes.
4. Make `cc-agent-runtime --check` initialize a fixture mission, run a harmless
   echo-style adapter, write timeline/proof/cost/trust/route artifacts, and
   validate the bundle.
5. Make the cockpit show runtime/execution status from Mission Kernel before
   session ledger fallback.

## Decision

Proceed with Agent Runtime Adapter only after this study is committed.

The adapter should borrow:

- OpenHands' separation of conversation, sandbox, execution, events
- Cline's task state, command permission parsing, metrics, checkpoint model
- OpenCode's provider/model/session/permission/tool schemas
- Cursor/Windsurf/Kimi/Devin's continuation-first UX and mission ownership

The adapter should not borrow:

- duplicate IDE shells
- Docker-first default execution
- visible tool-log UI as the main product experience
- provider abstraction that bypasses our existing router
