---
name: Public Repo Dogfood
description: Fresh public-clone dogfood runner is installed and dependency-checked.
command: bin/cc-public-repo-dogfood --check
expect: Status: public-repo-dogfood-ready
---

This check does not clone or mutate the public repo. It proves the public-repo
dogfood runner and its dependencies are installed.
