---
name: project-claimpilot-feature-status
description: "ClaimPilot feature operational status — verified live 2026-06-08; ~28/30 work, AI bridge confirmed alive"
metadata: 
  node_type: memory
  type: project
  originSessionId: e7f3c946-fa9b-4bfd-820a-ae054ea5ef06
---

## HARVEST REMOVED 2026-06-10 (user decision — supersedes "Harvest operational" claims below)

Jonathan ditched the gamified canvassing app as a business product; ClaimPilot is now purely
the professional claims CRM. Commit `07b9fb3` removed the whole gamification surface
(~37K lines / 90 files): harvest routes+pkg, incentives engine, battle_pass, Enzy
canvassing_map, harvest_coach worker, rep player UI (/rep), Harvest/Incentives/BattlePass/
PerformanceConsole frontend, 15MB gamification PNGs. Backend routes 890→768; suite
588 passed / 0 failed after. KEPT: storm-turf canvassing intel (`routes/canvassing.py` —
active DOL/storm-watch line), regrid (DolDiscovery uses it), University LMS, Adam QA,
MyCard/PublicCard ALSO REMOVED 2026-06-10 (user call; old QR share links 404 now — commit 873341e).
Never re-add `/api/harvest|incentives|battle-pass` or `routes/canvassing_map.py`.

ClaimPilot (the CRM at code/projects/ClaimPilot, prod https://eden.careclaimsadjusting.com,
backend https://eden-gsot.onrender.com) is ~28 of ~30 features OPERATIONAL — NOT "only a
handful" as the user perceived. Verified 2026-06-08 via a logged-in browser click-through of
every route.

**Key fact: the Eve AI / Claude Max OAuth bridge is LIVE.** Sent Eve a test message in prod,
got a correct reply → `CLAUDE_CODE_OAUTH_TOKEN` is valid in Render → all AI features work
(Eve, Scales analyze/dispute-letter, supplement writer, inspection AI). The
`/api/health/services` probe falsely reported `llm: missing_config` because it only checked
OPENAI/EMERGENT keys, not the OAuth bridge — fixed this session (server.py).

**Genuinely broken at audit start (2 pages), now fixed + deployed:** IndustryExperts (/experts)
and FloridaLaws KB tabs (/florida-laws) called auth-gated /api/knowledge-base/* with bare
fetch() and no JWT → 401 → empty pages. Fix: attach Bearer eden_token. Both now show data.

**Dropped:** /notion — its 5 backend endpoints never existed (404). Route + component removed.

**Property "Intel"/Property-Report tab — FIXED 2026-06-08:** added POST /api/weather/verify
(thin adapter over build_storm_timeline → {coordinates, events, lsrs}); removed the
generateSampleData() fake-weather fallback; normalized compact YYYYMMDDHHMM timestamps to
YYYY-MM-DD. Verified live: pulls 50-278 real NOAA/SPC/NEXRAD events with correct dates/winds.
Remaining gap on that tab: satellite "Property View" needs GOOGLE_MAPS_API_KEY (Static Maps).

**Voice Assistant — DROPPED 2026-06-08** (route + VoiceAssistantConsole component removed;
backend voice routes left intact but unrouted). Outbound SMTP "Not Connected" (inbound Gmail
sync works) — config, not code.

**Stubs by design:** Performance Overview tab (hardcoded demo numbers), Rep competitions/profile
("coming soon"), Sales (static playbook).

**Trap:** backend/routes/ai.py (~1900 lines, Ollama/Emergent) is DEAD CODE shadowed by the
routes/ai/ package — editing it to "fix Eve" edits a file that never runs. Eve lives in
routes/ai/eve_chat.py → services/claude_max.py. Eve's frontend "Claude Connected" badge is
hardcoded (EveAI.jsx ~600), not a real health signal.

Related: [[project-claimpilot-deploy-reality]] [[project-claimpilot-ci-lint-gate]]
[[project-eve-claude-max-bridge]] [[project-scales-xactimate-compare]]
