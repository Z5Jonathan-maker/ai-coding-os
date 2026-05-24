---
name: Kimi Status
description: Kimi/WebBridge status degrades cleanly when optional local tools are absent.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-kimi-status'
expect: Status: kimi-status-ready
---

This check protects the cockpit's browser/UI lane status card from failing when
Node, the Kimi CLI, or VS Code CLI are not present in a public evaluator shell.
