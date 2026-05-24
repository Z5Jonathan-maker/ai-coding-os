---
name: Router Degradation
description: Degraded-provider replay fixture and live dry-run fallback shape stay valid.
command: bin/cc-router-degradation-check
expect: Status: router-degradation-ready
---

This check protects the real-world quota/circuit-breaker case. It proves the
router has a human-readable degraded-lane notice, a fallback chain, and no raw
provider error/log leakage in the user-facing notice.
