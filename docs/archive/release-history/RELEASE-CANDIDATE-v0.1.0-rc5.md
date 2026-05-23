# RELEASE-CANDIDATE-v0.1.0-rc5.md

Date: 2026-05-21
Commit target: current `main`

## Result

The release-candidate gate passed after adding public fixture proof, structured
session timeline, browser-proof JSON hardening, and ranked repo-map visibility.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc5: bundle + .sha256 generated
```

## Added Since rc4

- bounded `cc-browser-proof --json` proof packets
- transcript turn summaries in `cc-session-ledger`
- structured Sessions cockpit rendering
- Aider-inspired `cc-repo-map` plus cockpit surface
- public fixture repo and `cc-demo-fixture`
- release gate coverage for fixture proof
- evaluator check coverage for fixture proof

## Known Constraints

- GitHub Actions workflow exists but depends on the account billing /
  spending-limit state.
- Browser mode can be `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
