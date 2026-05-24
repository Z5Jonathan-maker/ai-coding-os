---
name: Pulse Status
description: Pulse status resolves the repo-local skill in fresh clone evaluator shells.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-pulse-status'
expect: Dotfiles skill: present
---

This check prevents the code-density status surface from hardcoding Jonathan's
home-directory checkout path.
