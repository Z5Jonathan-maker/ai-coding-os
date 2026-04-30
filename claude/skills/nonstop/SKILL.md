---
name: nonstop
description: Arm or disarm the nonstop Stop hook. When armed, Claude won't terminate the turn — the Stop hook nudges it to keep working through the task list. Use when the user says "go nonstop", "keep working", "don't stop", "I'm going AFK", "work while I sleep", "finish without me", "/nonstop". Also handles "/nonstop off" and "/nonstop status".
---

# nonstop — autonomous work mode

The nonstop Stop hook is at `~/.claude/hooks/nonstop.sh`. It's armed by
touching a flag file. This skill is the user-facing UX for that.

## When the user says `/nonstop` or `/nonstop on`

1. **Pre-flight first** (the nonstop hook gives you 5 retries before
   giving up — make them count). Do the standard nonstop pre-flight:
   - Mentally simulate the entire task path
   - Surface any genuinely-blocking ambiguity NOW (this is the last
     chance to ask before the user walks away)
   - Get explicit yes/no on each high-risk category that might come up
     (deploy, force push, kill processes, post comments, send messages,
     paid API calls)
2. **Arm the hook** by running:
   ```bash
   touch ~/.claude/hooks/state/nonstop.activate
   ```
3. **Confirm** in your reply: "Nonstop armed. I'll keep working through
   the task list. Touch `~/.claude/hooks/state/nonstop.deactivate` to
   stop me at any time."
4. **Start working immediately.** Don't wait. The user's already AFK.

## When the user says `/nonstop off`

Run:
```bash
touch ~/.claude/hooks/state/nonstop.deactivate
```
Then confirm and stop normally.

## When the user says `/nonstop status`

Show:
```bash
ls -la ~/.claude/hooks/state/nonstop-*.active 2>/dev/null && \
  echo "ARMED" || echo "off"
cat ~/.claude/hooks/state/nonstop-*.count 2>/dev/null
```
Tell the user how many nudges remain (NONSTOP_MAX default is 5).

## Decision framework while armed

When the Stop hook fires and blocks you, the loop is:
1. Look at the task list — anything pending or in_progress?
2. If blocked: solve it yourself first (read code/docs, fix the error).
3. If unsolvable: work around it without changing the outcome, mark it
   blocked with reason, move on.
4. Long-running ops: spawn a background Agent, don't sit on it.
5. Genuinely out of work: `touch ~/.claude/hooks/state/nonstop.deactivate`.

**Never:** brute-force retry, disable safety checks, take destructive
actions not pre-approved, guess credentials.

## Composes with

- `loop-guard.sh` (PreToolUse) — same call ≥5x → block. Won't infinite-
  loop on a stuck operation.
- `error-gate.sh` (PostToolUse) — same tool failing 3x → switch-strategy
  nudge.
- `wired-up-stop.sh` (Stop) — opt-in: blocks Stop on orphan source files.
- `session-handover.sh` (Stop, always-on) — writes a checkpoint at the
  end so the next session can resume.
