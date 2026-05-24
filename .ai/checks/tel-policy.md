---
name: TEL Policy
description: Credentialed actions are policy-whitelisted, redacted, audited, undo-aware, and secret-safe.
command: bin/cc-tel-policy-check
expect: Status: tel-policy-ready
---

This check keeps the Trusted Execution Layer honest without invoking live
credentials. It validates service/action whitelists, rate limits, Keychain and
1Password references, reversible mutation windows, GraphQL query constraints,
redaction/audit code, and ignored audit logs.
