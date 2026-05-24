---
name: Provider Capacity
description: Provider capacity proof stays readable without private router probes or credentials.
command: bash -lc 'CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-provider-capacity'
expect: status=fixture-capacity
---

This check proves the advertised `cc-provider-capacity` proof command degrades
to a labeled fixture instead of crashing when evaluated from a public clone.
