---
name: project-router
description: "The 3-tier LLM router lives at /Users/leonardofibonacci/Claude Code/. Already wired with DEEPSEEK_API_KEY + CLAUDE_CLI for Tier 3. Don't propose to "set it up" — it exists."
metadata:
  type: project
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
The triple-tier router (per `TRIPLE-MODEL-ROUTER-SOP` / `TRIPLE-MODEL-ROUTER-PROMPT-v2`) is **already deployed** at `/Users/leonardofibonacci/Claude Code/`. State:

- `lib/tiered-ask.cjs`, `lib/ollama-client.cjs`, `lib/deepseek-client.cjs`, `lib/anthropic-client.cjs`, `lib/deepseek-verify.cjs`, `lib/soft-failure.cjs` — all present.
- `.env` has `DEEPSEEK_API_KEY`, `OLLAMA_BASE_URL`, quota config, and **`CLAUDE_CLI`** (Tier 3 dispatches through the Claude CLI / Max subscription — NOT a separate `ANTHROPIC_API_KEY`).
- `memory/tier-usage.jsonl` is the rolling call log (append-only, do not rotate without backup).
- `node lib/tiered-ask.cjs ping` returns all three tiers `ok: true` (verified 2026-04-29).

**Why:** The user pays Anthropic via Claude Max, so Tier 3 is wired through `CLAUDE_CLI` rather than an Anthropic API key. The DeepSeek key was provisioned in an earlier session.

**How to apply:**
- Never propose to "set up" the router — it's done. Reference the existing files instead.
- For changes (new tier purposes, classifier tweaks, quota retuning), edit `lib/tiered-ask.cjs` in place.
- Before any prompt rewrite or refactor, read `node scripts/tier-usage-report.cjs` first — the actual distribution tells you what's drifting.
- Memory files (`tier-usage.jsonl`, `soft-failures.jsonl`) are permanent per the doctrine's §13. Don't truncate.

**Tier-2 model + reuse for browser-use (added 2026-04-29):**
- `TIER2_MODEL=deepseek-v4-pro`, `TIER2_FALLBACK_MODEL=deepseek-v4-flash`
- `DEEPSEEK_BASE_URL=https://api.deepseek.com/v1`
- `~/.zprofile` now sources `~/Claude Code/.env`, so DEEPSEEK_API_KEY is in any login shell.
- `~/dotfiles/bin/cc-browse` and `~/dotfiles/bin/cc-browse-mcp` use the same DEEPSEEK_API_KEY to drive `browser-use` (autonomous browser navigation). Verified end-to-end. The browser-use MCP server is registered with `claude mcp add` pointing at the cc-browse-mcp shim so the env propagates.
