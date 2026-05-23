---
name: Security Baseline
description: No committed secrets or credential leakage.
command: pre-commit run gitleaks --all-files
expect: Passed
---

This check keeps secret scanning source-controlled and runnable outside the full
pre-commit suite.
