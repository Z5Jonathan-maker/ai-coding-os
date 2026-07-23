---
name: feedback-cost-tier-research-hordes
description: Dispatch grunt research agents on the efficient worker tier (sonnet); frontier model only for planning/synthesis/verification — adopted 2026-07-10
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

When dispatching multi-agent research hordes (mym-autotrader H-series pattern and similar), tier the
models: **the orchestrator (main loop) plans and synthesizes; mechanical execution agents — backtest
sweeps, data checks, doc regeneration, consumer audits — go out with `model: "sonnet"`**; only
verification/judgment/adversarial stages stay on the frontier tier. Reported 5-10× cost reduction at equal
quality for mechanical work (frontier scan 2026-07-10, founder-adopted "full steam ahead").

**How to apply:** in Agent tool calls, add `model: "sonnet"` for grunt tasks; keep the default (inherit)
for design/verdict-heavy agents. Also codified repo-side as gauntlet doctrine D-CT in
mym-autotrader `vault/VALIDATION-GAUNTLET.md`. Related: [[feedback-goat-evals-speed-first]] (same founder
economics: spend where it buys outcome, not comfort).
