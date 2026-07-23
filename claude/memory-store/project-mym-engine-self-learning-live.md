---
name: project-mym-engine-self-learning-live
description: "2026-07-18: the mym-autotrader discovery engine's RD-Agent self-learning loop is WIRED LIVE (problem_driven registered in generator.SOURCES, 8ec19b2a) -- the verdict knowledge-graph is now built+queried every cycle, so generation is steered by prior verdicts (novelty + dominant-kill-reason). Supersedes the capstone-DEFINED state; capstone is now BUILT + IN the loop."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-18 -- the engine went from "capstone modules exist" to "self-learning loop running."**

**What was the gap (audit a38bd94f):** the capstone (problem_driven + corpus_gap + verdict_graph) was a STANDALONE ISLAND -- the live loop's generator built candidates only from the OLD `SOURCES` = {family, corpus, combinatorial, synthesis, research_card}; nothing called problem_driven, so the knowledge-graph was never built or queried during a cycle. The RD-Agent loop was designed but OPEN.

**The close (8ec19b2a):** registered `problem_driven_hypotheses` in `engine/generator/generator.py::SOURCES` (additive, +12/-1). Proven live: KG built+queried during generation (novelty + dominant-kill-reason active), corpus gaps consumed, a problem_driven fingerprint landed in the candidate batch. `VerdictGraph.build()` re-reads the live graveyard/candidates each call, so every cycle's generation is now informed by ALL prior verdicts. K stays BOUNDED (418 fingerprints from 630 gaps, 0 outside the 1209 ceiling; per-cycle delta unchanged at `limit`). This realizes [[feedback-brain-distillation-back-standing-step]] architecturally.

**Money-safety CONFIRMED structural (a38bd94f):** `engine/orchestrate/safety.py` AST-bans any `service`/`connectors` import; there is NO live-order path anywhere in the engine tree; every terminal is paper (shadow_book / forward-candidate). So the 24/7 loop is paper-only BY CONSTRUCTION -- funding stays a manual founder gate.

**Related upgrades same day:** research-card fuel widened (quant_blogs + crypto_research into `_INTAKE_CORPORA`, 8db36273; ceiling still 1209 -- corpus adds evidence-breadth, novelty comes from problem_driven); Method-3 queue-position fill realism as a 4th honesty axis (d22fdd01, `FillRealism.queue_ticks`, off-by-default, tightening-only); **new `ppc_mr` family** (3a2e85a8) -- price-path convexity reversion, a DISTINCT 5th reversion mechanism (ATR-normalized 2nd-difference: enter LONG on a convex-UP still-net-DOWN path = a DECELERATING/rounding bottom, NOT the falling knife conv<=-k; watch for that sign). Added because the KG interrogation showed the bottleneck is VOCABULARY EXHAUSTION (problem_driven yielded ~1 novel candidate; dominant kills book-wide = execution 202 / sample 123; error_query found real death->survival deltas e.g. rsi2 rsi_len 3->2). ppc_mr widens the exhausting space; wired signals+research_cards+problem_driven; faces the same honest gauntlet. See [[project-mym-capstone-architecture]], [[reference-mym-synthesis-exhausted-not-broken]], [[project-mym-24-7-hunter-scheduler]].
