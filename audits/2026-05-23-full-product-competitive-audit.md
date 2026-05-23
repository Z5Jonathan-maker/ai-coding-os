# Full Product Competitive Audit — 2026-05-23

## Verdict

This project is no longer average. Architecturally, it is a strong and unusual
AI coding operating system with a credible moat: opinionated multi-model routing,
local-first execution, source-controlled AI checks, mission continuation, token
economics, browser proof, and strict release gates.

It is not yet at the public trust standard of the top GitHub projects it is
compared against. The engine is ahead of many projects in routing composition,
but the product is behind mature developer tools in UI finish, install
hermeticity, remote CI trust, and prolonged real-world dogfood evidence.

Current ruthless rating:

| Area | Score | Notes |
|---|---:|---|
| Routing architecture | 8.7/10 | Real lane boundaries, smoke tests, live provider proof, fallback receipts. |
| Model capacity today | 9.0/10 | Claude, Codex, Kimi, and DeepSeek all responded successfully. |
| Local verification | 9.0/10 | 10/10 readiness, product readiness, fresh clone, source checks, fixtures all pass locally. |
| Competitive architecture | 8.2/10 | Stronger orchestration than many single-agent tools; weaker ecosystem/distribution than mature OSS tools. |
| VS Code cockpit as daily UI | 6.5/10 | Better than before, but still not Cursor/Kimi/Claude-level product finish. |
| Public install/distribution | 6.0/10 | VSIX package exists and fresh clone passes locally; still macOS-first and personal-stack-heavy. |
| Public trust/readiness | 5.8/10 | GitHub Actions is red due billing/spending block; this is a launch blocker. |
| Sellable today | 6.8/10 | Valuable to expert internal operator; not yet "developer buys this cold" quality. |

Bottom line: brilliant direction, real system, not yet public-launch elite.

## Evidence Checked

- `cc-provider-capacity`: `ready=4/4 status=full-capacity`
- Live lane calls:
  - DeepSeek cheap lane returned `deepseek-lane-ok`
  - Claude precision lane returned `claude-lane-ok`
  - Kimi design lane returned `kimi-lane-ok`
  - Codex lane returned `codex-lane-ok`
- `cc-router-smoke`: all representative prompts routed as expected
- `cc-benchmark-fixtures --check`: `passed=3 failed=0`
- `cc-ai-checks`: `passed=8 failed=0`
- `cc-ten-readiness`: `passed=10 failed=0`
- `cc-product-readiness`: `15/15`, `Status: product-ready`
- `cc-package-cockpit`: produced `dist/ai-system-cockpit-0.1.0.vsix`
- `cc-fresh-clone-check`: recently green after the benchmark pass
- `cc-token-ledger`: last 100 calls estimated $1.5530 premium spend avoided
- `cc-first-run`: `required_missing=0 optional_missing=0 personal_missing=0`
- `cc-kimi-status`: WebBridge running, extension connected, official-extension mode
- GitHub Actions: latest Public CI runs are failing before execution because
  account billing/spending state blocks the job from starting.

## Competitive Comparison

### Against Cline / Roo / Goose

They are stronger in user-facing product maturity: marketplace feel, familiar
agent UX, obvious onboarding, community trust, and visible workflows.

This system is stronger in opinionated multi-model role separation. Cline/Roo
give users many modes and providers; this system tries to make that decision
disappear. That is the right strategic bet, but it only wins if the cockpit
feels calm, truthful, and automatic.

Gap: our cockpit still exposes too much machinery and lacks the "obvious in 30
seconds" onboarding quality.

### Against Aider / Codex / Gemini CLI / Qwen Code

Those projects are clearer as command-line tools. They are easier to understand:
"run this agent in a repo."

This project is broader: cockpit, router, browser, mission ledger, checks,
tokens, launch gates, and native app status. That breadth is the advantage and
the risk.

Gap: the public story needs sharper compression. A new developer should not need
to understand 86 `bin/` commands to trust the product.

### Against Continue

Continue's source-controlled check concept is now harvested well. `.ai/checks/`
is the right move.

Gap: Continue is more obviously team/PR-integrated. Our checks are local-first
and can become CI status checks later, but the current GitHub Actions billing
block means public PR trust is not yet real.

### Against OpenHands / SWE-agent

OpenHands and SWE-agent are stronger in isolated/runtime/eval posture. They are
closer to research/agent platforms.

This project correctly rejected a Docker-first runtime for now. That keeps it
simple and local, but it means we cannot yet claim untrusted-repo isolation or
large benchmark-grade agent evaluation.

Gap: benchmark fixtures are useful but tiny. They catch routing regressions; they
do not prove complex issue-solving ability.

### Against Cursor / Windsurf / Kimi Desktop / Claude Desktop

They are ahead in emotional UX, polish, and default daily-driver feel. They feel
like products; this still often feels like a powerful system.

The latest mission-continuation direction is correct, but the installed cockpit
still has a lot of visible controls, command surfaces, and diagnostic zones.

Gap: real premium product feel requires fewer visible decisions, more truthful
continuation, and less raw system output.

## What Is Legitimately Strong

- All four core live lanes are active again.
- The router has real, tested capability boundaries.
- The system now has source-controlled AI checks, trust profile, token ledger,
  mission ledger, and benchmark fixtures.
- Local release/readiness discipline is unusually strong for a private AI stack.
- Kimi WebBridge is on the official extension, not the weaker shim path.
- The Image 2.0 -> Kimi implementation loop is a genuine creative/product
  workflow advantage, not a generic feature.
- The product has a coherent philosophy: smallest competent lane, hidden
  complexity, continuation over command.

## Critical Blockers

1. **Remote CI is red.**
   GitHub Actions Public CI is failing before execution due billing/spending
   account state. Public launch is blocked until this is fixed or CI is moved to
   a working runner.

2. **The cockpit is not yet elite-product quality.**
   It is functional and much improved, but still too diagnostic/control-heavy.
   A developer comparing it to Cursor/Kimi/Claude will respect the backend more
   than the interface.

3. **Daily-driver proof is still too short.**
   Gates pass, but the system needs 5-10 real work sessions across important
   projects with logged failures before it can claim dependable daily operation.

4. **Public install is still personal-stack-shaped.**
   Fresh clone passes locally, but broad adoption still assumes macOS, local
   paths, VS Code, multiple native subscriptions, and a private router adjacent
   to dotfiles.

5. **Dependency audit is not cleanly runnable.**
   `npm audit` reports `ENOLOCK` because there is no lockfile. This may be fine
   for a no-dependency VS Code extension, but an evaluator will read it as an
   unfinished supply-chain posture unless documented or fixed.

## High-Priority Gaps

- Collapse the public command surface. Keep 86 commands internally, but expose
  5-7 public commands in the README.
- Add a "developer cold start" script that proves install, package, demo, and
  first mission in one flow with no private assumptions.
- Convert cockpit result logs into structured mission events by default, with raw
  logs hidden behind details.
- Add actual VS Code webview smoke testing, not only package/unit tests.
- Add a week-long dogfood ledger: task, repo, route, failure, fix, test, time.
- Document provider subscription assumptions in plain language.
- Decide whether this is sold as:
  - a dotfiles-powered AI OS for power users, or
  - a packaged VS Code extension/product.
  Right now it is both, which creates adoption friction.

## Medium Gaps

- Disk remains tight enough to matter for autonomous work.
- Public docs are strong but dense.
- Benchmark fixtures are too small to prove agent skill; they only prove
  routing/regression plumbing.
- No real team/multi-user story yet.
- No marketplace/provider plugin story yet, intentionally. This is acceptable
  for v1 but limits comparison to Goose/Cline-style ecosystems.
- No self-hosted autocomplete lane, intentionally. This is acceptable because
  the product is not a Copilot replacement.

## What Not To Add

- Do not add Crush or another IDE shell.
- Do not add a provider marketplace until the current lanes are daily-driver
  proven.
- Do not add Docker/OrbStack runtime by default.
- Do not add Slack/Discord/Telegram surfaces yet.
- Do not add more dashboard widgets.

## Launch Judgment

Internal daily use: yes, with supervision.

Important-project daily driver: yes for assisted work, not yet as the only
control center.

Public open-source launch: not yet. Remote CI must be fixed, public onboarding
must be simpler, and the cockpit needs one more restraint pass.

Sellable to serious developers today: partially. A technical founder or power
user would see the value. A normal developer would likely say, "This is powerful
but too much system."

## Next 10/10 Milestone

The next bar is not more features. It is trust compression:

1. Fix GitHub Actions billing/spending so Public CI is green remotely.
2. Create one public command: `cc-verify-product`, wrapping fresh clone, source
   checks, fixtures, package, and demo.
3. Reduce README first-run path to under 10 minutes.
4. Make the cockpit open to one truthful current mission and one primary action.
5. Hide model/provider/route details unless expanded.
6. Add webview smoke tests.
7. Run five real work sessions and append every failure to the mission ledger.

If those are done, the project moves from "impressive private system" to
"credible public AI coding OS."
