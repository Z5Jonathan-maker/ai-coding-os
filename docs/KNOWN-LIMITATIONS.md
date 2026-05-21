# KNOWN-LIMITATIONS.md

This page exists so the launch surface is honest. Unsupported states should be
named directly instead of hidden behind successful-looking demos.

## Current Limitations

| Area | Limitation | Current Handling |
|---|---|---|
| Public install | Optimized for macOS Apple Silicon first | `install.sh --dry-run` reports required, optional, and personal prerequisites |
| Browser automation | Official logged-in Chrome extension still requires user approval | `cc-kimi-status` and `cc-browser-proof` report `official-extension`, `shim`, or `not-ready` |
| Shim mode | Works for proof/demos but does not inherit normal Chrome cookies | Browser truth table documents the boundary |
| License | Root open-source license has not been selected yet | `docs/LICENSE-SUPPORT.md` tracks the launch decision |
| Provider accounts | User must bring their own paid/free AI accounts | First-run doctor does not inspect secrets |
| Windows/Linux | Not supported as a launch target | Future work only |
| Hosted/team mode | Not implemented | Sellable path is local product plus support/workflow packaging first |
| Screenshots/GIFs | Capture plan exists, final images pending | `docs/COCKPIT-SCREENSHOT-PLAN.md` lists required captures |

## Not Bugs

- A dirty tree makes `cc-product-readiness` and `cc-demo-five-minute` fail.
- `shim` browser mode is valid for local proof but not equivalent to official
  logged-in Chrome control.
- Missing optional AI tools should be reported as optional unless the requested
  lane depends on them.

## Must Fix Before Public Launch

1. choose root license and update cockpit package license
2. capture launch screenshots/GIFs
3. verify README on a fresh clone target
4. remove or explain any remaining personal-only paths in public docs
5. create a tagged release candidate
