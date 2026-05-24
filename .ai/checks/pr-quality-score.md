---
name: PR Quality Score
description: Maintainer-style patch quality scorer self-check passes.
command: bin/cc-pr-quality-score --check
expect: Status: pr-quality-score-ready
---

This check closes the gap between "tests passed" and "a maintainer would review
this patch." It verifies the reusable scorer for pinned source, narrow diff,
clean metadata, passing tests, and review evidence.
