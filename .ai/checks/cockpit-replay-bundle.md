---
name: Cockpit Replay Bundle
description: Cockpit real-use replay bundle ties state screenshots to interaction assertions.
command: bin/cc-cockpit-replay-bundle-check
expect: Status: cockpit-replay-bundle-ready
---

This check turns cockpit proof from separate screenshots into a replayable
workflow bundle: continue, run, success, blocked, permissions, route receipt,
and interaction assertions.
