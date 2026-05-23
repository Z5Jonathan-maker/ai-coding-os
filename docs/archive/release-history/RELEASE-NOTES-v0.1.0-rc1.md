# RELEASE-NOTES-v0.1.0-rc1.md

Date: 2026-05-21
Tag: `v0.1.0-rc1`

## What This Release Proves

This release candidate packages the repo as a verifiable AI coding operating
system instead of a personal dotfiles dump.

The stable evaluation path is now:

```sh
cc-release-check
```

Expected result:

```text
passed=9 failed=0
```

## Included

- VS Code cockpit extension packaged as a VSIX.
- Multi-model role map and router receipts.
- First-run doctor with required, optional, and personal-machine checks.
- Product readiness gate.
- Five-minute public demo command.
- Browser-proof path with visible mode boundaries.
- Deterministic cockpit screenshots and GIF capture.
- Apache-2.0 license, contribution guide, security policy, issue templates, and
  PR template.

## Still Preview

- Browser automation currently runs through the local shim unless the official
  extension is approved and connected.
- Install is macOS Apple Silicon first.
- The cockpit is functional and packageable, but final marketing screenshots
  can still be replaced by real unlocked VS Code captures.
- Disk gate requires 25GB free; 50GB remains the preferred operating target.

## Verification

Last local gate:

```text
cc-release-check: passed=9 failed=0
```

See `docs/archive/release-history/RELEASE-CANDIDATE-v0.1.0-rc1.md` for the detailed gate record.

Superseded by `docs/RELEASE-NOTES-v0.1.0-rc2.md`.
