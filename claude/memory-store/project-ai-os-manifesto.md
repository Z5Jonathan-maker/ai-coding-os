---
name: project-ai-os-manifesto
description: "Constitution-level vision for the Claude Code router project — federate native AI runtimes (Claude, Codex, Kimi, DeepSeek, Perplexity, Cursor, Roo, OpenHands) via one control plane instead of flattening into API calls"
metadata:
  type: project
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
User authored a 17-section manifesto on 2026-05-05 declaring the north-star architecture for `/Users/leonardofibonacci/Claude Code/`. Saved verbatim to repo at `AI_OS_MANIFESTO.md` with current-state mapping + phase plan appended.

**Why:** User explicitly does not want "one chatbot with many models" — they want "one control plane over many native agent runtimes." Each ecosystem (Codex computer-use, Cursor IDE indexing, Perplexity research, OpenHands sandbox) must keep its native runtime, not be reduced to a text-completion endpoint. Manifesto is the explicit articulation of where the 9-tier router has been heading.

**How to apply:**
- Before proposing new tier integrations, read `AI_OS_MANIFESTO.md` §2 (native runtimes) and §6 (preservation rule). Do not bridge a service via raw API if a native runtime exists.
- Phase 0 (in flight) = shared task queue at `~/.claude/state/tasks.db` — foundation the manifesto's coordination layer rests on.
- Phase 1+ priorities are listed in the doc's "Phase Plan" section. Defer to that ordering unless user redirects.
- 6 open decisions are flagged in the doc — resolve before starting Phase 1 (Cursor vs VS Code+Roo, OpenHands vs octogent, Perplexity sub or substitute, Qdrant vs pgvector, AGENTS.md template owner, verifier-as-gate scope).
- The manifesto names tools the user does NOT yet have (Cursor, Roo, OpenHands, Perplexity sub) — flag the install/decision cost before assuming any of them exist.
- Stack inventory in the doc shows what's already built (camoufox bridges, MCP mesh, swarm/octagents, MemPalace, TEL, design intelligence) — don't propose to "add" things that are already there.
