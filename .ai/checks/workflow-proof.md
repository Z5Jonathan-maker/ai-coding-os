---
name: Workflow Proof
description: Direct workflow proof remains readable in public clones using the in-tree router.
command: bash -lc 'CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-workflow-proof "debug this repo and verify the safest next step"'
expect: Status: workflow-proof-ready
---

This check protects the daily-driver proof packet from leaking private setup
assumptions into public evaluation while still exercising a real route decision.
