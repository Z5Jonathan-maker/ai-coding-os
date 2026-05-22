# AI System Cockpit

Native VS Code cockpit for AI-SYSTEM-V2.

## Features

- Auto-first prompt composer that lets the router choose the working lane instead of forcing a brittle model path.
- Intent modes for Code, Browser, Extract, and Route preview.
- Current file or selected code context can be attached to prompts, with extra files and git diff available as chips.
- Inline streaming route/output, diff review, repo index, and inspection reports.
- Primary cards for route receipt, file changes, context pressure, and last result, with deeper diagnostics collapsed under Project Context, System Checks, and Advanced.
- Degraded health state when a provider circuit is open, with Auto mode as the recovery path.
- Status bar readiness entry.

## Requirements

- Jonathan's AI-SYSTEM-V2 dotfiles installed.
- `router-ask`, `cc-system-demo`, `cc-product-readiness`, `cc-router-metrics`, and related cockpit commands available on `PATH`.
- VS Code 1.96.0 or newer.

## Install

Local development install is managed by:

```sh
~/dotfiles/install.sh
```

Packaged install:

```sh
code --install-extension dist/ai-system-cockpit-0.1.0.vsix
```

## Verification

```sh
cc-product-readiness
cc-system-demo
cc-health-weekly --verbose
```
