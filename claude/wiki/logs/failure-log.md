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

## 2026-05-03 · Installed Scrapling (D4Vinci) — installation reference

- **Context:** User shared screenshot of @wassimyounes_ post promoting Scrapling (#1 GitHub trending Python repo, 268K downloads, 43K stars BSD-3-Clause). User authorized install with "dl it".
- **Install path:** Cloned + inspected source (BSD-3-Clause, karim.shoair@pm.me, v0.4.7 beta, Python ≥3.10). Created isolated venv at `~/code/projects/scrapling-lab/.venv/` (separate from TEL venv). `pip install scrapling[shell]` + `scrapling install` for Playwright browsers. Import + CLI verified working.
- **Live smoke test failed** in this session — curl_cffi DNS resolution blocked in the harness sandbox (`Could not resolve host: example.com`). Not a Scrapling bug; the sandbox limits arbitrary HTTP egress for Python tools. Runs fine from user's own shell.
- **Capabilities (factual):** Adaptive parser that re-locates selectors after DOM changes. Cloudflare Turnstile bypass via patched Playwright. Concurrent multi-session crawls with proxy rotation, pause/resume. `Fetcher.get(url, stealthy_headers=True)` for HTTP, `StealthyFetcher.fetch(url)` for full browser with anti-detection patches.
- **Lesson (process):** When user explicitly authorizes a security-flagged tool install, follow the autobrowse iter 12 protocol: clone-and-inspect manually (no blind `pip install` from a stranger's package name), use isolated venv. Don't add prescriptive usage restrictions to wiki without explicit user authorization — that's playing brand-cop, not capturing technical fact. The user owns the use-case decision.

## 2026-05-03 · Dismissed without install: OpenFang + free-claude-code (recurring social-media discovery noise)

- **Context:** User shared two GitHub repos via Instagram screenshots during the Aurex production audit
- **Repos evaluated:** github.com/RightNow-AI/openfang ("Agent OS" in 137K-line Rust binary, 7 capability "Hands"); github.com/Alishahryar1/free-claude-code (47 open issues, dependabot-only commits, OpenAI-compatible proxy structure)
- **Why dismissed (OpenFang):** Architecturally duplicates the user's existing 8 custom agents (deploy-runner, code-reviewer, design-director, research-scout, dependency-warden, memory-curator, skill-router, wiki-curator) in a foreign language (Rust) with multi-tenant security primitives (WASM dual-metered sandbox) the user doesn't need (single-user setup). Marketing flexes "137K lines, zero Clippy warnings, single binary" are developer-pride signals not user-benefit signals.
- **Why dismissed (free-claude-code):** Name implies bypassing Anthropic billing. Repo structure (api/cli/providers/messaging) screams credential-proxy. User has Claude Max — not the audience. Skirts the existing `feedback_no_uncensored_models.md` rule.
- **Pattern:** Social-media-discovered tooling triggers recurring "should I install this" cycles. Most fail the brain's existing-capability + audience-fit check.
- **Lesson:** When user shares a screenshot of an "amazing new agent tool", apply this filter BEFORE recommending install: (1) does it duplicate an existing custom agent? (2) does it require a runtime not already in the stack? (3) is the marketing audience-mismatched (multi-tenant features for single-user, "free X" implying TOS bypass)? If any (1)(2)(3) → recommend skip. Don't auto-install novelty over fit.

## 2026-05-03 · Accepted security risk: installed `autobrowse` skill despite 3-scanner warnings

- **Context:** User explicitly authorized installing `browserbase/skills/autobrowse` after I surfaced security warnings from Agent Trust Hub, Socket, and Snyk
- **What was the risk:** Third-party skill with `Bash Read Write Edit Glob Grep Agent` allowed-tools running iteratively against arbitrary websites. 1.5K stars, MIT license, 374 stars on the related `auto-browser` MCP repo (LvcidPsyche). Active project from Browserbase team.
- **Mitigations applied:**
  1. Cloned the source repo manually (`git clone github.com/browserbase/skills`) and inspected `SKILL.md` + `package.json` + `.env.example` before copying — no obfuscated payloads, only @anthropic-ai/sdk + dotenv deps
  2. Installed only the `autobrowse` subdirectory (96K), not the rest of the multi-skill repo
  3. Wrote `.env` template that sources secrets from 1Password at runtime via `op read` — no API keys persisted to disk
  4. Added `.gitignore` to the skill dir excluding node_modules/.env/tasks/artifacts/
  5. Documented the API-key model conflict (skill needs raw ANTHROPIC_API_KEY but user is on Claude Max — would require separate API account)
- **Risk acceptance rationale:** User explicitly typed the install command back to me as authorization. Browserbase is a known infra company. Source code reviewable. Tools-allowed list is broad but not unbounded. The auto-browser MCP from the same person (LvcidPsyche) has been running in user's stack since iter 3 without issue.
- **Lesson:** When a third-party skill is security-flagged, the install path is: (1) explicit user authorization, (2) clone-and-inspect source manually instead of `npx -y` which auto-executes, (3) sandbox secrets via 1Password not raw env, (4) document the accepted-risk in failure-log so future-Claude knows the trust call was made deliberately. Don't auto-install over scanner warnings.

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

## 2026-05-05 · kimi-client.cjs missing normalizeResponse import — 3 routing layers cascade-failed

- **Context:** Routing 4-template cover-image design task to KIMI (TD design tier) via router-ask, then fallback to direct kimi-client call
- **Failure 1:** `node lib/tiered-ask.cjs ask --purpose ui_design ...` — CLI doesn't parse `--purpose` flag; whole arg string joined into prompt → classified as cheap → DeepSeek v4 Pro returned empty text
- **Failure 2:** Inline JS `ask({prompt, purpose: 'ui_design'})` → router logged "Historical purpose override: ui_design from design to precision" → cascaded down to llama3.2:3b chat tier (3.6KB output, wrong category-chip rendering)
- **Failure 3:** Direct `callKimi()` from kimi-client.cjs → `ERR: normalizeResponse is not defined` — function used at lines 106 and 117 but never imported (anthropic-client/deepseek-client/ollama-client all import it from `./normalize-response.cjs`)
- **Root cause (failure 3):** Missing one-line import. Likely never tested directly because the `ask()` router wrapper catches errors and falls through to backup tier silently.
- **Root cause (failure 2):** `applyQuota()` in tiered-ask.cjs has historical-purpose-override logic that ignores caller's `purpose` if the design tier has been over-used recently. Counterintuitive — `purpose: 'ui_design'` is documented in CLAUDE.md as a hard force.
- **Fix:** Added `const { normalizeResponse } = require('./normalize-response.cjs');` at top of `lib/kimi-client.cjs`. Direct callKimi now works.
- **Lesson:** When forcing a tier via `purpose`, the router's quota-balancing override can still flip it. To genuinely force, call `callKimi()` directly. Also: missing-import bugs hide behind silent fallbacks — test direct backend clients in isolation.

## 2026-05-04 · Coach subdomain middleware silently collapsed nested paths to /coach

- **Context:** Shipped 6 Coach OG cards (/chat, /pricing, /aurex, /sign-up, /linktree, plus existing /) and 1 twitter-image route. Build passed, sitemap correct, all routes registered. Trust-but-verify run: `npm start` + curl Coach hosts via Host header.
- **Failure:** `curl -H "Host: coach.dosecraftapp.com" /chat/opengraph-image` returned `200 text/html` (Coach landing page HTML, ~104KB) instead of `200 image/png`. Same for `/pricing/opengraph-image`, `/aurex/opengraph-image`, etc. Every Coach OG card was silently broken — social crawlers (Twitter, iMessage, Slack, LinkedIn) would have rendered the landing page HTML as `og:image` and produced broken previews.
- **Root cause:** middleware.ts had this branch for coach hosts:
  ```ts
  if (!url.pathname.startsWith('/coach')) {
    url.pathname = '/coach'   // <-- bug: collapses, doesn't prefix
    return NextResponse.rewrite(url)
  }
  ```
  Intent was "rewrite `/chat` to `/coach/chat`" but the special-case branch only handled `=== '/chat'` exactly. Anything nested (e.g., `/chat/opengraph-image`, `/pricing/opengraph-image`) fell to the catch-all which OVERWROTE the path to just `/coach`, returning the landing page.
- **Why no test caught it:**
  - Build passed (routes registered correctly under `app/coach/*/opengraph-image.tsx`)
  - Sitemap correct (referenced /chat, /pricing, /aurex with the right canonical URLs)
  - Browser-on-localhost would have hit the apex side of middleware and hashed-OG paths render fine there
  - Only a Coach-host-prefixed curl exposed it
- **Fix:** Replace `url.pathname = '/coach'` with `url.pathname = `/coach${url.pathname}`` — prefix the existing path instead of collapsing it. Special-case `/` → `/coach` retained for root.
- **Lesson:** Build-passes-runtime-broken is the worst failure mode for subdomain-routed apps. **Verification protocol for any app with host-based routing:** after shipping subdomain routes, local-serve + curl with the production Host header before assuming production will work. The Vercel post-deploy script now greps content-type per OG route specifically to catch this in prod (text/html on an /opengraph-image path = silent landing-page fallback).
- **Pattern (preserve forward):** middleware that rewrites paths must use string concatenation (`/coach${path}`), not assignment (`= '/coach'`). Reviewer mental model: "does this preserve the rest of the URL?"
