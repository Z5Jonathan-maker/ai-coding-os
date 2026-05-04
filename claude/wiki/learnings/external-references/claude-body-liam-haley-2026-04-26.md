---
source: https://drive.google.com/file/d/1x1Q-aFEXtPBKPn0A1v8y9u6LjYLVFIMK/view
kind: external_reference
title: Claude Body — Setup Guide (5 parts)
author: Liam Haley (@liambuilds.ai)
owner_email: liammhaley@gmail.com
created: 2026-04-26
retrieved: 2026-05-04
file: claude-body_dm_asset.pdf
size_bytes: 893679
---

# Claude Body — Setup Guide

> "I gave Claude a body. Here's how." — Liam Haley, @liambuilds.ai

Five-part guide: install, MCPs, system prompt, agent loop prompts, failure modes.

## Part 01 / 05 · INSTALL — "Give Claude its hands"

Claude Code (the CLI) is what gives Claude file access, a terminal, and a project loop. **This is the body.** Everything in the next four sections is what you put inside it.

```bash
npm install -g @anthropic-ai/claude-code
cd ~/your-project
claude
```

- **Tools.** Read, Write, Edit, Bash — built in. No setup.
- **Memory.** Drops a CLAUDE.md at project root if you ask. That's the system prompt.
- **Loop.** Long-horizon tasks run until done. You can leave the room.

## Part 02 / 05 · 4 MCPs — "Extra organs. 90% coverage."

Add this to `~/.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] },
    "filesystem": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/YOU/projects"] },
    "github":     { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." } },
    "postgres":   { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."] }
  }
}
```

| MCP | What it adds |
|---|---|
| Playwright | Open a real browser · click, type, screenshot · scrape behind logins |
| Filesystem | Sandboxed file reads · "scan this whole folder" · safer than full ~/ access |
| GitHub | Branches, commits, PRs · issue triage · inline review comments |
| Postgres | Live data, no CSV exports · schema-aware queries · read-only is safer |

## Part 03 / 05 · CLAUDE.md — "The brain stem"

> Drop this in CLAUDE.md at your project root. Claude Code reads it on every session. This is the difference between "polite assistant" and "agent that acts."

```
You are an autonomous engineer working on this project.

Operating rules:
- Always read before you edit. Use parallel file reads when scanning more than 3 files.
- Build a mental map of imports/entry points before touching anything.
- When a tool you need doesn't exist, write it inline as a script, use it, and discard it. Don't ask.
- Before claiming a task is done, run the test suite or write a regression test that reproduces the original problem.
- For bugs: trace every call site of the failing symbol before guessing the cause. The bug is rarely where you're looking.
- For PRs: write the description like a human. Link the issue. Include screenshots if the change is visible.
- Never commit secrets. Cross-reference .gitignore before any "git add ."
- Keep responses short. Show work in tool calls, not commentary.
```

## Part 04 / 05 · The 5 Prompts — "Exactly what I typed"

### 01 // THE INDEX — Full repo map

> Read every file in this repo in parallel. Build a map: entry points, exports, dead code, anything outside the import graph. Flag anything that shouldn't be here. Don't ask before reading.

### 02 // THE AUDIT — Forgotten secrets

> Scan ~/ for API key patterns: `sk_live_*`, `sk-proj-*`, `AC*` (twilio), `eyJ*` (JWT), `AKIA*` (AWS). For each one, check if it's inside a .gitignore. Output a markdown table sorted by exposure risk, with the provider's revoke URL.

### 03 // THE FIX — 3-day bug

> There's a race condition in src/websocket.ts. I've been staring at handleReconnect. Read every call site of WebSocketManager and trace the lifecycle of `pending` and `flushQueue`. Don't propose a fix until you've drawn the call graph in your head.

### 04 // THE TOOL — Write what's missing

> I need to query the session_v Postgres view for top users. There's no Postgres MCP. Write a Python subprocess wrapper, run the query, throw the script away. Don't add it to the project.

### 05 // THE SHIP — PR while I make coffee

> Implement the fix from earlier. Branch off main as fix-ws-race. Write a regression test that fails on current main and passes after your patch. Commit, push, open a PR via gh CLI with a real description. Link issue #842.

## Part 05 / 05 · What breaks it

### IT WORKS WHEN
- CLAUDE.md is specific, not generic
- The repo has tests it can self-check against
- You give the long-horizon task and walk away
- You let it write its own throwaway tools
- You ask it to read before it edits

### IT FAILS WHEN
- You over-prompt — it second-guesses
- The repo has no tests — no signal
- You watch the loop and interrupt
- CLAUDE.md is one generic line
- You ask for the answer instead of the work

> The unlock is **letting it run**. Most people stop the loop the moment it starts — they want to see the answer, not let the agent get there. If you can sit with 90 seconds of silence while it reads, traces, and tests, you'll get a different model out of the same model.

---

## How this maps to our brain (annotated)

| Liam's recipe | Our equivalent | Notes |
|---|---|---|
| Playwright MCP | `agent-browser` (clean) + `camofox-browser` (stealth) | We swapped 2026-05-04 |
| Filesystem MCP | Direct Read/Edit/Write tools + permission allowlist | Our path-based permissions are finer-grained |
| GitHub MCP | Same | ✓ loaded |
| Postgres MCP | `neonctl` + `psql` direct (per W12 workflow) | More flexible for multiple DBs |
| 10-line operating rules CLAUDE.md | 200-line routing layer (skills/agents/MCPs/learnings/design/TEL) | We have the *advanced* version |
| 5 named prompts | W13-W17 in workflow-templates.md (added 2026-05-04) | Adapted as durable workflows |
| "Let it run, don't interrupt" | `nonstop` + `wired-up` skills + auto-mode | Codified |
