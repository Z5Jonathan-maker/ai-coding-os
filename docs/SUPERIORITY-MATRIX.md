# SUPERIORITY-MATRIX.md

This document is the competitive proof contract for AI Coding OS.

The target is not "more features than everyone." The target is a simpler,
capability-routed system that can sit beside OpenHands, Claude Code, Cursor,
Cline, OpenCode, Kimi, Codex, Windsurf, Devin, Octagents-style swarms, and
triple-router/token-efficiency stacks without looking unserious.

## Standard

AI Coding OS wins only where it has proof:

1. the capability is present
2. the capability is wired into the cockpit/router path
3. the capability has a command, fixture, or source-controlled check
4. the capability improves capability, safety, cost, clarity, or rebuildability
5. the capability does not add duplicate IDEs, duplicate assistants, or noisy lanes

If a reference system is stronger in a category, we mark the gap directly.

## Reference Systems

| Reference | What It Wins At | What We Must Beat Or Match |
|---|---|---|
| OpenHands | Open-source autonomous engineer, repo inspection, command execution, PR-style workflows | Comparable local proof without requiring Docker-first workflow or a separate agent IDE |
| Claude Code | Terminal-native autonomous coding, MCP ecosystem, architecture/reasoning quality | Keep Claude as the strategic lane while proving the multi-lane system is simpler for daily work |
| Cursor | Best commercial AI IDE polish and codebase-aware editing flow | Cockpit must feel like a premium continuation workspace, not an admin dashboard |
| Cline | Human-in-the-loop VS Code agent, approvals, browser, MCP, task cost visibility | Match permission clarity and cost visibility while hiding routine mechanics from the main surface |
| OpenCode | Provider-agnostic terminal agent, power-user customization, local/offline options | Keep provider abstraction and CLI proof without becoming terminal-only |
| Kimi | Browser/UI/operator lane and high-quality frontend execution | Use Kimi as the design/browser specialist, not as a duplicate cockpit |
| Codex | Engineering execution, debugging, tests, app/server/IDE agent surface | Keep Codex as the execution lane and prove local verification through fixtures |
| Windsurf | Polished agent UX and low-friction IDE workflow | Match UX calmness and daily-driver flow through the VS Code cockpit |
| Devin | Ambitious autonomous software-engineer product model | Borrow the end-to-end ambition, but prove local-first control and verifiable gates |
| Octagents / multi-agent stacks | Parallel specialized agents and work distribution | Use swarms only where independent work exists; avoid visible orchestration noise |
| Triple-router / token-efficiency stacks | Cheap/quality lane routing and token discipline | Prove model selection, fallback, token ledger, and premium-spend avoidance |

## Scorecard

Status values:

- **Strong**: capability exists and has proof.
- **Needs proof**: capability exists but needs stronger benchmark/demo evidence.
- **Gap**: not good enough for the target standard yet.

| Dimension | We Must Win By | Current Proof | Missing Proof | Gate / Command | Status |
|---|---|---|---|---|---|
| Routing/orchestration | Capability lanes are explicit, inspectable, and fallback-aware | `ai-lanes.json`, `cc-lane`, `cc-router-smoke`, `cc-router-receipt`, `cc-router-metrics` | More live degraded-provider replay fixtures | `cc-router-smoke`, `cc-lane-registry-check` | Strong |
| Output-quality benchmarks | Claims are backed by executable tasks, not screenshots | 10 benchmark fixtures; graded repair, refactor, long-context scoring; mutating dogfood report; public-repo dogfood report; third-party dogfood report | More third-party repo tasks, UI/browser visual scoring, PR-quality scoring | `cc-benchmark-fixtures --check`, `cc-benchmark-run <fixture>`, `cc-mutating-dogfood`, `cc-public-repo-dogfood`, `cc-third-party-dogfood` | Strong |
| Trust and permissions | Autonomy is gated before routing, not after damage | `.ai/trust.json`, `cc-trust-profile`, `cc-trust-gate`, permission matrix | More adversarial fixture coverage for paid/destructive/cross-user actions | `cc-trust-gate --check` | Strong |
| Token and cost efficiency | Quality-first routing still exposes economics and fallback cost | `cc-token-ledger`, router receipts, premium-spend avoidance estimates | Real per-provider token capture where APIs expose usage | `cc-token-ledger --check` | Strong |
| Persistent memory and continuation | The product opens on current mission, not a blank prompt | `cc-mission-ledger`, cockpit continuation UI, session ledger | More real multi-day mission replay demos | `cc-mission-ledger --check`, `cc-cockpit-webview-smoke` | Strong |
| Browser/UI lane | Browser work has a bounded proof path and Kimi/WebBridge status | `cc-browser-proof`, `cc-kimi-status`, browser-proof benchmark | Visual regression scoring and authenticated-browser fixture replay | `cc-browser-proof --json` | Needs proof |
| Cockpit product UX | Main surface feels like an AI-native workspace, not a dashboard | VS Code cockpit package, media, webview smoke, deterministic state screenshots, headless interaction proof, visual-diff gate | More dogfood videos and richer pixel-diff scoring | `cc-cockpit-webview-smoke`, `cc-cockpit-state-proof`, `cc-cockpit-interaction-proof`, `cc-cockpit-visual-diff`, `cc-package-cockpit` | Strong |
| Daily-driver workflow | A developer can route, edit, verify, review, and resume from one system | `cc-dogfood-day`, `cc-demo-quick`, `cc-workflow-proof`, six-hour dogfood report, mutating dogfood report, public-repo dogfood report, third-party dogfood report | External issue/PR-quality scoring with maintainer-style review | `cc-dogfood-session`, `cc-mutating-dogfood`, `cc-public-repo-dogfood`, `cc-third-party-dogfood` | Strong |
| Autonomous loops | System improves through checks and feedback laws without endless noise | `cc-feedback-law-check`, loop quality, depth-check/evolve exposure | Real repeated-cycle improvement logs tied to shipped diffs | `cc-feedback-law-check` | Strong |
| Extensibility | Provider/tool growth is controlled by lane contracts | `ai-lanes.json`, command registry, product packaging rule | Public extension guide for adding one lane safely | `cc-lane-registry-check`, `cc-public-ci-check` | Strong |
| Public evaluator experience | Cold reviewer can understand and verify quickly | `cc-demo-quick`, `cc-evaluator-check`, `cc-fresh-clone-check`, Public CI | Hosted demo/video walkthrough and release artifact download path | `cc-evaluator-check` | Needs proof |
| Competitive clarity | The repo states where it wins and where it does not | This document and `cc-superiority-check` | Periodic refresh against live reference projects | `cc-superiority-check` | Strong |

## Non-Negotiable Gaps Before "Better Than The Top Projects"

These are the remaining gaps that matter most:

1. **Real-world benchmark depth**: add larger public repo tasks with expected diffs, test evidence, and review-quality scoring.
2. **UI/browser scoring**: move beyond route expectation into screenshot or DOM-level visual assertions.
3. **Third-party issue realism**: expand from controlled external repo mutation to externally sourced issues with PR-quality scoring.
4. **Cockpit pixel-diff scoring**: move from strict hash/byte visual gates to perceptual or pixel-level delta scoring.
5. **Package separability**: make the router/cockpit easy to install without inheriting personal machine assumptions.

Until those are closed, the honest rating is:

```text
Architecture/orchestration: elite
Proof harness: strong and improving
Daily-driver UX: close, not fully proven
Public installability: improving, not finished
Competitive superiority: plausible, not fully proven
```

## Required Proof Commands

The competitive claim must stay backed by these commands:

```sh
cc-demo-quick
cc-benchmark-fixtures --check
cc-benchmark-run failing-test-repair
cc-benchmark-run refactor-cleanup
cc-benchmark-run long-context
cc-token-ledger --check
cc-trust-gate --check
cc-mission-ledger --check
cc-cockpit-webview-smoke
cc-cockpit-state-proof --check
cc-cockpit-interaction-proof --check
cc-cockpit-visual-diff
cc-dogfood-session --check
cc-mutating-dogfood --check
cc-public-repo-dogfood --check
cc-third-party-dogfood --check
cc-verify-product
cc-ten-readiness
```

## Harvest Rule

Reference systems are used as gap detectors:

- If OpenHands is better at autonomous repo execution, add benchmark proof.
- If Cline is better at approvals, harden trust gates and permission UI.
- If Cursor/Windsurf are better at UX, simplify the cockpit and prove flows.
- If OpenCode is better at provider freedom, improve lane abstraction.
- If Kimi is better at browser/UI execution, route to Kimi instead of duplicating it.
- If Codex/Claude are better at execution/reasoning, keep them in their best lanes.
- If token-router patterns are better at economics, improve receipts and ledgers.

Do not add a feature because a reference project has it. Add it only when it
closes a named gap above and passes the packaging rule in
`docs/PRODUCT-PACKAGING.md`.
