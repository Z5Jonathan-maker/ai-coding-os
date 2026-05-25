---
name: Router Eval
description: Private routing eval set prevents lane-classifier drift.
command: bin/cc-router-eval
expect: Status: router-eval-ready
---

This check replays representative prompts across image, design, cheap,
precision, and codex lanes.
