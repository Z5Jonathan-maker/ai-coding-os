---
name: feedback-kimi-paid-account
description: "KIMI is a paid account, not a free tier — don't attribute bridge issues to free-tier caps"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 47474520-a719-4226-9bcc-ff3eb2134405
---

The user's KIMI access (the `design` tier in `router-ask`, KIMI K2.6) is a **paid account**, not a free tier. CLAUDE.md's older wording ("Cloudflare Workers AI, free tier", "100K-250K tokens/day free") is outdated/misleading.

**Why:** When a large design brief returned empty output from the KIMI bridge, I wrongly attributed it to a "free-tier output cap." The real cause was the bridge's per-response output limit / large-prompt handling — billing was never the issue.

**How to apply:** When routing design work via `router-ask -p design`, treat KIMI as a paid, capable model. If a call returns empty, suspect the prompt/response size or bridge timeout and **chunk into focused per-deliverable calls** (that fixed it) — not quotas. Don't tell the user they're rate-limited on a free tier.
