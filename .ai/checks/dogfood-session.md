---
name: Dogfood Session
description: Six-hour developer-session runner is installed and dependency-checked.
command: bin/cc-dogfood-session --check
expect: Status: dogfood-session-ready
---

This check does not run the six-hour session. It proves the timed dogfood
runner and its dependencies are available so a real sustained session can be
started without hand assembly.
