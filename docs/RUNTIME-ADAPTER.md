# RUNTIME-ADAPTER.md

The runtime adapter is the thin execution boundary between AI Coding OS missions
and any provider-specific worker.

Provider implementations adapt into this contract. The contract must not adapt
around provider-specific event shapes.

## Required Inputs

Every adapter receives an `AgentRunInput` with:

- `mission_id`
- `task`
- `repo`
- `cwd`
- `agent`
- `lane`
- `provider`
- `model`
- `adapter_type`
- `permission_mode`
- `tools_allowed`
- `tools_denied`
- `requires_browser`
- `requires_visual_proof`
- `budget`
- `timeout_ms`
- `parent_mission_id`

## Required Outputs

Every adapter must write the Mission Kernel artifact bundle:

- `mission.json`
- `route.receipt.json`
- `trust.decision.json`
- `cost.ledger.json`
- `proof.bundle.json`
- `agent.timeline.json`

## Lifecycle Split

Mission state is split deliberately:

- `status`: product-level mission state
- `startup_phase`: preflight, trust check, route, context pack, launch, ready, error
- `runtime_status`: starting, running, paused, error, missing
- `execution_status`: queued, planning, acting, waiting permission, verifying, done, failed

This mirrors the proven OpenHands runtime pattern without importing its whole
runtime surface.

## Event Rule

`agent.timeline.json` is the source of truth for runtime continuity. Events must
be appendable, replayable, timestamp-ordered, and provider-neutral.

The cockpit may render provider-specific details only as expanded proof. Primary
state comes from Mission Events.

## Adapter Types

Current:

- `local_process`: bounded shell execution through `cc-agent-runtime`
- `worktree`: temporary git worktree execution for risky or long-running
  missions. The source repo stays untouched; changed files are captured from
  the isolated worktree before cleanup.
- `docker`: container adapter contract. If Docker/OrbStack is available, the
  command runs inside an ephemeral container with the repo mounted at
  `/workspace`. If Docker is unavailable, the adapter fails loudly instead of
  silently falling back to host execution.

Future-compatible:

- `remote`: optional remote runtime boundary for long-running or cloud tasks.

## Usage

Default local process run:

```sh
cc-agent-runtime run --title "Router reliability pass" --task "Fix fallback behavior and verify tests"
```

Isolated worktree run:

```sh
cc-agent-runtime run \
  --adapter worktree \
  --title "Risky refactor proof" \
  --task "Prove this change in an isolated worktree before touching the active repo"
```

`cc-agent-runtime --check` validates both adapter types and fails if the
worktree path leaks files into the source repository.
