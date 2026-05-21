# PRODUCT-PACKAGING.md

This system is a premium AI coding operating system, not a bag of tools.

## Product Promise

One clean developer cockpit that routes work to the right AI lane:

```text
VS Code cockpit
  -> Codex for code edits and local verification
  -> Claude for architecture, security, compliance, final review
  -> Kimi for browser, UI, screenshots, visual/operator work
  -> DeepSeek for cheap extraction, transforms, summaries, bulk passes
  -> ChatGPT image for image generation/editing
  -> TEL for credentialed actions with audit boundaries
```

The product value is simplicity under power. A developer should not need to
think about which model to ask first. The system should route by capability,
trust tier, and safety boundary.

## What Makes It Sellable

- **One cockpit:** VS Code is the surface. No duplicate IDEs.
- **Native cockpit UI:** Activity Bar, sidebar dashboard, status bar, and command palette actions.
- **Opinionated lanes:** each AI has a specific job.
- **Executable routing:** `ai-lanes.json`, `cc-lane`, and router smoke tests.
- **Visible health:** weekly health and acceptance demo show drift.
- **Visible control:** permission matrix, checkpoint timeline, and route receipts are in the cockpit.
- **Safe credentials:** TEL handles credentialed actions; free/lab lanes do not.
- **Rebuildable config:** dotfiles own the editor, shell, commands, docs, and checks.
- **Reference-aware:** external systems inform the architecture but do not become noise.

## Acceptance Demo

Run:

```sh
cc-system-demo
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

Native extension:

- `vscode/ai-cockpit/`
- installed by `~/dotfiles/install.sh`
- packaged by `cc-package-cockpit`
- exposes the same intent modes as a sidebar product surface
- includes a selected-mode prompt composer with current file/selection context,
  file/diff context chips, streaming output, route preview, router metrics,
  jobs, lanes, permissions, checkpoints, route receipts, readiness, and disk gate
- renders common inspection reports inline, keeping routine control checks
  inside the sidebar instead of terminal scrollback

## Product Boundary

Core lanes:

- Codex
- Claude
- Kimi
- DeepSeek
- ChatGPT image
- TEL
- Playwright as clean browser fallback only

Reference systems studied:

- Cursor: native AI IDE UX, context indexing, rules, background agents, PR review
- Cline: human-in-the-loop agent approvals, checkpoints, Plan/Act, MCP/tools, cost visibility
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

Personal system is 100% when:

1. `cc-health-weekly --verbose` is green except intentional dirty-repo state
2. `cc-system-demo` passes
3. `cc-product-readiness` has no blockers
4. `cc-package-cockpit` produces a VSIX
5. active configs are committed and pushed
6. one real workflow has run end-to-end: route -> edit -> verify -> browser/UI check -> final review
7. `cc-workflow-proof` produces a readable proof packet

Current known blocker: product readiness. Run `cc-product-readiness` for the
exact list; dirty/synced repo state is expected while active work is in flight.

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

## Packaging Rule

Every feature must pass one of these tests:

- makes the system more capable
- makes it safer
- makes it cheaper
- makes it easier to understand
- makes it easier to rebuild

If not, it stays out.
