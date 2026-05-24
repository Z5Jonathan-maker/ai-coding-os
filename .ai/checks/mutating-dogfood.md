---
name: Mutating Dogfood
description: Mutating coding-session runner is installed and dependency-checked.
command: bin/cc-mutating-dogfood --check
expect: Status: mutating-dogfood-ready
---

This check does not run the mutating session. It proves the isolated mutating
dogfood runner and its dependencies are present.
