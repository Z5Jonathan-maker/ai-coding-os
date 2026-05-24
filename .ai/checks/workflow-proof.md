---
name: Workflow Proof
description: Direct workflow proof remains readable in public clones without private router or VS Code readiness.
command: bash -lc 'AI_SYSTEM_ROUTE_SCRIPT=/tmp/no-ai/intent-route.sh CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-workflow-proof "debug this repo and verify the safest next step"'
expect: Status: workflow-proof-ready
---

This check protects the daily-driver proof packet from leaking private setup
assumptions into public evaluation.
