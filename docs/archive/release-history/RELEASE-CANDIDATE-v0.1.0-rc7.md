# RELEASE-CANDIDATE-v0.1.0-rc7.md

Date: 2026-05-22
Commit target: current `main`

## Result

The release-candidate gate passed after polishing release checksums so the
downloadable `.sha256` file uses a portable artifact basename instead of an
absolute local path.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc7: bundle + portable .sha256 generated
```

## Added Since rc6

- portable release checksum file format

## Known Constraints

- GitHub Actions cloud execution depends on the account billing /
  spending-limit state.
- Browser mode can be `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
