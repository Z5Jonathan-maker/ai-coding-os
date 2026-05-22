# RELEASE-NOTES-v0.1.0-rc5.md

Date: 2026-05-21
Tag: `v0.1.0-rc5`

## What Changed Since rc4

- Hardened browser proof JSON with nonce boundaries, origin, truncation fields,
  and bounded content.
- Added transcript turn summaries to `cc-session-ledger`.
- Rendered structured session history in the VS Code cockpit.
- Added Aider-inspired `cc-repo-map` and cockpit Repo Map surface.
- Added a public fixture repo plus `cc-demo-fixture`.
- Added fixture proof to both `cc-release-check` and `cc-evaluator-check`.

## Verification

```text
cc-evaluator-check: Status: evaluator-ready
cc-public-ci-check: passed=8 failed=0
cc-release-check: passed=11 failed=0
cc-release-bundle v0.1.0-rc5: bundle + .sha256 generated
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

`.github/workflows/public-ci.yml` is present, but cloud execution depends on the
GitHub account billing / spending-limit state. The local portable gate passes.

## Integrity

See `docs/RELEASE-MANIFEST-v0.1.0-rc5.md` for artifact checksums.
