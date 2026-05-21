# RELEASE-CHECKLIST.md

Use this checklist before tagging a public release candidate.

## Required Gates

```sh
~/dotfiles/install.sh --dry-run
cc-product-readiness
cc-demo-five-minute
cc-health-weekly --verbose
cc-package-cockpit
cc-cockpit-capture
git status --short
```

Required result:

- first-run doctor exits `Status: first-run-ready`
- product readiness exits `Status: product-ready`
- five-minute demo exits with `passed=4 failed=0`
- cockpit package command produces `dist/ai-system-cockpit-0.1.0.vsix`
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
- `.github/ISSUE_TEMPLATE/`

## Manual Review

- no secrets in tracked files
- no unexplained private paths in public docs
- fresh-clone dry-run verification passes without temp-home writes
- root license is Apache-2.0
- cockpit package license matches root Apache-2.0 license
- browser mode boundary is visible
- issue templates render correctly on GitHub
- screenshots/GIFs exist before public announcement

## Tag

Do not tag until every required gate passes from a clean tree.

Suggested first tag:

```sh
git tag v0.1.0-rc1
git push origin v0.1.0-rc1
```
