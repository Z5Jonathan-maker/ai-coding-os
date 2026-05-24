---
name: Browser Replay
description: Authenticated browser replay fixture is credential-free and enforceable.
command: bin/cc-browser-replay-check
expect: Status: browser-replay-ready
---

This check validates the logged-in browser replay contract without requiring a
logged-in browser in CI. It ensures fixtures describe workflow and assertions,
not cookies, tokens, passwords, or browser storage.
