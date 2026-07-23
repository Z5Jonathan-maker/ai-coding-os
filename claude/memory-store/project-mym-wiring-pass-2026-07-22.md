---
name: project-mym-wiring-pass-2026-07-22
description: "2026-07-22 full wiring audit + repair — degenerate-tradeHash root cause, journal resurrected, journal-brain wired as generator source 7, machine index at MACHINE-INDEX.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: efe30758-1fc2-41df-a0af-136e4975a265
  modified: 2026-07-22T13:24:43.941Z
---

Tri-lane wiring pass 2026-07-22 (Fable ultracode 20 agents + K3 independent + inline): canonical index now at mym-autotrader/MACHINE-INDEX.md; K3 audit at audits/k3-wiring-audit-2026-07-22.md; open founder decisions at docs/ai-memory/FOUNDER-DECISION-DOCKET.md.

**Root cause of the "great work disappears" feeling:** CrossTrade bridge returns ONE constant 10-char tradeHash for EVERY journal trade → all hash-first idempotency collapsed to one key → journal-of-record silent Jun 30→Jul 22 while funded traded. LAW: never key broker records on a single upstream id (composite fill-tuple everywhere now). Also the journal CSV's on-disk header was the old 20-col schema vs 21-col appends (column-shifted rows) — regenerated from feed.

**Wired this pass (all launchd):** rejudge nightly 01:30, 6 harvesters nightly 21:30–23:10, journal-brain chain 00:45 (fxblue→label→distill → generator source 7 'journal', K3-built, bounded 8/cycle), demo_replay after season-advance 17:45 (own ledger logs/demo_replay_fills.jsonl — daily_report truncates the old path), dashboard mirror 07:40+16:40, termination-watchdog installed. Pollers staggered (ft-journal 70s, trade-truth 95s vs 30s healer) for the CrossTrade 429 storm. launchd-PATH class bug fixed in ~/.claude/scripts/_agent-runner.sh + brain-os daily_study/autonomous_fill.

**Resolved 07-22 morning:** passover GREEN (expected book reconciled — MNQ drift closed); US30 brief lane rescued INTO the repo (scripts/us30_brief*.py, wrappers repointed, cc-router proxy revived w/ local node deps + lazy playwright); arrow 8 shipped (engine/knowledge/reality_feedback.py, daily 17:45); V2 investigation shipped as deterministic docket (engine/state/investigation_docket.jsonl, DAILY_CAP=12, agent lane consumes OPEN rows); genome_map wired as generator source 8 (first live candidate: dual_thrust 6A); harmonic 2-cell realistic basket filed (cypher MNQ 30m + gartley MES 30m — founder gate for Sim101).

**Still user-gated:** heartbeat healthchecks.io URL; harmonic basket Sim101 go; rag belief-priors + belief_writer/decision_enrichment recurring wiring (belief-weight policy); tier_a2 rm + old session transcripts (~2.6G).

**Coordination note:** 2+ parallel autonomous sessions + K3 work this repo simultaneously; check `git log -10` and `git status` for other actors' WIP before touching engine/generator/signals.py or committing sweeps — the 07-22 back-out commit d959c274 is the pattern to follow (defer, don't collide).

Related: [[project-mym-autotrader-assistant]], [[project-mym-institutional-brain]], [[project-mym-trade-journal-brain-layer]]

**Memory-store note (07-22):** MEMORY.md ran 209 lines / 28KB (soft partial-load warning). A curator pass over-corrected — dropped 117 files from the index (broke the canon 0-orphans invariant), then restored with short auto-pointers under "Archive index". Canon guard OK, all lines <200 chars. The DURABLE fix is MERGING the 206 files down (many superseded MYM verdict files restate newer ones) — a deliberate consolidation job, NOT an index-trim; don't let a curator drop pointers again.
