# Failure Log

Append-only. Every failure with its root cause and fix. Future sessions read this before retrying anything risky.

## Format

```
## YYYY-MM-DD · <one-line title>
- **Context:** <what was being attempted>
- **Failure:** <what went wrong, exact error if available>
- **Root cause:** <why, not just what>
- **Fix:** <what worked>
- **Lesson:** <what future-Claude should remember>
```

---

## 2026-05-03 · Routing-drift detector false-positives on built-in agents and MCPs

- **Context:** Wrote `routing-drift-check.sh` to compare CLAUDE.md routing tables against `~/.claude/skills/` and `~/.claude/agents/`
- **Failure:** First run flagged 18 🔴 issues — but most were valid: built-in agents (Explore, Plan, general-purpose, claude-code-guide, statusline-setup) and MCP server names (chrome-devtools, github, etc.) which legitimately don't have local skill/agent files
- **Root cause:** Drift checker assumed every routing-table entry must have a local file, didn't account for runtime-provided agents or MCP servers (validated separately by mcp-probe.sh)
- **Fix:** Added BUILTINS + MCPS allowlists to the drift checker. Re-runs clean.
- **Lesson:** When validating routing tables, the source-of-truth is multi-layered: local files + built-ins + MCPs. Always allowlist the layers you don't own.

## 2026-05-03 · Bash strict-mode tripped on empty array reference

- **Context:** Drift checker used `set -euo pipefail` and `${#issues[@]} -eq 0`
- **Failure:** `unbound variable` error when `issues` array had no elements added
- **Root cause:** `set -u` (nounset) is strict about array references. `declare -a issues` doesn't initialize the array as empty when nothing is appended.
- **Fix:** Changed to `declare -a issues=()` — explicit empty init.
- **Lesson:** With `set -u`, ALWAYS initialize bash arrays with `=()` even if you intend to populate them later.

## 2026-05-03 · MCP probe surfaced silent OAuth expiration on Amplitude + Gamma

- **Context:** First run of the new daily MCP probe
- **Failure:** Both `claude.ai Amplitude` and `claude.ai Gamma` were marked `! Needs authentication`
- **Root cause:** OAuth tokens expired silently. Without the probe, Claude would have tried to use them mid-task and hit auth errors.
- **Fix:** Probe now reports re-auth-needed servers in daily output + at SessionStart. User re-auths via `claude mcp` UI.
- **Lesson:** OAuth-gated MCPs need active monitoring. Silent expiration is the default failure mode; visibility solves it.

## (Aurex) 2026-04-30 · Vercel two-project domain drift

- **Context:** Pushing to main on Aurex, expected aurex.bio to update
- **Failure:** Pushes built successfully but aurex.bio kept serving 14h-old build
- **Root cause:** Two Vercel projects exist — `aurex` receives git pushes, `aurex-bio` owns the production domain. Pushes built into `aurex` but the alias never updated.
- **Fix:** Manual `npx vercel alias <new-deployment> aurex.bio` after every push. Long-term: GitHub Action `auto-promote.yml` automates the alias. Permanent fix requires moving the domain in Vercel UI (still pending).
- **Lesson:** Always run `npx vercel inspect <prod-domain>` before assuming a push will go live. Two-project drift is a common Vercel footgun on hobby tier.
