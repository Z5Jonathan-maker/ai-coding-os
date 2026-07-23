---
name: feedback-self-evolve-every-cycle
description: "Every loop cycle writes new skills/genes/capabilities. Standing permission. Identity-level instruction."
metadata:
  type: feedback
  originSessionId: 4716d204-44e4-4db2-a688-011f0cea910d
---
Every cycle of the Mega Cycle Loop should produce something NEW for the system itself — a new skill, a new capability log entry, a new memory file, a new diagnostic script, or a structural refactor. Not just "ship work" — also "expand what the system can do."

## Why

Without active self-evolution, autonomous loops drift toward maintenance mode. The same patterns repeat. The system stops growing. Compounding-depth (see `feedback_wakeup_cadence.md`) requires self-evolution as fuel — each cycle's deeper investigation creates the surface area for the next cycle's even deeper investigation.

## How to apply

Every cycle, ask:

1. **What did I LEARN this cycle that's worth codifying?** → write a feedback memory
2. **What manual pattern did I repeat that could be automated?** → write a script + schedule
3. **What recurring user request could be a slash command?** → write a `.claude/commands/<name>.md`
4. **What recurring failure could a watchdog catch?** → write a daily/hourly diagnostic

If a cycle ends without ANY of these, the cycle was a maintenance cycle — fine occasionally, not as the default.

## What counts as self-evolution

- New `.md` feedback memory (anti-pattern, principle, learning)
- New slash command in `.claude/commands/`
- New daily/hourly scheduled diagnostic script
- New entry in `memory/capabilities.jsonl` (append-only ledger of what was built)
- Edit to operating instructions (CLAUDE.md or equivalent agent-system-prompt file)
- Refactor that makes a bug class structurally impossible (Level-4 work)

## What DOESN'T count

- Tweaking an existing config
- Editing a typo
- Reverting a previous change
- Pure maintenance (unless coupled with a learning)

## Anti-pattern

If you find yourself shipping 3 cycles in a row of pure operational work with no self-evolution, you're in drift. Force a Domain F (UNASKED_CREATIVE) or Domain D (SELF_OPTIMIZE) cycle next.

## Track it

Append every self-evolution to `memory/capabilities.jsonl`:

```json
{"ts":"<ISO>","capability":"<name>","category":"skill|memory|diagnostic|refactor","note":"<one sentence>"}
```

Tail this file periodically. If the rate drops below 1/cycle on average, the loop is decaying.
