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

## How to add a new workflow

If during a session you build a multi-step recipe that worked well:
1. Append it here as Wn with trigger + numbered steps
2. If the workflow is detailed (>20 lines), put it in `workflows/<name>.md` and link from here
3. Cross-reference from the relevant skill or agent
