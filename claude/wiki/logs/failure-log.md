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

## 2026-05-03 · TEL server import failed under macOS system Python (3.9)

- **Context:** First-run validation of the TEL server in iter 9, using `python3 -m venv .venv` (which picks up macOS CommandLineTools Python 3.9.6)
- **Failure:** `TypeError: Unable to evaluate type annotation 'dict | None'` from pydantic model field collection
- **Root cause:** Server uses PEP 604 union syntax (`X | Y`) in pydantic model annotations. Python 3.9 doesn't support this at runtime even with `from __future__ import annotations` because pydantic v2 re-evaluates annotations via `eval()` for validation.
- **Fix:** Recreated venv with `~/.local/bin/python3.12` (uv-managed Python). All imports + unit tests pass clean. Updated `tel/ops/INSTALL.md` to document the 3.10+ requirement and call out the explicit python3.12 path on this machine.
- **Lesson:** When shipping Python services that use modern type syntax, pin the Python version in install docs AND fail loud at startup if the running interpreter is too old. `from __future__ import annotations` is necessary but NOT sufficient for pydantic v2 + PEP 604.

## 2026-05-03 · TEL 1Password broker timed out on `op whoami`

- **Context:** Smoke-testing TEL auth_broker.health() during iter 9 install validation
- **Failure:** `op whoami timed out` — the 1Password CLI was reachable but unresponsive within the 5s timeout
- **Root cause:** 1Password CLI requires an interactive sign-in (`eval $(op signin)`) per shell session. The python venv subprocess inherited the env but not the auth state.
- **Fix:** Documented `eval $(op signin)` as a prerequisite in `tel/ops/INSTALL.md` step 2. Future fix: TEL launchd plist should source 1Password's biometric/SSH-agent auth at startup; currently requires interactive session.
- **Lesson:** Local CLI tools that need interactive auth (1Password, gh) don't carry across subprocess boundaries cleanly. Either use the SSH agent socket (already on for 1Password — `SSH_AUTH_SOCK` env var) or use a service account token + biometric unlock. For TEL v0.2: switch from `op read` to using the 1Password Connect server which is daemon-friendly.

## 2026-05-03 · Pre-commit hook blocked dotfiles commit on shellcheck SC2010

- **Context:** First commit of iter 1-5 work to `~/dotfiles/`
- **Failure:** Pre-commit hook ran shellcheck on the staged `skill-usage-tracker.sh` and rejected `ls -1 ... | grep -v "^backup"` with SC2010
- **Root cause:** `ls | grep` pattern is fragile against non-alphanumeric filenames + shellcheck enforces this even when the alternative is a fallback path
- **Fix:** Replaced the `||` fallback with a glob-based `for d in dir/*/` loop with `case` skip for `backup*`
- **Lesson:** Dotfiles repo has shellcheck in pre-commit. Run shellcheck on every new bash script BEFORE committing. Avoid `ls | grep` always — use globs + case statements.

## (Aurex) 2026-04-30 · Vercel two-project domain drift

- **Context:** Pushing to main on Aurex, expected aurex.bio to update
- **Failure:** Pushes built successfully but aurex.bio kept serving 14h-old build
- **Root cause:** Two Vercel projects exist — `aurex` receives git pushes, `aurex-bio` owns the production domain. Pushes built into `aurex` but the alias never updated.
- **Fix:** Manual `npx vercel alias <new-deployment> aurex.bio` after every push. Long-term: GitHub Action `auto-promote.yml` automates the alias. Permanent fix requires moving the domain in Vercel UI (still pending).
- **Lesson:** Always run `npx vercel inspect <prod-domain>` before assuming a push will go live. Two-project drift is a common Vercel footgun on hobby tier.
