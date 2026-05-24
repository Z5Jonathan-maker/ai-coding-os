---
name: Release Artifact
description: Release tarball/checksum builds from the current clone and contains evaluator assets.
command: bin/cc-release-artifact-check
expect: Status: release-artifact-ready
---

This check protects the cold-reviewer handoff path. It proves the release bundle
can be built from a fresh clone, includes the VSIX, quickstart, CI docs,
manifest, launch media, and has a valid checksum.
