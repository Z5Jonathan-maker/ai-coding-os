# Workflow Templates

Proven multi-step recipes. Pick a recipe; follow the steps; deviate only when reality contradicts.

## W1: Audit → punch list → ship fixes

**Trigger:** "audit this", "what's broken here", weekly maintenance pass

1. Invoke `audit` skill — produces `./audits/<date>.md` punch list
2. For each 🔴 Critical item: open in main thread, fix, commit individually
3. For 🟡 High items: dispatch via parallel `general-purpose` agents (one per item, when independent)
4. Run `code-reviewer` agent on the bundled diff before push
5. Push → Vercel auto-deploys → invoke `deploy-runner` agent for alias chain
6. If audit flagged outdated/CVE deps: chain into **W7** (Dependency upgrade) before step 5
7. Write outcome to `wiki/logs/optimization-log.md` (what got better)

## W2: New feature on Aurex (or any Next.js project)

**Trigger:** "add X to the catalog/PDP/checkout flow"

1. Read project CLAUDE.md + relevant lib/* files (don't grep-only)
2. Plan via `Plan` agent if scope > 1 file
3. Implement: prefer Edit over Write, follow `karpathy-guidelines` (surgical changes)
4. Type-check + lint locally before commit
5. Commit with conventional prefix (`feat:`, `fix:`, `chore:`)
6. Run `dependency-warden` if any new dep added
7. Push + alias via `deploy-runner`
8. Smoke-test the changed route

## W3: Research before high-stakes claim

**Trigger:** Anything load-bearing that needs a citation (regulatory, scientific, competitive)

1. Spawn `research-scout` agent with the specific question
2. Wait for report
3. Cite verbatim quotes from the report (not your own paraphrase)
4. If the report flags `[UNVERIFIED]`, do NOT propagate the claim — surface the gap to user

## W4: Fix a deploy that's drifted

**Trigger:** "domain serving stale build", "push went through but site is old"

1. Check `gh run list` — did CI/Vercel build complete?
2. Check `npx vercel ls` — what's the latest deployment URL?
3. Check `npx vercel inspect <prod-domain>` — which project owns it?
4. If pushed-to project ≠ domain-owner project: invoke `deploy-runner` to manually `vercel alias`
5. Verify with `curl -I <prod-domain>` — check `x-vercel-id` matches new deployment
6. Long-term fix (if recurring): file as 🛑 in audit punch list, propose moving domain in Vercel UI

## W5: Onboard a messy project

**Trigger:** "/onboard", new repo handed off, "rehab this codebase"

1. Invoke `onboard` skill
2. Skill writes scoped specialist docs (CLAUDE.md, AGENTS.md, DESIGN.md, ARCHITECTURE.md if non-marketing)
3. Run `audit` skill against the freshly-onboarded repo — produces a baseline punch list
4. Surface the worst 3 🔴 to user; offer to fix inline or stage as a backlog

## W6: UI design iteration

**Trigger:** "design this", "/design", "make a landing page"

1. Check for `./DESIGN.md` — if absent, offer to write one first
2. Invoke `design` skill (English/Western) or `huashu-design` (Chinese hi-fi) per CLAUDE.md disambiguation
3. Generate self-contained HTML mockup
4. Audit via `chrome-devtools` MCP: `lighthouse_audit` + `take_screenshot` at multiple viewports
5. Iterate on user feedback axis-by-axis (visual / a11y / responsive / motion)
6. Final: commit mockup to `./.design-mocks/<slug>.html`; checkpoint via session-handover for /recall

## W7: Dependency upgrade pass

**Trigger:** "what's outdated", weekly cron, pre-release

1. Invoke `dependency-warden` agent
2. Review categorized report
3. Apply 🟢 Medium upgrades inline (minor/patch only — semver-safe)
4. For 🟡 High (major-version): read CHANGELOG via `context7` MCP, decide
5. For 🔴 Critical CVE: fix immediately if patch exists; if not, surface to user with risk note
6. Commit with `chore(deps): ...` — push → deploy-runner

## W8: Self-improvement digest review

**Trigger:** Monday morning (after weekly cron fires)

1. Read `~/.claude/audits/digest-<date>.md`
2. If recommendations include "tool error rate above 5%": invoke `audit` skill on whichever project is causing it
3. If "high session count": invoke `memory-curator` agent
4. Apply any low-cost optimizations inline
5. Append outcomes to `wiki/logs/optimization-log.md`

## W9: Credentialed action via TEL

**Trigger:** Need to invoke a third-party API on user's behalf where credential storage is required (Gmail send, Gamma create, GitHub PR, etc.) AND the MCP for that service is unavailable, missing, or you want strict whitelisting

1. Check if a TEL policy exists: `ls ~/.claude/tel/policies/<service>.yaml`
2. If yes: skip to step 5
3. If no: **propose** a policy YAML to user (write to `tel/policies/<service>.yaml.proposal` — don't activate without approval)
4. After user approves the policy: ensure the credential is stored at the policy's `auth_op_path` in 1Password
5. Verify TEL is up: `tel-call.sh --health` (returns `{"ok":true,...}`)
6. Dry-run the call first: `tel-call.sh --dry-run <service> <action> '<args>'` — validates request shape without executing
7. Execute: `tel-call.sh <service> <action> '<args>'` — returns `{ok, result, audit_id, undo_token?}`
8. If `undo_token` returned and user wants to reverse: `tel-call.sh --undo <token>` within the action's window
9. Inspect audit log: `tel-call.sh --audit <service>` — last 20 calls
10. If response was 401: TEL auto-invalidates the broker cache; user re-auths and retries

**Hard rule:** Never paste credentials into chat to "help" — TEL's whole point is that the credential lives in 1Password and never enters Claude's transcript. See D13.

## W10: Self-improving browser skill via autobrowse

**Trigger:** User says "/autobrowse <task>", "build a browser skill for X site", "autobrowse google flights / amazon / linkedin / etc"

1. Verify autobrowse is installed: `ls ~/.claude/skills/autobrowse/SKILL.md`
2. Verify ANTHROPIC_API_KEY is reachable via 1Password: `op read op://Personal/Anthropic-API/credential | head -c 10` (note: separate from Claude Max OAuth — autobrowse needs the API key explicitly)
3. If user gave a free-form URL or instruction (not `--task <name>`):
   - Check `~/.claude/skills/autobrowse/tasks/<name>/task.md` for matching existing task
   - Else create one in kebab-case using `references/example-task.md` as template
4. Source secrets from 1Password into env:
   ```bash
   export ANTHROPIC_API_KEY=$(op read op://Personal/Anthropic-API/credential)
   # Optional, for cloud browser via Browserbase:
   export BROWSERBASE_API_KEY=$(op read op://Personal/Browserbase/api_key)
   export BROWSERBASE_PROJECT_ID=$(op read op://Personal/Browserbase/project_id)
   ```
5. Run the skill: `cd ~/.claude/skills/autobrowse && npm run evaluate -- --task <name>`
6. Inner agent attempts the browser task → produces a trace → outer agent (Claude) reads the trace → updates `tasks/<name>/strategy.md`
7. Iterate until convergence (default: 5-10 iterations until consistent pass)
8. Once converged: the `strategy.md` IS the reusable browser skill — graduate to `wiki/logs/winning-patterns.md` (browser-task domain) with the converged strategy
9. Subsequent invocations of the same task use the converged strategy directly — no re-discovery

**Composes with:** Kimi WebBridge for logged-in Chrome flows, or Playwright for clean repeatable browser tests. The autobrowse skill is the orchestration layer; the browser executor is selected per task.

**Security note:** This skill has accepted-risk status (3 scanner warnings) — see `wiki/logs/failure-log.md` 2026-05-03 entry. Don't extend its allowed-tools surface beyond the SKILL.md frontmatter. Audit task definitions in `tasks/<name>/task.md` before running against sites that handle PII or money.

## W11: Build a mentor / topic mega-brain from external corpus

**Trigger:** "build a brain on X", "ingest this expert's content", any time we want a queryable corpus on a person, topic, or compound.

**Inputs:** YouTube channel/video URLs, articles, PDFs, sitemaps, RSS, OR a local dir of transcripts/PDFs/text/HTML.

1. Decide the topic slug (kebab-case, prefix `mentor-` if it's a person). e.g. `mentor-ayubace`, `peptide-research`.
2. Decide source mode:
   - **URL list:** put URLs in `~/code/projects/scrapling-lab/brain-sources/<topic>.txt` (one per line)
   - **Local corpus:** point at the directory (recurses, dedupes)
   - **DB-only corpus:** see W12 (dump first, then ingest the local dir)
3. Run ingestion:
   ```bash
   mega-brain-ingest --topic <slug> --sources brain-sources/<slug>.txt --skip-video --workers 8
   # then add video transcripts (slow)
   mega-brain-ingest --topic <slug> --sources brain-sources/<slug>.txt --whisper-model small
   ```
4. (Mentor brains) Add a profile to `/tmp/build-mentor-index.py`'s `PROFILES` dict (name, channels, credibility, strengths, tone, use_when). Re-run to refresh `_INDEX.md` + `_COMPOUND_INDEX.md` + per-mentor `_README.md`.
5. Mempalace mine for cross-session semantic recall:
   ```bash
   mempalace --palace ~/mempalace mine ~/.claude/wiki/learnings/<slug>
   ```
6. Update `wiki/tool-registry.md` `learnings` row totals.

**Cost:** $0 (trafilatura + pypdf + faster-whisper all local). Only paid if Groq Whisper fallback for captionless videos (~$0.111/hr).

## W12: Recover knowledge from a DB-only corpus (e.g. Neon transcript_embeddings → mentor brains)

**Trigger:** A prior project ingested external content directly into a DB (skipped writing files). You want it as queryable per-doc files in `learnings/`.

1. Get DB credentials cleanly. Order of preference:
   1. API key (Neon dashboard → settings → API keys → "Generate new") set into `NEON_API_KEY` env
   2. Live `.env.production` if committed (load `set -a; source FILE; set +a` so the value never enters transcript)
   3. OAuth via patched neonctl (`~/local/lib/neonctl-patched/cli.js auth` — 900s window)
2. List + select project → connection string:
   ```bash
   neonctl projects list --org-id <id>
   DB_URL=$(neonctl connection-string --project-id <pid> --org-id <oid>)
   ```
3. Inspect schema → find embeddings/transcript table:
   ```bash
   psql "$DB_URL" -c "\dt"
   psql "$DB_URL" -c "\d transcript_embeddings"
   ```
4. Stream rows → per-doc `.md` with frontmatter. Group by `(creator, video_id)`, sort by `chunk_index`, concatenate `content`. Reference template: `/tmp/dump-neon-corpus.py` (kept after 2026-05-03 DoseCraft pull, 8826 chunks → 843 videos across 8 mentors).
5. Ingest with W11 step 3 (local-dir mode).

**Honesty constraint:** API key crosses Bash boundary → treat as exposed → revoke after pull.

## W13: Full repo map ("THE INDEX") — adapted from Liam Haley

**Trigger:** Starting work on an unfamiliar repo, or before a substantial refactor on a familiar one. Need ground-truth on entry points, dead code, files that don't belong.

**Prompt template:**
> Read every file in this repo in parallel. Build a map: entry points, exports, dead code, anything outside the import graph. Flag anything that shouldn't be here. Don't ask before reading.

**Add for our brain:** spawn `Explore` subagent first to keep the file reads out of main context, then synthesize the map back. Cross-check against `/audit` if the repo is one we ship (Aurex, DoseCraft).

## W14: Forgotten-secrets audit ("THE AUDIT") — adapted from Liam Haley

**Trigger:** Periodic personal-machine cred hygiene; before posting a screenshot/blog/PR; after onboarding a new device.

**Prompt template:**
> Scan ~/ for API key patterns: `sk_live_*`, `sk-proj-*`, `AC*` (twilio), `eyJ*` (JWT), `AKIA*` (AWS). For each one, check if it's inside a .gitignore. Output a markdown table sorted by exposure risk, with the provider's revoke URL.

**Add for our brain:** harness will block broad cred-discovery scans (we hit this 2026-05-04). Frame as "audit my OWN machine for accidental commits / pre-commit-hook coverage gaps", and target specific git-tracked paths rather than scanning all of ~/. The pre-commit gitleaks hook + aurex-shield already block most.

## W15: Call-graph trace ("THE FIX") — adapted from Liam Haley

**Trigger:** Multi-day bug where you've been staring at one file. Symptom is in handler X, but the bug usually lives in the lifecycle of state Y consumed by X.

**Prompt template:**
> There's a [race condition / null reference / off-by-one] in `src/<file>.ts`. I've been staring at `<handler>`. Read every call site of `<symbol>` and trace the lifecycle of `<state>` and `<state2>`. Don't propose a fix until you've drawn the call graph in your head.

**Add for our brain:** spawn `Explore` agent for the call-site survey (parallel grep + read keeps it out of main context). When the agent returns, demand a written call-graph (text or ASCII) before any code edit. Pair with `/audit` if the bug pattern is known to recur.

## W16: Throwaway tool ("THE TOOL") — adapted from Liam Haley

**Trigger:** Need to query / transform / extract something once, no MCP exists for it, would over-engineer to make it permanent.

**Prompt template:**
> I need to [query/transform/extract] [X] from [Y]. There's no [MCP/CLI] for it. Write a [Python/Bash] subprocess wrapper, run it, throw the script away. Don't add it to the project.

**Add for our brain:** matches our `karpathy-guidelines` D2 ("simplicity first") + `pulse` skill (no comments restating code). Scratch dir `/tmp/` is the destination, not the project. If the script proves useful 2-3 times, THEN graduate it to `~/code/projects/scrapling-lab/bin/` or wiki/workflows.

## W17: PR ship ("THE SHIP") — adapted from Liam Haley

**Trigger:** Have an in-progress fix; want a real PR with regression test + human-style description while you do something else.

**Prompt template:**
> Implement the fix from [earlier conversation / spec at <path>]. Branch off `main` as `<branch-name>`. Write a regression test that fails on current `main` and passes after your patch. Commit, push, open a PR via `gh CLI` with a real description. Link issue #<NNN>.

**Add for our brain:** pre-commit gate (gitleaks + aurex-shield + typecheck) will fire — let it; don't bypass with `--no-verify`. PR description should follow the format we already use (Summary bullets + Test plan checklist + co-author trailer). On Aurex specifically, also confirm: not touching `lib/cart.ts` shape, not adding Stripe references, not modifying COA URLs.

---

**Source:** Liam Haley (@liambuilds.ai), "Claude Body — Setup Guide" PDF, retrieved 2026-05-04. Full source preserved at `wiki/learnings/external-references/claude-body-liam-haley-2026-04-26.md`.

## W18: Payment-rail rip ("Stripe → Paddle/Gumroad/BTCPay")

**Trigger:** A project is on Stripe and needs to be ripped (Stripe is globally banned per D18 — RUO peptide vendor risk). Replacement depends on product shape: digital subscriptions → Paddle/Gumroad (MoR handles tax); physical/RUO peptide ecom → BTCPay (crypto) + NMI Direct Post (card); SaaS with EU customers → Paddle.

**Steps:**

1. **Inventory Stripe surfaces.** `rg -i 'stripe|sk_test|sk_live|pk_test|pk_live|/v1/checkout|/v1/payment_intents|@stripe/stripe-js|stripe-node|loadStripe' --hidden -g '!node_modules' -g '!.next' -g '!dist'`. Output: files, env vars, packages, webhook endpoints.

2. **Pick replacement per product shape.**
   - Digital product / SaaS / subscription → **Paddle** (MoR, tax handled) or **Gumroad** (simpler, smaller MoR cut)
   - Physical / RUO peptide / regulated → **BTCPay** (crypto, self-hosted) + **NMI Direct Post** (card)
   - One-off digital download → **Gumroad** is fastest

3. **Delete the Stripe layer cleanly.** Remove `@stripe/*` packages, env vars (`STRIPE_*`), `/api/stripe/webhook` routes, `loadStripe(...)` imports, all `pk_*`/`sk_*` references. Don't leave dead imports for "future migration back" — Stripe is permanently banned.

4. **Wire the replacement.** Per-rail pattern:
   - **Paddle:** `npm i @paddle/paddle-node-sdk`, server-side `createCheckout` returning hosted checkout URL, `/api/paddle/webhook` with signature verification (timing-safe), idempotent event handlers
   - **Gumroad:** link to product URL, webhook on sale completion
   - **BTCPay:** self-hosted instance + REST API, invoice creation, webhook on payment confirmation
   - **NMI Direct Post:** direct POST to gateway, no JS SDK, response handling server-side

5. **Webhook security (NON-NEGOTIABLE — per D20):** route the diff through `code-reviewer` agent BEFORE pushing. Check for:
   - Timing-safe signature comparison (`crypto.timingSafeEqual`, not `===`)
   - Webhook timestamp freshness check (reject events >5min old — prevents replay)
   - Idempotent event handling (don't double-process same `event_id`)
   - Correct HTTP codes (200 only after success; 4xx invalid; 5xx for retry)
   - No URL fabrication with `customer_id` in query params (auth-bypass surface)

6. **Test the failure paths.** Try: stale webhook signature, replayed event, unknown customer_id, missing required fields, malformed JSON. All must fail closed.

7. **Ship gate.** `code-reviewer` pass → integration tests against new rail's sandbox → smoke test on staging → promote.

**Reference incidents:**
- DoseCraft commit `9df18ed3` — 5 P0 security ship-blockers caught in Paddle-rip code review (timing-attack, replay, silent-drop, URL leak, auth bypass). All landed before push.
- Aurex Stripe ban — `project_aurex.md` documents BTCPay + NMI scaffolded as canonical pattern.

**Pairs with:** D18 (Stripe ban scope), D20 (payment-rail commits require code-reviewer gate), `code-reviewer` agent.

## How to add a new workflow

If during a session you build a multi-step recipe that worked well:
1. Append it here as Wn with trigger + numbered steps
2. If the workflow is detailed (>20 lines), put it in `workflows/<name>.md` and link from here
3. Cross-reference from the relevant skill or agent
