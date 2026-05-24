---
name: Phase Status
description: Phase status prefers Codex loop state and falls back cleanly before any state exists.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-phase path'
expect: \.Codex/state/loop-status\.md
---

This check keeps the ambient autonomous-loop status reader aligned with the
active Codex state path while preserving Claude fallback behavior.
