# RELEASE-CANDIDATE-v0.1.0-rc1.md

Date: 2026-05-21
Commit target: current `main`

## Result

The local release-candidate gate passed.

```text
install.sh --dry-run: Status: first-run-ready
cc-product-readiness: Score: 14/14 checks (100%), Status: product-ready
cc-demo-five-minute: passed=4 failed=0
cc-health-weekly --verbose: all 15 green
cc-package-cockpit: packaged dist/ai-system-cockpit-0.1.0.vsix
cc-cockpit-capture: wrote docs/media/cockpit/*
git status: clean and synced
```

## Included Launch Surface

- Apache-2.0 root license
- VS Code cockpit package license aligned to Apache-2.0
- first-run doctor
- product readiness gate
- five-minute demo
- deterministic cockpit media capture
- launch screenshots/GIF under `docs/media/cockpit/`
- architecture map
- contribution guide
- security policy
- known limitations
- release checklist
- issue templates
- fresh-clone dry-run proof

## Known Constraints

- Browser mode is currently `shim`; official logged-in Chrome extension approval
  remains a user-controlled setup step.
- Disk passes the 25GB minimum gate but remains below the 50GB preferred target.
- Deterministic cockpit media is checked in; real unlocked VS Code screenshots
  can replace it later for final marketing polish.
