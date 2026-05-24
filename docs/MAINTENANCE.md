# MAINTENANCE.md

Everything that maintains the platform — fully automated. **Zero manual
maintenance under normal operation.** When something needs attention,
your phone gets an ntfy push. Otherwise silent.

## The schedule

| When | What runs | Output |
|---|---|---|
| **Daily 03:30** | `cc-backup` (restic → B2) | silent; alerts on failure |
| **Sunday 09:00** | `cc-health-weekly` — weekly health sweep | ntfy ONLY if issues |
| **1st of month 06:00** | `cc-self-update` — brew + repos + uv + npm globals | ntfy summary always |
| **1st of Jan/Apr/Jul/Oct 03:00** | `cc-backup-verify` — restic check + restore-test | ntfy summary; HIGH PRIORITY on failure |
| **Continuous** | `cc-loop` watchdog (when running) | ntfy on Stop, mercury daemon auto-restart |

`cc-prune` is now manual disk hygiene only. It is not loaded as a
daily LaunchAgent.

## What `cc-health-weekly` checks

1. mempalace initialized at ~/mempalace
2. cc-loop runner installed
3. zsh startup is silent in automation and `TERM=dumb`
4. AI-SYSTEM-V2 dashboard operational
5. Router smoke tests return expected platforms
6. Lane registry structure is valid
7. Tailscale authed + on tailnet
8. dotfiles in sync with origin/main
9. npm-only global CLIs from `npm-global-packages.txt`
10. VS Code User config symlinked + `vscode/extensions.txt` installed
11. Active docs/scripts contain no retired global-system references
12. Every executable in `bin/` is classified in `docs/COMMAND-REGISTRY.md`
13. Runtime mirror symlinks under `~/dotfiles`, `~/.claude`, and `~/.Codex` resolve
14. No retired user LaunchAgents are loaded
15. Disk usage < 85%

It also warns if operational `~/.claude` size exceeds 5GB after
excluding the intentional `~/.claude/gh-archive` cache.

Silent if all green. Phone push if any red, with detail.

## What `cc-self-update` updates

- `brew update && brew upgrade`
- `git pull --ff-only` for: `huashu-design`, `browser-harness`, `mercury-agent`, `ui-ux-pro-max-skill`, `andrej-karpathy-skills`
- `uv tool upgrade --all` (mempalace, browser-use, gdown, etc.)
- `npm-global-packages.txt` via `install.sh` for npm-only global CLIs
- `vscode/extensions.txt` via `install.sh` for editor extensions
- `npm cache verify` (forces npx-cached MCP servers to re-resolve next call)

Each step is safe-fail; one failure doesn't abort the rest. Failures
land in the ntfy summary so you know what to investigate.

## What `cc-backup-verify` does

1. `restic check --read-data-subset=5%` — verifies 5% of B2 data is actually readable (catches silent bit-rot, missing chunks)
2. Restore the latest snapshot's `~/.zprofile` to a tmp dir
3. Compare restored vs current
4. ntfy summary; PRIORITY 5 alert if restore failed (untested backup = no backup)

Quarterly is the right cadence — restic checks are cheap, restore-tests catch real issues, untested backups are the #1 disaster pattern.

## Install (one-shot)

After `cc-bootstrap all` finishes the platform setup, install the
maintenance LaunchAgents:

```bash
cc-launchd-install cc-health-weekly cc-self-update cc-backup-verify
launchctl list | grep -E 'cc-(health|self-update|backup-verify)'
```

After install, **the platform maintains itself.** You only act when ntfy pushes a red alert.

Tracked LaunchAgent plists are classified in
[`docs/LAUNCHD-INVENTORY.md`](LAUNCHD-INVENTORY.md). Do not copy raw plists
unless that inventory explicitly marks them as templates for a local operator.

## Verify each manually

```bash
cc-health-weekly --verbose       # immediate run, prints current checks
cc-self-update --dry-run          # show what would update without doing it
cc-backup-verify --full           # full restic check (100% data) + restore-test
```

## What still requires you (rare, infrequent, mostly transient)

| Trigger | Action | Frequency |
|---|---|---|
| macOS major OS update (Sequoia → next) | TCC perms reset → re-grant Hammerspoon + Rectangle Accessibility via `cc-grant-access`; verify Tailscale + 1P + sudo askpass via `cc-bootstrap doctor` | yearly |
| Anthropic Claude Code 1.x → 2.x ships breaking change | Read release notes; verify hook signatures still valid; verify MCP protocol unchanged. `cc-bootstrap doctor` will catch most regressions. | quarterly |
| 1P macOS password rotated | Update the 1P "macOS" item so askpass keeps working | when triggered |
| Tailscale auth expired (rare) | Re-run `cc-tailscale-qr`, scan with phone | yearly |
| Want to add a new project to /maintain Tier-2 | Edit MIGRATION-DISCIPLINE.md + run /onboard then schedule the cloud Routine | per project |
| New Mac | `git clone github.com/Z5Jonathan-maker/ai-coding-os && ./install.sh && cc-bootstrap all` (~30 min) | when triggered |

## What rots if you ignore everything for 6 months

With these maintenance LaunchAgents loaded, **almost nothing**:
- ✓ Disk pressure is watched weekly; run `cc-prune` manually when needed
- ✓ Backups continue (cc-backup daily) + verified quarterly
- ✓ Brew + cloned repos + uv tools all updated monthly
- ✓ Health checked weekly — phone gets pushed if anything red
- ⚠ MCP server packages auto-resolve via npx, so they get updated on first call after a long pause (no manual action needed)
- ⚠ Anthropic ships breaking changes occasionally; cc-health-weekly will detect downstream failures, ntfy will tell you

**Net outcome of 6-month neglect with these agents loaded: you come back, run `cc-bootstrap doctor`, fix at most 1-2 transient items, total recovery time < 30 min.**

**Net outcome WITHOUT these agents: ~70% works, ~30% needs investigation, total recovery time ~1-2 hours.** This file is the diff between the two.

## Disable / pause maintenance

```bash
# Pause weekly health checks
launchctl unload ~/Library/LaunchAgents/com.user.cc-health-weekly.plist

# Pause monthly updates (e.g. before a critical project ship)
launchctl unload ~/Library/LaunchAgents/com.user.cc-self-update.plist

# Re-enable
launchctl load -w ~/Library/LaunchAgents/com.user.cc-health-weekly.plist
```

## Last updated

This file lives in `~/dotfiles/docs/MAINTENANCE.md`. Update when the
platform gains new components that need lifecycle management (e.g.
when you add a new MCP server worth tracking).

Last updated: 2026-05-20. 3 LaunchAgents (weekly health, monthly
update, quarterly backup verify) cover the platform end-to-end.
