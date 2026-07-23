---
name: project-knowledge-fabric
description: "Autonomous knowledge-intelligence fabric — BUILT + scheduled 2026-07-23; reflexes in ~/.claude/fabric, self-heal + morning-brief on launchd"
metadata: 
  node_type: memory
  type: project
  originSessionId: bbebfc06-e8d6-4f7a-8224-4abe435df6ac
  modified: 2026-07-23T20:09:00.328Z
---

The routed knowledge fabric (blueprint: ~/.claude/wiki/KNOWLEDGE-FABRIC.md; code graph via [[reference-codebase-memory-mcp]]) is BUILT + running as of 2026-07-23 (Claude + K3 + GPT collab). Reflexes live in `~/.claude/fabric/`:
- `w2_resonance.py` — SELF-HEAL: block re-testing a failed strategy before a gauntlet run (on-demand, pre-test). Works (caught the ICT P/D dead idea with citation). Refine: stoplist too eager on generic bigrams.
- `w5_morning_brief.sh` — AUTONOMOUS daily brief (code-delta + forensics verdicts + open decisions). SCHEDULED: launchd `com.jonathan.fabric.morning-brief` 7am ET.
- `self_heal.sh` — ANTI-EVICTION: re-index any evicted graph + re-apply the ADR. SCHEDULED: launchd `com.jonathan.fabric.self-heal` hourly (verified exit 0). Logs: `~/.claude/fabric/logs/`.
- `gap_miner.py` — LOCAL InfraNodus reimplementation (Jina-embeddings-enhanced, NOT the SaaS — we never signed up, we cracked it): text-network structural-gap blind-spot mining. Built + concept-extraction bugs FIXED (case-truncation + date/number noise) + SCHEDULED launchd `com.jonathan.fabric.gap-miner` Sun 8am → writes vault/07-opportunity-pipeline. Own venv `~/.claude/fabric/.venv` (networkx). GOTCHA: Jina via python urllib gets Cloudflare-WAF-blocked (403/1010) on the default User-Agent — MUST send `User-Agent: curl/8.7.1`; propagate this to jina_common.py before any other fabric Jina call (e.g. W1).
- `adr-mym-autotrader.md` — canonical ADR (re-applied by self_heal; a codebase-memory re-index WIPES the in-graph ADR).

5 trading code repos indexed in codebase-memory (~756MB graph). Jina LIVE (embeddings/reranker/reader; key at ~/.config/mym-autotrader/secrets.env). Disk healed 2.5G→14G (cleared gh-archive 5.2G + updater caches).

Failure modes hardened this session: (1) graphs evict under disk pressure → self_heal re-indexes; (2) re-index wipes the in-graph ADR → wiki canonical + self_heal re-applies; (3) detect_changes slow on the 212k-node graph → morning job runs overnight.

Wave 2 pending: W1 (Jina-semantic doctrine-vs-code), W3 (trace-to-ADR autopsy), wire reflexes into [[project-brain-architecture]] loops (mega-cycle/autonomous-loop so they CALL w2_resonance pre-gauntlet + use the gap-miner).
