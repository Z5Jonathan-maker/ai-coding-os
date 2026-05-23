---
name: Benchmark Fixtures
description: Ten public fixtures prove routing, repo-map, diff, and verification surfaces stay repeatable across core task classes.
command: bin/cc-benchmark-fixtures --check
expect: Status: benchmark-fixtures-ready
---

This check harvests the useful part of SWE-agent style discipline without
adding a large benchmark harness or Docker-first runtime. It covers code fix,
cheap extraction, UI design, browser proof, security review, long-context
review, refactor cleanup, failing test repair, image-to-UI handoff, and
permission-denied trust behavior.
