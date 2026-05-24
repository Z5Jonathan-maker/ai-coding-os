---
name: Lane Extension
description: Public lane-extension guide and executable valid/invalid registry fixtures pass.
command: bin/cc-lane-extension-check
expect: Status: lane-extension-ready
---

This check protects provider-agnostic extensibility. It proves a new lane can be
added through the registry contract, routed through `cc-lane`, and rejected when
it lacks safe health/fallback semantics.
