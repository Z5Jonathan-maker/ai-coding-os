---
name: Cockpit State Proof
description: Deterministic cockpit state screenshot runner is installed and dependency-checked.
command: bin/cc-cockpit-state-proof --check
expect: Status: cockpit-state-proof-ready
---

This check does not regenerate screenshots during every source-controlled
check run. It proves the state-proof runner and capture dependencies are
installed.
