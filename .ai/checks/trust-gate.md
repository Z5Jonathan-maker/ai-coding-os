---
name: Trust Gate
description: Cockpit execution is machine-gated by workspace trust policy before routing.
command: bin/cc-trust-gate --check
expect: Status: trust-gate-ready
---

This check proves trust policy is not only documentation or prompt text. The
same gate used by the cockpit must allow safe reads, review risky package
installs, and deny secret exposure.
