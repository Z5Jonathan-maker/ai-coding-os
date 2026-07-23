---
name: feedback-wakeup-cadence
description: "ScheduleWakeup delaySeconds per config.json (default 605 = 10m5s). Each cycle does DEEPER work than the last — depth compounds across cycles, not resets."
metadata:
  type: feedback
  originSessionId: 4716d204-44e4-4db2-a688-011f0cea910d
---
ScheduleWakeup delay per `config.json` → `wakeup_delay_seconds` (default 605 = 10 min 5 sec). The 5-second gap is the buffer between agent wakeup and operator's next manual invocation.

**Depth compounds across cycles.** Each cycle goes DEEPER than the previous. Not "10 min of deeper work" once; **escalating depth across the whole session**.

## Depth ladder (every cycle climbs)

1. **Surface fix** — single-file edit, obvious bug
2. **Diagnostic + fix** — build the surfacing tool, then fix what it reveals
3. **Root-cause investigation** — trace race conditions, distributed-state bugs, silent skips
4. **Structural refactor** — change architecture to make a bug class impossible
5. **System-wide audit** — touch multiple subsystems, find compounding interactions
6. **Foundation rebuild** — replace a fragile dependency chain with a robust one

## How to apply within a session

- Cycle N+1's depth ≥ Cycle N's depth. No regression to micro-ships.
- If a cycle wants to "just commit X," it's wrong — find the deeper layer first
- Use the surfacing-tool pattern: every diagnostic built becomes the launching pad for next cycle's deeper investigation
- One substantive commit per cycle, sized to fit ~10 min of focused work
- Cycle compounds: today's fixes enable tomorrow's harder problems

## Tradeoffs accepted

- 605s is beyond the 5-min Anthropic prompt cache window → each wake pays a cache miss
- This is the "amortize the miss with deeper work" zone — depth justifies the cost
- Agent cycles ~6×/hour; each cycle ships meaningfully more
- Diminishing returns are the WRONG signal — they mean "find the next deeper problem," not "wrap up"

## How to apply

- Every `ScheduleWakeup({delaySeconds, ...})` call uses the configured value (default 605). No drift.
- Each cycle: explicitly identify the depth-level (1-6 above). Next cycle: explicitly aim ≥.
- Track depth across the session — don't let it drift back to surface fixes after going deep.
- Invoke `/depth-check` periodically (every 5-8 cycles) to audit drift.

## Configurable

See `config.json`:
- `wakeup_delay_seconds`: 60-3600. Default 605.
- `cycle_duration_target_seconds`: target work duration. Default 600.
- `depth_ladder_threshold`: minimum level to maintain. Default 2.
