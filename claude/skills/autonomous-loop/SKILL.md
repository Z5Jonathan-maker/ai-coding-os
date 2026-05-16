---
name: autonomous-loop
description: Bootstrap the 2-min self-improvement loop pattern into a project — pre-flight discipline, counter-action checks, null-result-as-health, theme detection, memory/HUMAN.md override. Composes with /loop (interval) and /nonstop (no early termination). Use when the user says "/autonomous-loop", "set up the self-improvement loop", "install the auto-improve pattern", or wants a project to self-tune over many short cycles. Adapted from Wassim Younes's Autonomous-Loop-Mega-Prompt (April 2026 free Drive bundle).
---

# autonomous-loop — bootstrap the 2-min self-improvement loop

This skill installs the operational scaffolding for an autonomous self-improvement loop *in the current project*. The loop itself runs via the built-in `/loop` skill; this one creates the memory files, defines the discipline, and writes the pre-configured loop prompt.

## When to invoke

User says any of:
- `/autonomous-loop`
- "set up the self-improvement loop"
- "install the auto-improve pattern"
- "make this project self-tune"

## What this skill does (in the current project)

1. Creates `memory/` if not present
2. Seeds the standard memory files the loop reads:
   - `memory/work-log.md` — numbered ship log
   - `memory/blockers.md` — decisions parked for human review
   - `memory/themes.md` — cross-cycle theme detection (auto-written every 5 cycles)
   - `memory/predictions.jsonl` — prediction → actual → lesson rows
   - `memory/blocklist.json` — `{}` (will accumulate failed-task fingerprints)
   - `memory/soft-failures.jsonl` — non-fatal error log
   - `memory/HUMAN.md` — override file. **Empty by default.** When the user writes a directive into this file, it overrides the loop prompt on the next cycle.
   - `memory/self-prompts.jsonl` — rotation of long-form questions for the recursive-learn lane
3. Writes the loop-launch one-liner the user pastes to start it (interval-tunable; default 2 min)
4. Tells the user how to stop, pause, monitor, and reset

## The loop prompt (canonical)

The full text lives at `~/code/research/wassim-drive/Autonomous-Loop-Mega-Prompt.txt`. Read from there at install-time so the canonical version stays single-source.

## Discipline (built into the loop prompt)

The loop's pre-flight runs *every cycle* (≤30s budget):
1. Read last 5 entries of `memory/work-log.md` → name one specific way the most recent claim could still be wrong (**counter-action discipline**)
2. Check `memory/HUMAN.md` — its contents OVERRIDE the loop prompt for this cycle if non-empty
3. Check `memory/blocklist.json` — don't retry blocked tasks without root-causing first
4. Read `memory/themes.md` — if last 5 cycles all surfaced the same theme, escalate (deeper attack on it instead of a 6th surface cycle)
5. Read `memory/soft-failures.jsonl` tail — recurring non-fatal errors get root-fixed, not symptom-patched

## Health signals (ship as part of the documentation)

Two counter-intuitive metrics define a *healthy* loop:
- **Null-result rate ≥ 20%** is a health signal, not a failure. It means the loop is *investigating* rather than *performing*. Below 20% suggests the loop is shipping low-quality work to keep the count up.
- **Self-modification rate around 1-2 per first 30 cycles**. The loop should occasionally edit its own operating instructions when evidence warrants. Zero modifications = the loop isn't learning. Too many = it's drifting.

## Composition with existing skills

| User wants | Stack |
|---|---|
| Just kick off the loop with default cadence | `/loop 2m <auto-loop prompt>` |
| Loop without ever ending a turn | `/autonomous-loop` then `/nonstop` |
| Loop that won't ship orphan code | `/autonomous-loop` then `/wired-up` then `/nonstop` |
| Loop that runs in the cloud, not on the iMac | Use `/route` first; cloud Routines wrap this same prompt |

## Ambient status surface

On every cycle, also update `~/.claude/state/loop-status.md` (template at that path documents the schema). Replace the "Current phase" section with this cycle's pre-flight outcome + chosen lane; append to "Phase history" on phase exit with timestamp + duration + outcome; append to "Cycle log" on cycle completion. Any observer can `cat ~/.claude/state/loop-status.md` (or run `cc-phase` / `cc-phase watch`) to see what the loop is doing without joining the Claude session. This is the Verdent-style status-pane pattern lifted into the autonomous-loop substrate.

## Self-modification permission (built into the loop)

The loop prompt explicitly authorizes edits to:
- The loop prompt itself (this skill, any agent config, project CLAUDE.md)
- Adding new files in `lib/`, `scripts/`, `memory/`

It explicitly forbids:
- Pushing to `main`/`master` without explicit user instruction (feature branches OK)
- Deleting files the user might want — preservation is default

## Output discipline (every cycle)

- 1-3 sentences max stating WHAT SHIPPED + WHAT'S NEXT. No preamble, no padding, no "I'll continue" filler
- Append numbered entry to `memory/work-log.md` when code shipped
- Append to `memory/blockers.md` when a decision needs the human

## Stop / pause / monitor

```bash
# Stop:
/loop stop                                  # or close session

# Pause without stopping:
echo "pause until I review work-log.md" > memory/HUMAN.md

# Monitor live:
tail -f memory/work-log.md

# Reset:
rm memory/work-log.md memory/themes.md memory/predictions.jsonl
# then re-invoke /autonomous-loop
```

## Source

Adapted from Wassim Younes's *Autonomous-Loop-Mega-Prompt* (Flux Growth Agency, April 2026 free Drive bundle). Original preserved at `~/code/research/wassim-drive/Autonomous-Loop-Mega-Prompt.txt`. Composes with this user's existing `/loop`, `/nonstop`, `/wired-up`, `/route`, and `consolidate-memory`/`research-scout` skills.
