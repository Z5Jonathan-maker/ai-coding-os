---
name: Router Observability
description: Router receipt and metrics remain useful without private router telemetry.
command: bash -lc 'CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-router-receipt --summary && CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-router-metrics'
expect: Source: fixture telemetry|Source: committed token ledger fixture
---

This check keeps the cockpit route proof surfaces portable. Public evaluators
without private router telemetry still see labeled fixture telemetry instead of
empty unavailable panels.
