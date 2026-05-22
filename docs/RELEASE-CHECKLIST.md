# RELEASE-CHECKLIST.md

Use this checklist before tagging a public release candidate.

## Required Gates

One-command gate:

```sh
cc-release-check
```

Equivalent manual gate:

```sh
~/dotfiles/install.sh --dry-run
cc-product-readiness
cc-demo-five-minute
cc-health-weekly --verbose
cc-package-cockpit
cc-release-bundle
cc-cockpit-capture
git status --short
```

Required result:

- first-run doctor exits `Status: first-run-ready`
- product readiness exits `Status: product-ready`
- five-minute demo exits with `passed=4 failed=0`
- cockpit package command produces `dist/ai-system-cockpit-0.1.0.vsix`
- release bundle command produces `dist/ai-coding-os-<version>.tar.gz` and `.sha256`
- cockpit capture writes the expected files in `docs/media/cockpit/`
- git tree is clean and synced

## Launch Artifacts

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `docs/ARCHITECTURE.md`
- `docs/KNOWN-LIMITATIONS.md`
- `docs/LICENSE-SUPPORT.md`
- `docs/FIVE-MINUTE-DEMO-TRANSCRIPT.md`
- `docs/FRESH-CLONE-VERIFY.md`
- `docs/COCKPIT-SCREENSHOT-PLAN.md`
- `docs/RELEASE-CANDIDATE-v0.1.0-rc1.md`
- `.github/ISSUE_TEMPLATE/`

## Manual Review

- no secrets in tracked files
- no unexplained private paths in public docs
- fresh-clone dry-run verification passes without temp-home writes
- public fixture demo passes in evaluator mode
- root license is Apache-2.0
- cockpit package license matches root Apache-2.0 license
- browser mode boundary is visible
- issue templates render correctly on GitHub
- screenshots/GIFs exist before public announcement

## Tag

Do not tag until every required gate passes from a clean tree.

Suggested first tag:

```sh
git tag v0.1.0-rc7
git push origin v0.1.0-rc7
```
