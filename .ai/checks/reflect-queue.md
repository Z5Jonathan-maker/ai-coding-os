---
name: Reflect Queue
description: Reflection entries queue into Codex state by default.
command: bash -lc 'home="$(mktemp -d)"; env HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-reflect cycle --n 1 --kind check --summary "queue path check" >/dev/null && env HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-reflect digest'
expect: \.Codex/state/reflection-queue\.jsonl
---

This check keeps the learning/reflection loop aligned with the current Codex
state tree instead of silently queueing new entries into the legacy Claude path.
