---
name: openhuman-bridge
description: Documents how this stack composes with (or replaces) elder-plinius-adjacent tinyhumansai/openhuman — a Rust+Tauri desktop "Jarvis" by Wassim Younes / @senamakel. Use when the user says "openhuman", "wire openhuman", "voice-first assistant", "desktop mascot", "@senamakel", "tinyhumans". Captures the 3 patterns worth lifting from OpenHuman and the 6 capabilities you already have in more sophisticated form.
---

# openhuman-bridge — composition map vs tinyhumansai/openhuman

## What OpenHuman is

A finished consumer desktop app (Tauri shell, Rust core, RPC sidecar).
Voice-first "Jarvis" with a mascot, 118 OAuth integrations, model routing,
SQLite memory tree, ElevenLabs TTS, live Google Meet agent.

GPL-3.0. Trending #2 on GitHub Trending (May 2026). Clone preserved at
`~/code/research/openhuman/` (54 MB, depth-1, no build artifacts).

## What this stack already covers (skip these)

| OpenHuman claim | Your existing equivalent |
|---|---|
| Model routing — picks reasoning/fast/vision per task | 14-tier router (`lib/tiered-ask.cjs`) with classifier + verifier + circuit breaker + cost fast-path + tier-registry refactor. Strictly more sophisticated. |
| 118 OAuth integrations | TEL (`~/.claude/tel/`) — Gmail / Calendar / Notion / GitHub / Vercel / Linear / Gamma / Glif. Different model: strict whitelist + audit + undo tokens + credential isolation. Fewer integrations, much stronger discipline. |
| SQLite memory tree + Obsidian wiki sync | Task-queue SQLite (`memory/tasks.db`) + vector store (`memory/vectors.db`) + MemPalace MCP + 8 mentor brains + `wiki/learnings/` as markdown corpus. The user already does the Karpathy obsidian-wiki workflow at scale. |
| Local AI via Ollama | Retired from AI-SYSTEM-V2. Reintroduce only if the user explicitly wants a local model tier again. |
| Coder toolset (filesystem, git, lint, test, grep) | Claude Code native. |
| Token compression (TokenJuice) | `/pulse` (60-70% code-token reduction) + `/caveman` (75% conversational reduction). |
| Background research / context fetching | `research-scout` (3x nightly) + `consolidate-memory` (Roman Knox 3-tier pattern). |

## What's genuinely novel in OpenHuman (consider lifting)

### 1. 20-minute auto-fetch cadence across active connections

OpenHuman's core walks every connected service every 20 min, pulls fresh
context into the memory tree. Your `research-scout` runs 3x nightly; your
`/loop` is on-demand. **Compose:** wire a TEL-driven launchd that walks
your TEL policies every 20 min and refreshes recent-context. See pattern
in `~/code/research/openhuman/src/` (search for `auto_fetch`).

### 2. TokenJuice-style boundary compression

Compresses tool-call outputs (scrape results, email bodies, search
payloads) BEFORE they touch the LLM. HTML→Markdown, URL shortening,
non-ASCII stripping. Claimed 80% cost reduction.

Your `/pulse` covers code generation; `/caveman` covers conversation.
NEITHER covers tool-output compression. **Compose:** a `tool-compress`
helper module that runs on `result.text` from swarm/scrapling/octagents
augmenters before they re-enter the prompt. Real cost-savings vector
distinct from `apiFastpath`.

### 3. Mascot-as-presence (UX pattern, not implementation)

A desktop character that visibly reacts, speaks, joins meetings. Pure
presence design — gives the AI a *physical anchor* in the user's
attention. Not lift-able as code (it's the whole point of their Tauri
UI), but worth knowing as a UX direction if you ever want a presence
layer beyond the terminal.

## What CANNOT be lifted cleanly

- **Voice loop** — STT in + ElevenLabs TTS out + mascot lip-sync. Deeply
  embedded in their Tauri shell + Rust core. Extracting requires
  building their full stack (`cargo build` pulls ~2 GB of deps + Tauri
  bundle). Not a skill install.
- **Google Meet agent** — joins meetings as a participant via headless
  Chrome + their core. Same constraint — embedded in the desktop app.
- **One-click OAuth flow for 118 services** — their auth UI lives in the
  Tauri shell. Your TEL uses a different security model (whitelisted
  policies + Keychain) and that's the *better* default for an audited
  stack.

## Installation (if you want the desktop app as a parallel interface)

OpenHuman is a separate consumer product. Installing means a `.dmg` on
macOS with its own app icon, persistent state, and resource footprint
(~500 MB-1 GB after first run). Claude Code remains your primary
interface; OpenHuman would be the voice/mascot layer.

```bash
# Review first — don't blindly curl|bash
less ~/code/research/openhuman/scripts/install.sh

# Then, if you want to install:
bash ~/code/research/openhuman/scripts/install.sh
# or download the DMG from https://tinyhumans.ai/openhuman
```

This skill does NOT auto-install. The user owns that decision.

## Architecture reference

- Their `CLAUDE.md` (302 lines): `~/code/research/openhuman/CLAUDE.md`
- Their `AGENTS.md` (641 lines): `~/code/research/openhuman/AGENTS.md`
- Their `gitbooks/developing/architecture.md`: deep narrative
- Their Rust core: `~/code/research/openhuman/src/`
- Their RPC surface: search for `core_rpc` in the Rust source

## Composition cheat sheet

| User intent | Use |
|---|---|
| "I want voice-first AI like OpenHuman" | Install their DMG. Your stack stays primary for code/system work. |
| "I want a Jarvis mascot on my desktop" | Install their DMG. Not buildable from their source easily without their Tauri shell. |
| "I want their 20-min auto-fetch pattern" | Extend TEL with a periodic-refresh cron. Pattern documented above. |
| "I want their TokenJuice compression" | Write a `lib/tool-compress.cjs` module (small, ~80 LOC); plug into swarm/scrapling/octagents augmenter outputs. |
| "I want their 118 integrations" | You don't — TEL's whitelist model is more disciplined. Add specific services to TEL as you need them. |
| "Just run the same prompt against both for comparison" | Install their DMG; manually prompt both. Or wire a `lib/tiers/openhuman.cjs` tier that calls their RPC (requires building their Rust core, ~2 GB disk hit). |

## Source

elder-plinius-orbit / Wassim Younes (@senamakel, @wassimyounes_). Cloned
2026-05-10. GPL-3.0. The DMG installer is the supported install path;
this skill captures the pieces that don't require running their app.
