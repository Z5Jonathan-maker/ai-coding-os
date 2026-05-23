---
name: Cockpit Webview Smoke
description: The packaged cockpit webview has required surfaces, continuation wiring, assets, and clean supply-chain audit.
command: bin/cc-cockpit-webview-smoke
expect: Status: cockpit-webview-ready
---

This check closes the gap between packaging a VSIX and proving the cockpit
surface still contains the core continuation UI, result stream, assets, and
startup-safe activation contract.
