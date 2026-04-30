---
name: recall
description: Search the user's MemPalace (long-term semantic memory across all prior Claude Code sessions, project files, and notes). Use when the user says "remember when…", "find that thing about…", "what did we decide on X", "/recall <query>", or when fresh context would benefit from prior session memory. Different from auto-memory (markdown index in ~/.claude/projects/.../memory/) — recall searches verbatim conversation history with semantic match, not summarized memos.
---

# recall — search MemPalace

The user's [MemPalace](https://github.com/MemPalace/mempalace) lives at
`~/mempalace`. It stores **verbatim** conversation/file history with
semantic search (ChromaDB backend, 96.6% R@5 on LongMemEval, no API
calls). The `mempalace-mcp` MCP server is registered with Claude — call
`mcp__mempalace__*` tools when available; fall back to shell otherwise.

## When to use

- User asks about a prior session, decision, conversation, or context
  that isn't in the current window or in the markdown auto-memory
  ("remember when…", "what did we decide on X", "find that thing")
- Starting a new task and prior context might inform it (run `wake-up`
  early to load a baseline 600-900 token recap)
- About to solve a problem the user "thinks they've solved before"

## When NOT to use

- The information is in the current conversation window (just look up)
- The user's auto-memory under `~/.claude/projects/.../memory/` already
  covers it (read those `.md` files first — they're indexed and
  authoritative for project state)
- The user explicitly says "ignore memory" / "fresh start"

## Surface

### `/recall <query>` — quick search

Prefer the MCP tool if registered:
```
mcp__mempalace__search query="<query>"
```

Shell fallback:
```bash
~/.local/bin/mempalace --palace ~/mempalace search "<query>"
```

Returns top-K matching drawers (verbatim chunks with timestamps + room
+ wing tags). Quote the relevant chunk back to the user with the
timestamp; don't paraphrase.

### `/recall wake` — load baseline context

```bash
~/.local/bin/mempalace --palace ~/mempalace wake-up
```

Outputs ~600-900 tokens of L0 (highest-priority) + L1 (recent) context.
Run this early in a fresh session when the prior context is likely
relevant. Skip if the current task is clearly unrelated to anything
recent.

### `/recall status` — show what's filed

```bash
~/.local/bin/mempalace --palace ~/mempalace status
```

Shows wings, rooms, drawer counts. Good for sanity-checking that the
palace has been mined recently.

### `/recall mine [path]` — index more

```bash
~/.local/bin/mempalace --palace ~/mempalace mine <path>            # files (code/docs/notes)
~/.local/bin/mempalace --palace ~/mempalace mine <path> --mode convos  # claude session jsonl
```

Run this opportunistically when:
- The user has been working in a new codebase for a few days
- A new chunk of `~/.claude/projects/` has accumulated since last mine
- The user says "remember this project" / "track this codebase"

Idempotent — re-mining is safe and cheap.

## Composes with the rest of the stack

- **`session-handover.sh`** writes Stop-time checkpoints to
  `~/.claude/checkpoints/`. Mine those into the palace periodically:
  `mempalace mine ~/.claude/checkpoints/`. Together they give
  short-term (last session) + long-term (semantic recall) memory.
- **`session-resume.sh`** (SessionStart) auto-surfaces the latest
  checkpoint. Pair with `mempalace wake-up` for deeper baseline.
- **`auto-memory`** (markdown under `~/.claude/projects/.../memory/`)
  remains the system-of-record for *project decisions*, *user identity*,
  *feedback memories*. MemPalace is for *raw conversation recall*. They
  serve different purposes — don't replace one with the other.
- **`caveman` mode**: when reading back recall results, keep them
  verbatim (don't compress) — the user is asking BECAUSE they want the
  exact prior wording.

## Honesty constraint

Memory results are *frozen at mine time*. Files change after mining;
positions drift. Before recommending action based on a recalled chunk,
verify the current state of the file/code. The recall tells you "this
was true on 2026-04-15"; it doesn't tell you "this is true now."

If the palace is empty or returns nothing for a relevant query, say so
explicitly. Don't fabricate or speculate.
