---
name: consolidate-memory
description: Distill the past 24-48hrs of session conversation logs into the 3-tier memory layer (recent-memory.md / long-term-memory.md / project-memory.md). Adapted from Roman Knox's "Claude Code learns by itself" pattern.
---

# /consolidate-memory

Reads recent session jsonls from `~/.claude/projects/`, extracts decisions,
preferences, and facts, then updates the 3-tier memory layer at
`~/.claude/memory/`. Promotes confirmed patterns from `recent-memory.md` →
`long-term-memory.md` based on recurrence + explicit user confirmation.

## When to invoke

- **Nightly** — via cron / launchd, scope: past 24hrs
- **Weekly** — via cron, scope: past 7 days, also promote `recent` → `long-term`
- **On-demand** — when user says "consolidate" / "update memory" / similar

## What it does

### Phase 1: Scan recent sessions

1. List `~/.claude/projects/*/aeda5184-*.jsonl` (or any session id) modified within the lookback window (`--since 24h` default).
2. For each session: parse `assistant` and `user` messages. Skip tool results (those are noise — focus on the conversational substrate).
3. Extract candidate facts using simple heuristics:
   - User states a preference: "I prefer X" / "always do Y" / "never do Z"
   - User corrects the agent: "no" / "stop" / "don't"
   - User confirms a non-obvious approach: "yes exactly" / "perfect"
   - Agent makes a decision the user accepts: deploy choice, library choice, structural choice
   - New tool/dep/MCP/skill installed
   - Bug fix landed (extracted from commit messages if any)

### Phase 2: De-duplicate against existing memory

For each candidate fact, check if it (or a near-paraphrase) already exists in:
- `~/.claude/memory/long-term-memory.md`
- `~/.claude/projects/<session>/memory/MEMORY.md` + per-fact files
- `~/.claude/wiki/logs/failure-log.md` and `optimization-log.md`

If match: skip. If contradicts existing: flag for user review (don't auto-overwrite).

### Phase 3: Update recent-memory.md

For new candidates, append to the "Active entries" section of
`~/.claude/memory/recent-memory.md` with format:

```
2026-05-04T12:00Z  <session-id-prefix>  <one-line-summary>  → promote: <topic-tag>
```

### Phase 4: Promote (weekly mode only)

When invoked with `--mode weekly`:
1. Read all entries in `recent-memory.md` from the past 7 days.
2. Group by `→ promote: <tag>` annotation.
3. For each tag, distill duplicate/related entries into a single permanent
   line under the matching section in `long-term-memory.md`.
4. Append timestamp comment so we can audit when it was promoted.
5. Clear the promoted entries from `recent-memory.md` (keep last 48hr).

### Phase 5: Sync project-memory.md

After scanning sessions, update `~/.claude/memory/project-memory.md`:
- For each project mentioned (Aurex, brain, mega-brains, etc.), refresh
  "Open threads" + "Recently shipped" lists from the past 24hr.
- Don't bloat — cap each project section at 10 bullets, drop oldest first.

## Implementation skeleton

```bash
~/.claude/skills/consolidate-memory/run.sh [--since 24h] [--mode {nightly|weekly|on-demand}]
```

Logic in `run.sh`:
1. Use `python` (venv at `~/code/projects/scrapling-lab/.venv/bin/python`) to:
   - `glob('~/.claude/projects/**/*.jsonl', recursive=True)` filtered by mtime
   - Parse jsonl lines → extract `message.content` strings from user + assistant turns
   - Apply candidate-fact heuristics (regex + simple pattern matching is fine; LLM call optional)
   - Diff against existing memory
   - Append new entries via stdlib file ops
2. No external LLM calls in the v0 — pure pattern matching is sufficient
   for ~80% of useful facts. Add LLM-distillation later if needed.

## Cron schedule

NOT auto-installed. To enable nightly + weekly:

```bash
# Nightly at 03:00 local
echo "0 3 * * * ~/.claude/skills/consolidate-memory/run.sh --mode nightly --since 24h" | crontab -

# Or via launchd plist at ~/Library/LaunchAgents/bio.claude.consolidate-memory.plist
```

## Composition

- Reads from: `~/.claude/projects/*/`, existing memory files, wiki logs
- Writes to: `~/.claude/memory/recent-memory.md`, `long-term-memory.md`, `project-memory.md`
- Cross-session: changes survive across sessions immediately (next session sees updated memory at start)
- Pairs with `/skills/research-scout` (which stages NEW external info into `long-term-memory.md`'s `new_learnings` section)

## Source

Adapted from Roman Knox (@roman.knox) Instagram post April 5, 2026:
"Claude Code learns by itself" — `It never forgets again.` 4-panel carousel.

## Status

v0 stub. Needs the actual `run.sh` implementation (Phase 1-5 above) before
scheduling. Track in `wiki/workflow-templates.md` as W18.
