---
name: Plan Fallback
description: cc-plan writes a useful local artifact without leaking router stack traces.
command: bash -lc 'd="$(mktemp -d)"; AI_SYSTEM_ROOT=/tmp/no-ai CC_PLAN_DIR="$d/plans" PATH="/usr/bin:/bin:/usr/sbin:/sbin" DOTFILES="$PWD" bin/cc-plan "debug this repo safely" | tee "$d/out"; grep -q "local fallback plan template" "$d/out"; ! grep -qi "stack\\|trace\\|Error:" "$d/out"'
expect: Saved plan:
---

This check keeps `cc-plan` usable when `router-ask` or the private router
checkout is unavailable.
