# PRODUCT-PACKAGING.md

This system is a premium AI coding operating system, not a bag of tools.

The current four-week plan to make it sellable open-source quality lives at
`docs/FOUR-WEEK-PRODUCT-MASTER-PLAN.md`. The done-state is tracked in
`.ai/ISA-sellable-open-source-ai-coding-system.md`.
Browser automation mode boundaries live at
`docs/BROWSER-AUTOMATION-TRUTH-TABLE.md`.
Competitive proof against the top reference systems lives at
`docs/SUPERIORITY-MATRIX.md`.
The first sustained six-hour dogfood proof lives at
`docs/DOGFOOD-REPORT-2026-05-24.md`.
Reference extraction tracks live at `docs/EXTRACTION-TRACKS.md`. The mission
artifact contract lives at `docs/MISSION-KERNEL.md`.

## Product Promise

One clean developer cockpit that routes work to the right AI lane:

```text
VS Code cockpit
  -> Codex for code edits and local verification
  -> Claude for architecture, security, compliance, final review
  -> Kimi for browser, UI implementation, screenshots, visual/operator work
  -> DeepSeek for cheap extraction, transforms, summaries, bulk passes
  -> ChatGPT image for image generation/editing and creative direction
  -> TEL for credentialed actions with audit boundaries
```

The product value is simplicity under power. A developer should not need to
think about which model to ask first. The system should route by capability,
trust tier, and safety boundary.

## What Makes It Sellable

- **Persistent workspace home:** VS Code is the surface. The primary action is
  Continue Work, not manage routes or inspect dashboards.
- **One cockpit:** no duplicate IDEs.
- **Native cockpit UI:** Activity Bar, sidebar dashboard, status bar, and command palette actions.
- **Opinionated lanes:** each AI has a specific job.
- **Creative-reference loop:** Image 2.0 creates approved visual direction;
  Kimi converts that reference into functional UI.
- **Executable routing:** `ai-lanes.json`, `cc-lane`, and router smoke tests.
- **Source-controlled checks:** `.ai/checks/` turns launch, routing, security,
  trust, and feedback-law expectations into committed runnable policy.
- **Workspace trust profile:** `.ai/trust.json` defines shell, network, browser,
  publish, paid-action, destructive-action, and TEL boundaries per repo.
- **Mission ledger:** `cc-mission-ledger` backs the cockpit continuation surface
  with repo-matched state and Plan/Act/Checkpoint/Resume events instead of
  static dashboard copy.
- **Mission kernel:** `cc-mission-kernel` standardizes durable mission
  artifacts: mission, route receipt, trust decision, cost ledger, proof bundle,
  and agent timeline. The cockpit can read this before falling back to ledgers.
- **Agent runtime adapter:** `cc-agent-runtime` turns a typed `AgentRunInput`
  into Mission Kernel route, trust, cost, proof, `AgentRunResult`, and
  normalized timeline events.
- **Mission event contract:** `cc-mission-events` validates the runtime event
  language before the cockpit renders continuity from it.
- **Sustained dogfood runner:** `cc-dogfood-session` runs multi-cycle timed
  sessions with Mission Kernel runs, event validation, provider/context/router
  logs, and final product gates.
- **Visible health:** weekly health and acceptance demo show drift.
- **Visible control:** permission matrix, checkpoint timeline, and route receipts are in the cockpit.
- **Visible dependencies:** native AI app versions and bridge health are in the cockpit.
- **Code-density discipline:** Pulse is present as a generation/cleanup protocol, not another lane.
- **Token ledger:** `cc-token-ledger` reports lane mix, estimated token usage,
  fallback count, cost, and premium-spend avoidance from existing router logs.
- **Benchmark fixtures:** `cc-benchmark-fixtures` runs 10 public scenarios:
  coding, extraction, design, browser proof, security review, long context,
  refactor, failing test repair, image-to-UI handoff, and permission-denied
  trust behavior. Each fixture includes tests, route expectations, repo-map
  proof, and diff-surface proof. `cc-benchmark-run` scores broken-first repair
  and refactor fixtures with an expected patch, baseline probe, and final test
  verification. Long-context fixtures include citation and top-risk scoring.
- **Competitive proof matrix:** `cc-superiority-check` keeps claims against
  OpenHands, Claude Code, Cursor, Cline, OpenCode, Kimi, Codex, Windsurf,
  Devin, Octagents-style swarms, and token-router stacks tied to explicit
  proof commands and known gaps.
- **Cockpit webview smoke:** `cc-cockpit-webview-smoke` proves the packaged
  cockpit surface still contains the continuation UI, result stream, assets,
  startup-safe activation contract, and clean npm audit.
- **Feedback-law discipline:** Mega Cycle anti-pattern laws are executable through
  autonomy preflight, `ai depth-check`, `ai evolve`, and `cc-feedback-law-check`.
- **Safe credentials:** TEL handles credentialed actions; free/lab lanes do not.
- **Rebuildable config:** dotfiles own the editor, shell, commands, docs, and checks.
- **Reference-aware:** external systems inform the architecture but do not become noise.

## Acceptance Demo

Fast human-facing demo:

```sh
cc-demo-quick
```

Expected proof: representative routing, public fixture workflow, 10-scenario
benchmarks, cockpit smoke, trust gate, and mission ledger are green without
requiring a clean tree.

Run:

```sh
cc-system-demo
cc-demo-fixture
```

From VS Code, run the task:

```text
AI: System Demo
```

Expected proof:

1. lane registry is valid
2. capability routes are readable
3. representative prompts route correctly
4. AI-SYSTEM-V2 reports operational
5. VS Code live config is symlinked to dotfiles
6. core CLIs exist
7. disk has at least 25GB free by default

That is the minimum "this machine is ready" demo.

Primary VS Code tasks:

- `AI: Status`
- `AI: Explain Route`
- `AI: Lane Route`
- `AI: Build / Fix`
- `AI: Design / Browser`
- `AI: Research / Extract`
- `AI: Browser Check`
- `AI: Route Receipt`
- `AI: Router Metrics`
- `AI: Permission Matrix`
- `AI: Save Plan`
- `AI: Checkpoints`
- `AI: System Demo`
- `AI: Disk Readiness`
- `AI: Product Readiness`
- `AI: Context Meter`
- `AI: Session Ledger`
- `AI: Pulse Status`
- `AI: Native App Status`
- `AI: Repo Map`
- `AI: Browser Proof`

Native extension:

- `vscode/ai-cockpit/`
- installed by `~/dotfiles/install.sh`
- packaged by `cc-package-cockpit`
- exposes the same intent modes as a sidebar product surface
- includes a selected-mode prompt composer with current file/selection context,
  file/diff context chips, streaming output, route preview, router metrics,
  repo map, semantic index, diff hunks, context meter, Kimi status, jobs, lanes,
  permissions, checkpoints, loop quality, Pulse status, native app status,
  route receipts, readiness, and disk gate
- renders common inspection reports inline, keeping routine control checks
  inside the sidebar instead of terminal scrollback

## Product Boundary

Core lanes:

- Codex
- Claude
- Kimi
- DeepSeek
- ChatGPT image / Image 2.0
- TEL
- Playwright as clean browser fallback only

Reference systems studied:

- Cursor: native AI IDE UX, context indexing, rules, background agents, PR review
- Cline: human-in-the-loop agent approvals, checkpoints, Plan/Act, MCP/tools, cost visibility
- Kimi Desktop/Kimi Code: outcome modes, session/context UX, WebBridge status,
  file-heavy workflows, reusable skills/presets, and desktop app packaging
- Pulse: code-density protocol for compact generated code without compressing
  tests, errors, or user-facing clarity
- Codex/ChatGPT/Claude/Perplexity native app references: command center, screen/file
  context, extension/security boundaries, native app control, and dependency
  status patterns
- Autonomous Loop / Mega Cycle: counter-action discipline, null-result health,
  depth ladder, repeated-theme escalation, and anti-pattern memories
- FreeLLMAPI: provider registry and fallback architecture
- OpenCode/Antigravity videos: cheap/free model lanes behind an IDE-like cockpit

Study/lab lanes:

- FreeLLMAPI-style free-tier gateway
- Qwen/OpenRouter/OpenCode Zen
- any future cheap/free model path

Removed from active stack:

- Crush, because it duplicated the interface layer without adding an independent
  model, safety boundary, or cost advantage.

## Definition Of 100% Functional

Installed system is 100% when:

1. `cc-health-weekly --verbose` is green except intentional dirty-repo state
2. `cc-system-demo` passes
3. `cc-product-readiness` has no blockers
4. `cc-package-cockpit` produces a VSIX
5. active configs are committed and pushed
6. one real workflow has run end-to-end: route -> edit -> verify -> browser/UI check -> final review
7. `cc-workflow-proof` produces a readable proof packet
8. `cc-demo-fixture` proves the route/repo-map/diff flow on a public fixture
9. `cc-fresh-clone-check` proves a clean clone can dry-run install, package,
   run the fixture demo, and leave a temporary home untouched
10. `cc-ai-checks` proves source-controlled checks in `.ai/checks/` pass
11. `cc-trust-profile --check` proves repo-local autonomy policy is valid
12. `cc-trust-gate --check` proves cockpit runs are machine-gated before routing
13. `cc-token-ledger --check` proves token/cost telemetry is readable
14. `cc-mission-ledger --check` proves persistent continuation state is readable
15. `cc-benchmark-fixtures --check` proves the 10-scenario fixture suite is green
16. `cc-cockpit-webview-smoke` proves the cockpit package surface is structurally intact
17. `cc-feedback-law-check` proves the Mega Cycle feedback laws are present,
    loaded by autonomy preflight, exposed through the control plane, and
    documented in the packaged system
18. `cc-superiority-check` proves competitive claims are documented against
    reference systems, tied to commands, and backed by at least three graded
    benchmark fixtures
19. `cc-mission-kernel --check` proves mission artifacts have a documented,
    schema-validated object model for cockpit continuity and proof bundles
20. `cc-agent-runtime --check` proves a harmless typed runtime run can create
    route, trust, cost, proof, result, and timeline artifacts
21. `cc-mission-events --check` proves the runtime emits normalized lifecycle
    events for preflight, trust, route, context, runtime, permission, tool,
    verification, proof, and completion
22. `cc-dogfood-session --check` proves the sustained dogfood runner and its
    dependencies are installed before a six-hour run

Daily-driver confidence is sampled by:

```sh
cc-dogfood-day
```

That command is non-mutating. It proves the developer-day path across router
scenario coverage, workflow proof, context pressure, diff surface, browser
proof, cockpit packaging, and mission-state regression tests.

Current local state is tracked by `cc-product-readiness`; dirty/synced repo
state is expected while active work is in flight.

Sellable system is 100% when:

1. install flow is one command plus documented prerequisite accounts
2. first-run health explains every missing dependency in plain language
3. demo workflow creates visible output in under five minutes
4. quota/cost/route receipt is visible
5. plan artifacts can be saved before execution
6. docs distinguish core, optional, and study lanes
7. no secrets, paid actions, or destructive commands can run without the right boundary
8. `cc-product-readiness` is clean on a fresh install target
9. the cockpit extension can be distributed as a VSIX
10. route, repo context, diff review, and readiness can run inside the cockpit
11. native app status and Pulse status are visible without terminal spelunking
12. source-controlled AI checks and workspace trust policy are executable
13. `cc-demo-quick` gives a cold reviewer the product thesis and proof in one
    short terminal run without requiring a clean tree
14. `cc-superiority-check` keeps "better than the top projects" claims honest
    by requiring a dimension-by-dimension matrix, required proof commands, and
    graded benchmark depth
15. the Mission Kernel exists as a concrete artifact contract so missions can
    carry route, trust, cost, proof, timeline, blockers, and next action
16. the Agent Runtime Adapter exists so a mission can move through preflight,
    trust, route, context, launch, tool execution, verification, and proof
    without bespoke per-tool state
17. the Mission Event contract exists so provider-specific logs adapt into one
    cockpit-safe event ontology
18. the timed dogfood runner can execute a real sustained working window and
    leave durable cycle logs, mission artifacts, event validation, and final
    readiness proof

The strict gate is:

```sh
cc-ten-readiness
```

The external-facing proof command is:

```sh
cc-verify-product
```

It is intentionally harsher than `cc-product-readiness`. It requires public CI,
external evaluator readiness, fresh-clone validation, source-controlled AI
checks, feedback-law validation, dogfood proof, product readiness, release
readiness, portable launch docs, and this documented 10/10 contract.

## Packaging Rule

Every feature must pass one of these tests:

- makes the system more capable
- makes it safer
- makes it cheaper
- makes it easier to understand
- makes it easier to rebuild

If not, it stays out.

## Reference Harvest Rule

Reference projects are gap detectors first. We study tools loved by developers
to name missing capability classes in this system, not to collect shiny parts.

Prebuilt code can be harvested only when all of these are true:

1. it fills a named gap in the existing cockpit/router/lane architecture
2. it is one of the best available implementations of that specific capability
3. it can be wired into our current direction without adding a duplicate IDE,
   duplicate assistant shell, or unowned model/tool lane
4. its license and maintenance profile are acceptable
5. the result makes the system more capable, safer, cheaper, clearer, or easier
   to rebuild

If a reference project has a strong idea but the code would distort the system,
we rebuild the capability natively instead of importing the project.

Code-level harvesting follows `docs/archive/reference-studies/CODE-HARVEST-WORKFLOW.md`: named gap first,
license/maintenance/fit gate second, import or adaptation third, cockpit-visible
verification last.
