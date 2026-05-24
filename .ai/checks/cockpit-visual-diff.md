---
name: Cockpit Visual Diff
description: Cockpit visual-diff threshold gate is installed and has a committed baseline.
command: bin/cc-cockpit-visual-diff --check
expect: Status: cockpit-visual-diff-ready
---

This check confirms the visual-diff gate is installed and has a committed
baseline. The full command decodes PNG pixels and scores deterministic pixel
samples, perceptual hash, and luma drift; file hash and byte drift are reported
as diagnostics.
