# Repo audit — master report — 2026-07-20

Tri-model cross-verified audit of the ai-coding-os brain (`~/.claude` + `~/dotfiles/claude`) and 24
concurrent projects. Three independent model families ran the same read-only spec
(`repo-audit-spec-2026-07-20.md`): **Kimi K3**, **Codex (gpt-5.5)**, **Fable (Claude)**.

**Confidence legend:** ✅✅✅ = flagged by all 3 · ✅✅ = 2 models · ✅ = 1 model · 🔬 = I re-verified the
evidence myself. Fidelity was high: every one of the ~8 findings I spot-checked confirmed true.

Fixes below are **proposals** — nothing was changed. Money-code, secret rotation, and central-config
edits need your per-item go.

---

## CRITICAL — data-loss / security / live-money risk (fix first)

### C1 · Production DB has ZERO backups — nightly job never once succeeded  ✅🔬
`com.careclaims.eden-backup` (02:30 daily) exits 1 every night: `keychain item 'eden-mongo-url' not set`.
`~/Backups/eden-claims/` holds only a log + empty `launchd.err` — **not one dump since install (2026-06-10)**.
→ The ClaimPilot/Eden Atlas production DB is unbacked. **Fix:** `security add-generic-password -s eden-mongo-url -w <atlas-uri>`, then one manual run.

### C2 · Sole copy of a live production frontend is unversioned  ✅🔬
`~/code/projects/careclaims-crm-recovered/` — no `.git`, no remote; `RECOVERY-NOTES.md`: "NO GitHub repo —
cross-device local working copy." This is the only copy of the live `eden.careclaimsadjusting.com` frontend
(recovered from Vercel source maps). One disk failure = gone. **Fix:** `git init` + commit + push now.

### C3 · Trading forward-clock crashes every day  ✅✅✅🔬
`com.jonathan.mym-season-advance` (17:45 daily) dies exit 1: `KeyError: no entry_fn registered for family
'structure_bos'` at `engine/generator/signals.py:990`. One certified sleeve family with no entry_fn aborts
the whole book's forward advance (the "forward generator gap" memory, now actively crashing). Also logs a
STALE TAPE 'SI' warning (7d old). **Fix (money-code — your review):** register `structure_bos`'s entry_fn OR
make `advance_sleeve` skip-and-log unimplemented families instead of raising.

### C4 · Trading dead-man's switch has NEVER armed  ✅🔬
`service/heartbeat.py`: "Until that file exists this script no-ops quietly." `logs/heartbeat_url.txt` does
not exist → the 5-min healthchecks.io ping has never fired. **If this Mac dies, the live trading stack goes
down silently — no phone/email alert.** **Fix:** create a healthchecks.io check, write its URL to that file.

### C5 · Plaintext live secrets across 6 repos (incl. LIVE payment keys)  ✅✅✅
`dosecraft/apps/web/.env.production.local` — **Paddle LIVE API key + webhook secret**, Stripe, Cerebras/
Gemini/Groq/Meta/Sentry/NextAuth/Vercel; `cc-router/.env` — same Paddle LIVE key **duplicated**, n8n admin
pw, OpenAI; `stewardship-app/.env.local` (644, world-readable) — Plaid + Clerk + Stripe + encryption key;
`dosecraft-companion/.env.local` — Postgres pw + OpenAI + brain token; `~/.claude/.env` — 7 provider keys;
`aurex-bio/.env.local`. All gitignored but on-disk, sync via any backup. **Fix:** rotate the duplicated
Paddle live key; migrate to Keychain/1Password `op://` refs; `chmod 600` the 644 files.

---

## HIGH — broken lanes silently failing

### H1 · ClaimPilot claim ingestion dead 36 consecutive nights  ✅🔬
`com.careclaims.claim-scan` → 36× `409 No Google token` (Jun 14 → Jul 20). Zero claim emails ingested for
5+ weeks. **Fix:** reconnect Google/Gmail OAuth in ClaimPilot Settings, re-run once for HTTP 200.

### H2 · ClaimPilot accuracy eval scores 0/10 — backend AI creds unset  ✅
`com.careclaims.eve-accuracy` → every case `HTTP 500 "AI is not configured… set CLAUDE_CODE_OAUTH_TOKEN or
ANTHROPIC_API_KEY"` → `0/10` (indistinguishable from a real model regression). **Fix:** set the token in the
ClaimPilot backend env, re-run.

### H3 · Entire `bio.claude.*` maintenance/audit tier (13 jobs) designed but never installed  ✅🔬
`~/dotfiles/claude/launchd/` has 13 plists (audit-rotate, deploy-watch, mcp-probe, routing-drift, self-improve,
memory-health, skill-usage, task-reaper, session-digest, tel-refresh, …); **0 loaded.** This is the root cause
of ~15 orphaned scripts in `~/.claude/scripts/` (they're the never-scheduled targets). **Fix:** bootstrap the
13 plists into `~/Library/LaunchAgents`, or delete them + their orphaned scripts if the tier was abandoned.

### H4 · Three hooks exist but were never wired  ✅✅✅
`session-health.sh` (would surface drift/failures at session start — ironically the mechanism that'd have
caught all of the above), `environment-details.sh`, `ntfy-notify.sh` (phone push) are in `hooks/` but absent
from `settings.json`. (Note: `git-shadow-checkpoint.sh` IS wired indirectly via `cc-rollback` — Kimi's
correction to Fable/Codex.) **Fix:** wire the 3 into their events, or archive them.

### H5 · Three launchd plists corrupted to bare JSON arrays — unloadable since May 19  ✅✅🔬
`com.user.cc-loop`, `com.user.cc-health-weekly`, `com.cliproxy` are `[...]` arrays, not dicts (a `plutil
-convert json` accident in the 2026-05-19 cleanup). The cc-loop autonomous-loop lane is dead; CLAUDE.md still
documents it as live. **Fix:** rewrite as proper launchd XML dicts, or retire + update CLAUDE.md.

### H6 · Fidelity scorecard job SIGKILL'd; stale since Jul 17  ✅✅
`com.jonathan.mym-fidelity` last exit `-9`; `fidelity_scorecard.log` truncated mid-run Jul 17. The
"dashboards stay accurate" directive depends on it. **Fix:** run manually under `caffeinate` to observe the
kill (OOM/watchdog?), add a memory/time guard.

### H7 · `settings.local.json` runs in bypassPermissions with stale destructive-command whitelist  ✅
`defaultMode: bypassPermissions` + one-off `rm -f`, `git commit`, `perl -pi`, `mkdir -p` left whitelisted.
**Fix:** prune to durable read/tool permissions only.

### H8 · trade-truth reconciler fails every run on HTTP 429  ✅
`com.jonathan.trade-truth` exits 1 on `HTTP 429 Too Many Requests` (log fresh — current). **Fix:** add
backoff/jitter or treat 429 as skip-with-exit-0 if idempotent.

---

## MEDIUM (confirmed; abbreviated)

- **M1 commands split-brain** ✅✅ — 16 of 17 slash-commands live only in `~/.claude/commands/` (not dotfiles); a restore loses all but `mega-cycle`. Fix: move into dotfiles + symlink.
- **M2 deploy-watch dead since May 19** ✅ — aurex-bio stuck `drift` 2 months; its watcher is one of the uninstalled bio.claude plists (H3).
- **M3 chatgpt-bridge DOWN 2+ months** ✅ — image2code-site's Image-2.0 lane; keeper unwired, auto-heal stale.
- **M4 dosecraft-IG state points at evicted monorepo path** ✅ — bot moved to `dosecraft-instagram` (Jun 9); status writers still target the deleted path; no live health monitoring.
- **M5 cliproxy dead + dangerous stale pid** ✅✅ — not running since May 18; `cliproxy.pid` = 806 now aliases Apple's `familycircled` (a `kill $(cat pid)` would hit an unrelated process).
- **M6 monarch-money + crosstrade-oauth MCPs parked in needs-auth** ✅✅ — 40+ dead permission grants; re-auth or remove.
- **M7 open-design MCP routed but dead** ✅ — no daemon, not in `~/.claude.json`, repo frozen on a pre-cleanup branch.
- **M8 dirty / limbo repos** ✅✅✅ — mym-autotrader **117** uncommitted, aurex-bio 24, cc-router 6, us30-dashboard 7, area61 5; 9 repos idle 6+ wks; 4 dirs non-git (image2code [routed "primary"!], ai-system-v2-panel, scrapling-lab 1.0G, careclaims-crm-recovered=C2); 7 repos no remote.
- **M9 duplicate drift-checker** ✅ — `routing-drift-check.sh` == `check-routing-drift.sh` (byte-identical), different callers → silent fork on first edit.
- **M10 my own uncommitted seo-prune** ✅🔬 — this session's agent-prune left `~/dotfiles` dirty (`M CLAUDE.md`, `D seo-*.md ×11`) + 4 commits unpushed; a GitHub restore resurrects the 11 agents. Fix: `/sync`.
- **M11 substrate-consolidate log path split** ✅ — my consolidator: plist writes `.out/.err`, script writes `.log`. Fix: align.
- **M12 deferred-MCP roster / mcp-memory** ✅ — CLAUDE.md lists 9 deferred MCPs; `mcp-memory.jsonl` 0 bytes since May 12.

## LOW (confirmed; abbreviated)
- **L1** settings backups (6) + `.plist.bak` + 6 `*.plist.disabled` + **1,784 hook-state files** (1,710 stale `loop-*.log`) — no rotation ever ran (rotation IS one of the uninstalled bio.claude jobs, H3).
- **L2** `shadow-state.json` orphaned (no writer).
- **L3** malformed CLAUDE.md skill-routing row (`dotfiles/claude/CLAUDE.md:171` intent cell = literal `"|"`, a cc-skill-register escaping bug; image2code-site routed twice).
- **L4** kimi-webbridge skill dirs report version "unknown"/outdated vs extension 1.11.3.
- **L5** verify-funded-sunday [UNVERIFIED] no output since Jul 5 (may log nothing on write-free runs).

## Contradiction to resolve
- **Kimi WebBridge health:** Codex saw `running:false` (listening but unhealthy); Fable saw OK. Likely flapping. Quick `~/.kimi-webbridge/bin/kimi-webbridge status` at fix-time settles it.

---

## Per-category rollup
unwired: H3, H4, (root of orphaned scripts) · dormant/failing-job: C1, C3, H1, H2, H6, H8, M2 · dead-integration:
M3, M4, M5, M6, M7 · secret: C5 · split-brain: M1, M9 · config-drift: H7, M10, M11, M12, L1, L3 · half-finished:
C4 · orphaned: L2, (~15 scripts via H3) · limbo-project: C2, M8.

## Prioritized fix order
1. **Stop data loss (minutes):** C1 eden keychain uri · C2 `git init`+push careclaims-crm-recovered.
2. **Trading safety (your review — money-code):** C3 season-advance skip-unimplemented · C4 arm heartbeat.
3. **Secrets (rotate + migrate):** C5 — rotate the duplicated Paddle LIVE key first; `chmod 600` the 644 files; then Keychain-migrate.
4. **Revive dead lanes:** H1 Google OAuth · H2 backend token · H5 rewrite 3 plists · H6/H8 mym jobs.
5. **Wire-or-retire:** H3 bio.claude 13-tier (decide en masse) · H4 3 hooks · then the M/L hygiene sweep + M10 `/sync` my prune.

## RESOLVED 2026-07-21 (this session, user-approved batch)
- **C3 fixed + verified + COMMITTED** — `engine/forward/clock.py` + `health_monitor.py` skip-and-log unimplemented
  sleeve families instead of raising; dry-run `advanced=36 skipped=3`, no crash (the crash was freezing ALL 36
  sleeves). Regression test `test_unimplemented_family_is_skipped_not_failed` added; 10 clock tests green.
  Committed `e9f030ef` on `mym-playbook-and-bots` (local; not pushed — mym deploy flow is yours).
- **H3 done — bio.claude tier: 8 of 13 installed.** Bootstrapped + loaded: routing-drift, memory-health,
  mcp-probe, mcp-usage, audit-rotate, session-digest, self-improve, deploy-watch (each verified to run clean).
  NOT installed: skill-usage (fails under `set -euo pipefail` — needs debug) + 4 whose target binaries were never
  built (api-registry→cc-api-find, federation-health→cc-federation-health, task-reaper→cc-tasks, tel-refresh→
  refresh-walker.sh). audit-rotate being live now fixes the L1 cruft-rotation gap going forward.
- **H4 done** — session-health / environment-details / ntfy-notify wired into settings.json (all self-guard);
  committed + pushed.
- **H5 done** — 3 corrupted plists archived → `~/.claude/_archive/corrupted-plists-2026-07-20/`.
- **H7 done** — 8 stale destructive one-off allow-entries pruned from settings.local.json (backup `.bak-preprune`).
- **C5 partial** — `chmod 600` on the 3 world-readable `.env.local` files. (Rotation + Keychain migration still yours.)
- **M10 done** — seo-prune committed + pushed (`071460b`); GitHub restore can no longer resurrect the 11 agents.
- **M9 = false positive** — `routing-drift-check.sh` is already a symlink to `check-routing-drift.sh` (not a dup).
- Not touched (need your hands/decision): C1 eden keychain URI · C2 git-init careclaims-crm-recovered · C4
  heartbeat URL · C5 secret rotation · H1/H2 OAuth+backend creds · H3 bio.claude 13-tier decision · H6/H8/M-rest.

## Coverage gaps (not audited by any model)
Per-agent invocation counts from the 2.9GB session jsonls (so "routed-but-never-invoked" agents like `aaa-*`
stay unverified); TODO/FIXME inside project *source* trees (brain wiring scanned clean); `wiki/` content;
`tel/` policy YAMLs; Obsidian/brain-os vaults; live network/deploy verification (Vercel/Render/GHA); the 6
`.disabled` us30 plists' intent. A targeted deeper pass can cover these if wanted.
