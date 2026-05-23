# RELEASE-CANDIDATE.md

Date: 2026-05-22
Commit target: current `main`

## Result

The release-candidate gate passed after enabling manual public CI dispatch and
documenting the exact GitHub Actions billing block returned by GitHub.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc8: bundle + portable .sha256 generated
```

## Added Since rc7

- `workflow_dispatch` trigger for public CI
- exact GitHub Actions billing/spending-limit annotation in `docs/CI.md`

## Known Constraints

- GitHub Actions cloud execution depends on the account billing /
  spending-limit state.
- Browser mode can be `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
