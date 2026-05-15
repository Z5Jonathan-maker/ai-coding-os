---
name: checkpoint
description: Write or list session checkpoints in ~/.claude/checkpoints/. Use when the user says "save state", "checkpoint", "/checkpoint", "save where we are", "leave a note for the next session", or before context compaction. Also handles listing/showing prior checkpoints. Emits BOTH a markdown snapshot AND a machine-readable HANDOFF.json (GSD lift) so other tools/skills can ingest the resume state programmatically.
---

# checkpoint — manual session state snapshots

The session-handover Stop hook writes checkpoints automatically when a
turn ends. This skill is for explicitly writing one mid-session, or
reading prior ones.

Every checkpoint emits TWO artifacts:
1. **Human-readable markdown** at `~/.claude/checkpoints/manual-<ts>.md`
2. **Machine-readable JSON** at `~/.claude/checkpoints/HANDOFF-<ts>.json` (also copied to `~/.claude/state/HANDOFF.json` as the "latest" pointer) — GSD-style structured resume artifact that survives `/clear` and can be parsed by downstream tools.

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
TS=$(date +%Y%m%d-%H%M%S)
mkdir -p ~/.claude/checkpoints ~/.claude/state
cat > ~/.claude/checkpoints/manual-${TS}.md <<'EOF'
<the markdown above>
EOF
```

Then ALSO emit the HANDOFF.json (see schema below):

```bash
cat > ~/.claude/checkpoints/HANDOFF-${TS}.json <<'EOF'
{
  "version": 1,
  "timestamp": "<ISO-8601 UTC>",
  "session_kind": "manual",
  "phase": "<current-phase-name>",
  "in_progress_task": {
    "title": "<task title>",
    "status": "in-progress",
    "started": "<ISO-8601 if known else null>"
  },
  "blockers": [
    "<concrete blocker 1>",
    "<concrete blocker 2>"
  ],
  "pending_human_actions": [
    "<thing waiting on user>"
  ],
  "files_in_flight": [
    {"path": "path/to/file.ts", "intent": "<what's changing>"}
  ],
  "next_steps": [
    "<concrete next action>",
    "<concrete next action>"
  ],
  "plan_reference": "<path to .ai/plan-*.md or null>",
  "isa_reference": "<path to .ai/ISA-*.md or null>",
  "key_context": "<anything a fresh session would need>",
  "markdown_sibling": "~/.claude/checkpoints/manual-<ts>.md"
}
EOF
# Also point the latest at this checkpoint
cp ~/.claude/checkpoints/HANDOFF-${TS}.json ~/.claude/state/HANDOFF.json
```

Confirm by tailing BOTH files.

## HANDOFF.json schema

| Field | Type | Purpose |
|---|---|---|
| `version` | int | Schema version. Bump if breaking changes. Current: 1. |
| `timestamp` | ISO-8601 string | UTC time of checkpoint emission |
| `session_kind` | "manual" \| "auto" \| "stop-hook" | Why this checkpoint exists |
| `phase` | string | Current phase if in a loop (mega-cycle, design-director). Empty string if not in a loop. |
| `in_progress_task` | object | `{title, status, started}` |
| `blockers` | string[] | Hard blockers preventing progress (paid action, missing creds, etc.) |
| `pending_human_actions` | string[] | Things waiting on user input/approval |
| `files_in_flight` | object[] | `{path, intent}` per file currently being edited |
| `next_steps` | string[] | Ordered list of concrete actions to resume |
| `plan_reference` | string \| null | Path to `.ai/plan-<slug>.md` if a written plan exists |
| `isa_reference` | string \| null | Path to `.ai/ISA-<slug>.md` if an ISA exists |
| `key_context` | string | Free-form context that wouldn't survive a `/clear` otherwise |
| `markdown_sibling` | string | Path to the human-readable companion file |

## Why the dual artifact

- **Markdown** is human-skimmable, paste-able into a new session for warm context.
- **JSON** is parseable by `cc-resume`, `session-resume.sh`, future status-pane tooling, MCP servers, or any downstream agent that needs structured handoff (not natural-language inference).

The `~/.claude/state/HANDOFF.json` "latest pointer" means any tool can read the most recent checkpoint without a directory listing or timestamp sort.

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
