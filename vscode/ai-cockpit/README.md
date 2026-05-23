# AI System Cockpit

Native VS Code cockpit for AI-SYSTEM-V2.

## Features

- Composer-first interface with one primary Run path and Auto as the default mode.
- Optional modes for Code, Browser, Extract, and Route preview are tucked behind a mode drawer.
- Startup-safe by default: the cockpit does not activate or auto-open until opened.
- Current file or selected code context can be attached to prompts, with extra files and git diff available as chips.
- Inline streaming route/output, diff review, repo index, and inspection reports.
- Deeper diagnostics collapsed under Overview, Context, System, and Advanced.
- Daily readiness state separates usable lanes from the stricter release/product gate.
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

Packaged install after generating the VSIX locally:

```sh
cc-package-cockpit
code --install-extension dist/ai-system-cockpit-0.1.0.vsix
```

## Verification

```sh
cc-product-readiness
cc-system-demo
cc-health-weekly --verbose
```
