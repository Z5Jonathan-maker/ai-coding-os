---
name: project-dosecraft-brain-architecture
description: "DoseCraft Coach's real brain is dosecraft-companion (246K chunks), NOT the old LightRAG; two separate repos + two separate Neon DBs"
metadata: 
  node_type: memory
  type: project
  originSessionId: 55c7544a-a17e-47b8-a072-3efd533e749f
---

DoseCraft has **two separate "brains"** that are easy to confuse — verified 2026-06-08:

1. **The real, live Coach brain = `dosecraft-companion`** (separate repo: github.com/Z5Jonathan-maker/dosecraft-companion, Vercel project `dosecraft-companion`, served at **coach.dosecraftapp.com**). It exposes a LightRAG-compatible bridge at **`/api/brain/query`** (also `/health`, `/stats`), backed by `lib/retrieve.ts` (Notebook + Neon **vector over `brain_chunks`** + FTS + Cohere rerank). Corpus = **246,588 chunks / 11,311 docs / 19 mentors / 60.4M words**, OpenAI **text-embedding-3-small (1536-dim)**. Auth: **Bearer `BRAIN_API_TOKEN`** (required). This DB is a **DIFFERENT Neon project**: `old-salad-864…`, host `ep-dawn-art-a…`, db `neondb`, tables `brain_chunks` + `brain_documents`.

2. **The OLD brain = `brain-v2/`** (LightRAG FastAPI on Fly app `dosecraft-brain`, internal-only, volume store from a March-28 GitHub release `brain-v1.0`, ~4.1M words, Gemini 1024-dim). Its graph desyncs at query time. **Deprecated** — the Coach should NOT use it. (Candidate for decommission.)

**Correct wiring** (set 2026-06-08, deployed commit `ca76a659`/`1c6d4ebc`): `dosecraft-api` (Fly) secret `BRAIN_API_URL=https://coach.dosecraftapp.com/api/brain` + matching `BRAIN_API_TOKEN`. The Coach calls `${BRAIN_API_URL}/query`. coach-chat.service now sends the Bearer token + 30s timeout. Verified: authed Coach turn returns a `source:"brain"` citation.

**The app's main Neon DB is a THIRD database** (`curly-base-27452080`, host `ep-green-tree-aijyg2hv`) — users/subscriptions/peptides/coach-chat history. It has NO large corpus (`knowledge_chunks`≈24, `embeddings`=0); the brain corpus is NOT here. A prior `prisma db push --accept-data-loss` on THIS db dropped a stale `transcript_embeddings` table (harmless — wrong db).

**Gotchas:** `coach.dosecraftapp.com` is the companion Next.js app, not a bare LightRAG — its endpoints are under `/api/brain/*`, so `BRAIN_API_URL` must include the `/api/brain` path. Companion routes need `export const maxDuration=60` (retrieval runs 8-20s; default Vercel cap → 504). Related: [[project-mym-autotrader-assistant]] pattern of "work done locally but never deployed."
