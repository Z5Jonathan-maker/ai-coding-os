---
name: checkpoint
description: Write or list session checkpoints in ~/.claude/checkpoints/. Use when the user says "save state", "checkpoint", "/checkpoint", "save where we are", "leave a note for the next session", or before context compaction. Also handles listing/showing prior checkpoints.
---

# checkpoint — manual session state snapshots

The session-handover Stop hook writes checkpoints automatically when a
turn ends. This skill is for explicitly writing one mid-session, or
reading prior ones.

## `/checkpoint` (write)

Write a manual checkpoint to `~/.claude/checkpoints/manual-<ts>.md`
with a structured snapshot of where we are. Use the conversation
context — don't ask the user, infer from the recent messages.

The checkpoint markdown should have:

```markdown
# Manual checkpoint — <timestamp>

## Where we are
<1-2 sentences on the current task and what's done>

## Open threads
- <thing still in progress>
- <decision pending>

## Next steps (if continued)
1. <concrete next action>
2. <concrete next action>

## Files in flight
- `path/to/file.ts` — <what's changing>

## Key context
<anything a fresh session would need that isn't in CLAUDE.md or git>
```

Save with:
```bash
mkdir -p ~/.claude/checkpoints
cat > ~/.claude/checkpoints/manual-$(date +%Y%m%d-%H%M%S).md <<'EOF'
<the markdown above>
EOF
```

Confirm by tail of the file path.

## `/checkpoint list`

```bash
ls -lt ~/.claude/checkpoints/*.md 2>/dev/null | head -10
```
Show the 10 most-recent checkpoints with size + age.

## `/checkpoint show [N]`

Show the Nth most-recent checkpoint (default 1):
```bash
ls -t ~/.claude/checkpoints/*.md | sed -n "${N:-1}p" | xargs cat
```

## `/checkpoint last` 

Show the latest checkpoint:
```bash
ls -t ~/.claude/checkpoints/*.md | head -1 | xargs cat
```

## `/checkpoint resume`

Like SessionStart's auto-resume but on demand:
- Read the latest checkpoint
- Acknowledge what was happening
- Ask if user wants to continue or start fresh

## Composes with

- `session-handover.sh` writes Stop-time checkpoints automatically — you
  don't need to call this skill at end-of-turn, only mid-turn when
  there's a meaningful checkpoint moment.
- `session-resume.sh` (SessionStart) auto-surfaces the latest checkpoint
  when a new session starts in the same cwd. Manual checkpoints get the
  same treatment.
- Run `/checkpoint` before any long Agent dispatch or before /compact —
  preserves what won't survive the compaction.
