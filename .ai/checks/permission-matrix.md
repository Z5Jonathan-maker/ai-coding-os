---
name: Permission Matrix
description: Cockpit permission surface stays meaningful without the private AI-SYSTEM-V2 policy checker.
command: bash -lc 'AI_SYSTEM_ROOT=/tmp/no-ai DOTFILES="$PWD" bin/cc-permission-matrix --summary'
expect: secret=DENY
---

This check proves public evaluators still see enforceable permission boundaries
from `.ai/trust.json` when the maintainer's private `AI-SYSTEM-V2` policy files
are absent.
