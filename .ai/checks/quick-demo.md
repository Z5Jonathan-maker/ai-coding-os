---
name: Quick Demo
description: The 90-second evaluator demo uses the in-tree router and public proof commands.
command: bash -lc 'CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-demo-quick'
expect: Status: quick-demo-ready
---

This check protects the cold-reviewer path documented in `README.md` and
`docs/EVALUATOR-QUICKSTART.md`: `cc-demo-quick` must explain the product and
exercise the in-tree router instead of silently falling back to private
`AI-SYSTEM-V2` fixtures.
