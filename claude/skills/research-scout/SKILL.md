---
name: research-scout
description: Proactively hunt for new info that challenges or updates existing knowledge in the brain. Cross-references findings against existing docs, stages confirmed novelties in long-term-memory.md `new_learnings`. Adapted from Roman Knox's "Claude Code learns by itself" pattern.
---

# /research-scout

A scout that runs in the background — searches web/Reddit/HackerNews/Quora/X
for strategies, tools, announcements, and workflow changes relevant to the
user's current documentation and project context. For each finding, it
cross-references against existing knowledge to confirm it's actually new
or contradictory, then stages validated findings into the brain's
`new_learnings` section with timestamp + source URL + one-line note.

## When to invoke

- **3x nightly** (e.g. 02:00, 06:00, 18:00 local) — broad sweep
- **Weekly** — deeper sweep + auto-review of `new_learnings` to promote
  confirmed patterns into the main memory files
- **On-demand** — when user says "scout for X" / "what's new in Y"

## What it does

### Phase 1: Build query set from project context

Reads the user's current focus from:
- `~/.claude/CLAUDE.md` (routing tables — what tools/skills are loaded)
- `~/.claude/memory/project-memory.md` (active project state)
- `~/.claude/wiki/tool-registry.md` (current MCP/CLI/skill inventory)
- Recent session jsonls (last 24hr) for hot topics

Extracts query-worthy keywords:
- Tools we use (Claude Code, agent-browser, camofox-browser, mempalace, etc.)
- Workflows we've codified (mega-brain-ingest, /audit, /loop)
- Domain topics (peptide research, BPC-157, Janoshik, GLP-1 trials)
- Mentor names being tracked (Bachmeyer, Niddam, Karpathy, etc.)

### Phase 2: Search

For each query, hit:
- WebSearch (built-in)
- Reddit (via web)
- Hacker News (Algolia search API)
- X/Twitter (via web)
- Quora (via web)
- arXiv / PMC (for research domains)

Cap at N hits per source (default N=5) to keep token budget bounded.

### Phase 3: Cross-reference + filter

For each hit:
1. Fetch summary (article body via trafilatura, tweet body, post body).
2. Compare against existing knowledge:
   - mempalace search for semantic-similarity match against past sessions
   - grep against `~/.claude/wiki/learnings/` corpus
   - grep against `~/.claude/wiki/decision-rules.md` + `tool-registry.md`
3. Categorize:
   - `actually-new` — no match in existing knowledge
   - `contradicts-existing` — explicitly contradicts something we wrote down
   - `redundant` — matches what we already know (discard)

### Phase 4: Stage

For each `actually-new` or `contradicts-existing` hit, append to
`~/.claude/memory/long-term-memory.md` under `## new_learnings`:

```
- 2026-05-04T02:00Z  [tool/strategy/announcement/workflow]  <one-line summary>
  Source: <URL>
  Why it matters: <one-line context against existing knowledge>
```

## Critical rules

- **Never auto-promote** out of `new_learnings`. The weekly review (manual or
  via `/consolidate-memory --mode weekly`) is when promotion happens.
- **Never overwrite existing entries** in main memory files — only append
  to `new_learnings`.
- **Honor cost budget** — each scout run should consume <2¢ in API calls
  (roughly: 50 web fetches × ~0.05¢ trafilatura local + 5 LLM-summary calls
  via the user's Claude Max sub via CLAUDE_CODE_OAUTH_TOKEN, NOT API key).
  If a source costs more (e.g. paid API), skip with a logged note.
- **Honor harness friction** — the harness blocks broad credential scans
  and "data exfiltration"-shaped patterns. Frame queries as targeted
  research, not as "scan everything."

## Implementation skeleton

```bash
~/.claude/skills/research-scout/run.sh [--mode {nightly|weekly|on-demand}] [--query <keyword>]
```

Phase 1 and 2 are pure web-fetching; phase 3 is the expensive part (LLM
distillation for novelty check). Use the user's Claude Max subscription
via the Claude CLI (`claude --print "<prompt>"`) for distillation calls
to stay on the subscription not API key.

## Cron schedule

NOT auto-installed. To enable 3x-nightly + weekly:

```bash
# 3x daily at 02/06/18
echo "0 2,6,18 * * * ~/.claude/skills/research-scout/run.sh --mode nightly" | crontab -

# Plus weekly Sunday 04:00 review
# (separate line)

# OR via launchd plists at ~/Library/LaunchAgents/bio.claude.research-scout-{nightly,weekly}.plist
```

## Composition

- **Reads from:** CLAUDE.md, memory/, wiki/, mempalace, recent jsonls
- **Writes to:** `~/.claude/memory/long-term-memory.md` `new_learnings` section
- **Pairs with:** `/consolidate-memory` (weekly mode promotes `new_learnings` →
  topic sections after user review)
- **Pairs with:** `mega-brain-ingest` (when scout finds a high-value source
  worth absorbing whole, it can hand off the URL to mega-brain-ingest)

## Source

Adapted from Roman Knox (@roman.knox) Instagram post April 5, 2026:
"Claude Code learns by itself" — 4-panel carousel showing the
research-scout pattern.

## Status

v0 stub. Needs the actual `run.sh` implementation (Phase 1-4 above) +
LLM-distillation budget approval before scheduling. Track in
`wiki/workflow-templates.md` as W19.
