# COMMAND-REGISTRY.md

Every executable in `~/dotfiles/bin` must be listed here. This is the
PATH hygiene contract: if a command is useful, classify it; if it is not
useful, delete it or move it out of `bin/`.

## Primary interface

- `cc-ask` — direct router wrapper for one-shot model calls.
- `cc-ai-checks` — run source-controlled AI checks from `.ai/checks/`.
- `cc-browse` — autonomous browser-use lane with persistent profile.
- `cc-image` — image client wrapper through the router project.
- `cc-lane` — inspect the AI lane registry, capability fallback chain, and lane support/unsupported contracts.
- `cc-loop` — unattended Claude runner.
- `cc-pause` — pause `cc-loop`.
- `cc-permission-matrix` — visible autonomy boundaries for cockpit approvals.
- `cc-plan` — save a read-only implementation plan artifact in `.ai/plans/`.
- `cc-product-readiness` — paid-product readiness gate for cockpit, router, sync, and packaging.
- `cc-pr-quality-score` — maintainer-style patch quality scorer for third-party/public repo dogfood work.
- `cc-public-repo-dogfood` — fresh public-clone mutating proof with failing test, runtime repair, Mission Events, review evidence, local commit, and public CI gate.
- `cc-public-ci-check` — portable repo validation for GitHub Actions and external contributors.
- `cc-release-artifact-check` — build and verify the release tarball, checksum, VSIX, evaluator docs, manifest, and launch media from the current clone.
- `cc-release-bundle` — build a distributable release tarball with VSIX, docs, media, manifest, and checksum.
- `cc-release-manifest` — generate release artifact inventory with SHA-256 checksums.
- `cc-release-check` — one-command release gate: first-run, readiness, demos, health, package, bundle, media, and clean/synced git.
- `cc-resume` — resume `cc-loop`.
- `cc-status` — inspect `cc-loop` state.
- `deepseek` — DeepSeek CLI wrapper.
- `shannon` — local Shannon security CLI symlink.

## System health and maintenance

- `cc-backup` — restic backup of operational state.
- `cc-backup-verify` — quarterly restore verification.
- `cc-benchmark-run` — score one benchmark fixture, including broken-first repair fixtures with expected patches.
- `cc-benchmark-fixtures` — run tiny public benchmark fixtures for route expectation, npm test, repo-map, and diff-surface regression proof.
- `cc-bootstrap` — one-shot platform bootstrapper.
- `cc-browser-proof` — Kimi WebBridge readiness plus bounded browser proof output; `--json` returns nonce boundaries, origin, truncation metadata, and proof content.
- `cc-browser-replay-check` — validates credential-free authenticated browser replay fixtures.
- `cc-browser-replay-live-check` — prepared-machine live WebBridge replay readiness gate with nonce proof and safe skip on public machines.
- `cc-browser-visual-proof` — public-clone-safe browser/UI visual contract gate for DOM/layout assertions and bounded browser-proof packet schema.
- `cc-checkpoints` — read-only checkpoint timeline for shadow Git and session handoffs.
- `cc-cockpit-status` — concise AI cockpit status snapshot.
- `cc-cockpit-capture` — deterministic launch screenshot/GIF capture for cockpit media.
- `cc-cockpit-interaction-proof` — headless browser proof for cockpit keyboard submit, empty/loading/blocked states, permissions, route diagnostics, and visual-regression metadata.
- `cc-cockpit-replay-bundle-check` — validates cockpit real-use replay bundle across state screenshots and interaction assertions.
- `cc-cockpit-state-proof` — deterministic cockpit state screenshots for continuation, running, success, blocked, permissions, and route receipt.
- `cc-cockpit-visual-diff` — cockpit screenshot visual-regression gate with decoded PNG pixel samples, perceptual hash, luma scoring, and diagnostic file-hash/byte drift.
- `cc-cockpit-webview-smoke` — static webview/package smoke gate for cockpit continuation UI, result stream, assets, startup-safe activation, and npm audit.
- `cc-context-meter` — context-window pressure, diff size, output reserve, available-token estimate; supports `--json`.
- `cc-context-snapshot` — current repo context packet for routing/debugging; `--json` exposes named context providers and ignored sources.
- `cc-creative-kernel-check` — verifies the Creative Direction Kernel, cognitive design routes, design DNA fields, and taste validation scores.
- `cc-deploy-watch` — production drift checker.
- `cc-deploy-watch-cron` — launchd wrapper for deploy drift alerts.
- `cc-demo-five-minute` — public evaluator demo: readiness, workflow proof, browser proof, and cockpit packaging.
- `cc-demo-fixture` — run workflow proof against a temporary public fixture repo with tests and an intentional diff.
- `cc-demo-quick` — 90-second human-facing proof: routing, public workflow, benchmarks, cockpit smoke, trust gate, and mission continuity.
- `cc-dogfood-day` — non-mutating developer-day proof across routing, workflow proof, context, diff, browser, package, and cockpit mission tests.
- `cc-dogfood-session` — timed multi-cycle dogfood runner for sustained developer-session proof with Mission Kernel runs, event validation, logs, and final product gates.
- `cc-disk-readiness` — read-only disk gate and cleanup candidate report.
- `cc-diff-hunks` — changed-file stats, hunk list, and patch preview for cockpit review; supports `--json`.
- `cc-evaluator-check` — external evaluator check for fresh clones and public review.
- `cc-feedback-law-check` — executable gate for Mega Cycle feedback laws, autonomy preflight, depth-check, evolve, and packaging exposure.
- `cc-first-run` — non-mutating public setup doctor for required, optional, and personal prerequisites.
- `cc-fresh-clone-check` — fresh public clone gate: temp clone, temp home, dry-run install, cockpit package, fixture demo, and no temp-home writes.
- `cc-health-weekly` — weekly health sweep.
- `cc-kimi-status` — Kimi Desktop, CLI, WebBridge, and VS Code extension status.
- `cc-kimi-webbridge-shim` — local fallback WebBridge extension client for remote setup.
- `cc-lane-registry-check` — structural validation for `ai-lanes.json`.
- `cc-lane-extension-check` — public lane-extension guide and valid/invalid registry fixture gate.
- `cc-launchd-install` — render and install LaunchAgents with the current user's home path.
- `cc-launchd-inventory` — classify tracked LaunchAgents as rendered, template, or local-only.
- `cc-loop-quality` — autonomous loop depth, memory, and anti-pattern status.
- `cc-agent-runtime` — thin mission runtime adapter that turns a typed `AgentRunInput` into Mission Kernel route, trust, cost, proof, result, and timeline artifacts.
- `cc-mission-events` — validate normalized Mission Kernel timeline events and complete runtime run stages.
- `cc-mission-kernel` — create, list, read, and validate mission artifact bundles (`mission.json`, route receipt, trust decision, cost ledger, proof bundle, agent timeline).
- `cc-mission-ledger` — append-only current-mission and Plan/Act/Checkpoint/Resume event ledger for cockpit continuation state; supports `record`, `event`, `list --json`, and `--check`.
- `cc-mutating-dogfood` — isolated mutating coding-session proof with failing tests, real edits, recovery, review evidence, Mission Events, and commits.
- `cc-native-app-status` — installed native AI app versions and role map.
- `cc-package-cockpit` — validate and package the native VS Code cockpit as a VSIX.
- `cc-portability-check` — package separability gate for clone-root command defaults, public path hygiene, and classified maintainer-home assumptions.
- `cc-provider-capacity` — live provider capacity check across Claude, Codex, Kimi, and DeepSeek; separates installed/healthy from quota-exhausted/degraded.
- `cc-pulse-status` — Pulse code-density protocol source, skill, and fit status.
- `cc-prune` — manual disk hygiene for `.claude`.
- `cc-review-diff` — precision-lane review of current git diff.
- `cc-repo-map` — Aider-inspired ranked repo map with entrypoints, changed files, symbols, scores, and `--json` output.
- `cc-repo-index` — compact workspace index for cockpit context and repo inspection.
- `cc-router-receipt` — latest router decision, fallback, quota, token receipt.
- `cc-router-degradation-check` — degraded-provider replay fixture plus live dry-run fallback-chain shape check.
- `cc-router-metrics` — router usage, fallback, failure, token, and session metrics.
- `cc-router-smoke` — deterministic dry-run checks for expected model/platform routing.
- `cc-self-update` — monthly platform update sweep.
- `cc-semantic-index` — dependency-free repo symbol map using `ctags` and `rg`.
- `cc-session-ledger` — recent routed sessions, cwd-aware resume metadata, stale state, lanes, models, fallbacks, sticky state, and transcript turn summaries; supports `--json`.
- `cc-superiority-check` — competitive proof gate for the superiority matrix, reference systems, required proof commands, and graded benchmark depth.
- `cc-system-demo` — acceptance demo for the AI coding operating system.
- `cc-tailscale-qr` — phone-assisted Tailscale auth.
- `cc-ten-readiness` — strict 10/10 readiness gate for public CI, evaluator, dogfood, product, release, docs portability, and launch contract.
- `cc-token-ledger` — read-only router economics ledger: calls, token estimates, costs, fallbacks, and premium-spend avoidance.
- `cc-third-party-dogfood` — external public-repo mutating proof with pinned upstream source, failing test, runtime repair, Mission Events, review evidence, local commit, and third-party test gate.
- `cc-trust-profile` — validate and print the repo-local `.ai/trust.json` workspace autonomy policy.
- `cc-trust-gate` — enforce `.ai/trust.json` plus AI-SYSTEM-V2 permission policy before cockpit routing.
- `cc-verify-product` — single external-facing product proof: first-run, source checks, fixtures, cockpit smoke, package, demo, and fresh clone.
- `cc-workflow-proof` — one-command route/readiness/repo-index/repo-map/diff proof packet; set `CC_WORKFLOW_PROOF_SKIP_READINESS=1` for portable fixture checks.
- `code-stable` — launch VS Code through the verified `--disable-gpu` renderer-crash recovery path.

## Claude/Codex workflow helpers

- `cc-handoff` — read latest session handoff artifact.
- `cc-phase` — read ambient autonomous-loop phase.
- `cc-push-gate` — pre-push smoke gate for autonomous repos.
- `cc-reflect` — queue structured wiki reflections.
- `cc-rollback` — inspect/restore git shadow checkpoints.
- `cc-skill-register` — register skills, CLIs, and agents in routing tables.
- `cc-swarm` — spawn local multi-worktree Claude swarms.
- `sync-dotfiles` — stage, commit, and push dotfiles.

## Browser, auth, and local app helpers

- `cc-browse-mcp` — browser-use MCP stdio shim.
- `cc-grant-access` — guide macOS Accessibility permission setup.
- `cc-new-editorial` — scaffold editorial site projects.
- `cc-sudoers-install` — assisted sudoers install flow.
- `gh-auto-auth` — GitHub device-code auth automation.
- `gh-mail-code` — GitHub-specific Mail.app code reader.
- `gh-playwright-login` — one-time GitHub Playwright profile login.
- `mail-code` — Mail.app OTP reader.
- `onboard` — local GUI first-run helper.
- `op-token` — fetch token fields from 1Password.
- `sudo` — askpass-aware sudo wrapper.
- `sudo-askpass` — universal sudo askpass helper.

## Vendor utility

- `fzf-git.sh` — vendored fzf Git helper from junegunn.

## Retired

These commands are intentionally absent from `bin/` and should not come
back without a new registry entry and routing-table update:

- `cc-health`
- `cc-loop-v2`
- `cc-loop-v3`
- `cc-mercury`
- `openai`
- `perplexity`
