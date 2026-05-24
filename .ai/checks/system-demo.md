---
name: System Demo
description: Acceptance demo stays meaningful before VS Code user symlinks exist in a public clone.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" AI_SYSTEM_ROOT=/tmp/no-ai AI_INTENT_ROUTER=/tmp/no-ai/intent-route.sh DOTFILES="$PWD" bin/cc-system-demo'
expect: portable evaluator mode
---

This check keeps `cc-system-demo` from reporting a false VS Code symlink
failure before installation has initialized the evaluator's VS Code user
directory.
