---
name: Mission Condenser
description: Long-running mission timelines condense into a compact context summary.
command: bin/cc-mission-condenser --check
expect: Status: mission-condenser-ready
---

This check proves the OpenHands-inspired condenser keeps the first/recent events
and emits `mission.context-summary.json` for long missions.
