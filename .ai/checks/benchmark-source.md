---
name: Benchmark Source
description: Source-linked upstream issue replay benchmarks have verifiable metadata, README links, and repair patches.
command: bin/cc-benchmark-source-check
expect: Status: benchmark-source-ready
---

This check prevents benchmark citation drift. Any fixture that claims to replay
an upstream issue must include owner/repo metadata, issue URL, reported
behavior, a broken-first setup, an expected patch, and a README source link.
