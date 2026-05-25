# AI System Cockpit

Native VS Code cockpit for the AI Coding OS command surface.

## Features

- Composer-first interface with one primary Run path and Auto as the default mode.
- Optional modes for Code, Browser, Creative Handoff, Extract, and Route preview are tucked behind a mode drawer.
- Creative Handoff starts the first-class wedge workflow: brief, route receipt, staged artifact manifest, proof bundle, and next-action packet.
- Creative Handoff Status, Continue, and Approve use the local mission files in `.ai/design-handoffs/` so a visual reference can move through approval without manual command lookup.
- Startup-safe by default: the cockpit does not activate or auto-open until opened.
- Current file or selected code context can be attached to prompts, with extra files and git diff available as chips.
- Inline streaming route/output, creative handoff creation, diff review, repo index, and inspection reports.
- Native inline edit command: captures the current selection or line, routes to
  Codex, opens a VS Code diff preview, then applies only after explicit approval.
- Full cockpit opens beside the active editor and preserves workspace context.
- Mode, permission, file, diff, and review controls are collapsed behind a
  context drawer so continuation stays primary.
- Deeper diagnostics collapsed under Overview, Context, System, and Advanced.
- Daily readiness state separates usable lanes from the stricter release/product gate.
- Degraded health state when a provider circuit is open, with Auto mode as the recovery path.
- Status bar readiness entry.

## Requirements

- This repo's `bin/` directory available on `PATH`.
- `cc-route`, `cc-design-handoff`, `router-ask`, `cc-system-demo`, `cc-product-readiness`, `cc-router-metrics`, and related cockpit commands available on `PATH`.
- VS Code 1.96.0 or newer.
- Provider accounts for the lanes you want to use. See `docs/PROVIDER-ACCOUNTS.md` at the repo root.

## Install

Local development install is managed by:

```sh
~/dotfiles/install.sh
```

Packaged install after generating the VSIX locally:

```sh
cc-package-cockpit
code --install-extension dist/ai-system-cockpit-0.1.0.vsix
```

## Verification

```sh
cc-product-readiness
cc-cockpit-webview-smoke
cc-system-demo
cc-health-weekly --verbose
```
