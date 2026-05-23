---
name: Mission Events
description: Mission runtime timelines use the normalized event contract and complete run stages.
command: bin/cc-mission-events --check
expect: Status: mission-events-ready
---

This check prevents fake cockpit state. It runs the runtime adapter against a
temporary mission, then validates that the timeline contains first-class
events for preflight, trust, route, context, runtime, permission, tool,
verification, proof, and completion.
