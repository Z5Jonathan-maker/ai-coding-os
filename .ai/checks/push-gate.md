---
name: Push Gate
description: Protected branch pushes require an explicit override and the pre-push gate has a self-check.
command: bin/cc-push-gate --check
expect: Status: push-gate-check-ready
---

This check prevents accidental direct pushes to protected branches after a
feature branch or PR was expected. Direct protected-branch pushes are still
possible, but only with an explicit one-off override.
