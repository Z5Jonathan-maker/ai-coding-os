# RELEASE-NOTES-v0.1.0-rc3.md

Date: 2026-05-21
Tag: `v0.1.0-rc3`

## What Changed Since rc2

- Added `cc-evaluator-check` for fresh-clone external review.
- Added `docs/EVALUATOR-QUICKSTART.md`.
- Made the portable public gate require the evaluator quickstart.

## Verification

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=9 failed=0
```

## Included

- VS Code cockpit extension packaged as a VSIX.
- Multi-model role map and router receipts.
- First-run doctor with required, optional, and personal-machine checks.
- Product readiness gate.
- External evaluator check.
- Portable public CI check.
- Five-minute public demo command.
- Browser-proof path with visible mode boundaries.
- Deterministic cockpit screenshots and GIF capture.
- Apache-2.0 license, contribution guide, security policy, issue templates, PR
  template, roadmap, and release manifest.

## Known External Constraint

`.github/workflows/public-ci.yml` is present but disabled in GitHub because the
account currently has an Actions billing / spending-limit block. The local
portable gate passes; the blocked cloud run did not execute project code.

## Integrity

See `docs/RELEASE-MANIFEST-v0.1.0-rc3.md` for artifact checksums.

Superseded by `docs/archive/release-history/RELEASE-NOTES-v0.1.0-rc4.md`.
