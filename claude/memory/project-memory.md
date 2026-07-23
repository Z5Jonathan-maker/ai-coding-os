# Project Memory — active project state

Active state of in-flight work across projects. Updated by
`/skills/consolidate-memory` AND manually as the user pivots between
projects.

## Format

One section per active project. Each section: current focus, open threads, blockers.

## MYM autotrader (primary — updated 2026-07-23)

**Current focus:** CWAP confirmed-winner accumulation across ALL asset classes (new north star — prop playbooks wiped, rebuild from reproduced real receipts) + harmonic book gating + Goat funded playbook

**Open threads:**
- CWAP NORTH STAR (dominant): prop-firm playbooks WIPED; new books get invented from accumulated CWAP winners (real traders' receipts reproduced at ~100% parity). Do NOT maintain/fix/forward-test the old playbook/registry/fam_* families. Every cycle → accumulate + certify more winners; founder builds new books once enough accumulate. See [[project-mym-winner-catalogue-cwap]]
- GO WIDE, ALL ASSET CLASSES (founder, forceful): hunt EVERY tradable — metals/energy/livestock/grains/softs/crypto futures + every FX player with a futures counterpart. "A winner is a winner." Hunt EVERY winner type (high-winrate / low-DD / high-PF-low-volume / regime-only). See [[feedback-a-winner-is-a-winner-any-asset]]
- SOURCE-YIELD steers discovery: hunt Collective2 (41.7%) + Myfxbook (55.6%) for FUTURES winners, not the FX-dominated FXBlue crank (0.1% futures). Myfxbook + C2-behind-free-login receipt lanes scouted, NOT yet wired. C2 niche commodity desks search-barren (need logged-in crawl) — deprioritized
- C2-lane martingale/loss-averaging screen NOT built (e.g. 97%-win/R:R41.6/DD79.5% detonators must be excluded from real net)
- HARMONIC BOOK: 7 cells survive BH-FDR q=0.05 across 5 markets × 5 patterns (30m/1h). NEXT GATES: per-cell execution-robustness filter (drop 1-of-N-variant fragiles) + Sim101 forward-test. Sim101 ON HOLD. See [[project-harmonic-ym-verdict]]
- TRADE-JOURNAL BRAIN: FXBlue ~46k verified trades + 19 hypotheses; account-edge classifier CORRECTED tape-replay "no edge" — mine the 19 hypotheses. See [[project-mym-trade-journal-brain-layer]]
- 3 sleeve families still have no entry_fn (structure_bos, trend_HO, patterns_HG) — skip-logged, not crashing
- Goat funded playbook: pass eval → maximize funded until forced live; NO daily stop (founder call); Sprint terms: 35% consistency at payout, 5 winning days ≥0.2%, 90/10, ≤50%/request. Founder wants BEST playbook + fastest path to max withdrawals; Tradeify $9k eval target still to pass; founder to supply the 2 Goat live logins
- Everything ships into the Vault/command center — NO separate dashboards; logo still needs redo
- MYM Capital University = founder top priority ("amnesia test" + "7-year-old test")

**Recently shipped (last 24hr):**
- CWAP pipeline matured: fx_pnl parity engine (FXBlue receipts corr 0.997), winner_pipeline stage bucketer, catalogue_export, adopt_specs→docs/data/PLAYBOOKS.md, continuous discovery-crank launchd (FXBlue every 90s), MQL5 + Collective2 harvesters, jina-proxy 2nd C2 lane (different egress IP beats rate-limit), index_funnel (index→micro futures, R² ~1.0), cwap_intel source-yield self-direction
- Calibration discipline hardened (receipts-as-ground-truth): 20-trade floor→parity-min 6; martingale flag ≤-0.3 not -0.05 (was eating ~40 winners incl BTC +$445k/Copper +$380k); lifetime-OR-recent net selection
- K3 efficiency audit (audits/k3-efficiency-audit-2026-07-22.md) + zero-risk fixes: per-cycle state index (stop re-parsing 19MB jsonl/cycle), placebo multicore behind bit-identical parity harness. Earlier K3 wiring audit (22KB)
- forward_outcomes.py + label_outcomes.py closed-loop self-learning (deploy→measure) committed
- Harmonic-family FDR book proven; Strategy Lab UI + MTF harmonics feed + launchd; trade-journal brain layer; CI/Vault DARK→GREEN (16 mypy fixed, pandas<3.0.0, ~48 CI failures/4 root causes); C3 forward-clock COMMITTED (d752a667); 3 trend-continuation leads DEMO-deployed (28fefd53)
- Hunter lanes steady-state ~285 sessions/24h (213 YT extractors, 47 forensics, 23 crosstrade readers)

## Brain-OS (new — updated 2026-07-21)

**What it is:** ~/brain-os — the quant-hedge-fund-style research brain (founder: "most powerful quant/trading/prop-firm brain"). Source of truth: ~/brain-os/HANDOFF.md + TAXONOMY.md. brain MCP (brain_emit/get/query/stats) live in sessions.

**Open threads:**
- YM-only scope; YM = founder's most profitable market, gets first director attention; ingest max YM content, no prejudice from prior failures
- Verdict locked: stop mining YM for a robot — build the decision-support twin (analogue_engine, 281k state vectors) for the discretionary edge
- Discretionary trade logging → forward-testing journal → daily winners/losers study (autopilot wanted)
- Level-strength surfacing on the dashboard/app
- Retrieval ceiling: bge-small hard-tier R@1 14% (43% w/ HyDE) — stronger embeddings = the deeper lever; re-run brain eval after any index change

**Recently shipped (last 24hr):**
- Ledger ~11,960 events chain_ok; self-correcting loop proven end-to-end (vet caught its own RangePlay false positive via the falsified-memory match)
- YM engines (qf_state_machine, qf_relevance+OOS, level_reactivity honest-fill kill, analogue_engine); knowledge graph 1,293 edges; 19-brain taxonomy + coverage map; options/GEX brain pattern established

## Ops / AI-OS infrastructure (updated 2026-07-22)

**Current focus:** post-audit runbook (report: ~/.claude/audits/repo-audit-2026-07-20.md, auto-memory: project-repo-audit-2026-07-20) + device disk pressure

**Open threads:**
- DEVICE DISK: iMac hit 99% (freed ~9.3GB → 94% via safe caches); durable fix = Photos→iCloud "Optimize Mac Storage" toggle, handed to founder (VS Code lacks Accessibility perm, grant needs relaunch = session end). Founder growing data indefinitely → external storage is the real answer. See [[project-device-disk-constraint]]
- Bearer→Keychain migration STILL not landed — founder handed it to K3, but 4 plaintext Authorization headers remain in ~/.claude.json + token-env LaunchAgent ABSENT; watcher ready: ~/.claude/scripts/migrate-bearers-watcher.sh; verify project-scoped MCPs (crosstrade-oauth, obsidian) from INSIDE mym-autotrader dir
- eden-backup failing nightly since Jun 10 — ZERO prod DB dumps; needs keychain URI
- CareClaims frontend sole copy still unversioned (C2) — git init pending founder word
- bio.claude.* 13-job maintenance tier (H3): install or retire — root cause of the 2-month rot
- Secret rotation from audit findings (plaintext password in dosecraft doc + file-history leak)

**Recently shipped (last 24hr):**
- Tri-model audit complete + fixes: 4 orphan hooks wired (session-health now surfaces drift at session start), corrupted plists archived, 8 stale destructive perms pruned, secrets chmod 600, seo-prune pushed (071460b)

## UniFi / stewardship-app (active — updated 2026-07-19)

**Current focus:** post-parity gap = real data, not pixels

**Open threads:**
- #1 gap: real money in the pipes — app is a certified demo on a data seam (lib/data/selectors.ts), Monarch/SoFi are living systems
- Brand: B– — two palettes in one brand (logo vs product); palette unification started
- Monarch/SoFi token JSONs committed on rename/unifi, NOT pushed

**Recently shipped (last 24hr):**
- Monarch craft-parity certified 95, live on uunifi.com (5439029)
- Mock-data migration to real data seam (3527166, 181/181 tests)
- 30-day-trial experiment reverted to 7-day everywhere (founder call)
- Name decision: UniFi stays; uunifi.com = quick-buy domain

## Aurex (stale — last updated 2026-05-04)

**Current focus:** Production-readiness audit + UI/UX /loop refinement

**Open threads:**
- Cart/checkout pages need `export const dynamic = 'force-dynamic'` (audit P7)
- No idempotency on order creation — race on double-click can create 2 orders
- No CSP header in vercel.json
- NMI rail still not wired to /checkout
- 500KB chunk persists (likely Recharts on first-paint)
- products.ts MOTS-c molecular formula needs reconciliation against PubChem
- IMAGE-GEN-SPEC.md lists 7 phantom SKUs

**Recently shipped (last 24hr):**
- WebP conversion of marketing PNGs (-58MB / -94%)
- 14 PDP marketing heroes wired (gpt-image-2)
- 2 section parallax bgs (EvidenceBanner, HomeStackTeaser)
- MagneticCTA primitive + useMagnetic hook + 5 CTAs wired
- ScrollTrigger registered globally + bridged to Lenis
- Stagger reveals on 4 grid surfaces
- Blur placeholder on PDP hero
- Focus-visible audit (CommandPalette + ReviewSubmitForm fixed)
- KLOW/GLOW research-data corrected (was sema/cagri lie)
- 11 sites of KLOW/GLOW miscategorization purged

## Brain / dotfiles (stale — last updated 2026-05-04)

**Current focus:** Roman Knox memory patterns adoption + audit-skill content extension

**Open threads:**
- consolidate-memory skill needs nightly cron schedule
- research-scout skill needs API budget approval before scheduling
- Wiki should pull in Roman Knox PDF references for posterity (done — wiki/learnings/external-references/claude-body-liam-haley-2026-04-26.md and forthcoming roman-knox-2026-05-04.md)

## Mega-brains (stale — last updated 2026-05-04)

**Current focus:** corpus assembly for cross-session recall

**State:**
- 8 mentor brains (843 → ~2,160 videos after auto-CC expansion)
- peptide-research: 140 → ~400 docs / 4.3M words
- karpathy: 10 articles + YouTube ingest pending
- mempalace mining of new content in flight (PID 49040 may still be running)
