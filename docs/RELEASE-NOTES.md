# RELEASE-NOTES.md

Date: 2026-05-22
Tag: `v0.1.0-rc8`

## What Changed Since rc7

- Added `workflow_dispatch` to public CI.
- Documented the exact GitHub Actions billing/spending-limit block currently
  preventing cloud job startup.

## Verification

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc8: bundle + portable .sha256 generated
```

## Included

- VS Code cockpit extension packaged as a VSIX.
- Release tarball containing VSIX, README, license, release notes, release
  candidate record, release manifest, CI docs, evaluator quickstart, and cockpit
  media.
- Public fixture project for route/repo-map/diff proof.
- Multi-model role map and router receipts.
- First-run doctor with required, optional, and personal-machine checks.
- Product readiness gate.
- External evaluator check.
- Portable public CI check.
- Five-minute public demo command.
- Browser-proof path with visible mode boundaries.
- Deterministic cockpit screenshots and GIF capture.

## Known External Constraint

`.github/workflows/ci.yml` is enabled and dispatchable, but cloud
execution is blocked by the GitHub account billing / spending-limit state. The
local portable gate passes.

## Integrity

See `docs/RELEASE-MANIFEST.md` for artifact checksums.
