# KNOWN-LIMITATIONS.md

This page exists so the launch surface is honest. Unsupported states should be
named directly instead of hidden behind successful-looking demos.

## Current Limitations

| Area | Limitation | Current Handling |
|---|---|---|
| Public install | Optimized for macOS Apple Silicon first | `install.sh --dry-run` reports required, optional, and local-account prerequisites; fresh-clone proof is in `docs/FRESH-CLONE-VERIFY.md` |
| Browser automation | Official logged-in Chrome extension still requires user approval | `cc-kimi-status` and `cc-browser-proof` report `official-extension`, `shim`, or `not-ready` |
| Shim mode | Works for proof/demos but does not inherit normal Chrome cookies | Browser truth table documents the boundary |
| License | Apache-2.0 selected; support/commercial boundary still needs launch copy | `docs/LICENSE-SUPPORT.md` tracks the boundary |
| Provider accounts | User must bring their own paid/free AI accounts | First-run doctor does not inspect secrets |
| Windows/Linux | Not supported as a launch target | Future work only |
| Hosted/team mode | Not implemented | Sellable path is local product plus support/workflow packaging first |
| Screenshots/GIFs | Deterministic preview media exists; real unlocked VS Code screenshots are still better for final marketing | `cc-cockpit-capture` writes `docs/media/cockpit/` |

## Not Bugs

- A dirty tree makes `cc-product-readiness` and `cc-demo-five-minute` fail.
- `shim` browser mode is valid for local proof but not equivalent to official
  logged-in Chrome control.
- Missing optional AI tools should be reported as optional unless the requested
  lane depends on them.

## Must Fix Before Public Launch

1. optionally replace deterministic preview media with real unlocked VS Code screenshots
2. validate install on one separate fresh macOS Apple Silicon account
3. remove or explain any remaining personal-only paths in public docs
4. attach the rc5 release bundle/checksum to a GitHub release
