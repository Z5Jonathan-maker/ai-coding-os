# RELEASE-NOTES-v0.1.0-rc2.md

Date: 2026-05-21
Tag: `v0.1.0-rc2`

## What Changed Since rc1

- Added `cc-release-check` as the one-command local release gate.
- Added `cc-public-ci-check` as the portable contributor gate.
- Added GitHub PR template and issue-template config links.
- Added public roadmap and CI status docs.
- Added release manifest generation with SHA-256 artifact checksums.

## Verification

```text
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=9 failed=0
```

## Included

- VS Code cockpit extension packaged as a VSIX.
- Multi-model role map and router receipts.
- First-run doctor with required, optional, and personal-machine checks.
- Product readiness gate.
- Five-minute public demo command.
- Browser-proof path with visible mode boundaries.
- Deterministic cockpit screenshots and GIF capture.
- Apache-2.0 license, contribution guide, security policy, issue templates, PR
  template, and portable CI command.

## Known External Constraint

`.github/workflows/public-ci.yml` is present but disabled in GitHub because the
account currently has an Actions billing / spending-limit block. The local
portable gate passes; the blocked cloud run did not execute project code.

## Integrity

See `docs/RELEASE-MANIFEST-v0.1.0-rc2.md` for artifact checksums.
