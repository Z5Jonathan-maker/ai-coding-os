# MISSION-KERNEL.md

The Mission Kernel is the spine of AI Coding OS.

Every meaningful task should become a mission with one directory of durable
artifacts. The cockpit reads this state to show what is happening, what has
been proven, what is blocked, and what needs permission.

## Directory

```text
.ai/missions/<mission-id>/
  mission.json
  route.receipt.json
  trust.decision.json
  cost.ledger.json
  proof.bundle.json
  agent.timeline.json
```

## Files

### `mission.json`

Canonical mission state.

Required fields:

- `schema`: `ai-coding-os.mission.v1`
- `id`
- `title`
- `task`
- `repo`
- `status`: `planned`, `running`, `blocked`, `verifying`, `passed`, `failed`
- `runtime_status`: `starting`, `running`, `paused`, `error`, `missing`
- `execution_status`: `queued`, `planning`, `acting`, `waiting_permission`,
  `verifying`, `done`, `failed`
- `startup_phase`: `preflight`, `trust_check`, `route`, `context_pack`,
  `launch`, `ready`, `error`
- `route`
- `permission_mode`
- `parent_mission_id`
- `created_at`
- `updated_at`
- `next_action`
- `blockers`
- `agent_run_input`

### `route.receipt.json`

The route decision that selected the lane.

Required fields:

- `schema`: `ai-coding-os.route-receipt.v1`
- `mission_id`
- `selected`
- `fallback_chain`
- `raw`

### `trust.decision.json`

The trust decision before execution.

Required fields:

- `schema`: `ai-coding-os.trust-decision.v1`
- `mission_id`
- `decision`
- `mode`
- `hits`

### `cost.ledger.json`

Token/cost snapshot for the mission.

Required fields:

- `schema`: `ai-coding-os.cost-ledger.v1`
- `mission_id`
- `source`
- `calls`
- `estimated_cost_usd`
- `notes`

### `proof.bundle.json`

The proof package for the final answer.

Required fields:

- `schema`: `ai-coding-os.proof-bundle.v1`
- `mission_id`
- `changed_files`
- `commands`
- `screenshots`
- `artifacts`
- `verdict`

### `agent.timeline.json`

Append-oriented timeline.

Required fields:

- `schema`: `ai-coding-os.agent-timeline.v1`
- `mission_id`
- `events`

Each event has:

- `schema`: `ai-coding-os.timeline-event.v1`
- `mission_id`
- `ts`
- `agent`
- `stage`
- `kind`
- `message`
- `proof`
- `data`
- `severity`

The full event contract lives at `docs/MISSION-EVENTS.md`.

Normalized complete-run stages:

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

## Commands

Create a mission kernel:

```sh
cc-mission-kernel init --title "Router reliability pass" --task "Fix fallback behavior and verify tests"
```

Print the latest mission:

```sh
cc-mission-kernel current --json
```

Validate the kernel contract:

```sh
cc-mission-kernel --check
```

Run a mission through the local runtime adapter:

```sh
cc-agent-runtime run --title "Router reliability pass" --task "Fix fallback behavior and verify tests"
```

Validate the runtime adapter contract:

```sh
cc-agent-runtime --check
```

Validate the event contract:

```sh
cc-mission-events --check
```

## Runtime Adapter

`cc-agent-runtime` is the thin execution adapter above the Mission Kernel. It
does not replace Codex, Claude, Kimi, DeepSeek, or the router. It standardizes
how a routed run becomes durable state.

The adapter writes:

- typed `AgentRunInput` into `mission.json`
- route receipt from the existing router dry-run
- trust decision from `cc-trust-gate`
- cost snapshot from `cc-token-ledger`
- normalized timeline events
- typed `AgentRunResult` inside `proof.bundle.json`

This is the native extraction from OpenHands conversation/runtime separation,
Cline task/tool permission state, and OpenCode session/provider/permission
schemas, adapted to this local-first system.

## Cockpit Rule

The cockpit should read the Mission Kernel first. If no kernel exists for the
current repo, it falls back to `cc-mission-ledger` and `cc-session-ledger`.

This keeps the visible product focused on mission continuity instead of
terminal logs or route mechanics.
