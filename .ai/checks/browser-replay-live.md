---
name: Browser Replay Live
description: Kimi WebBridge live replay readiness proves or safely skips without credentials.
command: bin/cc-browser-replay-live-check
expect: Status: browser-replay-live-(ready|skipped)
---

This check protects the prepared-machine path for authenticated browser replay.
It uses the official WebBridge when connected, navigates a credential-free nonce
page through the real browser, and skips cleanly on public machines without the
extension.
