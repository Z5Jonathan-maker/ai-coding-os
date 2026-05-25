# OpenHands Code Study - 2026-05-24

Purpose: extract proven runtime patterns from OpenHands without importing product
clutter into AI Coding OS.

## Sources Studied

- `https://github.com/All-Hands-AI/OpenHands`
  - Local clone: `/tmp/openhands-study`
  - Commit: `5e311f7f995008ffe4c74f8cf6f3085d4030c670`
- `https://github.com/OpenHands/software-agent-sdk`
  - Local clone: `/tmp/openhands-sdk-study`
  - Commit: `2aa5256e2147a3252be8d1f96600f627ec27abbb`

Boundary: this was a static code study. I did not run OpenHands.

## Core Finding

OpenHands is strongest as an execution runtime, not as a taste/product interface.
The valuable layer is its separation between:

- app conversation metadata
- start task lifecycle
- sandbox/runtime status
- agent execution status
- append-only event history
- tool execution and security gates
- local/remote workspace abstraction

That maps directly to our Mission Kernel and Agent Runtime Adapter direction.
The wrong move would be cloning its full Docker/cloud/enterprise surface. Our
advantage is still simplicity, routing, taste-driven frontend, and cockpit
continuity.

## Architecture Map

### 1. App Server Composition

File: `openhands/app_server/config.py`

OpenHands wires every major subsystem through explicit injectors:

- `LLMModelService`
- `EventService`
- `EventCallbackService`
- `SandboxService`
- `SandboxSpecService`
- `AppConversationInfoService`
- `AppConversationStartTaskService`
- `AppConversationService`
- `PendingMessageService`
- `UserContext`
- `JwtService`
- `DbSessionInjector`

Extraction: keep our runtime adapter service boundaries explicit. Do not let one
large orchestrator own routing, mission state, trust, proof, and tool execution.

### 2. Conversation Object Model

Files:

- `openhands/app_server/app_conversation/app_conversation_models.py`
- `openhands/app_server/app_conversation/app_conversation_service.py`
- `openhands/app_server/app_conversation/live_status_app_conversation_service.py`

Useful structures:

- `AppConversationInfo`: durable metadata without live status
- `AppConversation`: metadata plus sandbox and execution status
- `AppConversationStartRequest`: user request, repo, branch, trigger, parent,
  plugins, secrets, initial message
- `AppConversationStartTask`: slow startup state machine

OpenHands explicitly separates stored task identity from live runtime state. That
is correct.

Extraction for us:

- `mission.json` should remain durable mission identity.
- `runtime.state.json` should track live runtime separately.
- `agent.timeline.json` should record startup and execution events.
- Parent/child mission IDs should stay first-class.

### 3. Startup Lifecycle

OpenHands startup phases:

- `WORKING`
- `WAITING_FOR_SANDBOX`
- `PREPARING_REPOSITORY`
- `RUNNING_SETUP_SCRIPT`
- `SETTING_UP_GIT_HOOKS`
- `SETTING_UP_SKILLS`
- `STARTING_CONVERSATION`
- `READY`
- `ERROR`

This is one of the strongest extractable patterns. Starting an autonomous coding
run is not binary. It has visible phases that need proof and recovery.

Native AI Coding OS version should stay smaller:

- `preflight`
- `route`
- `trust`
- `context`
- `workspace`
- `agent_start`
- `ready`
- `error`

### 4. Sandbox Runtime Boundary

Files:

- `openhands/app_server/sandbox/sandbox_models.py`
- `openhands/app_server/sandbox/sandbox_service.py`
- `openhands/app_server/sandbox/process_sandbox_service.py`
- `openhands/app_server/sandbox/docker_sandbox_service.py`
- `openhands/app_server/sandbox/remote_sandbox_service.py`

OpenHands models sandbox state separately:

- `STARTING`
- `RUNNING`
- `PAUSED`
- `ERROR`
- `MISSING`

It supports process, Docker, and remote sandbox services. The process service is
the relevant one for our local-first stack: spawn an agent server process, give it
a dedicated working directory, expose a health endpoint, track a session API key,
and support pause/resume/delete.

Extraction:

- Add a future optional sandbox adapter around existing local agents.
- Keep process/local first.
- Docker should remain optional, not required.
- Runtime health check should be a first-class proof signal.

Do not extract:

- Docker-first assumptions.
- Kubernetes/enterprise runtime complexity.
- Per-user sandbox pools until we need multi-user hosting.

### 5. Event Log And Trajectory Export

Files:

- `openhands/app_server/event/event_service.py`
- `openhands/app_server/event/event_service_base.py`
- `openhands/app_server/event/filesystem_event_service.py`
- `openhands-sdk/openhands/sdk/conversation/event_store.py`
- `openhands-sdk/openhands/sdk/event/base.py`

OpenHands treats actions, observations, state changes, errors, condensation, and
messages as an append-only event stream. The SDK event log persists ordered event
files, builds an index, prevents duplicate event IDs, and uses a lock file for
concurrent writes.

Extraction:

- Our `agent.timeline.json` should be treated as the source of truth, not a UI
  artifact.
- Proof bundles should be exportable/replayable from mission events.
- Event writes need ordering and duplicate protection.
- Cockpit should render from live events, not simulated summaries.

### 6. Agent Execution Loop

Files:

- `openhands-sdk/openhands/sdk/agent/agent.py`
- `openhands-sdk/openhands/sdk/conversation/impl/local_conversation.py`
- `openhands-sdk/openhands/sdk/conversation/state.py`

The SDK has the real agent loop:

- conversation state persists agent, workspace, execution status, stats,
  secrets, hooks, activated skills, blocked actions/messages, and agent runtime
  state
- agent initializes a system prompt event once, then repeatedly prepares LLM
  messages, calls the LLM, classifies the response, emits action events, executes
  tools, emits observations, and marks finished/error/stuck
- context-window and malformed-history errors can trigger condensation recovery
- `FinishTool` controls completion

Extraction:

- Keep a single runtime loop with normalized events.
- Continue using finish/verdict as the end of a mission, not “last chat text”.
- Track blocked actions and blocked messages directly in mission state.
- Add condensation/context recovery only when our own long sessions prove the
  need; do not build it prematurely.

### 7. Parallel Tool Execution With Resource Locks

File: `openhands-sdk/openhands/sdk/agent/parallel_executor.py`

This is a high-value pattern. OpenHands can execute multiple tool calls
concurrently, but it serializes calls that touch the same declared resource.

Extraction:

- Our agent runtime adapter should not blindly parallelize tool calls.
- Tools should declare resource keys:
  - file path
  - shell/session
  - browser profile
  - git worktree
  - credential/TEL service
- Different resources can run concurrently.
- Shared resources must serialize.

This is one of the few patterns worth implementing later because it improves
speed without making the product busier.

### 8. Confirmation And Security

Files:

- `openhands-sdk/openhands/sdk/security/confirmation_policy.py`
- `openhands-sdk/openhands/sdk/security/analyzer.py`
- `openhands-sdk/openhands/sdk/agent/agent.py`

OpenHands separates risk analysis from confirmation policy:

- `AlwaysConfirm`
- `NeverConfirm`
- `ConfirmRisky`
- security analyzer assigns risk
- confirmation policy decides whether execution pauses

Extraction:

- This validates our `.ai/trust.json` direction.
- Keep the public UX simple, but internally model:
  - risk
  - policy
  - decision
  - reason
  - scope
  - one-time vs persistent approval

Do not expose this as a dashboard. It should appear only when the system needs
permission or when the user opens proof/debug mode.

### 9. Hooks

Files:

- `openhands-sdk/openhands/sdk/hooks/manager.py`
- `openhands-agent-server/openhands/agent_server/hooks_service.py`

Hook types include:

- pre-tool-use
- post-tool-use
- user-prompt-submit
- session-start
- session-end
- stop

Pre-tool and prompt hooks can block. Post-tool and session hooks are observational.

Extraction:

- Our trust/proof/runtime layers should use lifecycle hooks, but they should be
  product-owned hooks, not user-facing plugin sprawl.
- Useful hook points:
  - before route
  - before tool execution
  - after tool execution
  - before final verdict
  - after proof bundle
  - stop/continue loop

### 10. Pending Messages

Files:

- `openhands/app_server/pending_messages/pending_message_service.py`
- `openhands/app_server/app_conversation/live_status_app_conversation_service.py`

OpenHands queues user messages while a conversation is not ready, then remaps
the temporary task ID to the real conversation ID and delivers queued messages.

Extraction:

- Add this concept to the roadmap for long-running cockpit sessions.
- Do not implement immediately unless the cockpit starts dropping user input
  during startup/resume.

### 11. Model Routing

Files:

- `openhands-sdk/openhands/sdk/llm/router/base.py`
- `openhands-sdk/openhands/sdk/llm/router/impl/multimodal.py`

OpenHands has a router-shaped LLM abstraction that presents multiple LLMs as one
LLM and delegates completion to a selected underlying model. Its included
multimodal router is simple: route to primary when images are present or when the
secondary model context limit would be exceeded.

Extraction:

- Their abstraction supports our approach: one model interface, multiple model
  lanes underneath.
- Our router is more specialized because it routes by cognitive role, quality,
  cost, fallback, and creative direction.
- Do not downgrade to a media-type-only router.

### 12. Skills / Microagents

Files:

- `skills/README.md`
- `.openhands/microagents/glossary.md`
- `openhands/app_server/app_conversation/skill_loader.py`
- `openhands-sdk/openhands/sdk/context/skills/*`

OpenHands supports public skills plus repo-local microagents/skills. This is the
same primitive as our global skills, project AGENTS files, and routing table.

Extraction:

- We do not need another skill system.
- We should keep improving our existing AGENTS/skills discipline.
- The useful idea is loading repo-local instructions automatically and keeping
  them versioned with the project.

### 13. Worktrees

File: `openhands-agent-server/openhands/agent_server/conversation_service.py`

OpenHands can create a dedicated git worktree per conversation, branch it from
the remote default branch when possible, and inject guidance telling the agent to
work inside that worktree.

Extraction:

- This is relevant for safe autonomous sessions.
- We should prefer worktree-backed missions for long-running or risky changes.
- Keep it optional. Small local edits should not pay this overhead.

## What We Should Take

1. **Runtime status split**
   - mission status, runtime status, execution status, startup phase

2. **Append-only mission events**
   - ordered, replayable, duplicate-safe, exportable

3. **Trajectory/proof export**
   - mission metadata plus event timeline plus changed files plus verification

4. **Local/process sandbox adapter**
   - optional future adapter for isolated long-running missions

5. **Resource-aware tool concurrency**
   - parallel where resources differ, serialize where resources collide

6. **Risk analyzer + confirmation policy split**
   - trust decision becomes enforceable, not just documented

7. **Pending input queue**
   - only once cockpit long-running sessions need it

8. **Worktree-backed mission mode**
   - for risky/autonomous multi-hour work

## What We Should Not Take

- Full Docker-first runtime.
- Kubernetes/enterprise deployment topology.
- Analytics stack.
- Broad Git provider management.
- Full OpenHands settings surface.
- Another skill/microagent system.
- Another IDE shell.
- Visible logs as the main UX.
- Media-type-only model routing.

## Comparison To AI Coding OS

### OpenHands Is Ahead In

- battle-tested execution loop
- local/remote workspace abstraction
- sandbox lifecycle
- event persistence
- REST agent server surface
- worktree isolation
- resource-aware tool concurrency
- pending message delivery

### AI Coding OS Is Ahead In

- cognitive routing thesis
- creative-direction/Image 2.0 lane
- taste-driven frontend wedge
- invisible orchestration UX
- mission/proof product framing
- TEL/trust-first credential boundaries
- local global config integration
- quality/cost/fallback routing philosophy

### Current Practical Gap

Our concept is more differentiated. OpenHands is more operationalized.

The gap is not more features. The gap is runtime hardening:

- event replay under real day-long use
- robust failure recovery
- optional worktree/sandbox execution
- proof bundles generated from live events
- cockpit reflecting real runtime state
- fewer manual claims, more machine-verifiable artifacts

## Minimal Next Move

Do not clone OpenHands.

The only justified next implementation track is:

1. Strengthen Mission Runtime state with the OpenHands split:
   - `startup_phase`
   - `runtime_status`
   - `execution_status`
2. Make `agent.timeline.json` append-only and replayable.
3. Add a small future-facing `runtime.adapter.md` contract for:
   - local process
   - worktree
   - optional sandbox
4. Delay Docker, pending messages, and parallel resource locks until a real
   dogfood session proves they are needed.

This keeps the product simple while extracting the part OpenHands actually got
right: autonomous execution is durable state plus evented proof, not a chat box.
