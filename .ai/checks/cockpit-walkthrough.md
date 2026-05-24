---
name: Cockpit Walkthrough
description: Tracked cockpit walkthrough video and source-frame manifest stay valid.
command: bin/cc-cockpit-walkthrough-check
expect: Status: cockpit-walkthrough-ready
---

This check protects real-use cockpit evidence. It verifies the tracked MP4,
source frames, duration, resolution, codec, and credential-free manifest.
