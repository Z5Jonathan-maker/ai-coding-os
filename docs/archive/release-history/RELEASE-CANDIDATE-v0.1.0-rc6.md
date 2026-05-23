# RELEASE-CANDIDATE-v0.1.0-rc6.md

Date: 2026-05-21
Commit target: current `main`

## Result

The release-candidate gate passed after aligning the rc5 launch docs with the
latest tagged code and preserving all rc5 product improvements.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc6: bundle + .sha256 generated
```

## Included Since rc4

- bounded `cc-browser-proof --json` proof packets
- transcript turn summaries in `cc-session-ledger`
- structured Sessions cockpit rendering
- Aider-inspired `cc-repo-map` plus cockpit surface
- public fixture repo and `cc-demo-fixture`
- release/evaluator gate coverage for fixture proof
- refreshed launch limitations and roadmap state

## Known Constraints

- GitHub Actions cloud execution depends on the account billing /
  spending-limit state.
- Browser mode can be `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
