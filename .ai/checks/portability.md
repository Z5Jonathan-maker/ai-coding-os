---
name: Package Portability
description: Public/evaluator commands resolve the current clone and maintainer-home assumptions stay classified.
command: bin/cc-portability-check
expect: Status: portability-ready
---

This check protects package separability. It keeps public evaluator commands
clone-rooted, rejects absolute user paths in public tracked files, and confines
`~/dotfiles` assumptions to maintainer-local utilities.
