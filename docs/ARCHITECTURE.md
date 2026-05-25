# ARCHITECTURE.md

## System Shape

```text
Developer
  -> VS Code Cockpit
      -> local command surfaces
      -> route receipts
      -> readiness and setup states
      -> browser/demo proof
  -> cc-route + ai-lanes.json
      -> in-tree lane classifier
      -> fallback chains
      -> dry-run route receipts
  -> optional router-ask / AI-SYSTEM-V2 execution gateway
      -> live provider invocation
      -> quota/cost/session telemetry
  -> AI lanes
      -> Codex: code edits, local verification, integration
      -> Claude: architecture, hard debugging, security/final QA
      -> Kimi/WebBridge: browser, UI implementation, screenshots, visual operator work
      -> DeepSeek: cheap extraction, transforms, summaries
      -> ChatGPT image: image generation/editing, creative direction, canonical visual references
      -> TEL: credentialed actions with audit boundaries
      -> Playwright: clean browser fallback
```

## Source Of Truth

| Area | Source |
|---|---|
| Lane registry | `ai-lanes.json` |
| Route decision engine | `bin/cc-route` backed by `ai-lanes.json` |
| Live execution gateway | `router-ask` / private `AI-SYSTEM-V2` install when available |
| VS Code cockpit | `vscode/ai-cockpit/` |
| Source-controlled AI checks | `.ai/checks/` |
| Workspace trust profile | `.ai/trust.json` |
| Trust gate | `bin/cc-trust-gate` before cockpit routing |
| Mission continuation ledger | `~/.Codex/state/missions.jsonl` via `bin/cc-mission-ledger` |
| Public setup doctor | `bin/cc-first-run` |
| Product readiness gate | `bin/cc-product-readiness` |
| Five-minute demo | `bin/cc-demo-five-minute` |
| Browser proof | `bin/cc-browser-proof` |
| Benchmark fixtures | `fixtures/benchmarks/` via `bin/cc-benchmark-fixtures` |
| Packaging contract | `docs/PRODUCT-PACKAGING.md` |
| Master plan | `docs/FOUR-WEEK-PRODUCT-MASTER-PLAN.md` |

## Design Rules

1. The cockpit is the user surface.
2. The in-tree router is the public decision engine.
3. Lanes are capability boundaries, not model hype labels.
4. Unsupported lane capabilities must be executable contract checks, not prose.
5. Every fallback must be visible.
5. Every launch claim needs a command that proves it.
6. Credentials stay out of transcripts and git.
7. Reference projects are harvested only for named gaps.
8. Static visual direction comes from Image 2.0; functional UI execution comes from Kimi.

## Active Control Plane

The active control plane is local-first:

- dotfiles own shell/editor/command setup
- `install.sh --dry-run` reports setup without mutating home
- `cc-product-readiness` is the release gate
- `cc-demo-five-minute` is the public proof path
- `cc-package-cockpit` creates the distributable VSIX

## Cockpit Responsibilities

The cockpit should show:

- product readiness
- first-run/setup state
- route decision, receipt, and metrics
- permission matrix
- checkpoint visibility
- context pressure
- session ledger
- mission continuation state
- browser mode
- native app status
- demo mode

It should not create a second model runtime, credential store, or hidden agent
loop. Route decisions come from `cc-route`; live provider execution remains an
adapter behind the command surface.

## Extension Points

New work should enter through one of:

- new command in `bin/`
- new cockpit card/action for an existing command
- lane registry update with smoke/integrity coverage
- router capability update in `cc-route` and `ai-lanes.json`
- documentation update for a public setup or launch boundary

Avoid adding new long-running daemons unless the capability cannot be represented
as a command plus cockpit surface.
