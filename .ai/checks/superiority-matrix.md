---
name: Superiority Matrix
description: Competitive claims stay tied to executable evidence, explicit gaps, and graded benchmark depth.
command: bin/cc-superiority-check
expect: Status: superiority-matrix-ready
---

This check prevents the product from claiming "better than the top projects"
by grepping a self-written claim. It requires executable command inventory,
graded benchmark depth, and explicit missing-proof language.
