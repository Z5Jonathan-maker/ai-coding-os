# COMMAND-REGISTRY.md

Every executable in `~/dotfiles/bin` must be listed here. This is the
PATH hygiene contract: if a command is useful, classify it; if it is not
useful, delete it or move it out of `bin/`.

## Primary interface

- `cc-ask` — direct router wrapper for one-shot model calls.
- `cc-browse` — autonomous browser-use lane with persistent profile.
- `cc-image` — image client wrapper through the router project.
- `cc-lane` — inspect the AI lane registry and capability fallback chain.
- `cc-loop` — unattended Claude runner.
- `cc-pause` — pause `cc-loop`.
- `cc-permission-matrix` — visible autonomy boundaries for cockpit approvals.
- `cc-plan` — save a read-only implementation plan artifact in `.ai/plans/`.
- `cc-product-readiness` — paid-product readiness gate for cockpit, router, sync, and packaging.
- `cc-public-ci-check` — portable repo validation for GitHub Actions and external contributors.
- `cc-release-bundle` — build a distributable release tarball with VSIX, docs, media, manifest, and checksum.
- `cc-release-manifest` — generate release artifact inventory with SHA-256 checksums.
- `cc-release-check` — one-command release gate: first-run, readiness, demo, health, package, bundle, media, and clean/synced git.
- `cc-resume` — resume `cc-loop`.
- `cc-status` — inspect `cc-loop` state.
- `deepseek` — DeepSeek CLI wrapper.
- `shannon` — local Shannon security CLI symlink.

## System health and maintenance

- `cc-backup` — restic backup of operational state.
- `cc-backup-verify` — quarterly restore verification.
- `cc-bootstrap` — one-shot platform bootstrapper.
- `cc-browser-proof` — Kimi WebBridge readiness plus bounded browser proof output; `--json` returns nonce boundaries, origin, truncation metadata, and proof content.
- `cc-checkpoints` — read-only checkpoint timeline for shadow Git and session handoffs.
- `cc-cockpit-status` — concise AI cockpit status snapshot.
- `cc-cockpit-capture` — deterministic launch screenshot/GIF capture for cockpit media.
- `cc-context-meter` — context-window pressure, diff size, output reserve, available-token estimate; supports `--json`.
- `cc-context-snapshot` — current repo context packet for routing/debugging; `--json` exposes named context providers and ignored sources.
- `cc-deploy-watch` — production drift checker.
- `cc-deploy-watch-cron` — launchd wrapper for deploy drift alerts.
- `cc-demo-five-minute` — public evaluator demo: readiness, workflow proof, browser proof, and cockpit packaging.
- `cc-demo-fixture` — run workflow proof against a temporary public fixture repo with tests and an intentional diff.
- `cc-disk-readiness` — read-only disk gate and cleanup candidate report.
- `cc-diff-hunks` — changed-file stats, hunk list, and patch preview for cockpit review; supports `--json`.
- `cc-evaluator-check` — external evaluator check for fresh clones and public review.
- `cc-first-run` — non-mutating public setup doctor for required, optional, and personal prerequisites.
- `cc-health-weekly` — weekly health sweep.
- `cc-kimi-status` — Kimi Desktop, CLI, WebBridge, and VS Code extension status.
- `cc-kimi-webbridge-shim` — local fallback WebBridge extension client for remote setup.
- `cc-lane-registry-check` — structural validation for `ai-lanes.json`.
- `cc-loop-quality` — autonomous loop depth, memory, and anti-pattern status.
- `cc-native-app-status` — installed native AI app versions and role map.
- `cc-package-cockpit` — validate and package the native VS Code cockpit as a VSIX.
- `cc-pulse-status` — Pulse code-density protocol source, skill, and fit status.
- `cc-prune` — manual disk hygiene for `.claude`.
- `cc-review-diff` — precision-lane review of current git diff.
- `cc-repo-map` — Aider-inspired ranked repo map with entrypoints, changed files, symbols, scores, and `--json` output.
- `cc-repo-index` — compact workspace index for cockpit context and repo inspection.
- `cc-router-receipt` — latest router decision, fallback, quota, token receipt.
- `cc-router-metrics` — router usage, fallback, failure, token, and session metrics.
- `cc-router-smoke` — deterministic dry-run checks for expected model/platform routing.
- `cc-self-update` — monthly platform update sweep.
- `cc-semantic-index` — dependency-free repo symbol map using `ctags` and `rg`.
- `cc-session-ledger` — recent routed sessions, cwd-aware resume metadata, stale state, lanes, models, fallbacks, sticky state, and transcript turn summaries; supports `--json`.
- `cc-system-demo` — acceptance demo for the AI coding operating system.
- `cc-tailscale-qr` — phone-assisted Tailscale auth.
- `cc-workflow-proof` — one-command route/readiness/repo-index/repo-map/diff proof packet.

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
