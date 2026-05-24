---
name: Third-Party Dogfood
description: External public-repo dogfood runner is installed and dependency-checked.
command: bin/cc-third-party-dogfood --check
expect: Status: third-party-dogfood-ready
---

This check does not clone or mutate the external repository. It proves the
third-party dogfood runner and its dependencies are installed.
