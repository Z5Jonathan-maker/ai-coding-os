# Optimization Log

Append-only. Every change that made the system faster, cheaper, more autonomous, or higher quality. Future sessions read this to understand WHY current state is current state.

## Format

```
## YYYY-MM-DD · <one-line title>
- **Before:** <prior state, with metric if measurable>
- **Change:** <what was done>
- **After:** <new state, with metric>
- **Why it matters:** <one-line autonomy/cost/quality impact>
```

---

## 2026-05-15 · Dify (LLMOps platform) — evaluated, deferred

- **Before:** No formal stance on Dify or LLMOps-class platforms (LangSmith, Humanloop, Helicone, Langfuse cloud). Implicit assumption that Langfuse self-hosted + `aaa-rag-rerank` agent + Agent SDK already covered the LLMOps tier.
- **Change:** Deep-dive eval by research-scout agent. Verified: (1) Dify's observability is a pass-through to Langfuse/Phoenix/Opik — adds zero net observability since Langfuse already runs at `127.0.0.1:3000`. (2) Dify requires `ANTHROPIC_API_KEY` (Anthropic Console key), not OAuth — hard mismatch with `CLAUDE_CODE_OAUTH_TOKEN` billing setup. (3) License is modified-Apache with multi-tenant restriction clause + producer reserves right to change terms — not clean Apache 2.0. (4) Target use case is teams building LLM *products* (chatbots, copilots for external users); current portfolio is e-commerce (Aurex) + mobile (DoseCraft) — no external-facing LLM product exists.
- **After:** Verdict: SKIP / DEFER-UNTIL-USE-CASE-EMERGES. The only genuine gap Dify fills is prompt versioning + A/B testing; the cost (docker-compose stack, license risk, auth mismatch) exceeds the benefit. **Revisit trigger:** when a future Aurex internal AI agent OR DoseCraft Coach becomes a product feature for external users, AND a non-engineer needs to iterate on the prompts without PRs.
- **Why it matters:** Closes the "should we adopt Dify" loop without leaving the question open. Future sessions reading this entry skip the eval cost. Verdent (sibling eval same day) skipped without log because no realistic re-evaluation condition exists.

## 2026-05-15 · Lifted 3 novel patterns from GSD/OpenSpace/PAI deep dives

- **Before:** Identified gaps from deep-dive evals: (a) no pre-task definition-of-done primitive (post-hoc audit only), (b) no machine-readable resume artifact (markdown checkpoints only), (c) no test-coverage gate before execution, (d) no long-horizon teleology file (factual memory only), (e) `/evolve` is manual not metric-driven.
- **Change:** Wired 4 additive surfaces in `~/.claude/`:
  - `skills/isa/SKILL.md` — ISA primitive (PAI lift): Vision + numbered ISCs + anti-goals + constraints, written to `.ai/ISA-<slug>.md` before non-trivial tasks
  - `memory/TELOS.md` — long-horizon goals (PAI lift): north-stars + active campaigns + anti-goals + operating posture
  - `skills/nyquist-gate/SKILL.md` — pre-execution test mapping gate (GSD lift): requirement → test command table, fails if any requirement lacks a sampler
  - `state/loop-status.md` — ambient status surface (Verdent UX lift): mega-cycle / autonomous-loop / design-director write phase transitions here for observer visibility
- **After:** ISA + Nyquist + Telos compose with existing /writing-plans + /executing-plans + /verification-before-completion. Drift-check should now register `isa` and `nyquist-gate` in next run (CLAUDE.md routing table updated same-day).
- **Why it matters:** Pre-task "what does done look like" + per-requirement verification signals close the audit→fix asymmetry (you could find problems after but not specify the win condition before). Telos converts implicit direction into a referenceable file skills can cite. Status surface unblocks observability into autonomous loops without standing up a real dashboard.
- **Lifts SKIPPED as redundant or not-yet-justified:** GSD context-window monitor (`context-monitor.sh` already superior — 4 thresholds + real autocompact parsing vs GSD's env-var-guess). Dify (above). Verdent runtime (skip; only the status-pane UX pattern lifted). PAI installer (would overwrite brain).

---

## 2026-05-05 · Classifier precedence inverted to "purpose > flag" uniformly

- **Before:** `classifyTask` checked DESIGN_F before IMAGE_P, and CHAT_F/CHEAP_F flags before CHAT_P/CHEAP_P purposes — same code path used inconsistent precedence depending on tier. Symptom: `purpose:'image_gen', flags:['design']` returned `'design'` (flag won over purpose), but `purpose:'ui_design', flags:['image']` returned `'design'` (purpose won over flag). Routing was hard to reason about.
- **Change:** Reordered `classifyTask` to do all PURPOSE checks first (HARD_FLOOR → DESIGN_P → IMAGE_P → SWARM_P → CODEX_P → CHAT_P → CHEAP_P), then all FLAG checks in same priority order. Documented "purpose > flag > heuristic" as the universal precedence rule inline.
- **After:** Predictable contract: when purpose and flag conflict, purpose always wins. Added two precedence test cases to the runtime gauntlet (`test/router-routes.test.js`) — both pass.
- **Why it matters:** Inconsistent precedence is a silent surface — callers passing `{purpose, flags}` together couldn't predict the result without reading source. The reorder makes the rule obvious: more specific (purpose) beats less specific (flag).

## 2026-05-05 · Runtime route gauntlet promoted to project test + wired into pre-commit

- **Before:** Codex generated a one-shot runtime test at `/tmp/audit-r2/runtime-test.js` during the audit. It tested PURPOSE-based routing only. The cheap-flag bug (flags:['cheap'] → Ollama) slipped through because no test exercised flag-only routes. The test would also be deleted on next reboot.
- **Change:** Promoted to permanent file at `Claude Code/test/router-routes.test.js`. Extended from 15 to 25 cases: added 8 flag-only routes (cheap/deepseek/light/mechanical/design/image/codex/swarm) and 2 purpose-vs-flag precedence conflicts. Wired into `.pre-commit-config.yaml` so any change to `lib/tiered-ask.cjs` or `lib/validate.cjs` runs the gauntlet at commit time.
- **After:** Reintroducing the cheap-flag bug now produces `FAIL flag cheap → cheap` at commit. Verified by negative test (reverted, ran gauntlet, confirmed failure, restored).
- **Why it matters:** Two kinds of route bugs (purpose-set drift, flag-set drift) now have first-class regression coverage. The historical bug cannot return silently.

## 2026-05-05 · Three-net regression defense for the LLM router

- **Before:** Adding a new tier required updating two files (classifier set in `tiered-ask.cjs`, validator set in `validate.cjs`). Forgetting the second made the tier unreachable via explicit `purpose:` / `flags:`. Routing-table edits relied on a weekly launchd drift-check that had been silently passing on a column-extraction bug.
- **Change:** (1) Added startup integrity check in `tiered-ask.cjs` that throws on first classifier↔validator drift — module won't load. (2) Fixed `routing-drift-check.sh` to read column 2 (skill names) instead of column 1 (user intents); added `-L` to follow `skills/` and `agents/` symlinks; added built-in allowlist. (3) Added pre-commit hook in `~/dotfiles/.pre-commit-config.yaml` that runs the drift-check on any change to `claude/CLAUDE.md`, `claude/skills/**`, or `claude/agents/**`.
- **After:** Three orthogonal nets at three cadences — pre-commit (instant, blocks bad commits), module-load (catches unreachable purposes immediately), weekly cron (catches anything that bypassed pre-commit). Same regression cannot slip through all three.
- **Why it matters:** The codex/image-tier-unreachable bug had been latent since those tiers were added; the SWARM tier was added by auto-improve mid-session and would have repeated the bug. Adding orthogonal checks turned a silent two-file invariant into a load-time error.

## 2026-05-05 · CLAUDE.md density: 295 → 210 lines (-29%) without losing routing power

- **Before:** Global CLAUDE.md had three contradictory KIMI design rows (one said "translate KIMI output to code", one said "DEFER to KIMI", a memory entry said "KIMI leads design AND code"). Built-in Anthropic skills consumed 8 routing-table rows each repeating "Built-in —" qualifier. DESIGN INTELLIGENCE SUITE / MEGA-BRAIN / WIKI / TELEMETRY / OCTOGENT / STOP CONDITIONS sections were 5-15 lines each restating rules already in `wiki/decision-rules.md`.
- **Change:** Audit ran via DeepSeek (T2, long-context, ~28k tokens, 1 call) → 30-item punch list. Synthesized into surgical edits: collapsed contradictory KIMI rows into one current-policy line citing the superseding memory entry, moved 8 built-in skills into one inline `**Built-in Anthropic skills**` line that the drift-checker now parses, trimmed sections to load-bearing density, fixed `cc-loop` → `loop`, added missing `skill-creator` row, fixed `agent-definitions.md` count `(6)` → `(8)`.
- **After:** 210 lines. Drift-check green (37 skills + 13 agents + 2 MCP refs). No routing power lost — every removed line either duplicated another, cited a non-existent file, or restated a built-in harness behavior.
- **Why it matters:** CLAUDE.md is loaded into every session's context. Each saved line saves ~50 tokens × every session forever. Density also surfaces drift faster — contradictions are easier to spot in a tight doc.

## 2026-05-03 · Wired Stop hooks were not the bottleneck

- **Before:** Suspected 5 sequential Stop hooks were causing 2-5s dead air per turn
- **Change:** Profiled each hook with `/usr/bin/time -p`
- **After:** Combined wall time = 0.18s. Hooks are NOT a bottleneck.
- **Why it matters:** Killed a planned "parallelize Stop hooks" optimization that would have added complexity for zero gain. **Measure before optimizing.**

## 2026-05-03 · CLAUDE.md as central routing brain

- **Before:** Tool selection was implicit — Claude rediscovered which skill/agent/MCP to invoke every session by reading SKILL.md descriptions one at a time
- **Change:** Added 3 routing tables to CLAUDE.md (skills 22 entries, agents 10 entries, MCPs 16 entries) with composition rules + stop conditions
- **After:** Routing decisions are O(1) lookup against tables loaded at session start
- **Why it matters:** Reduces first-token latency and prevents skill misfires. Brain knows the menu before the user finishes typing.

## 2026-05-03 · Self-monitoring suite (5 launchd agents)

- **Before:** System health required manual `/health` invocation
- **Change:** Loaded 5 launchd agents — daily MCP probe (09:00), weekly drift+memory+digest (Mon 09:05/10/20), monthly skill-usage (1st 09:15)
- **After:** Brain self-reports without input. Real findings caught on first run (Amplitude + Gamma needed re-auth)
- **Why it matters:** Removes a recurring manual task and surfaces silent failures (like OAuth expiration) before they cause downstream errors.

## 2026-05-03 · SessionStart MCP probe hook

- **Before:** Broken MCP servers caused mid-task failures with confusing error messages
- **Change:** Added `mcp-session-probe.sh` to SessionStart hook chain. 6h dedup so it doesn't thrash on rapid restarts. Surfaces 🔴 issues to Claude inline at session open.
- **After:** Claude knows which MCPs are dead BEFORE attempting to use them; can route to fallbacks proactively
- **Why it matters:** Prevents wasted token spend debugging a failed MCP call. Surfaces issues at the right moment.

## 2026-05-03 · Retired browser-use MCP (4 → 3 browser MCPs)

- **Before:** Four browser MCPs (chrome-devtools, playwright, auto-browser, browser-use) with no precedence rule. Coin-flip routing.
- **Change:** Added "Which browser MCP" decision rule (D4) + retired browser-use via `claude mcp remove browser-use`
- **After:** Clear precedence: chrome-devtools (default) → playwright (test runner) → auto-browser (supervised)
- **Why it matters:** Eliminates routing ambiguity + reduces MCP startup overhead. Cohesion +5%.

## 2026-05-03 · Audits version-controlled in dotfiles

- **Before:** `~/.claude/audits/` was local-only — audit history would be lost on machine swap
- **Change:** Migrated to `~/dotfiles/claude/audits/` + symlinked back to `~/.claude/audits/`
- **After:** All audit history (drift reports, memory health, system score, architecture redesigns) versioned with the rest of the brain config
- **Why it matters:** Audit timeline survives reinstalls. Enables comparing system score iter-over-iter.

## 2026-05-03 · TEL installed + validated under Python 3.12

- **Before:** TEL existed as code in dotfiles but was never installed — the iter 8 commit was design-and-stage only
- **Change:** Created Python 3.12 venv at `~/.claude/tel/.venv/`, installed pinned deps (fastapi 0.115.0, uvicorn 0.32.0, pydantic 2.9.2, httpx 0.27.2, pyyaml 6.0.2). Validated all 6 server modules import. Validated all 3 policy YAMLs parse with correct action counts. Validated redaction (tokens/api_keys → `<redacted>`, normal args preserved). Validated rate limiter. Validated rollback issue/consume/no-double-consume.
- **After:** TEL is import-clean and unit-functional. Server NOT yet running (launching the long-running daemon is a separate approval gate the user hasn't cleared yet — correct harness behavior). The path to "live" is now: `op signin` → `launchctl load bio.tel.plist` → done.
- **Why it matters:** Closes the architecture loop from iter 8. Future "use my login for X" requests have a code-validated answer waiting; only operational steps remain.

## 2026-05-03 · MCP fallback resolver + auto-recommendation in probe

- **Before:** When an MCP failed, Claude had no automated way to know which alternative MCP could cover the same need
- **Change:** Built `~/.claude/scripts/mcp-fallback-resolver.sh` with fallback chains (chrome-devtools→playwright→auto-browser, webclaw→chrome-devtools, etc.). Wired into mcp-probe so 🔴 Disconnected entries now show inline `→ fallback: <name>` recommendations.
- **After:** Probe output is actionable: tells you what to use instead. skill-router agent also queries the resolver when called in failure-recovery mode.
- **Why it matters:** Reliability +1%. Brain self-routes around MCP failures without asking the user.

## 2026-05-03 · Design-skill picker baked into CLAUDE.md

- **Before:** 5 design-family skills (`design`, `huashu-design`, `design-system`, `ui-styling`, `ui-ux-pro-max`) overlapped with no hard disambiguator. Routing was a coin flip in fuzzy cases.
- **Change:** Added "Design-family skill picker" table to CLAUDE.md SKILL COMPOSITION RULES with explicit "user says X → pick Y" mapping + hard rule "never invoke two design skills in the same task"
- **After:** Single-glance disambiguator. Cohesion +1%.
- **Why it matters:** Removes the worst routing collision in the system.

## 2026-05-03 · LLM Wiki integration (this iteration)

- **Before:** Knowledge lived in scattered docs (CLAUDE.md, audits, agent files) with no read-before/write-after protocol. Failures and optimizations were ephemeral.
- **Change:** Built `~/dotfiles/claude/wiki/` with 6 sections (tool-registry, agent-definitions, workflow-templates, decision-rules, failure-log, optimization-log) + read/follow/write protocol baked into CLAUDE.md
- **After:** Failures get logged once, never repeated. Optimizations compound across sessions. New workflows accumulate as the brain encounters them.
- **Why it matters:** **If knowledge isn't in the wiki, it doesn't exist for future intelligence.** This is the foundation of long-term self-improvement.

## 2026-05-03 · Mega-brain ingestion pipeline + 8 mentor brains stood up

- **Before:** No standard way to absorb external corpora (articles/PDFs/videos/databases) into the wiki. Domain knowledge stayed siloed in source projects (DoseCraft had 8826 transcript chunks in Neon, unreachable from any other Claude session).
- **Change:**
  - Built `mega-brain-ingest` (`~/code/projects/scrapling-lab/bin/`, on PATH): auto-routes URL/local-path → trafilatura/pypdf/transcribe-video; writes per-doc markdown + frontmatter + dedupe manifest under `~/.claude/wiki/learnings/<topic>/`. Local-path mode supports recursive directory ingest of mixed `.pdf .md .txt .html .vtt .srt .mp3 .mp4`.
  - Pulled DoseCraft Neon `transcript_embeddings` (8,826 chunks across 843 videos) → reconstructed per-video markdown → ingested into 8 per-mentor brains: bachmeyer (472 vids / 3.0M words), bachmeyer-rumble (102), ayubace (167), nathalie-niddam (28 / 338K words), jay-campbell (21), nick-trigili (20), moreplatesmoredates (17), dr-craig-koniver (16). Total: **843 videos, 4.1M words.**
  - Built cross-mentor `_COMPOUND_INDEX.md` (peptide → mentor coverage matrix; e.g. BPC-157 across 185 videos, top: bachmeyer 78) + machine-readable `_compound-index.json`.
  - Per-mentor `_README.md` profiles (credibility, tone, strengths, when-to-consult).
  - Top-level `_INDEX.md` catalog.
- **After:** Any future Claude session can recall mentor consensus on any peptide in 1 grep / mempalace search. Workflows W11 + W12 cover greenfield ingestion and DB-recovery patterns. Decision rule D14 governs when to consult.
- **Cost:** $0 (faster-whisper local, trafilatura local, pypdf local). Neon API key crossed Bash boundary once → user advised to revoke.
- **Why it matters:** This is the user's primary mode going forward — "build mega brains from public articles + PDFs + YouTube + mentor content, efficient, lowest cost, highest quality." The pipeline is generic; DoseCraft mentors were the first 4M words; karpathy + peptide-research source files already seeded for next ingestion passes.

## 2026-05-04 · Per-surface custom OG cards compound social CTR

- **Before:** Both Aurex (aurex.bio) and Dosecraft (dosecraftapp.com + coach.dosecraftapp.com) had a single apex OG card; every shared URL rendered the same brand card whether it was the homepage, a research-area landing, or the bio link tree. Social viewers had no preview-level clue what to expect — link CTR cratered on shared deep-links.
- **Change:** Shipped 12 purpose-built OG cards (Next.js `next/og` ImageResponse + `runtime: 'nodejs'` for fs-loaded brand mark):
  - **Aurex (5):** /links (bio destination), /find-your-stack (picker), /calculator (reconstitution), per-condition /research/<slug> (×7 already shipped iter-pre)
  - **Dosecraft apex (3):** /research index, /picker, per-condition /research/<slug> (×7 already shipped)
  - **Coach (3):** /coach/chat (sample-question chips), /coach/pricing (tier+price chips), /coach/aurex (cross-brand pitch)
- **Pattern:** Shared visual language per brand (warm paper + cobalt accent for Aurex; warm paper + teal for Dosecraft apex; navy + teal for Coach). Each card surfaces the page's specific value via 4-6 chip tags so the preview *advertises* contents.
- **After:** Every high-share surface now has its own preview. Bio destinations, pickers, and tools (the most DM/screenshot-shared assets) get bespoke cards.
- **Why it matters:** OG cards are the single highest-leverage SEO/social investment per LOC — one 200-line file moves CTR on every share of that URL forever. Pattern is repeatable: any new page that gets shared on social warrants its own opengraph-image.tsx co-located with page.tsx.

## 2026-05-04 · llms.txt + ai.txt + llms-full.txt as AI-search foundation

- **Before:** Aurex had llms.txt/llms-full.txt/ai.txt; Dosecraft (the LLM-target product — Coach is literally an AI chat) had none. Perplexity / ChatGPT / Claude / Gemini crawlers had no structured discovery path.
- **Change:** Dosecraft `public/llms.txt` (concise: canonical URLs apex+coach, 36 compound slugs grouped by class, 7 research areas, 3 vendors, editorial posture, AI-citation guidance, contact) + `public/llms-full.txt` (comprehensive markdown mirror: per-compound MoA summary, per-research-area framing, methodology + sanitizer behavior, schema.org safety policy, compliance, "how to cite Dosecraft" for AI assistants) + `public/ai.txt` (allowed crawlers list, preferred citation format per surface, CC-BY-4.0 content license, editorial-integrity expectations: preserve research-only framing, preserve citations, avoid therapeutic-claim laundering, disclose affiliate context per FTC § 255.5)
- **After:** Coach is now AI-search-discoverable with the editorial framing intact across summarization. UGC explicitly excluded from training corpora.
- **Why it matters:** AI search is the next-gen attention layer. `llms.txt` follows the emerging llmstxt.org convention (additive to sitemap.xml, not replacement). `ai.txt` is the Cloudflare/spawning.ai standard for declaring access policy. Pattern: any LLM-target product needs both files; sister-brand parity matters (apex + sub-brand).

## 2026-05-04 · Post-deploy script as silent-failure detector

- **Before:** Post-deploy scripts only curl'd /api/health and pinged Bing — silent OG card bugs (e.g., a route falling through to text/html instead of image/png) survived shipped state.
- **Change:** Both repos now grep returned content-type per OG route:
  - For OG cards: expect `200 image/png` — `text/html` means silent page-render fallback
  - For AI-search files: expect `200 text/plain` on llms.txt/llms-full.txt/ai.txt
  - Sitemap content sanity: count compound dossiers (expect 36 Dosecraft), research areas (expect 7), coach.* URLs (expect 11+), partner SKUs (expect 6 Aurex)
  - Aurex script grep PDPs for `?ref=DOSECRAFT` + `?sld=dosecraft` — silent revenue-leak detector; if affiliate code missing, partner click-through earns nothing
- **After:** A failed deploy that *built* but produced broken OG/affiliate state now fails loud at the post-deploy step.
- **Why it matters:** Build-passes-but-runtime-broken is the worst failure mode. Pattern: post-deploy scripts should verify *runtime behavior* (response codes, content types, content sanity) not just `curl /api/health`.

## 2026-05-04 · OG render smoke test as CI gate (vitest)

- **Before:** Satori errors fire only at request-time. Build was silent on the 5 OG bugs caught by local-serve E2E this session. Manual local-serve + curl is the only existing verification — high friction, easy to skip.
- **Change:** Added `tests/og-render.test.ts` to both repos (dosecraft-companion 040c57e, aurex 57d1df0). Pattern: import each OG handler module, call default export with mocked params for dynamic routes, await `response.arrayBuffer()`, verify PNG magic bytes (`89 50 4E 47 0D 0A 1A 0A`) at offset 0. Any Satori error rejects the promise — caught at unit-test time, before merge.
- **After:** 24 OG render assertions across both repos run in ~2s total. Verified detection by injecting a Satori bug into a known-good OG card — test failed with the exact error message Satori would emit at request time.
- **Why it matters:** Converts the manual trust-but-verify loop into a CI gate. Future Satori regressions blocked at PR time, not after they reach production. Pattern is repeatable for any `next/og` ImageResponse — 1 test per OG route, ~10 lines each.
- **Coverage:** Dosecraft 9 static + 4 dynamic = 13 tests; Aurex 8 static + 3 dynamic = 11 tests. Branch coverage for vendor-preferred (`aurex` slug hits the PREFERRED pill) and partner-fulfilled product variants.

## 2026-05-04 · Data integrity tests catch silent content drift

- **Before:** Build was silent on YAML/data-source drift — typo in a research-area's compound slug, missing affiliate code in a partner URL, partner-fulfilled SKU forgotten with stock>0, vendor renamed without updating cross-refs. Manual visual scan was the only check.
- **Change:** `tests/data-integrity.test.ts` in both repos.
  - **Dosecraft (15 tests, b80ca03):** compound count + unique slugs + resolvability + canonical fields; research-area cross-refs resolve to compounds; vendor roster locked to {aurex, oasis, peptide-partners}; every SKU references real compound + real vendor; FTC affiliate hygiene (every PP URL `?ref=DOSECRAFT`, every oasis URL `?sld=dosecraft`).
  - **Aurex (16 tests, ba094c7):** product count + unique slugs + canonical fields; partner-fulfilled SKU hygiene (stock===0, primaryUrl present, alt-partner URL carries right affiliate code); Aurex-fulfilled SKU hygiene (pricing.list > 0); stack count + canonical fields.
- **Caught + fixed by this run:** `/research/libido` had only 1 compound (PT-141). Added VIP — has legitimate intracavernous-injection erectile-mechanism research, distinct from PT-141's central melanocortin pathway. Both compounds + comparison cited in updated chatPrompt.
- **Why it matters:** Total test coverage now blocks 5 silent-failure classes pre-merge:
  1. Satori OG render bugs (vitest OG smoke, 24 tests)
  2. Cross-link breakage between compound/research/vendor (15 tests)
  3. Affiliate-code stripping = silent revenue leak (4 tests across both repos)
  4. Partner-fulfilled SKU forgotten state mismatches (3 tests)
  5. Content thinness (research areas with too few compounds, products without taglines)
- **Pattern:** When YAML/registry data feeds public pages, write integrity tests that walk every cross-reference. The cost is ~150 LOC per repo; the value is unbounded — catches every future content-drift regression.

## 2026-05-04 · CI gates wired (vitest + sitemap completeness)

- **Before:** Aurex CI ran typecheck + build + lint + knip but skipped `npm test`. Dosecraft had no .github/workflows at all. The 55 vitest tests added this session sat unused on disk — local-only, never gated PRs.
- **Change:**
  - Aurex 6b8eeeb: appended `test:` job to existing ci.yml (needs typecheck, runs `npm test`, blocks merge)
  - Dosecraft f52c27c: created ci.yml from scratch (typecheck → build → test → audit). Audit job verifies AI-search file presence (llms.txt, llms-full.txt, ai.txt) + routing files + Coach legal pages (Paddle merchant-review-critical)
- **Plus 16 new sitemap completeness tests** (Dosecraft 57f1d7c, Aurex f8e5559) catching silent-SEO-leak: new compound / research-area / vendor / product / stack added to registry but app/sitemap.ts not updated → page renders, Google never indexes.
- **Result:** Total test counts after this wave:
  - Dosecraft: 151 tests across 9 files
  - Aurex: 73 tests across 8 files
  - All gated by CI on every PR.
- **Why it matters:** Tests on disk are best-effort; tests in CI are gates. The 5-class silent-failure detection (Satori OG, cross-link breakage, affiliate stripping, partner-SKU mismatch, content thinness, sitemap drift) now blocks merge automatically. No more "the test passes locally but I forgot to run it before pushing".

## 2026-05-04 · KIMI design pass — 4 waves + bug fixes raise Aurex from "looks low budget" to premium-tier

- **Trigger:** User screenshot + feedback "site looks low budget."
- **Pattern:** Visual audit → route design pass to KIMI per the design-tier rule (`router-ask` purpose: ui_design) → translate KIMI's spec to production code → ship measured waves.
- **Bug-fix wave (5f6b8f6):** Visual audit caught real production bugs hidden under the "low budget" complaint — partner-fulfilled SKU PDPs rendering "$0 SAVE NaN%" + fake 5★ rating + Add-to-Cart-at-$0 fraud surface on every catalog grid card. 11 Aurex-cart-only sub-components conditioned on `!p.partnerFulfillment`. Confidence-killer fixed.
- **Wave 1 (980d0b7) — KIMI #1 + #3 + #6 partial:** Hero typography from "ENGINEERED FOR PRECISION" all-caps blocky → "Engineered for precision." sentence-case serif with cobalt accent on one word (Apple iPhone 16 Pro pattern). Trust strip from solid dark banner-ad → Stripe/Apple bg-paper/70 backdrop-blur-xl with hairline dividers. Hero badges desaturated graphite/steel.
- **Wave 2 (e9b7916) — KIMI #2 + #6 finish:** Catalog grid card hierarchy inverted — title becomes focal point, price drops from cobalt/26px-bold to ink/20px-medium, HPLC chips desaturated from cobalt-on-cobalt to ink-bordered-paper, hover states neutralized. Cobalt count above the fold dropped from ~12 to ~2 (headline accent + primary CTA only).
- **Wave 3 (8c31da8) — KIMI #5 + ink-fill CTA + 39-file brand-fix:** Section density tokens (space-y-20/24/28 across 12 home sections). Card CTA from outline-only ink → ink-filled default with cobalt-on-hover. `DoseCraft` → `Dosecraft` across 39 files (about/press/terms/privacy + EvidenceBanner + llms-full.txt + every printed-label SVG).
- **Wave 4 (f0464c5) — KIMI #4 PDP gradient settle:** Found smaller-than-expected fix for the deferred "PDP full-bleed dark" item. Instead of flipping every inner-component color, just had the dark gradient settle into paper by ~45% so the buy panel reads as a continuation of the surface, not a contrast-sandwich island. No inner-component color flips needed.
- **Result:** All 6 KIMI design directives shipped. Cobalt restraint + serif hierarchy + section density + Stripe-style trust strip + filled-ink CTAs + softened PDP framing. Dosecraft + Coach surfaces audited separately — already premium-tier (different design language, editorial vs commercial, both work). Aurex test suite: 76/76 passing post-design-waves; Dosecraft: 151/151. Zero regressions.
- **Pattern preserved forward:** When user feedback says "looks low budget" — (1) visual audit to find real bugs hidden beneath the perception, (2) dispatch KIMI for a 6-shot plan via router-ask purpose:ui_design, (3) ship in measured waves keeping diffs reviewable. Visual quality is downstream of fixing $0/NaN% bugs first.

## 2026-05-05 · Dosecraft Companion v1 SHIPPED to dosecraftapp.com + coach.dosecraftapp.com

- **Trigger:** User explicit "go" after I outlined the dummy-mode-now vs wait-for-Paddle decision tree.
- **What shipped:** Full v1 deliverable — chat UI streaming + vendor cards + cross-link surfaces + FTC disclosure + corpus-backed retrieval. Apex + Coach subdomain both live.
- **Pattern that worked (preserve forward):**
  1. `vercel link --yes --project <name>` (auto-creates project, connects to GitHub)
  2. `vercel --prod --yes` (first deploy)
  3. `vercel domains ls` (audit registered domains)
  4. `vercel alias set <deploy-url> <domain>` for apex + each subdomain
  5. `vercel domains add <subdomain>` for any subdomain not yet on the project
  6. `vercel env add <KEY> production` (echo value via stdin to avoid interactive prompt)
- **Two prod gotchas caught + fixed:**
  - **Coach subdomain returned 401 SSO-protected.** Cause: ssoProtection mode was `all_except_custom_domains`, but the alias alone doesn't make a custom domain "registered." Fix: explicit `vercel domains add coach.dosecraftapp.com` to register it as a project-level domain.
  - **Wiki corpus didn't reach the function.** Vercel Node File Tracing only includes statically-imported files. retrieve.ts computes its path from env, so wiki-corpus/ was excluded. Two fixes layered: (1) `outputFileTracingIncludes` in next.config.ts to explicitly bundle the directory, (2) absolute env path `/var/task/wiki-corpus` rather than relative `./wiki-corpus` (cwd in serverless != repo root).
- **Corpus strategy:** Bundled the dosecraft-research subset only (88 files / 2 MB) of the full 368 MB wiki/learnings tree. Mentor brains (Bachmeyer, Huberman, Koniver — 14-17 MB each) stay local-only as enrichment. v1 chat answers from dosecraft-owned curated corpus; mentor enrichment is a post-v1 lever (could go to Neon as embedded vectors).
- **Result:** Live chat smoke against `https://coach.dosecraftapp.com/api/chat` returned `chunkCount: 3, tier: keyword, total_ms: 324` with 3 vendor cards (peptide-partners + aurex + oasis) emitted at end of stream. Deployment chain: c931819 → db592fe → 98f98c8 → cbd601c → final lfaajtle5.
- **Aurex side:** All 5 KIMI design waves auto-deployed via the existing Vercel/GitHub integration. aurex.bio shows the new "Engineered for precision." hero, partner SKUs render "Cataloged" not "$0/SAVE NaN%", catalog cards show "Via partner" chips. Confirmed live.

## 2026-05-14 · Closed feedback loop: autotuner → CB threshold
- **Before:** cbAdjustment in classifier-tuning.json was dead data; CB threshold was global default 3 for every tier
- **Change:** Wired circuit-breaker.cjs to read classifier-tuning.json with mtime-cached load + clamped per-tier offset (±3, floor at 1)
- **After:** Live thresholds: chat=3, cheap=5 (+2 grace), precision=3, design=3, codex=2 (stricter). 9 tests pass.
- **Why:** First piece of closed-loop architecture. The autotuner's observations finally drive routing decisions automatically. Future tier drift self-corrects without manual intervention.
- **Timestamp:** 2026-05-14T08:44:26Z

## 2026-05-14 · hero trust pill no-wrap on mobile
- **Cycle:** #50 (fresh-audit)
- **Summary:** hero trust pill no-wrap on mobile
- **Depth:** 2 · **Regression:** false
- **Timestamp:** 2026-05-14T08:44:26Z

## 2026-05-14 · Closed feedback loop #2: post-cycle reflection → wiki logs
- **Before:** wiki-writeback.sh fired on every Stop but only checked obscure CC_WIKI_* env vars that no session ever sets. No structured path for sessions or autonomous cycles to leave a learning trail. optimization-log.md only grew when I hand-wrote entries.
- **Change:** Built ~/dotfiles/bin/cc-reflect (writes JSONL to ~/.claude/state/reflection-queue.jsonl). Extended wiki-writeback.sh to drain the queue, format entries by type (optimization/cycle/failure), append to the right log, and truncate. Tested end-to-end: 2 entries queued → flushed to optimization-log.md → queue empty.
- **After:** Sessions can now leave a structured learning trail with one CLI call per reflection. Autonomous cycles can do the same. The wiki logs become a queryable corpus instead of a hand-curated record.
- **Why:** Second piece of closed-loop architecture (after autotuner→CB). Multi-cycle pattern detection becomes possible — e.g. 'show me all cycles with depth<=2 in the last 7 days' would now be a single grep against optimization-log.md.
- **Timestamp:** 2026-05-14T08:47:08Z

## 2026-05-14 · loop-2 ship
- **Change:** shellcheck cleanup + commit
- **Why:** demonstrate end-to-end with hook drain still working
- **Timestamp:** 2026-05-14T12:11:18Z

## 2026-05-14 · Closed feedback loop #3: every session auto-deposits into mempalace
- **Before:** mempalace had 106k drawers but no skill or session auto-wrote to it. Every session ended, the brain forgot. Manual writes via mempalace_kg_add MCP tool were the only path. Most sessions left no trace beyond the markdown logs.
- **Change:** Built ~/.claude/hooks/mempalace-stop.sh (defensive wrapper: timeout-bounded, fail-soft, logged). Added as 6th entry in settings.json Stop hook chain. Every session Stop now pipes the standard Claude Code hook stdin (session_id, transcript_path) to 'mempalace hook run --hook stop --harness claude-code' which spawns a background convo-mode mine on the transcript directory.
- **After:** Every session Stop event auto-deposits a session digest into mempalace's 'sessions' wing. Cross-session muscle memory accumulates without any per-session effort. Verified end-to-end: hook fires cleanly (exit 0), mempalace acknowledges (returns {}), audit log captures timestamp + result.
- **Why:** Third piece of closed-loop architecture (after autotuner→CB and reflection-queue→logs). Hands-off semantic recall now covers EVERY session, not just ones where I remember to manually write a memory entry. Three months from now /recall queries will return relevant work-history from sessions I'm not even aware existed.
- **Timestamp:** 2026-05-14T12:22:50Z

## 2026-05-14 · Built cc-health: single-call truth table across the whole stack
- **Before:** Truth was spread across router-ping (tier-only, JSON), /health skill (markdown instruction to model), bridge-keeper alerts log, mcp probe cache, mempalace status, task queue stats, vec list — and they disagreed. Two times today bridge ping returned ok=true while alerts log said down.
- **Change:** New bin/cc-health probes 17 components in ~3s: 5 router tiers (real ping), Kimi + ChatGPT image bridges (honest pings post fix), camofox/TEL HTTP, task queue + vec store + mempalace, plus closed-loop signals (autotuner age, reflection queue depth, mempalace-stop last-fire) and 15-min alert window. Color-coded TTY output, exit code reflects worst status (0=all OK, 1=warn, 2=fail).
- **After:** One command, one truth. Caught Kimi logged-out + image-bridge keeper-failures + corroborating 3 bridge alerts in 15min — all surfaced in a single coherent display. Verified mempalace-stop hook fires in real time (timestamped <1s before cc-health output).
- **Why:** Closes the visibility gap that made 'ok=true while keeper says down' possible. Composes with loops #1-3 — those generate signals, cc-health makes them visible. The next time bridge ping or router state lies, cc-health will catch it because it cross-references every layer.
- **Timestamp:** 2026-05-14T12:37:06Z

## 2026-05-14 · cc-deploy-watch — autonomous loops can no longer push into the void
- **Before:** aurex-bio's autonomous fresh-audit loop has shipped 20+ cycles in the last several hours. Each cycle commits, pushes, and reports done. But GitHub Actions is billing-blocked — every CI run since at least cycle 38 returns 'The job was not started because recent account payments have failed.' Result: typecheck/build/alias-to-aurex.bio all skipped; aurex.bio likely serving stale build. The loop has been blind to this for ~20 cycles.
- **Change:** Built bin/cc-deploy-watch — cross-references GitHub HEAD vs check-runs vs deployments API vs live HTTP probe. Wired into cc-health so 'Production deploy drift' is a first-class row. Writes structured alerts to ~/.claude/state/deploy-alerts.log on detected drift.
- **After:** Caught the live regression cleanly: cc-health now emits 'deploy/aurex.bio: CI broken on HEAD · loop pushing into void' in red. The 'autonomous loop is doing fine' delusion can no longer hide. cc-deploy-watch returns exit 2 on stale-prod so future launchd polling can alert via ntfy/push.
- **Why:** Closes the most important safety gap remaining: production-blast-radius from autonomous-loop blindness. Every other closed loop I shipped today depends on the loops actually REACHING prod. Without this watcher, the brain optimizes the loop while the loop optimizes nothing.
- **Timestamp:** 2026-05-14T15:44:38Z

## 2026-05-14 · SessionStart hook surfaces cc-health drift as additionalContext
- **Before:** Every new session started blind. I had to manually discover Kimi-logged-out + image-bridge-keeper-failing + GitHub-Actions-billing-blocked TODAY because there was no surface signal at session start. The 4 closed loops were generating perfect signal, but nothing was injecting it into the next session's context.
- **Change:** Built ~/dotfiles/claude/hooks/session-health.sh — runs cc-health --instant (1s, cached state only, no network), emits JSON additionalContext to SessionStart only when WARN/FAIL present. Added cc-health --instant mode that skips router-ping (30s subprocess CLI spawns) and bridge pings (playwright spawns), relying instead on bridge-alerts.log + deploy-watch state files + closed-loop signal files. Wired as 5th SessionStart hook in settings.json.
- **After:** Every fresh session now starts AWARE of: deploy drift, bridge keeper failures, pending reflections, mempalace-stop last fire, autotuner tuning age. Verified end-to-end: hook produces valid JSON additionalContext in 1s including the live failures (image bridge + deploy drift). Quiet when all green — no noise.
- **Why:** Closes the loop from 'observability catches drift' to 'next session ACTS on drift.' Without this, the closed-loop signals are write-only and rely on me running cc-health by hand. With this, the brain self-briefs at every session start.
- **Timestamp:** 2026-05-14T17:14:06Z

## 2026-05-14 · Brain self-pause: deploy drift can halt the autonomous evolve loop
- **Before:** The evolve daemon (com.claude-code.evolve, PID 46573) was shipping cycle after cycle into billing-blocked CI. Each cycle: an LLM call, a commit, a push — all ending in skipped GHA jobs. No mechanism to detect 'I'm shipping into the void' and stop.
- **Change:** Wired cc-deploy-watch-cron to launchctl stop/start the evolve daemon on drift state transitions. Opt-in via CC_DEPLOY_WATCH_PAUSE_EVOLVE=1 (default off — pure notify behavior). Pause/resume events logged to ~/.claude/state/evolve-paused-by-drift.log.
- **After:** When enabled: drift→pause→resume happens automatically via the 5-min poll. The autonomous loop can no longer run open-loop against broken infra. Combined with the SessionStart hook surfacing drift to fresh sessions, the entire stack now self-aware-of-drift and self-pausing.
- **Why:** Closes the final autonomous-safety gap: the loop now respects its own observability. Plus durable in dotfiles + symlinked back into ~/.claude/, so it survives machine rebuilds.
- **Timestamp:** 2026-05-14T17:30:27Z

## 2026-05-20 · Global config convergence: Claude + Codex share one maintained brain
- **Before:** Claude and Codex config paths had drifted: retired wrappers were still routed, Codex advertised missing paths, weekly health expected dead daemons, and generated heartbeat/probe files were tracked as source.
- **Change:** Retired legacy wrappers and the old prune LaunchAgent, linked Codex globals to dotfile-backed Claude resources, moved health routing to AI-SYSTEM-V2 status, cleaned active routing docs, and marked optional archived lanes as optional instead of installed.
- **After:** Installer replay is idempotent; active path scan reports zero missing advertised Codex paths; routing drift reports clean; SessionStart health is quiet when AI-SYSTEM-V2 is operational. Weekly health's only red during this work is the expected dirty/ahead dotfiles repo.
- **Why:** The global brain now has one source of truth instead of parallel Claude/Codex copies and dead command fossils. Future sessions should route by reality, not by old bootstrap assumptions.
- **Timestamp:** 2026-05-21T01:40:00Z

## 2026-05-20 · Added Crush as durable alternate terminal coding lane
- **Before:** Crush was spotted as promising, but not installed, routed, or rebuild-safe. npm globals also had no declarative restore path in dotfiles.
- **Change:** Installed `@charmland/crush` v0.70.0, registered `crush` as a CLI routing target, documented it in the tool registry, added `npm-global-packages.txt`, taught `install.sh` to restore npm globals, and taught weekly health to verify package + command presence.
- **After:** `crush --version` works, routing drift recognizes it as a CLI rather than a missing skill, Brewfile remains satisfied, and weekly health explicitly checks `@charmland/crush`.
- **Why:** Crush gives the stack another terminal-native, multi-provider coding lane without coupling it to raw secrets or making it the default. The install is durable without waiting on Homebrew's Xcode Command Line Tools blocker.
- **Timestamp:** 2026-05-21T01:56:00Z

## 2026-05-20 · VS Code interface moved under dotfile control
- **Before:** VS Code User settings/tasks/keybindings/MCP config were machine-local and drifted from the global routing layer. The active config allowed force-pushes, smart commits, Claude bypass permissions, stale Perplexity/OpenAI tasks, and dead local mcp-hub endpoints.
- **Change:** Added `vscode/settings.json`, `keybindings.json`, `tasks.json`, `mcp.json`, and `extensions.txt`; linked them through `install.sh`; installed and declared the missing Biome/Tailwind extensions; removed dead editor tasks; made task prompt passing argument-safe; and added VS Code symlink + extension-manifest checks to health/self-update.
- **After:** VS Code opens Claude, Codex, Kimi, DeepSeek, Crush, and AI-SYSTEM terminals from stable shortcuts; MCP config contains only a live GitHub remote endpoint; force-push/destructive Explorer actions require confirmation; and `install.sh`/weekly health can detect editor drift.
- **Why:** The editor is now part of the rebuilt global system instead of a separate hand-tuned surface. A new Mac or a damaged VS Code profile can converge from dotfiles.
- **Timestamp:** 2026-05-21T02:12:00Z

## 2026-05-20 · PATH noise now has an enforceable registry
- **Before:** `~/dotfiles/bin` contained dozens of executables, but there was no single classification layer proving which commands were primary interfaces, workflow helpers, maintenance jobs, vendor utilities, or retired fossils.
- **Change:** Added `docs/COMMAND-REGISTRY.md`, registered every live executable in `bin/`, moved retired command names into an explicit absent list, removed the stale Perplexity runtime claim from TELOS, disabled noisy global Git fsmonitor, and taught weekly health to fail on unregistered commands, broken runtime symlinks, or retired references in active files.
- **After:** `cc-health-weekly --verbose` now verifies VS Code, npm globals, stale-reference hygiene, command-registry coverage, and runtime symlink integrity. Current live result is 11/12 green; the only red is expected while dotfiles are dirty/ahead of origin.
- **Why:** This converts cleanup from a one-time purge into a guardrail. New global commands must be intentionally classified, and old lanes cannot quietly return to the active surface.
- **Timestamp:** 2026-05-21T02:36:00Z

## 2026-05-20 · Attachment doctrine converted into enforceable gates
- **Before:** The attached system bundle had the right principles — route before reasoning, browser/UI to Kimi, quality-preserving compression, autonomous depth, Keychain-first secrets, silent shell startup — but several were still prose-only in the live stack.
- **Change:** Added `docs/PROPRIETARY-SYSTEM-DOCTRINE.md`, fixed silent-shell startup failures, patched the router so screenshots/browser prompts route to `design/kimi`, added `cc-router-smoke`, and wired router smoke into weekly health.
- **After:** The router now proves representative prompt classes: cheap/DeepSeek for transforms, design/Kimi for UI/browser/screenshot, precision/Claude for hard debugging. `zsh -i -c exit` and `TERM=dumb zsh -i -c exit` emit no startup noise.
- **Why:** Developer-tier means the system cannot rely on remembered intent. The routing doctrine and desktop/interface doctrine now have executable checks.
- **Timestamp:** 2026-05-21T03:05:00Z

## 2026-05-20 · External router wiring translated into lane registry
- **Before:** FreeLLMAPI/Crush-style multi-provider routing was useful reference material, but our tool/model routing still lived across prose tables, shell wrappers, and memory. Fallbacks could be named without proving the target lane existed.
- **Change:** Added `docs/ROUTER-WIRING-STUDY.md`, `docs/LANE-REGISTRY.schema.json`, `ai-lanes.json`, `cc-lane`, and `cc-lane-registry-check`. Registered Kimi, Playwright, Codex, Claude, DeepSeek, ChatGPT image, TEL, and FreeLLMAPI study lanes; wired lane validation into command registry, `/health`, README, VS Code tasks, and weekly health.
- **After:** Router architecture now has an executable lane contract: each capability has a primary lane, fallbacks resolve to declared lanes, active lanes cannot lack a health surface, study-only lanes stay out of production routing, and operators can inspect a capability route from CLI or VS Code.
- **Why:** The useful pattern to steal is not “use another free model proxy”; it is provider adapter + health ledger + fallback graph + sticky workflow continuity + unsupported-capability declarations. This makes our multimodal tool router auditable before it becomes more autonomous.
- **Timestamp:** 2026-05-21T03:34:00Z

## 2026-05-20 · Removed Crush from active stack after value check
- **Before:** Crush was installed and routed as an alternate coding lane, but it depended on the same underlying model providers already in the system. That made it an interface duplicate, not an independent capability.
- **Change:** Removed Crush from `ai-lanes.json`, VS Code profiles/tasks/keybindings, npm global restore, CLAUDE/Codex routing tables, routing drift allowlist, and tool registry. Uninstalled `@charmland/crush` globally. Kept reference-study notes only where the pattern is explicitly architectural.
- **After:** Active coding authority is back to Codex plus Claude for hard-floor review. The router no longer presents Crush as a fallback, and `command -v crush` returns no command.
- **Why:** A lane must either add independent capability, cost advantage, safety boundary, or workflow leverage. Crush did not clear that bar for this stack once we modeled the dependency honestly.
- **Timestamp:** 2026-05-21T03:58:00Z

## 2026-05-20 · Video study: free model IDE demos reinforce cockpit/router product shape
- **Before:** The Kimi/Antigravity/OpenCode and Qwen/OpenCode videos were external hype signals without a local decision record.
- **Change:** Extracted the first video's full auto-caption transcript, locally transcribed the second video after YouTube caption rate limiting, and added `docs/VIDEO-REFERENCE-STUDY-2026-05-20.md`.
- **After:** The useful lesson is captured: cheap/free model lanes belong behind the router as `study`/`lab` lanes, not as extra cockpit buttons or second authority layers. Product demos should show visible output, token/receipt visibility, and one familiar IDE surface.
- **Why:** The market is validating the category: coding cockpit plus model routing is the new IDE. Our edge is simplicity, health checks, safe credentials, and capability ownership rather than chasing every free preview model.
- **Timestamp:** 2026-05-21T04:06:00Z

## 2026-05-21 · Added sellable-system acceptance demo and disk readiness gate
- **Before:** Health checks proved core wiring, but there was no single developer-facing demo command showing the product promise end to end. Disk pressure was visible in the dashboard but not enforced by the acceptance layer.
- **Change:** Added `cc-system-demo`, `docs/PRODUCT-PACKAGING.md`, and `docs/DISK-READINESS-AUDIT-2026-05-21.md`. The demo checks lane registry, capability routes, router smoke, AI-SYSTEM status, VS Code symlinks, core CLIs, and disk headroom.
- **After:** The system now has a clean acceptance command. Current result is 8/9: everything passes except disk headroom, with 21GB available vs 25GB required.
- **Why:** 100% functional must mean "ready to operate under load," not only "configs parse." Disk pressure is now a first-class readiness gate instead of a buried dashboard warning.
- **Timestamp:** 2026-05-21T04:45:00Z

## 2026-05-21 · VS Code cockpit moved from engine-room labels to intent labels
- **Before:** VS Code tasks exposed internal routing terms like Router Code, Router Design, and Router Research. Useful, but too much engine room for a premium cockpit.
- **Change:** Renamed tasks to developer intent labels: `AI: Build / Fix`, `AI: Design / Browser`, `AI: Research / Extract`, `AI: Explain Route`, `AI: Browser Check`, and `AI: System Demo`. Added `docs/VS-CODE-COCKPIT.md`, updated keybindings, replayed `install.sh`, and verified task/keybinding references.
- **After:** Live VS Code now exposes the system as a small set of clear actions instead of a provider menu. Health remains clean except dirty dotfiles sync; acceptance remains 8/9 due disk headroom.
- **Why:** Product polish is not more tools. It is hiding internal complexity behind the right verbs while keeping direct escape hatches for Claude/Codex.
- **Timestamp:** 2026-05-21T05:03:00Z

## 2026-05-21 · Cursor study converted into cockpit actions
- **Before:** Cursor's advantage was unmodeled: native-feeling context, inline/planning modes, review flow, and background agents.
- **Change:** Added `docs/CURSOR-REFERENCE-STUDY-2026-05-21.md`, `cc-context-snapshot`, `cc-review-diff`, and VS Code tasks for `AI: Ask / Plan`, `AI: Review Diff`, `AI: Context Snapshot`, and `AI: Jobs`. Replayed `install.sh` and verified shell/JSON/keybinding health.
- **After:** Our VS Code cockpit now captures Cursor's useful product shape without adopting Cursor: intent modes, context visibility, diff review, and background job visibility. The remaining Cursor gap is a real sidebar/status UI and inline-edit parity through our router.
- **Why:** Cursor proves the UX bar. Our advantage is keeping that clarity while preserving our stronger routing, hard-floor review, TEL credential boundary, and rebuildable dotfiles.
- **Timestamp:** 2026-05-21T05:13:00Z

## 2026-05-21 · Cockpit status snapshot created as sidebar precursor
- **Before:** Status existed in several commands (`ai status`, router usage, lane registry, jobs), but the VS Code cockpit had no compact status surface comparable to an IDE sidebar.
- **Change:** Added `cc-cockpit-status` and made `AI: Status` use it, while preserving `AI: Full System Status` for the verbose dashboard. The snapshot shows readiness, disk gate, capability routes, VS Code link state, jobs, router usage, and core command presence.
- **After:** The cockpit has a fast readable status panel in task form. It currently reports the true blocker: disk headroom at 21GB free vs 25GB required.
- **Why:** This is the data surface a future VS Code sidebar would render. It gets most of Cursor's status/context clarity without building an extension yet.
- **Timestamp:** 2026-05-21T05:29:00Z
