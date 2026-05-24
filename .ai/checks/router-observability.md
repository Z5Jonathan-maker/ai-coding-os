---
name: Router Observability
description: Router receipt and metrics remain useful without a private router checkout.
command: bash -lc 'CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-router-receipt --summary && CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-router-metrics'
expect: Source: fixture telemetry|Using token ledger fixture fallback
---

This check keeps the cockpit route proof surfaces portable. Public evaluators
without `cc-router` still see labeled fixture telemetry instead of empty
unavailable panels.
