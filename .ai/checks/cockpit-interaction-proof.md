---
name: Cockpit Interaction Proof
description: Cockpit keyboard, state, and visual-regression proof runner is installed and dependency-checked.
command: bin/cc-cockpit-interaction-proof --check
expect: Status: cockpit-interaction-proof-ready
---

This check does not run the browser interaction suite during every
source-controlled check pass. It proves the interaction-proof runner and
Playwright runtime are installed.
