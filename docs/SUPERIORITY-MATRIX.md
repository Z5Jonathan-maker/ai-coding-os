# Competitive Evidence Ledger

This document is an internal evidence ledger, not public positioning copy.

The target is not to claim superiority by language. The target is to identify
which reference systems expose real gaps, then close those gaps with commands,
artifacts, or removal of unsupported claims.

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

- **Evidence present**: capability exists and has a local command, fixture, or
  artifact.
- **Needs live proof**: capability exists but still needs stronger real-session,
  real-provider, or competitor evidence.
- **Gap**: not good enough for the target standard yet.

| Dimension | We Must Win By | Current Proof | Missing Proof | Gate / Command | Status |
|---|---|---|---|---|---|
| Routing/orchestration | Capability lanes are explicit, inspectable, and fallback-aware | `ai-lanes.json`, `cc-lane`, `cc-router-smoke`, `cc-router-receipt`, `cc-router-metrics`, degraded-provider replay fixture | Live degraded-provider replays across non-Claude lanes; public route planner remains classifier-only | `cc-router-smoke`, `cc-lane-registry-check`, `cc-router-degradation-check` | Needs live proof |
| Output-quality benchmarks | Claims are backed by executable tasks, not screenshots | Benchmark fixtures; source-integrity gate; graded repair, refactor, long-context, routing PR-quality scoring, and two source-linked upstream issue replays | More third-party repo tasks from real upstream issues | `cc-benchmark-fixtures --check`, `cc-benchmark-source-check`, `cc-benchmark-run <fixture>`, `cc-mutating-dogfood`, `cc-public-repo-dogfood`, `cc-third-party-dogfood` | Evidence present |
| Trust and permissions | Autonomy is gated before routing, not after damage | `.ai/trust.json`, `cc-trust-profile`, `cc-trust-gate`, permission matrix, adversarial paid/destructive/secret/force-push/cross-user/credential fixtures | More real-world TEL dry-run fixtures | `cc-trust-gate --check`, `cc-trust-adversarial-check` | Evidence present |
| Credentialed execution | Credentials stay behind policy, audit, redaction, and undo contracts | TEL server/policies, Keychain-first broker, ignored audit logs, GraphQL prefix constraints, mutation undo windows | Live approved dry-runs against each credentialed service | `cc-tel-policy-check` | Needs live proof |
| Token and cost efficiency | Quality-first routing still exposes economics and fallback cost | `cc-token-ledger`, router receipts, premium-spend avoidance estimates | Real per-provider token capture where APIs expose usage | `cc-token-ledger --check` | Needs live proof |
| Persistent memory and continuation | The product opens on current mission, not a blank prompt | `cc-mission-ledger`, cockpit continuation UI, session ledger | More real multi-day mission replay demos | `cc-mission-ledger --check`, `cc-cockpit-webview-smoke` | Evidence present |
| Browser/UI lane | Browser work has a bounded proof path and Kimi/WebBridge status | `cc-browser-proof`, `cc-browser-replay-check`, `cc-browser-replay-live-check`, `cc-browser-visual-proof`, `cc-kimi-status`, browser-proof benchmark | Real target authenticated replay still depends on approved local Kimi/WebBridge session state | `cc-browser-proof --json`, `cc-browser-replay-check`, `cc-browser-replay-live-check`, `cc-browser-visual-proof --check` | Needs live proof |
| Cockpit product UX | Main surface feels like an AI-native workspace, not a dashboard | VS Code cockpit package, media, webview smoke, deterministic state screenshots, real-use replay bundle, headless interaction proof, visual-diff gate, tracked walkthrough MP4 | More live dogfood videos from real project sessions and inline diff/apply flow | `cc-cockpit-webview-smoke`, `cc-cockpit-state-proof`, `cc-cockpit-interaction-proof`, `cc-cockpit-replay-bundle-check`, `cc-cockpit-visual-diff`, `cc-cockpit-walkthrough-check`, `cc-package-cockpit` | Needs live proof |
| Creative direction kernel | Taste is routed as cognitive work, not treated as a generic image task | `cc-creative-kernel-check`, `cc-asset-kit-check`, `cc-frontend-wedge-check`, `cc-taste-benchmark-check`, `cc-frontend-demo`, sequential Image 2.0 asset kit, design DNA, taste validation | Real project proof bundles from shipped design missions | `cc-creative-kernel-check`, `cc-asset-kit-check`, `cc-frontend-wedge-check`, `cc-taste-benchmark-check`, `cc-frontend-demo` | Evidence present |
| Daily-driver workflow | A developer can route, edit, verify, review, and resume from one system | `cc-dogfood-day`, `cc-demo-quick`, `cc-workflow-proof`, mutating dogfood report, public-repo dogfood report, third-party dogfood report, PR-quality scorer | Externally sourced issue replay with maintainer-style scoring | `cc-dogfood-session`, `cc-mutating-dogfood`, `cc-public-repo-dogfood`, `cc-third-party-dogfood`, `cc-pr-quality-score --check` | Evidence present |
| Autonomous loops | System improves through checks and feedback laws without endless noise | `cc-feedback-law-check`, loop quality, depth-check/evolve exposure | Real repeated-cycle improvement logs tied to shipped diffs | `cc-feedback-law-check` | Needs live proof |
| Extensibility | Provider/tool growth is controlled by lane contracts | `ai-lanes.json`, command registry, product packaging rule, public lane-extension guide, valid/invalid extension fixtures | More third-party lane adapters exercised without secrets | `cc-lane-registry-check`, `cc-lane-extension-check`, `cc-public-ci-check` | Evidence present |
| Public evaluator experience | Cold reviewer can understand and verify quickly | `cc-demo-quick`, `cc-evaluator-check`, `cc-fresh-clone-check`, `cc-release-artifact-check`, `cc-release-concurrency-check`, `cc-portability-check`, Public CI | Hosted demo/video walkthrough and public/maintainer split | `cc-evaluator-check`, `cc-release-artifact-check`, `cc-release-concurrency-check`, `cc-portability-check` | Needs live proof |
| Competitive clarity | The repo states where it wins and where it does not | This document, executable command inventory, graded benchmark fixtures, and explicit gap list | Periodic refresh against live reference projects | `cc-superiority-check` | Needs proof |

## Non-Negotiable Gaps Before "Better Than The Top Projects"

These are the remaining gaps that matter most:

1. **Real-world benchmark depth**: expand beyond the first two source-linked upstream issue replays into more real public issues across frontend, backend, and agent-runtime work.
2. **Authenticated browser replay**: expand from live credential-free WebBridge readiness to real approved target replays on prepared machines.
3. **Third-party issue realism**: expand from controlled external repo mutation to externally sourced upstream issues scored by the PR-quality gate.
4. **Cockpit real-use evidence**: expand from the tracked walkthrough MP4 into live dogfood videos from real project sessions.
5. **Package separability**: expand from clone-root command defaults to more cold third-party installs on non-maintainer machines.

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
cc-router-degradation-check
cc-benchmark-run failing-test-repair
cc-benchmark-run refactor-cleanup
cc-benchmark-run long-context
cc-benchmark-run routing-pr-quality
cc-benchmark-run upstream-issue-replay
cc-benchmark-run upstream-issue-replay-axios-params
cc-benchmark-source-check
cc-token-ledger --check
cc-trust-gate --check
cc-trust-adversarial-check
cc-tel-policy-check
cc-mission-ledger --check
cc-creative-kernel-check
cc-asset-kit-check
cc-frontend-wedge-check
cc-taste-benchmark-check
cc-frontend-demo
cc-lane-extension-check
cc-browser-replay-check
cc-browser-replay-live-check
cc-browser-visual-proof --check
cc-cockpit-webview-smoke
cc-cockpit-state-proof --check
cc-cockpit-interaction-proof --check
cc-cockpit-replay-bundle-check
cc-cockpit-visual-diff
cc-cockpit-walkthrough-check
cc-dogfood-session --check
cc-mutating-dogfood --check
cc-public-repo-dogfood --check
cc-third-party-dogfood --check
cc-pr-quality-score --check
cc-portability-check
cc-release-artifact-check
cc-release-concurrency-check
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
