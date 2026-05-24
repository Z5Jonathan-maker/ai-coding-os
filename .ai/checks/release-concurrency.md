---
name: Release Concurrency
description: Parallel release artifact checks cannot corrupt the final tarball, checksum, or VSIX.
command: bin/cc-release-concurrency-check
expect: Status: release-concurrency-ready
---

This check protects unattended verifier swarms. Release bundle and cockpit
package generation must write temporary files and atomically rename them into
`dist/` so concurrent readiness runs do not produce damaged archives.
