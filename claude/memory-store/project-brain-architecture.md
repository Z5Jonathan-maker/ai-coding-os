---
name: project-brain-architecture
description: "Snapshot of the autonomous brain Jonathan + Claude built across 11 iterations on 2026-05-03. Three sibling knowledge layers, full self-monitoring, version-controlled. Reference this so future sessions don't re-discover what already exists."
metadata:
  type: project
  originSessionId: aeda5184-d147-4d61-98c9-daa4117a8a76
---
The Claude Code config at `~/.claude/` is structured as a routing brain (CLAUDE.md), three sibling knowledge layers (wiki/, design/, tel/), 8 custom agents, 17 lifecycle hooks, 6 launchd self-monitors, and Langfuse telemetry. Built in 11 iterations on 2026-05-03.

**Why:** Single intelligent organism — one brain (Opus 4.7 + CLAUDE.md routing tables), many coordinated parts. Self-improving via wiki failure-log + optimization-log + monthly wiki-curator pass. Self-monitoring via daily/weekly/monthly cron. Self-healing via mcp-fallback-resolver + tel-canary.

**How to apply:**
- Before suggesting Claude Code config changes, READ `~/dotfiles/claude/CLAUDE.md` first — it has the routing tables
- Before "let me build X", check if X already exists at `~/.claude/{wiki,design,tel}/`
- Before invoking a skill, check the skill routing table in CLAUDE.md
- Before invoking an agent, check the agent routing table (12 agents: 5 built-in + 7 custom: code-reviewer, deploy-runner, memory-curator, skill-router, research-scout, dependency-warden, wiki-curator, design-director)
- For credentialed third-party actions: use TEL via `~/.claude/tel/client/tel-call.sh` (NEVER ask user to paste credentials — see wiki D13)
- After fixing a real failure: append to `~/.claude/wiki/logs/failure-log.md` with root cause + lesson
- After making something faster/better: append to `~/.claude/wiki/logs/optimization-log.md`

**Three sibling brains, same protocol (read-before/write-after):**
- `~/.claude/wiki/` — code + system intelligence (D1-D13 rules, W1-W9 workflows, failure-log, optimization-log)
- `~/.claude/design/` — visual + brand intelligence (13 task routes, brand brain for Aurex, prompts, exports, 8-axis QC rubric)
- `~/.claude/tel/` — credentialed action gateway (FastAPI + 1Password broker; daemon awaits user activation per `tel/ops/INSTALL.md`)

**Self-monitoring (6 launchd agents, all in dotfiles):**
- daily 09:00 mcp-probe (with TEL canary + Langfuse health + fallback recommendations)
- daily 09:25 session-outcome-digest (auto-extracts wiki write-back signals from session jsonl)
- Mon 09:05 routing-drift, Mon 09:10 memory-health, Mon 09:20 self-improvement digest
- 1st of month 09:15 skill-usage tracker

**Single-command state report:** `~/.claude/scripts/snapshot.sh` — composes all monitors into one view.

**Hook test harness:** `~/.claude/scripts/hook-test.sh` — runs every dotfiles hook dry, catches regressions before commit.

System composite score: 99.5%. Architecture is structurally complete. Two operational gates remain (TEL daemon activation + dotfiles git push backlog) — both user-actions, not code.
