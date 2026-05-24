---
name: Quick Demo
description: The 90-second evaluator demo stays green without the private AI-SYSTEM-V2 router.
command: bash -lc 'AI_INTENT_ROUTER=/tmp/no-ai/intent-route.sh CC_ROUTER_ROOT=/tmp/no-router DOTFILES="$PWD" bin/cc-demo-quick'
expect: Status: quick-demo-ready
---

This check protects the cold-reviewer path documented in `README.md` and
`docs/EVALUATOR-QUICKSTART.md`: `cc-demo-quick` must explain the product and
pass from a public clone using committed fixtures.
