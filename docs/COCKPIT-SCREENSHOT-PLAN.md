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
| 08-state-continuation | Primary continuation state | `cc-cockpit-state-proof` |
| 09-state-running | Calm in-progress execution state | `cc-cockpit-state-proof` |
| 10-state-success | Proof-backed completed state | `cc-cockpit-state-proof` |
| 11-state-blocked | Permission/trust blocked state | `cc-cockpit-state-proof` |
| 12-state-permissions | Authority selector/state explanation | `cc-cockpit-state-proof` |
| 13-state-route-receipt | Inspectable routing proof | `cc-cockpit-state-proof` |
| interaction-proof | Keyboard/state/diagnostic interaction proof | `cc-cockpit-interaction-proof` |
| visual-baseline | Pass/fail visual-diff baseline | `cc-cockpit-visual-diff` |

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
docs/media/cockpit/states/08-state-continuation.png
docs/media/cockpit/states/09-state-running.png
docs/media/cockpit/states/10-state-success.png
docs/media/cockpit/states/11-state-blocked.png
docs/media/cockpit/states/12-state-permissions.png
docs/media/cockpit/states/13-state-route-receipt.png
docs/media/cockpit/states/manifest.json
docs/media/cockpit/interaction/interaction-proof.png
docs/media/cockpit/interaction/manifest.json
docs/media/cockpit/visual-baseline.json
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

Deterministic state proof is available through:

```sh
cc-cockpit-state-proof
```

This writes the primary state screenshots under `docs/media/cockpit/states/`
and emits a manifest with file sizes and viewport metadata.

Headless interaction proof is available through:

```sh
cc-cockpit-interaction-proof
```

This writes `docs/media/cockpit/interaction/manifest.json`, including keyboard
flow assertions, state assertions, screenshot metadata, and hashes of the
primary state screenshots for visual-regression tracking.

Visual-diff thresholding is enforced through:

```sh
cc-cockpit-visual-diff
```

This compares committed screenshots against
`docs/media/cockpit/visual-baseline.json`, requiring exact dimensions, unchanged
hashes, and byte deltas within threshold. Intentional visual changes require:

```sh
cc-cockpit-visual-diff --update-baseline
```

## Attempt Log

- 2026-05-21: CLI/package proof is ready, but unattended GUI capture hit macOS
  lock-screen state. A raw screen capture was rejected because it did not show
  VS Code. Public screenshots still require an unlocked desktop or a scripted
  VS Code render harness.
- 2026-05-21: Added scripted render harness via `cc-cockpit-capture` so launch
  media can be regenerated without an unlocked desktop.
- 2026-05-24: Added `cc-cockpit-state-proof` for deterministic continuation,
  running, success, blocked, permissions, and route-receipt state screenshots.
- 2026-05-24: Added `cc-cockpit-interaction-proof` for keyboard submit,
  empty/loading/blocked states, permission switching, route diagnostics, and
  visual-regression metadata.
- 2026-05-24: Added `cc-cockpit-visual-diff` for strict screenshot baseline
  enforcement with exact dimensions, hash checks, and byte-delta thresholds.
