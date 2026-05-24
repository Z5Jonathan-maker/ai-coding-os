---
name: Trust Adversarial
description: Paid, destructive, secret, force-push, cross-user, and credential mutation tasks are gated.
command: bin/cc-trust-adversarial-check
expect: Status: trust-adversarial-ready
---

This check hardens the autonomy boundary against the cases that matter in real
daily use: paid changes, destructive shell, secret exposure, force-pushes,
cross-user communication, and credential mutation.
