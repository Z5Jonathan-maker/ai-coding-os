---
name: Visual Critic
description: N-candidate rendered output is ranked by a relative critic before Claude review.
command: bin/cc-visual-critic --check
expect: Status: visual-critic-ready
---

This check encodes the UI2Code^N / 1D-Bench finding that absolute VLM fidelity
scores are miscalibrated. We only commit to relative ranking among N candidate
renders, and we never emit an absolute fidelity score.
