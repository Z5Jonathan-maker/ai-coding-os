# Launchd Inventory

Every tracked LaunchAgent plist is classified here so public users can tell
which files are portable install surfaces and which are local operational
artifacts.

Classes:

- `rendered` — install through `cc-launchd-install`; never copy raw.
- `template` — explicit template or design reference; requires user-specific rendering before load.
- `local-only` — retained for this machine's operational history; not a public install contract.

| File | Class | Public install rule |
|---|---|---|
| `launchd/com.user.cc-backup-verify.plist` | rendered | Install with `cc-launchd-install cc-backup-verify`. |
| `launchd/com.user.cc-backup.plist` | rendered | Install with `cc-launchd-install cc-backup` after backup credentials exist. |
| `launchd/com.user.cc-health-weekly.plist` | rendered | Install with `cc-launchd-install cc-health-weekly`. |
| `launchd/com.user.cc-loop.plist` | template | Long-running autonomous loop; requires explicit operator approval and rendered local paths before load. |
| `launchd/com.user.cc-self-update.plist` | rendered | Install with `cc-launchd-install cc-self-update`. |
| `launchd/com.user.ecosystem-watchdog.plist` | local-only | Depends on a local `~/code/scripts/ecosystem-health.sh`; do not install from public clone. |
| `claude/launchd/bio.claude.api-registry-refresh.plist` | local-only | Legacy Claude-side maintenance job; not part of the public install contract. |
| `claude/launchd/bio.claude.audit-rotate.plist` | local-only | Legacy Claude-side maintenance job; not part of the public install contract. |
| `claude/launchd/bio.claude.deploy-watch.plist` | local-only | Legacy Claude-side deploy watcher; public path uses `cc-launchd-install` plus documented commands. |
| `claude/launchd/bio.claude.federation-health.plist` | local-only | Legacy Claude-side maintenance job; not part of the public install contract. |
| `claude/launchd/bio.claude.mcp-probe.plist` | local-only | Legacy Claude-side MCP probe; not part of the public install contract. |
| `claude/launchd/bio.claude.mcp-usage.plist` | local-only | Legacy Claude-side MCP usage tracker; not part of the public install contract. |
| `claude/launchd/bio.claude.memory-health.plist` | local-only | Legacy Claude-side memory health job; not part of the public install contract. |
| `claude/launchd/bio.claude.routing-drift.plist` | local-only | Legacy Claude-side routing drift job; not part of the public install contract. |
| `claude/launchd/bio.claude.self-improve.plist` | local-only | Legacy Claude-side digest job; not part of the public install contract. |
| `claude/launchd/bio.claude.session-digest.plist` | local-only | Legacy Claude-side session digest job; not part of the public install contract. |
| `claude/launchd/bio.claude.skill-usage.plist` | local-only | Legacy Claude-side skill usage tracker; not part of the public install contract. |
| `claude/launchd/bio.claude.task-reaper.plist` | local-only | Legacy task-reaper job; not part of the public install contract. |
| `claude/launchd/bio.claude.tel-refresh.plist` | local-only | Legacy TEL refresh job; not part of the public install contract. |

Public setup docs must point users at `cc-launchd-install`, not raw `cp`
commands. Raw plists may contain local paths by design; the renderer owns
substitution.
