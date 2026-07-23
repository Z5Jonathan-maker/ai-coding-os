# Repo audit spec — 2026-07-20 (read-only, tri-model cross-verify)

ROLE: Senior systems + infrastructure auditor. You audit a personal "AI coding OS" brain
(skills/agents/hooks/scripts/scheduled-jobs) + its 24 concurrent project repos. Find what is
broken, half-wired, dormant, orphaned, duplicated, drifted, or swept under the rug — with evidence.

SCOPE (read, priority order):
- ~/.claude/  — brain: settings.json + settings.local.json (hook wiring), hooks/ scripts/ agents/
  skills/ commands/ wiki/ memory/ state/ logs/ tel/, and stray backup/state cruft
  (settings.json.bak*, *.backup.*, cc-loop.state, shadow-state.json, scheduled_tasks.lock, *.log).
- ~/dotfiles/claude/ — dotfiles source (symlink target for much of ~/.claude); CLAUDE.md = routing truth.
- ~/Library/LaunchAgents/{com.jonathan,com.area61,bio.tel}*.plist — ~51 scheduled jobs.
- ~/code/projects/* — 24 repos (mym-autotrader, dosecraft*, ClaimPilot, aurex-bio, area61-command-center,
  careclaims*, harvest-culture, us30-dashboard, image2code, cc-router, …).

HUNT (every finding needs file:line OR command-output evidence):
1 UNWIRED — script/hook/agent/skill exists on disk but nothing references/invokes it. Esp: hooks in
  hooks/ NOT in settings.json; scripts no launchd/hook/skill calls.
2 DORMANT/FAILING JOBS — launchd jobs with non-zero last exit (`launchctl list` status col), or whose
  log hasn't updated in weeks, or whose target script errors. Verify each plist's target exists.
3 ORPHANED/DEAD — agents/skills routed in CLAUDE.md but invoked 0× (usage jsonls); 0-byte state; broken symlinks.
4 SPLIT-BRAIN/DUP — two stores that should be one + disagree; duplicated state; which is authoritative vs stale.
5 CONFIG DRIFT — settings.json vs .local vs backups; CLAUDE.md routing vs disk; ~/.claude.json / .mcp.json vs reality.
6 PLAINTEXT SECRETS — Bearer/sk-/api_key/password/OAuth/token in any config. Report file:line + type ONLY, never the value.
7 HALF-FINISHED — TODO/FIXME/HACK/XXX/WIP, NotImplementedError, stubs, "coming soon", commented-out wiring, plan-but-no-impl.
8 DEAD INTEGRATIONS — MCP configured but not connecting; bridges/daemons referenced but not running; creds expired/missing; paths moved.
9 LIMBO PROJECTS — repos with no recent commits + unclear status (deployed? abandoned? WIP?).

METHOD (real read-only commands): `launchctl list | grep -E 'jonathan|area61|bio'` then inspect each plist+log;
cross-ref each hooks/ file against settings.json; `grep -rIE 'TODO|FIXME|HACK|NotImplementedError|coming soon'` (bounded,
skip node_modules/.venv/.git); `find -L … -type l` for broken symlinks; stale-file mtime; secret scan
`grep -rIE '(Bearer |sk-|api[_-]?key|password|OAuth|token).{0,4}[:=]'` → file:line + type only.

HARD CONSTRAINTS:
- READ-ONLY. Do NOT modify/create/delete/move/write ANY file (except stdout findings). No git writes, no
  launchctl load/unload, no rm/mv, no installs, no state-mutating network calls.
- NEVER print a secret value — location + type only.
- Evidence-based: every finding cites file:line or command+output. Unverifiable → mark [UNVERIFIED]. No padding.

OUTPUT (exactly this, nothing else) — findings, most-severe first:
### [CRITICAL|HIGH|MEDIUM|LOW] <title>
- category: unwired|dormant-job|orphaned|split-brain|config-drift|secret|half-finished|dead-integration|limbo-project
- evidence: <file:line OR command + output snippet>
- supposed-to-be: <intended/expected>
- actual: <reality>
- fix: <one specific action>
End with COVERAGE: what you scanned + what you did NOT reach.
