---
name: feedback-verify-anthropic-facts
description: "When the user pushes back on a factual claim about Anthropic/Claude models/products, fetch live docs BEFORE digging in — system-prompt model facts go stale fast"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c75ac9b1-f85c-4028-84b4-5afa86a225be
---

When the user says something contradicts my claim about Claude models, Anthropic products, model IDs, or release dates — verify against `https://platform.claude.com/docs/en/docs/about-claude/models` (or relevant Anthropic docs) BEFORE pushing back a second time.

**Why:** On 2026-06-01 the user told me Opus 4.8 had shipped. I pushed back twice citing my system prompt (which claimed Opus 4.7 was latest). I was wrong — Opus 4.8 was real and Opus 4.7 had moved to the Legacy section. The system prompt's model facts lag actual releases; my "knowledge cutoff" reasoning is also unreliable because system prompts don't always update in sync with the model card.

**How to apply:** First user pushback on an Anthropic/Claude fact → WebFetch the docs page in the same turn instead of restating the system prompt. Trust live docs over the system prompt when they conflict. Own the correction directly, no hedging.
