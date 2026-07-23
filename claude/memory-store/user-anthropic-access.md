---
name: user-anthropic-access
description: "User pays via Claude Max subscription, NOT a separate Anthropic API key. Wire tools to CLAUDE_CODE_OAUTH_TOKEN, not ANTHROPIC_API_KEY."
metadata:
  type: user
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
User accesses Claude through the **Claude Max plan**, not a pay-as-you-go Anthropic API key. Any setup that asks for `ANTHROPIC_API_KEY` should instead be wired to use `CLAUDE_CODE_OAUTH_TOKEN` (or the equivalent Claude-Code-managed credential path) where the tool supports it.

**Why:** Claude Max is the user's billing relationship with Anthropic. Adding a separate API key would route to a different (paid-twice) billing rail. Stated explicitly in conversation when reviewing the triple-tier router doctrine.

**How to apply:**
- The triple-tier router at `/Users/leonardofibonacci/Claude Code/` already does this correctly via `CLAUDE_CLI` env var. Reference, don't re-set-up.
- For shannon: prefer `CLAUDE_CODE_OAUTH_TOKEN` over `ANTHROPIC_API_KEY` in `.env`.
- For `mods`, `llm`, `aider`, etc.: if they support Claude via subscription path, use it; otherwise note that a separate API key purchase would be required and ask before assuming.
- Never default to "set ANTHROPIC_API_KEY=…" instructions without first asking whether Claude Max is the intended path.
- Before suggesting any tooling that "needs an Anthropic key," check the project root — the router or other infrastructure may already be wired.
