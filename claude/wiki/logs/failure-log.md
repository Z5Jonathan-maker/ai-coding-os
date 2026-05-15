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

## 2026-05-05 · Circuit-open path silently produced "All tiers exhausted. Last error: unknown"

- **Context:** While running the runtime gauntlet after locking the image tier to `fallbacks: []`, the gauntlet's image-fail-fast assertion failed with the message `"All tiers exhausted. Last error: unknown"` instead of the expected `"Image bridge unavailable: ..."`.
- **Failure:** Final wrap message had no useful information about why the image tier failed. User-facing error degraded from "image bridge needs setup" (actionable) to "unknown" (useless).
- **Root cause:** `dispatch()` BFS loop has two non-success branches: (a) circuit-open short-circuit at the top, (b) try/catch around the actual call. Only branch (b) sets `lastErr = e`. When the image tier's circuit had opened from prior session failures, every subsequent `ask({purpose:'image_gen'})` hit branch (a), which logged + skipped without setting `lastErr`. With `fallbacks: []`, the queue then drained empty, and the final `throw new Error(\`All tiers exhausted. Last error: ${lastErr?.message || 'unknown'}\`)` fell back to 'unknown'.
- **Fix:** Set `lastErr = new Error(\`circuit breaker open for ${def.id}\`)` (with `code: 'CIRCUIT_OPEN'`) inside the circuit-open branch so the wrap message is meaningful regardless of which branch fired last. Updated the runtime gauntlet to accept either bridge-down or circuit-open as a valid image-failure signature; the gauntlet also resets the image CB before invoking `ask()` so the fresh-dispatch path runs when possible.
- **Lesson:** Two non-success branches in the same loop must both update the error-tracking variable. Wrapping logic should never produce "unknown" as a user-facing message — that's a sign some failure path forgot to populate context. Trace every path that sets the error-summary variable; if a path can fail without writing to it, the wrap message will lie. Especially relevant when a tier transitions from "has fallbacks" to "fail-fast": empty-fallback drains the queue without ever entering the success-or-error branch.

## 2026-05-05 · `flags:['cheap']` silently routed to Ollama instead of DeepSeek for weeks

- **Context:** Router has both a `chat` tier (Ollama, T1) and a `cheap` tier (DeepSeek, T2). Flags exist as a way for callers to force a specific tier without using a full purpose name.
- **Failure:** `classifyTask({ flags: ['cheap'] })` returned `'chat'` (→ Ollama llama3.2:3b) instead of `'cheap'` (→ DeepSeek). Quality regression on every cheap-flagged call: a 3B local model handled work intended for a frontier reasoner. Caught by DeepSeek's own audit of its host router.
- **Root cause:** `CHAT_F` and `CHEAP_F` were defined as `CHAT_F = ['chat','light','cheap','mechanical']` and `CHEAP_F = ['deepseek','cheap_reasoning','long_context']`. The flag `'cheap'` lived in the wrong set. `classifyTask` checks CHAT_F before CHEAP_F (line ordering), so `'cheap'` always won as chat. The disjointness check in `check-integrity.cjs` ran on PURPOSE sets only — it did not detect this flag-set drift.
- **Fix:** Moved `'cheap'` from CHAT_F to CHEAP_F. Extended `check-integrity.cjs` to also run pairwise disjointness across the flag sets. Added flag-routing tests to the Codex-generated runtime gauntlet so future flag misroutes are caught at module-load.
- **Lesson:** Disjointness invariants must apply to every enumerated set the classifier reads from, not just the most prominent ones. The label of a set ("CHAT_F") doesn't tell you which tokens belong in it — token names don't carry their semantics. When extending an integrity check, verify it covers every input the function under test consumes; don't assume the obvious set is the only one. Also: `Codex's runtime gauntlet didn't catch this` — gauntlets must exercise both purpose-only and flag-only paths because they take different code branches.

## 2026-05-05 · Router validator/classifier silent drift — codex+image+swarm purposes unreachable

- **Context:** Router (`/Users/leonardofibonacci/Claude Code/lib/`) had codex (T5) and image (TI) tiers wired in `tiered-ask.cjs` classification sets (CODEX_P, IMAGE_P, CODEX_F, IMAGE_F), but `validate.cjs` had not been updated when those tiers were added. SWARM tier was added by the auto-improve background process during this same session with the same omission.
- **Failure:** Calling `ask({ purpose: 'shell_script', flags: ['codex'] })` threw `Validation failed: unknown purpose: shell_script; unknown flag: codex`. The `validateAskInput()` gate at the top of `ask()` rejected legitimate forced-tier calls. Silent because the regex-based classifier still routed correctly when called with prompt text alone — only explicit `purpose:` / `flags:` were broken.
- **Root cause:** No integrity check between `tiered-ask.cjs` classification sets and `validate.cjs` VALID_PURPOSES / VALID_FLAGS. Adding a tier required updating two files; the second file was forgotten.
- **Fix:** (a) Patched `validate.cjs` to include all CODEX_P / IMAGE_P / SWARM_P purposes and CODEX_F / IMAGE_F / SWARM_F flags. (b) Added a startup integrity loop in `tiered-ask.cjs` that throws on first drift between classifier sets and validator sets — the module won't load if a future tier addition forgets the validator update. (c) Added a Claude Code project-level pre-commit hook that loads the module to surface the throw at commit time.
- **Lesson:** Any gate that checks against an enumerated set must have a startup integrity check verifying the set covers every legal value the rest of the system can produce. Two-file invariants without a cross-check rot silently. The throw-at-load pattern is cheap and definitive — prefer it to documentation that asks a future maintainer to remember.

## 2026-05-05 · Routing-drift weekly check was a no-op (column-extraction bug)

- **Context:** Weekly launchd job `bio.claude.routing-drift` (Mondays 09:05) ran `routing-drift-check.sh` to surface skills/agents that were either named in CLAUDE.md but missing from disk, or on disk but unrouted.
- **Failure:** Script had been silently passing on every run despite known drift (e.g. `cc-loop` referenced but doesn't exist; `skill-creator` on disk but not routed). Auditor surfaced the issues; weekly check had not.
- **Root cause:** `awk -F'`' '/\| `/{print $2}'` extracted the FIRST backtick-quoted token from any line containing `` | ` `` — which in the SKILL ROUTING TABLE is the user-intent column (column 1), not the skill column (column 2). All "intents" matched the allowlists trivially because they're free-form English text, not skill names. The check was reading the wrong column from day one.
- **Fix:** Replaced extraction with column-aware `awk -F'|' 'NF >= 4 && $1 ~ /^$/ ... { print $3 }'` that pulls column 2 of well-formed table rows. Also: added symlink-following (`find -L`) since `~/.claude/skills/` and `~/.claude/agents/` are themselves symlinks, and a built-in skills/agents allowlist for things like `claude-api`, `loop`, `Explore` that ship with Claude Code rather than living on disk. Re-ran: 37 skills + 13 agents + 2 MCP refs all aligned, exit 0.
- **Lesson:** "The check passes" ≠ "there is no drift" until you've verified the check actually detects drift. Before trusting a guard, induce a known failure (rename a skill) and confirm the guard fires. A silent guard is worse than no guard — it provides false confidence.

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

## 2026-05-04 · 5 silent OG production bugs caught by local-serve E2E (Satori + metadataBase + openGraph inheritance)

- **Context:** After shipping ~12 OG cards across Aurex + Dosecraft + Coach, ran trust-but-verify: `npm start` + curl each page, extract `<meta og:image content="...">`, fetch the URL, verify `200 image/png`. Build had passed for everything; the OG cards looked fine in source.
- **5 silent bugs caught:**
  1. **Apex Dosecraft `/` OG** — Satori rejected multi-child `<div>` containing "Peptide research,`<br/>`<span>organized.</span>" → fix: split each line into its own `<div>` under flex column.
  2. **Coach `/` OG** — same `<br/>` + multi-child pattern → same fix.
  3. **`/vendors/<id>/` OG** — Satori rejected text-only single-child `<div>`s when the parent flex container computed gap layout → fix: explicit `display: flex` on every pill div.
  4. **Coach `metadataBase`** — `app/layout.tsx` set apex (`dosecraftapp.com`) metadataBase, so Coach pages emitted `og:image` as `dosecraftapp.com/coach/<path>/...` → social crawlers got 307 → coach.dosecraftapp.com → cached the wrong canonical URL → fix: `app/coach/layout.tsx` adds `metadata` export with `metadataBase = https://coach.dosecraftapp.com`.
  5. **Aurex `/research`** — page overrode `openGraph` without re-declaring `images`, so Next dropped the inherited apex image reference → social shares had `og:title` + `og:description` but NO `og:image` → fix: explicit `images: [{ url: '/opengraph-image', width: 1200, height: 630 }]` inside the override.
- **Why none were caught by build:** Satori errors fire only at request time when the OG renders. `metadataBase` mismatch and missing `images` produce valid HTML — just point to wrong/missing URLs. Build is silent on all of these.
- **Why none were caught by my first post-deploy script:** I was probing `$BASE/<page>/opengraph-image` (unhashed). Next emits HASHED URLs in `<meta og:image>` (`/opengraph-image-<hash>?<query>`) — social crawlers fetch THOSE. Probing unhashed paths returned 404 even when the OG worked, producing false-negatives that masked these silent failures.
- **Lessons preserved forward:**
  - **Satori rules for next/og JSX:** any `<div>` with multiple children needs explicit `display: flex` or `display: none`. Use `<br/>` ALWAYS produces a multi-child div — split into separate `<div>` elements under a `flex-direction: column` parent. When in doubt, just add `display: 'flex'` to every div in the OG card.
  - **metadataBase per subdomain:** apex `app/layout.tsx` sets metadataBase for the apex host; sub-route layouts under different hosts MUST override metadataBase or all relative URLs (og:image, alternates, etc) will resolve to the apex.
  - **openGraph override = images dropped:** Next does NOT merge `images` from a parent layout's openGraph into a page's openGraph override. If a page declares its own `openGraph` block, it must re-declare `images` (or omit the override entirely to inherit).
  - **Smoke-script pattern:** to verify OG cards in production, curl each PAGE, extract `<meta og:image content=...>` from HTML, fetch THAT URL, verify content-type. Probing `/opengraph-image` directly returns false-negatives because Next emits hashed URLs.
