---
name: Phase Checkpoint
description: Phase checkpoints snapshot and restore dirty working trees without touching HEAD.
command: bin/cc-phase-checkpoint --check
expect: Status: phase-checkpoint-ready
---

This check proves the Cline-inspired safety primitive for handoff phases:
create a shadow commit from a dirty tree, list it by mission, and restore files
from it while leaving HEAD untouched.
