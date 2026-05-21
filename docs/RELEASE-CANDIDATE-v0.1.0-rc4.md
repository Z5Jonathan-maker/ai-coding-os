# RELEASE-CANDIDATE-v0.1.0-rc4.md

Date: 2026-05-21
Commit target: current `main`

## Result

The release-candidate gate passed after adding distributable release bundle
generation.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=9 failed=0
cc-release-bundle v0.1.0-rc4: bundle + .sha256 generated
```

## Added Since rc3

- release bundle command
- generated release tarball and checksum path
- release checklist coverage for distribution assets

## Known Constraints

- GitHub Actions workflow exists but is disabled until the account billing /
  spending-limit block is cleared.
- Browser mode is currently `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
