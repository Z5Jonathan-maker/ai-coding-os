---
name: Mission Git
description: Mission phases are recorded into hidden Git refs without moving HEAD or touching the real index.
command: bin/cc-mission-git --check
expect: Status: mission-git-ready
---

This check proves the Aider-inspired git-as-state layer: a phase writes a durable
mission commit under `refs/cc-missions/*` and the commit body carries proof
verdict state.
