---
name: Benchmark Fixtures
description: Tiny public fixtures prove routing, repo-map, diff, and verification surfaces stay repeatable.
command: bin/cc-benchmark-fixtures --check
expect: Status: benchmark-fixtures-ready
---

This check harvests the useful part of SWE-agent style discipline without
adding a large benchmark harness or Docker-first runtime.
