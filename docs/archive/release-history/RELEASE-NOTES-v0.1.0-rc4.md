# RELEASE-NOTES-v0.1.0-rc4.md

Date: 2026-05-21
Tag: `v0.1.0-rc4`

## What Changed Since rc3

- Added `cc-release-bundle` for distributable release assets.
- Added tarball/checksum ignore rules for generated release artifacts.
- Added release-bundle coverage to the release checklist and roadmap.

## Verification

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc4: bundle + .sha256 generated
```

## Included

- VS Code cockpit extension packaged as a VSIX.
- Release tarball containing VSIX, README, license, release notes, release
  candidate record, release manifest, CI docs, evaluator quickstart, and cockpit
  media.
- Multi-model role map and router receipts.
- First-run doctor with required, optional, and personal-machine checks.
- Product readiness gate.
- External evaluator check.
- Portable public CI check.
- Five-minute public demo command.
- Browser-proof path with visible mode boundaries.
- Deterministic cockpit screenshots and GIF capture.

## Known External Constraint

`.github/workflows/public-ci.yml` is present but disabled in GitHub because the
account currently has an Actions billing / spending-limit block. The local
portable gate passes; the blocked cloud run did not execute project code.

## Integrity

See `docs/archive/release-history/RELEASE-MANIFEST-v0.1.0-rc4.md` for artifact checksums.
