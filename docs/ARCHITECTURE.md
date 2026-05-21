# ARCHITECTURE.md

## System Shape

```text
Developer
  -> VS Code Cockpit
      -> local command surfaces
      -> route receipts
      -> readiness and setup states
      -> browser/demo proof
  -> cc-router / AI-SYSTEM-V2
      -> lane classifier
      -> fallback chains
      -> quota/cost/session receipts
  -> AI lanes
      -> Codex: code edits, local verification, integration
      -> Claude: architecture, hard debugging, security/final QA
      -> Kimi/WebBridge: browser, UI, screenshots, visual operator work
      -> DeepSeek: cheap extraction, transforms, summaries
      -> ChatGPT image: image generation/editing
      -> TEL: credentialed actions with audit boundaries
      -> Playwright: clean browser fallback
```

## Source Of Truth

| Area | Source |
|---|---|
| Lane registry | `ai-lanes.json` |
| Router implementation | `~/code/projects/cc-router` |
| VS Code cockpit | `vscode/ai-cockpit/` |
| Public setup doctor | `bin/cc-first-run` |
| Product readiness gate | `bin/cc-product-readiness` |
| Five-minute demo | `bin/cc-demo-five-minute` |
| Browser proof | `bin/cc-browser-proof` |
| Packaging contract | `docs/PRODUCT-PACKAGING.md` |
| Master plan | `docs/FOUR-WEEK-PRODUCT-MASTER-PLAN.md` |

## Design Rules

1. The cockpit is the user surface.
2. The router is the engine.
3. Lanes are capability boundaries, not model hype labels.
4. Every fallback must be visible.
5. Every launch claim needs a command that proves it.
6. Credentials stay out of transcripts and git.
7. Reference projects are harvested only for named gaps.

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
- route receipt and metrics
- permission matrix
- checkpoint visibility
- context pressure
- session ledger
- browser mode
- native app status
- demo mode

It should not create a second router, model runtime, credential store, or hidden
agent loop.

## Extension Points

New work should enter through one of:

- new command in `bin/`
- new cockpit card/action for an existing command
- lane registry update with smoke/integrity coverage
- router capability update in `cc-router`
- documentation update for a public setup or launch boundary

Avoid adding new long-running daemons unless the capability cannot be represented
as a command plus cockpit surface.
