---
name: Cockpit Visual Diff
description: Cockpit visual-diff threshold gate is installed and has a committed baseline.
command: bin/cc-cockpit-visual-diff --check
expect: Status: cockpit-visual-diff-ready
---

This check does not run the full image comparison during every
source-controlled check pass. It proves the visual-diff gate is installed and
has a committed baseline. Run `cc-cockpit-visual-diff` for the strict gate.
