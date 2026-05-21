# AI System Cockpit

Native VS Code cockpit for AI-SYSTEM-V2.

## Features

- Sidebar dashboard for readiness, route receipts, router metrics, permissions, checkpoints, jobs, lanes, disk, and product readiness.
- Prompt composer with Build, Design, Research, Route, and Plan modes.
- Current file or selected code context can be attached to prompts.
- Inline route preview and inspection reports.
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
