# MAINTENANCE.md

Everything that maintains the platform — fully automated. **Zero manual
maintenance under normal operation.** When something needs attention,
your phone gets an ntfy push. Otherwise silent.

## The schedule

| When | What runs | Output |
|---|---|---|
| **Daily 04:30** | `cc-prune` — disk hygiene for ~/.claude/ | silent log; alerts if can't prune |
| **Daily 03:30** | `cc-backup` (restic → B2) | silent; alerts on failure |
| **Sunday 09:00** | `cc-health-weekly` — 11-point health sweep | ntfy ONLY if issues |
| **1st of month 06:00** | `cc-self-update` — brew + repos + docker + uv | ntfy summary always |
| **1st of Jan/Apr/Jul/Oct 03:00** | `cc-backup-verify` — restic check + restore-test | ntfy summary; HIGH PRIORITY on failure |
| **Continuous** | `cc-loop` watchdog (when running) | ntfy on Stop, mercury daemon auto-restart |

## What `cc-health-weekly` checks (11 points)

1. cc-prune LaunchAgent loaded
2. mempalace initialized at ~/mempalace
3. cc-loop runner installed
4. mercury daemon running
5. langfuse-web container alive
6. auto-browser containers alive
7. Tailscale authed + on tailnet
8. 1P CLI signed in
9. dotfiles in sync with origin/main
10. Disk usage < 85%
11. ~/.claude size < 5GB (cc-prune sanity check)

Silent if all 11 green. Phone push if any red, with detail.

## What `cc-self-update` updates

- `brew update && brew upgrade`
- `git pull --ff-only` for: `huashu-design`, `browser-harness`, `mercury-agent`, `ui-ux-pro-max-skill`, `langfuse`, `andrej-karpathy-skills`, `auto-browser`
- `docker compose pull && docker compose up -d` for: langfuse stack + auto-browser stack
- `uv tool upgrade --all` (mempalace, browser-use, gdown, etc.)
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

After `cc-bootstrap all` finishes the platform setup, install all
3 maintenance LaunchAgents:

```bash
for plist in cc-health-weekly cc-self-update cc-backup-verify; do
  cp ~/dotfiles/launchd/com.user.${plist}.plist ~/Library/LaunchAgents/
  launchctl load -w ~/Library/LaunchAgents/com.user.${plist}.plist
done
launchctl list | grep -E 'cc-(health|self-update|backup-verify)'
```

After install, **the platform maintains itself.** You only act when ntfy pushes a red alert.

## Verify each manually

```bash
cc-health-weekly --verbose       # immediate run, prints all 11 checks
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
| New Mac | `git clone github.com/Z5Jonathan-maker/dotfiles && ./install.sh && cc-bootstrap all` (~30 min) | when triggered |

## What rots if you ignore everything for 6 months

With these maintenance LaunchAgents loaded, **almost nothing**:
- ✓ Disk stays pruned (cc-prune daily)
- ✓ Backups continue (cc-backup daily) + verified quarterly
- ✓ Brew + cloned repos + docker images + uv tools all updated monthly
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
when you add a new MCP server worth tracking, or a new docker stack).

Last updated: 2026-04-30. 3 LaunchAgents (weekly health, monthly
update, quarterly backup verify) cover the platform end-to-end.
