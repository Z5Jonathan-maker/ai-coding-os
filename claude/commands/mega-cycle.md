---
description: Start or continue the self-paced compounding-depth autonomous loop. Each cycle ships one substantive piece of work + schedules its own next wakeup.
---

You just received `/mega-cycle`. This is the entry point for the Mega Cycle System — a self-paced autonomous loop that ships increasingly deeper work over time.

## Execute this cycle now

### 1. Pre-flight (≤30s)

- Tail `memory/soft-failures.jsonl` (last 10 entries). If a pattern repeats ≥3 times, this cycle's domain = root-cause-fix.
- Check `memory/HUMAN_DIRECTIVE.md`. If file exists, HALT and report.
- Read last entry of `memory/inner-log.md`. Identify ONE specific way the most recent claim could still be wrong.
- Read tail of `memory/cycle-themes.md` (if exists). If 5+ cycles same theme, force domain rotation.

### 2. Pick domain (one per cycle)

Per `config.json` → `domain_rotation`. Default ladder:

- **A. PIPELINE_FIX** — find a recurring soft-failure, fix at root. Run audit scripts. HEAD-check resources.
- **B. CONTENT_HARVEST** — external data ingest. Track novelty.
- **C. KG_EXPANSION** — extract relations from recent inner-log entries.
- **D. SELF_OPTIMIZE** — find a mistake made twice. Edit operating instructions. Log [SHIP].
- **E. RECURSIVE_LEARN** — read last 20 inner-log entries, write theme to `memory/cycle-themes.md`.
- **F. UNASKED_CREATIVE** — ship something the operator hasn't named, 80%+ odds they want.
- **G. DASHBOARD_REFRESH** — if data bundle older than 2 hours, refresh.

Pre-flight findings override rotation.

### 3. Deep work (~10 min target)

**Apply the depth ladder** (see `memory/feedback_wakeup_cadence.md`). Each cycle ≥ depth-level of previous:

1. Surface fix
2. Diagnostic + fix
3. Root-cause investigation
4. Structural refactor
5. System-wide audit
6. Foundation rebuild

**Apply the anti-pattern memories** at write-time:

- **Silent-skip** (`feedback_silent_skip_pattern.md`): every filter rejection needs a named counter
- **Incremental-save** (`feedback_incremental_save.md`): persist mutations per-success
- **Speculative-write** (`feedback_speculative_write.md`): verify before writing resource-fields
- **Diagnostic-first** (`feedback_diagnostic_first.md`): build the surfacing tool before guessing at fixes

### 4. Discipline checks before shipping

- State one specific way this fix could still be wrong
- Karpathy 4: think → simple → surgical → goal-driven
- Smoke-test before claiming done
- Uncertain → revert + log

### 5. Output

- **Text response**: 1-3 sentences. WHAT SHIPPED + WHAT'S NEXT.
- **Append to `memory/inner-log.md`**: 3 categories — what shipped (with evidence), what broke (caveats), what surprised (genuine prediction errors).
- **Update `~/.claude/state/loop-status.md`** — replace the "Current phase" block with this cycle's domain + depth tier; append to "Phase history" with timestamp/duration/status; append to "Cycle log" with QC% + commit SHA if shipped. This is the ambient status surface any observer can `cat`. Update protocol is documented in the file's header comments.
- **Commit** with descriptive message ending with co-authorship trailer per your project conventions.

### 6. Schedule next wakeup

```
ScheduleWakeup({
  delaySeconds: <value from config.json wakeup_delay_seconds, default 605>,
  reason: "<one sentence on what next cycle should attempt>",
  prompt: "/mega-cycle"
})
```

The agent continues self-pacing until the operator stops or the rule changes.

## Anti-decay rules

- 3 cycles null in a row → switch domain hard
- 3 cycles same domain → force a different one (F or G usually)
- Reorganizing or commenting without new evidence → STOP, write phenomenology
- Diminishing returns are the WRONG signal — they mean "find the next deeper problem," not "wrap up"

## Output discipline

- No fluff. Lead with the action.
- For yes/no or factual questions: state the fact in the first sentence.
- Never "as an AI" / "based on my analysis" / hedge tokens
- Speak like a senior collaborator who ships
- When uncertain, say "I don't know"

Now run the cycle.
