---
name: project-mym-institutional-brain
description: "2026-07-18: mym-autotrader gained an institutional-grade LEARNING CORTEX + adaptive allocator on top of the honest gauntlet. The BRAIN now DRIVES research (MYM_ALLOCATOR=1 live on the 24/7 hunter). 11-commit wave: reservation lifecycle, genome map+validity+eligibility, belief engine+failure diagnosis, World Model, gap-history, graph-RAG retriever, ResearchAllocator."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-18 institutional-brain build** (founder directive: "autonomous quant research OS, not a backtester"; three brains -- Scientist/Trader/CEO -- that disagree). Built ON TOP OF the unchanged honest gauntlet.

**Parallel-research foundation (K is now statistically authoritative):**
- `engine/orchestrate/store.py::save_ledger_merged` (c93d1ed5) -- concurrency-safe delta-merge under flock; 16 lanes lose ZERO looks (unlocked control loses ~1400). The floor.
- `engine/ledger/reservation.py` (aee7fb51) -- transactional reservation ledger: atomic unique look-id BEFORE testing, deterministic FULL-genome identity (idempotent), FAILURES counted, hierarchical global+family K, crash-recovery, `adjudicate_at_committed_K`.
- Wired into loop (28279bf2): reserve->raw-stats-only->resolve-terminal->CLOSE-WAVE (freeze K)->re-adjudicate each green at frozen K via the DSR staleness-delta (monotonic -> can only DEMOTE; demoted=SUPERSEDED->paper forward). Prevents "500 workers all deflate at K=28,001". Fail-soft: k_ledger still counts every look.

**The learning cortex (all NEW, tested, side-modules -- do not duplicate):**
- `engine/genome_map/` -- FamilyGenome map + `schema.StrategyGenome` (per-hypothesis identity, consistent with reservation.hypothesis_id) + `validity.py` (8-rule structural/data/execution validity) + `eligibility.py` (ELIGIBLE/DATA_DEFERRED/STRUCTURAL_MISMATCH/SATURATED matrix + `frontier()`). "Not tested" != "doesn't work".
- `engine/knowledge/beliefs.py` -- Beta-Bernoulli beliefs (CI, narrow-evidence flag, half-life decay, append-only log); `seed_from_verdict_graph`. LIVE: rsi2_mr is the ONLY family with support (~8%, wide); orb=1% (execution-killed 70x).
- `engine/knowledge/failure_diagnosis.py` -- 11-category taxonomy (NO_SIGNAL/EXECUTION_DESTROYS_EDGE/OVERFIT/...) -> next-action. Live graveyard: 154 execution-destroys-edge, 123 insufficient-sample.
- `engine/world/state.py` -- World Model v1: daily market-state (vol/trend/mr/coupling/breadth) -> `research_bias()` PRIORITIZE/DEPRIORITIZE per family. Today = "mid-vol reverting" -> MR prioritized. Writes docs/data/world-state.json + engine/state/world_state_history.jsonl.
- `engine/acquire/gap_history.py` (383b52a8) -- temporal InfraNodus-gap tracking: emerging/closing/persistent gaps as the corpus grows. scripts/gap_snapshot.py schedules after corpus_intake.
- `engine/knowledge/graph_retriever.py` (51e84d94) -- reader over research-db/graph/edges.jsonl (1141 nodes/1499 edges; namespaces card/canon/market/indicator/channel/video). `context_for(family=|market=)` -> what the CORPUS already knows (complements verdict_graph = what WE killed).

**THE PAYOFF -- `engine/generator/allocator.py` (ac298810), LIVE (MYM_ALLOCATOR=1, c3b5a52f):** the CEO brain. Multiplies the generator's grounding x decorrelation score by world-regime x belief-P x emerging-gap x eligibility-frontier. PURE RE-RANKING -- never gates the gauntlet, never changes a verdict, never touches K; fail-soft (absent signal=1.0). Verified live: lifts dd_mr to #1 (regime+frontier), sinks orb (highest grounding, wrong regime) to last. Default OFF unless the env flag; on for the hunter loop.

**Knowledge-tool audit verdict:** only the InfraNodus METHOD is wired (corpus_gap->problem_driven); Obsidian/NotebookLM/LLM-Wiki are passive human-facing layers. Highest-leverage unbuilt piece was the graph-RAG over edges.jsonl -- NOW BUILT. Remaining: in-repo RAG (replace NotebookLM), Obsidian engine write-back, WikiLLM auto-emitter, ingest boilerplate cleaning. Founder must run one command to register the Obsidian MCP (agent-blocked). See [[project-mym-engine-self-learning-live]], [[project-mym-meta-labeling-verdict]] (meta-labeling = NULL), [[reference-what-the-research-points-to]] (no easy edge -- the machine's value is honest breadth + the learning loop, not a hero strategy).
