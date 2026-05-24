---
name: Browser Visual Proof
description: Browser/UI lane has deterministic DOM/layout assertions and bounded proof packets.
command: bin/cc-browser-visual-proof --check
expect: Status: browser-visual-proof-ready
---

This check closes the source-controlled browser/UI proof gap without requiring a
reviewer's logged-in browser. It validates the browser-proof fixture's visual
contract and the `cc-browser-proof --json` packet schema. Authenticated replay is
still a local runtime proof through Kimi WebBridge.
