---
name: project-repo-audit-2026-07-20
description: Tri-model repo audit (Kimi K3 + Codex GPT + Fable Claude) of the ai-coding-os brain + 24 projects — master report + the confirmed critical findings
metadata: 
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-21T09:50:40.304Z
---

Tri-model cross-verified read-only audit run 2026-07-20 (Kimi K3, Codex gpt-5.5, Fable Claude, same spec). Master report: `~/.claude/audits/repo-audit-2026-07-20.md`; spec: `~/.claude/audits/repo-audit-spec-2026-07-20.md`. High fidelity — every one of ~8 spot-checks I re-verified held. Method: prompt-master crafted one self-contained spec; 3 model families audited independently; findings deduped + cross-verified (≥2 = confirmed); I re-verified the critical single-model ones.

**CONFIRMED CRITICALS (verified, fixes NOT yet executed — user-gated):**
- C1 Production DB unbacked — `com.careclaims.eden-backup` fails nightly (`keychain 'eden-mongo-url' not set`); ZERO dumps exist. Fix: `security add-generic-password -s eden-mongo-url -w <uri>`.
- C2 `careclaims-crm-recovered` = SOLE copy of the live eden.careclaimsadjusting.com frontend, no git/remote. Fix: git init+push.
- C3 Trading forward-clock crashes daily — `mym-season-advance` KeyError `structure_bos` (no entry_fn) at signals.py:990. Money-code fix: skip-unimplemented or register entry_fn.
- C4 Trading dead-man's switch never armed — `heartbeat.py` no-ops (no `logs/heartbeat_url.txt`); Mac death = silent. Fix: create healthchecks.io check + write URL.
- C5 Plaintext live secrets across 6 repos incl. LIVE Paddle key DUPLICATED (dosecraft web .env.production.local + cc-router/.env), Stripe/Plaid/Clerk/DB pw; some 644 world-readable. Rotate Paddle + migrate to Keychain.

**HIGH:** claim-scan dead 36 nights (Google OAuth expired, 0 claims 5wk); eve-accuracy 0/10 (backend AI creds unset); **entire `bio.claude.*` 13-plist maintenance tier never installed** (root cause of ~15 orphaned scripts); 3 unwired hooks (session-health/environment-details/ntfy-notify); 3 corrupted plists (cc-loop/cc-health/cliproxy = bare arrays); mym-fidelity SIGKILL'd; settings.local bypassPermissions + stale destructive whitelist; trade-truth 429.

**MED/LOW:** commands split-brain (16/17 not in dotfiles); deploy-watch dead since May; chatgpt-bridge down 2mo; dosecraft-IG stale paths; cliproxy pid aliases Apple daemon; monarch/oauth MCPs need re-auth; dirty repos (mym-autotrader 117); my own seo-prune left dotfiles unpushed; 1784 stale hook-state files; malformed CLAUDE.md:171 row. NOTE the bio.claude tier explains the orphaned scripts + missing rotation. (M9 "duplicate drift-checker" = FALSE POSITIVE — already symlinked.) Coverage gaps: agent-invocation jsonl mining, project-source TODOs, wiki/tel content.

**RESOLVED 2026-07-21 (user-approved batch):** C3 fixed+verified+COMMITTED (`e9f030ef` on mym-playbook-and-bots, local; clock.py + health_monitor.py skip-and-log unimplemented families + regression test; forward clock advances 36/skips 3 — was freezing ALL 36); H3 bio.claude tier 8/13 installed (routing-drift, memory-health, mcp-probe, mcp-usage, audit-rotate, session-digest, self-improve, deploy-watch — audit-rotate now fixes L1 cruft-rotation; SKIPPED: skill-usage fails set-e + 4 whose target binaries never existed = cc-api-find/cc-federation-health/cc-tasks/refresh-walker.sh); H4 (3 hooks wired, committed+pushed); H5 (3 corrupted plists archived); H7 (8 stale destructive perms pruned); C5-partial (chmod 600 the 3 .env.local); M10 (seo-prune committed+pushed `071460b`). STILL YOUR HANDS: C1 eden-mongo-url keychain, C2 git-init careclaims-crm-recovered, C4 heartbeat healthchecks URL, C5 secret rotation (dup Paddle key), H1 Google OAuth, H2 backend token.
