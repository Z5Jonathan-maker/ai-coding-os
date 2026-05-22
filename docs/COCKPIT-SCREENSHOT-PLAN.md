# COCKPIT-SCREENSHOT-PLAN.md

This is the repeatable capture plan for launch screenshots and GIFs of the VS
Code cockpit. The goal is visual proof that the cockpit is a usable product
surface, not a terminal command list.

## Required Captures

| Capture | State To Show | Proof Command |
|---|---|---|
| 01-readiness | `AI: Product Readiness` showing all gates green | `cc-product-readiness` |
| 02-first-run | `AI: Doctor` or terminal doctor showing required/optional/personal sections | `install.sh --dry-run` |
| 03-route-receipt | `AI: Explain Route` / `AI: Route Receipt` showing selected lane and fallback chain | `cc-workflow-proof "debug this repo and verify the safest next step"` |
| 04-browser-proof | `AI: Browser Proof` showing browser mode, WebBridge health, and bounded page content | `cc-browser-proof --url https://example.com --max-chars 1200` |
| 05-composer | Sidebar composer with mode selector, context chips, prompt, and streamed result | `AI: Ask / Plan` from the cockpit |
| 06-full-panel | Full editor-panel cockpit with large Work Stream and bottom composer | `AI Cockpit: Open Full Cockpit` |
| 06-package | VSIX package proof for the extension | `cc-package-cockpit` |

## Capture Standards

- Use a clean repo state before capture.
- Use the default VS Code theme unless a product theme is intentionally added.
- Crop to the VS Code window; do not include desktop clutter.
- Show the Activity Bar icon and cockpit sidebar in every cockpit screenshot.
- If a state is degraded, the image filename must include `degraded`.
- Browser automation screenshots must name the active mode: `official-extension`,
  `shim`, `playwright`, `locked-session`, or `not-ready`.

## File Targets

```text
docs/media/cockpit/01-readiness.png
docs/media/cockpit/02-first-run.png
docs/media/cockpit/03-route-receipt.png
docs/media/cockpit/04-browser-proof.png
docs/media/cockpit/05-composer.gif
docs/media/cockpit/06-full-panel.png
docs/media/cockpit/06-package.png
```

## Launch README Placement

The final README should use:

1. `01-readiness.png` near "Quick Proof".
2. `06-full-panel.png` near "Why This Exists".
3. `05-composer.gif` near sidebar/launcher explanation.
4. `03-route-receipt.png` near the lane table.
5. `04-browser-proof.png` near browser automation boundaries.

## Current Status

Deterministic capture is available through:

```sh
cc-cockpit-capture
```

This writes the required media files under `docs/media/cockpit/` from the real
cockpit CSS and representative product states. It is the fallback when macOS is
locked or real VS Code GUI capture is unavailable.

## Attempt Log

- 2026-05-21: CLI/package proof is ready, but unattended GUI capture hit macOS
  lock-screen state. A raw screen capture was rejected because it did not show
  VS Code. Public screenshots still require an unlocked desktop or a scripted
  VS Code render harness.
- 2026-05-21: Added scripted render harness via `cc-cockpit-capture` so launch
  media can be regenerated without an unlocked desktop.
