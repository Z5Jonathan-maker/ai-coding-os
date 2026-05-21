# RELEASE-CANDIDATE-v0.1.0-rc2.md

Date: 2026-05-21
Commit target: current `main`

## Result

The local release-candidate gate passed after the rc1 launch-polish follow-up.

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=9 failed=0
```

## Added Since rc1

- one-command release gate
- portable public CI gate
- external evaluator check
- GitHub PR template
- issue-template config links
- release notes
- roadmap
- CI status documentation
- release manifest/checksum generator

## Known Constraints

- GitHub Actions workflow exists but is disabled until the account billing /
  spending-limit block is cleared.
- Browser mode is currently `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
