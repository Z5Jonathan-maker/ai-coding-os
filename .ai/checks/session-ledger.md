---
name: Session Ledger
description: Cockpit session continuity command stays usable without a private router checkout.
command: bin/cc-session-ledger --check
expect: Status: session-ledger-ready
---

This check keeps `AI: Session Ledger` portable for public evaluators. If the
full router session store is unavailable, the command must still expose
continuation state through the source-controlled mission ledger fallback.
