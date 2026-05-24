---
name: Loop Quality
description: Loop quality degrades cleanly when no Codex or Claude loop status exists yet.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-loop-quality'
expect: Status: loop-quality-ready
---

This check protects autonomous-loop observability from falsely reporting cycle
history when a public evaluator has no local loop state.
