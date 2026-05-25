# MISSION-EVENTS.md

Mission events are the runtime language of AI Coding OS.

The cockpit should render mission continuity from these events, not from
provider-specific logs, chat text, or handcrafted dashboard state.

## Contract

Every event in `agent.timeline.json` uses:

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

`kind` is the prefix of `stage`. Example: `tool.requested` has kind `tool`.

Allowed severity:

- `info`
- `warn`
- `error`

## Required Run Stages

A complete runtime run must include:

- `preflight.started`
- `trust.decided`
- `route.selected`
- `context.attached`
- `permission.requested`
- `permission.replied`
- `runtime.started`
- `tool.requested`
- `tool.completed`
- `verification.started`
- `verification.completed`
- `proof.bundle.updated`
- `mission.completed`

## Optional Stages

These are reserved for richer runtime proof without changing the ontology:

- `checkpoint.created`
- `cost.updated`
- `file.changed`
- `screenshot.captured`
- `benchmark.completed`
- `runtime.paused`
- `runtime.failed`

## Commands

Print the event schema:

```sh
cc-mission-events schema
```

Validate a timeline:

```sh
cc-mission-events validate --file .ai/missions/<mission-id>/agent.timeline.json
```

Append a normalized event:

```sh
cc-mission-events append \
  --mission-dir .ai/missions/<mission-id> \
  --stage checkpoint.created \
  --message "Checkpoint created" \
  --proof checkpoint
```

Replay a timeline as a human-readable mission trace:

```sh
cc-mission-events replay --mission-dir .ai/missions/<mission-id>
```

Require complete runtime stages:

```sh
cc-mission-events validate --file .ai/missions/<mission-id>/agent.timeline.json --complete-run
```

Complete-run validation also enforces nondecreasing timestamps and lifecycle
ordering. If the cockpit can replay the timeline, it is allowed to render the
mission as live state.

Run the gate:

```sh
cc-mission-events --check
```

## Design Rule

Providers adapt into this event language. This project should not leak
provider-specific event shapes into the cockpit.
