---
name: Cockpit Status
description: Cockpit status reports portable evaluator mode before VS Code config is installed.
command: bash -lc 'home="$(mktemp -d)"; node_dir="$(dirname "$(command -v node)")"; HOME="$home" AI_SYSTEM_ROOT=/tmp/no-ai CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" PATH="$node_dir:/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-cockpit-status'
expect: portable evaluator mode
---

This check keeps the status surface from presenting expected pre-install VS
Code config as a product failure in public clones.
