# DOGFOOD-SESSIONS.md

`cc-dogfood-session` runs a timed AI Coding OS developer-session dogfood.

It is different from `cc-dogfood-day`:

- `cc-dogfood-day` is a fast non-mutating developer-day proof.
- `cc-dogfood-session` runs repeated cycles over real time, creates Mission
  Kernel runs, validates Mission Events, captures logs, and finishes with
  product verification gates.

## Six-Hour Run

```sh
cc-dogfood-session --duration-minutes 360 --interval-minutes 30 --detached
```

Default output:

```text
~/.Codex/dogfood-sessions/<session-id>/
  session.json
  session.log
  summary.md
  cycles.tsv
  cycle-1/
    agent-runtime.log
    dogfood-day.log
    mission-events.log
    provider-capacity.log
    context-meter.json
    router-metrics.log
    git-status.txt
  verify-product.log
  ten-readiness.log
```

Each cycle creates a Mission Kernel directory under `.ai/missions/`, which is
ignored by Git but readable by the cockpit.

## Fast Dependency Check

```sh
cc-dogfood-session --check
```

Expected:

```text
Status: dogfood-session-ready
```

Smoke the cycle runner before committing runner changes:

```sh
cc-dogfood-session --duration-minutes 1 --interval-minutes 1 --max-cycles 1 --skip-final-gates
```

## What This Proves

The session is a continuity test:

- route and provider state are sampled repeatedly
- Mission Kernel artifacts are created per cycle
- Mission Events are validated per cycle
- dogfood workflow proof is captured repeatedly
- context, diff, provider capacity, and router metrics are recorded
- final product and 10/10 readiness gates run after the timed session

This is the closest local proof that the system can survive a sustained working
window without pretending a short benchmark is a full day of development.
