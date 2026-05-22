---
name: route
description: Decide cloud Claude Code Routines vs local cc-loop per task. Use when the user says "route this", "schedule this task", "/route", "should this run on the iMac or in the cloud", or any time before dispatching unattended work. Closes the strategic boundary the audit (2026-04-30) identified — without this, every task defaults to the iMac stack regardless of whether it actually needs local capabilities.
---

# /route — cloud-vs-local task router

The user has TWO unattended-execution surfaces. This skill decides which.

| Surface | Best for |
|---|---|
| **Local: `cc-loop` / `mercury` / `cc-swarm` on the iMac** | Anything touching local-only resources (MemPalace, Kimi WebBridge, browser stack with persistent profiles, 1Password CLI, mail-OTP scraper, Tier-2 DeepSeek router, project files on local disk) |
| **Cloud: Anthropic [Claude Code Routines](https://code.claude.com/docs/en/routines)** | Pure GitHub-event-driven or scheduled jobs that don't need local files / MCPs / browsers / secrets. Triggered by cron OR push/PR/issue. Runs in Anthropic's infra — no Mac required, no self-hosted state to manage. |

## Decision algorithm (run this when classifying a task)

Walk these checks in order. **First YES wins → route there.**

### → LOCAL (`cc-loop` / `mercury` / `cc-swarm`)

1. **Touches MemPalace search?** → local (data is at `~/mempalace`)
2. **Needs local session telemetry or router ledgers?** → local (self-hosted container telemetry is retired)
3. **Drives a browser?** → local (Kimi WebBridge, Chrome profile, browser-harness CDP all live here)
4. **Reads from 1Password?** → local (CLI is biometric-bound to this Mac)
5. **Scrapes Mail.app for OTPs?** → local (mail-code only works against your inbox)
6. **Uses Tier-2 DeepSeek router?** → local (router lives at `~/Claude Code/`)
7. **Touches `~/dotfiles/`, `~/code/projects/<thing>/`, or any local file path?** → local
8. **Needs a long-running browser session with takeover capability?** → local + Kimi WebBridge
9. **Needs `mercury`'s SQLite Second Brain or Telegram channel?** → local
10. **Multi-agent fan-out via `cc-swarm` worktrees?** → local (worktrees are on local disk)

### → CLOUD (Claude Code Routines)

11. **Pure GitHub-repo work** (PR review, issue triage, scheduled changelog)? → cloud
12. **Cron-shaped** ("every Monday 9am do X on this repo")? → cloud
13. **Triggered by GitHub event** (PR opened, issue labeled, push to branch)? → cloud
14. **No local secrets / no local files / no local MCPs needed**? → cloud
15. **Single-shot, idempotent, ~15-30 min ceiling**? → cloud (Routines have wall-clock limits)

### Edge cases

- **"GitHub PR review that also drops a screenshot"** → LOCAL (browser screenshot needs local stack)
- **"Schedule a daily MemPalace mine"** → LOCAL via cc-loop (cron-shaped but local-data)
- **"Daily morning standup digest from 5 repos"** → CLOUD (pure GitHub, no local state)
- **"Write a blog post to my dotfiles repo"** → LOCAL (touches local file path; cloud Routines clone fresh, would need a push-back step)
- **"Babysit a long-running deploy"** → CLOUD (single repo, GitHub-shaped); LOCAL only if it needs noVNC takeover

## How to dispatch each side

### Cloud → Claude Code Routines

Use the existing `/schedule` skill (already in your stack). Routines syntax (per docs):

```
/schedule "every Monday 9am" "Review open PRs in <owner>/<repo> and draft a triage comment"
```

Or for one-time delayed:

```
/schedule "in 2 weeks" "Open a cleanup PR for the feature flag X"
```

Cloud-side Routines run in Anthropic's infra against a GitHub repo (you authorize per-routine).
You don't pay for iMac uptime; Anthropic bills per run.

### Local → cc-loop / mercury / cc-swarm

Drop the prompt into a file the local runner reads:

```bash
# cc-loop (long-running, single prompt iterated)
echo "Refactor lib/brand.ts to ..." > ~/.claude/cc-loop-prompt.md
launchctl load -w ~/Library/LaunchAgents/com.user.cc-loop.plist  # if not loaded

# mercury (Telegram + CLI agent, daemonized)
mercury up
# then DM the bot from your phone

# cc-swarm (parallel fan-out, 4 agents on 4 worktrees)
cc-swarm 4 ~/tasks/refactor.md --repo ~/code/projects/myapp
```

## What to actually say to the user when invoked

When the user says "/route this <task>":

1. Run the decision algorithm silently
2. Reply in ONE sentence: "**Local** because <reason>: `<command>`" or "**Cloud** because <reason>: `/schedule "<when>" "<what>"`"
3. Offer to dispatch on confirmation
4. If the task hits multiple checks (e.g. starts cloud, ends local), surface the split and propose a hand-off pattern

## Honesty constraint

If you genuinely can't tell whether a task is local or cloud (rare), default to **LOCAL** — the iMac stack is more permissive, has all the integrations, and the user is paying for the box anyway. Cloud Routines bill per run; default-cloud could surprise the bill.

If a task is borderline + the user is currently AFK + their phone is on Tailscale, prefer **LOCAL** so the noVNC + mercury + ntfy channels can take over if it goes sideways.

## Why this skill exists at all

The audit (2026-04-30) found: *"he has zero routing logic deciding which jobs go cloud vs local — that's the missing piece."* Without `/route`, every task defaults silently to the iMac stack just because that's where the user lives. Anthropic Routines (GA preview, April 14 2026) is genuinely better for a class of jobs; this skill makes that boundary explicit.

## Composes with

- `loop` (existing) — `loop` runs a prompt on an interval; `/route` decides if that interval lives local or cloud
- `schedule` (existing) — `/schedule` IS the cloud-Routine dispatcher; `/route` chooses when to call it
- `cc-loop` runner — local cron-shaped target
- `mercury up` — local long-running daemon target
- `cc-swarm <n>` — local parallel-agent target
