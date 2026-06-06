---
name: Visual Fidelity Eval
description: Visual critic ranks the intended winner first across all eval cases.
command: bin/cc-visual-fidelity-eval
expect: Status: visual-fidelity-eval-ready
---

This check is the regression harness for the critic loop. Each case has a
reference plus N candidates with a known expected winner. We assert the critic
ranks the expected winner first, mirroring Design2Code / Vision2Web evaluation
practice.
