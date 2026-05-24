---
name: Handoff Status
description: Handoff reader prefers Codex state for checkpoint artifacts.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-handoff path'
expect: \.Codex/state/HANDOFF\.json
---

This check prevents the session-resume helper from silently looking only at the
legacy Claude state path.
