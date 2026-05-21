# VIDEO-REFERENCE-STUDY-2026-05-20.md

Source videos studied:

- <https://www.youtube.com/watch?v=Rcmbx1TFaWs> — Kimi K2.6 + Google Antigravity + OpenCode + Cloudflare Workers AI
- <https://www.youtube.com/watch?v=isfgQF1I3gU> — Qwen 3.6 Plus + OpenCode/Antigravity-style Claude Code alternative

Local notes:

- First video transcript came from YouTube English auto-captions.
- Second video captions were rate-limited by YouTube; audio was transcribed locally with Whisper tiny. It is good enough for architecture signals, not exact quoting.

## What These Videos Are Actually Showing

Both videos are selling the same workflow pattern:

```text
VS Code-like IDE
  + coding-agent bridge
  + cheap/free frontier-ish model
  + manual provider credential setup
  + visible token usage
  + quick demo project
```

The setup is not more elegant than ours. It is public-market proof that
developers want one familiar cockpit, model choice behind the surface, cheap
experimental lanes, visible token usage, and demos that produce a complete app.

## Useful Pattern To Steal

### 1. Free/cheap lanes belong in the router, not the cockpit

The videos wire Kimi/Qwen through OpenCode into Antigravity. The user sees one
IDE-like surface, while provider configuration lives behind the coding agent.

Our equivalent:

```text
VS Code cockpit
  -> router/lane registry
  -> Kimi / Codex / Claude / DeepSeek / ChatGPT image / TEL
```

Do not expose every provider as a separate visible button. Expose capability
routes.

### 2. Add a lab lane class, not another primary lane

Kimi via Cloudflare Workers AI and Qwen 3.6 Plus via OpenRouter/OpenCode Zen are
interesting because they are cheap/free and high-context. They are not hard-floor
replacements for Claude/Codex.

Recommended lane status:

```json
{
  "status": "study",
  "capabilities": ["long_context_experiment", "cheap_code_draft", "bulk_repo_scan"],
  "unsupported": ["credentialed_action", "final_security_review", "production_autonomy"]
}
```

### 3. Token visibility is product UX

The first video calls out token consumption during a demo. Developers trust a
system more when cost/capacity is visible.

Our sellable system should show:

- model/lane selected
- prompt/output token estimate when available
- daily/monthly quota state
- fallback reason
- "why this lane" receipt

### 4. One-minute demo must create visible output

For our product, the demo should not be "here are 30 scripts." It should be:

```text
Open VS Code.
Run a task.
The system picks the lane.
It writes files.
It runs checks.
It opens/validates the result.
It shows the receipt.
```

## What Not To Steal

- Do not make Antigravity the cockpit. VS Code is already our cockpit.
- Do not add OpenCode as a second authority layer unless it clears a hard value test.
- Do not let free preview models touch secrets, credentials, payments, or final review.
- Do not route by model hype. Route by capability and trust tier.
- Do not make users manually paste model IDs across scattered config files.

## Current Architecture Decision

Keep the core stack simple:

```text
Codex       -> code edits, local verification, system integration
Claude      -> architecture, security, compliance, final hard review
Kimi        -> browser/UI/visual/operator lane
DeepSeek    -> cheap bulk transforms and extraction
ChatGPT img -> image generation/editing
TEL         -> credentialed actions
```

Add Qwen/OpenRouter/OpenCode Zen only as a future `study`/`lab` lane if it passes:

1. real availability check
2. clear ToS/credential policy
3. no secret exposure
4. no duplicate cockpit surface
5. measurable cost or context advantage
6. health-checkable endpoint

## Product Lesson

The market is already teaching developers:

> "A coding cockpit plus model routing is the new IDE."

Our differentiation is that ours is cleaner: fewer active lanes, explicit
capability ownership, health checks, audit receipts, safe credentials,
dotfile-rebuildable VS Code config, and no duplicate coding shells unless they
earn their place.
