---
source: Instagram @roman.knox (knoxhub.io/hub)
kind: external_reference
title: Roman Knox Claude Code patterns (5 carousels)
author: Roman Knox (@roman.knox / knoxhub.io)
retrieved: 2026-05-04
posts:
  - "I gave Claude a body" — 5-part install/MCP/CLAUDE.md/prompts/failure-modes (Liam Haley, see separate file)
  - "Claude Code learns by itself" — research-scout pattern, April 5, 2026
  - "Now it searches any file/videos/audio" — multimodal memory with Gemini Embedding 2 + ChromaDB
  - "It never forgets again" — 3-tier persistent memory (recent/long-term/project) + consolidate-memory nightly cron
  - "Conductor" — Mac app for running parallel Claude Code agents in isolated repo copies (post 4/7 of "6 essential apps")
---

# Roman Knox Claude Code Patterns

User-shared Instagram carousels showing 4 Claude Code workflow patterns.

## 1. Conductor (Mac app)

> Conductor is a Mac app that runs a team of Claude Code agents simultaneously.
> One agent can ship a new feature while another quietly fixes bugs in the
> background. Each agent works in its own isolated copy of the repo, ensuring
> nothing ever clashes.

**Install:** `brew install --cask conductor` (Homebrew cask, source: conductor.build)
**Status:** Installed at `/Applications/Conductor.app` 2026-05-04.
**Comparison:** Conductor (separate Mac app) ≠ Octogent (CLI multi-session).
Conductor for desktop GUI orchestration, Octogent for CLI/headless.

## 2. Claude Code learns by itself (research-scout pattern)

> Build a /skills/research-scout skill whose sole job is finding new
> information that challenges or updates your existing knowledge. Using web
> search, Reddit, Hacker News, and Quora, hunt for new strategies, tools,
> announcements, and workflow changes relevant to your current documentation
> and project context.
>
> For each finding, cross-reference against existing docs to confirm it's
> actually new or contradictory, discard anything redundant. Store validated
> findings in a new_learnings section of long-term-memory.md with a timestamp,
> source URL, and a one-line note on what it changes or adds.
>
> Schedule this skill to run 3x nightly. Add a separate weekly cron that
> reviews new_learnings, promotes confirmed patterns into the main memory
> files, and clears the staging section.

**Implemented:** `~/.claude/skills/research-scout/SKILL.md` (v0 stub, 2026-05-04).
**Cron:** Not auto-installed — opt-in via plist.
**Adapted differences from Roman's spec:**
- Use Claude Max sub via `CLAUDE_CODE_OAUTH_TOKEN` not API key (per user's identity)
- mempalace semantic-similarity for novelty check (we already have it)
- Hand-off to mega-brain-ingest when scout finds a high-value source

## 3. Multimodal memory (Gemini Embedding 2 + ChromaDB)

> Build a multimodal memory system using Gemini Embedding 2. Store every
> piece of media I send or you generate — images, video, audio, files — in
> a /media-memory directory with a metadata schema covering filename, type,
> timestamp, source, natural language description, extracted text/transcript,
> and semantic tags.
>
> Embed each item with Gemini Embedding 2 and store vectors in a local
> ChromaDB instance.
>
> Build a /skills/media-memory skill that handles ingestion, embedding, and
> search with both semantic similarity and structured metadata filtering
> (type, date, tags, source).
>
> Update CLAUDE.md so you automatically log all media and query this system
> when a past asset seems relevant.

**Status:** Not implemented yet. Needs:
- Gemini API key (separate from Anthropic Claude Max sub) for Embedding 2
- ChromaDB local install (`pip install chromadb`)
- `/skills/media-memory/SKILL.md` + ingestion runner
- CLAUDE.md hook to auto-log + auto-query

**Note:** Our existing mempalace already does episodic semantic memory across
text. Adding multimodal (image/video/audio embed) is the new capability here.
The video-transcript piece overlaps with mega-brain-ingest's transcribe-video
already.

## 4. Persistent memory layer (3-tier + consolidate-memory)

> Build a persistent memory layer for yourself. Create a /memory directory
> with three files: recent-memory.md (rolling 48hr context), long-term-memory.md
> (distilled facts, preferences, patterns), and project-memory.md (active
> project state).
>
> Build a skill at /skills/consolidate-memory that reads the past 24hrs of
> conversation logs from ~/.claude, extracts key decisions, preferences, and
> facts, updates the memory files accordingly, and promotes important facts
> and patterns from recent → long-term. Set up a scheduled task to run this
> automatically every night.
>
> Update CLAUDE.md to always load recent-memory.md inline at startup and
> reference long-term-memory.md by path.

**Implemented:**
- `~/.claude/memory/recent-memory.md` — rolling 48hr distilled context
- `~/.claude/memory/long-term-memory.md` — distilled facts/preferences (with `new_learnings` staging section for research-scout)
- `~/.claude/memory/project-memory.md` — active project state (Aurex / brain / mega-brains tracked)
- `~/.claude/skills/consolidate-memory/SKILL.md` — v0 stub spec
**Cron:** Not auto-installed — opt-in via crontab or launchd plist.

## How this composes with our existing brain

| Layer | Roman's pattern | Our existing equivalent | Combined behavior |
|---|---|---|---|
| Per-session user-fact memory | (not addressed) | `~/.claude/projects/<sid>/memory/MEMORY.md` + per-fact frontmatter files | Both load at session start; Roman's is auto-distilled prose, ours is curated structured facts |
| Cross-session episodic recall | (not addressed) | mempalace + `recall` skill | Mempalace covers Roman's "search past sessions" use case |
| Rolling 48hr context | `recent-memory.md` | NEW — added | Auto-loaded inline by future CLAUDE.md update |
| Long-term curated patterns | `long-term-memory.md` | overlaps with `~/.claude/wiki/decision-rules.md` + `optimization-log.md` | Sibling layer; consolidate-memory cross-syncs |
| Active project state | `project-memory.md` | overlaps with `wiki/learnings/` + per-project CLAUDE.md | New pattern: dynamic state vs static knowledge |
| Auto-consolidation | nightly cron | NEW — skill-stubbed, cron not auto-installed | User opt-in |
| Proactive discovery | research-scout | NEW — skill-stubbed | User opt-in |
| Multimodal memory | Gemini Embedding 2 + ChromaDB | partial overlap with mempalace (text only) | Future: add media-memory skill if user approves Gemini API budget |

## Key design decision: opt-in cron

All schedules are documented but NOT auto-installed via launchctl/cron.
Reasoning: harness friction history (multiple denials of "establish session-spanning persistence") + spend-budget caution on research-scout's web fetch volume.
User can `crontab -e` or `launchctl load -w <plist>` themselves when ready.
