---
name: feedback-routing-targets-three-kinds
description: "Routing-table entries in CLAUDE.md can be SKILLS (~/.claude/skills/), SLASH COMMANDS (~/.claude/commands/), or CLIs (allowlist). Don't audit just the first."
metadata:
  type: feedback
  originSessionId: f575512d-c097-472e-8d8f-3175e69155a3
---
When auditing CLAUDE.md routing tables for orphans / drift, a backtick'd name in column 2 may resolve to any of THREE valid sources:

1. **Skill dir** — `~/.claude/skills/<name>/SKILL.md` (real or symlink)
2. **Slash command** — `~/.claude/commands/<name>.md` (real or symlink — e.g. `mega-cycle.md` symlinks to dotfiles)
3. **CLI in allowlist** — declared inside `~/.claude/scripts/routing-drift-check.sh` `cli_allowlist()` (e.g. cc-reflect, cc-health, cc-deploy-watch, cc-skill-register, cc-push-gate)

**Why:** During the 2026-05-18 ruthless audit, an audit scout flagged depth-check / evolve / mega-cycle / schedule-task as "skills missing on disk" because it only checked `~/.claude/skills/`. They were actually slash commands at `~/.claude/commands/*.md`. I removed 4 valid routing rows before the drift-checker correctly flagged them back as "on disk but not routed (orphan)." I had to restore them. Costly round-trip.

**How to apply:** Before declaring any routed name an orphan, check all three sources. The canonical drift-checker at `~/.claude/scripts/routing-drift-check.sh` walks all three — when in doubt, run it and trust its output over a one-off `ls`. Run it via `zsh -i -c '~/.claude/scripts/check-routing-drift.sh'` so it picks up project env (Node version, fnm state). Related: [[feedback-diagnostic-first]] — measure before guessing.
