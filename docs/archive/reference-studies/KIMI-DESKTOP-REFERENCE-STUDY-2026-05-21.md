# KIMI-DESKTOP-REFERENCE-STUDY-2026-05-21.md

## Sources

- Kimi K2.6 product page: https://www.kimi.com/ai-models/kimi-k2-6
- Kimi overview: https://www.kimi.com/help/getting-started/overview
- K2.6 Agent overview: https://www.kimi.com/help/agent/agent-overview
- Kimi Code product page: https://www.kimi.com/code
- Kimi Code interaction/context docs surfaced via Help Center search
- Local app inspection: `/Applications/Kimi.app`, `kimi --help`, `kimi-webbridge status`

## What Kimi Gets Right

1. Mode clarity.
   Kimi separates instant, thinking, agent, swarm, code, slides, docs, sheets,
   website, and research flows. Users do not have to infer which mental mode
   they are in.

2. Deliverable-first UX.
   The product language is about finished websites, reports, slides, documents,
   sheets, and reusable skills. It sells outcomes, not models.

3. Session continuity.
   Kimi Code supports resume, continue, session browsing, startup replay,
   persisted approvals, and persisted extra directories.

4. Context hygiene.
   It exposes clear/compact/context status concepts. The user can see context
   pressure and recover from long-running work.

5. Fast interaction primitives.
   Agent mode vs shell mode, slash commands, path completion with `@`, image
   paste, structured options, and approval choices make the interface feel
   responsive and controllable.

6. Tool platform.
   Kimi packages WebBridge with the desktop app and exposes official tools,
   MCP-style integrations, and CLI/IDE/browser modes.

7. Local desktop polish.
   The app is a full Electron desktop shell with deep links, window state,
   auto-update metadata, WebBridge bundled in resources, and explicit macOS
   camera/microphone/local-network permissions.

## Local Findings

- Kimi Desktop is installed: `3.0.10`.
- Kimi CLI is installed: `1.41.0`.
- Kimi WebBridge daemon is running on port `10086`.
- WebBridge browser extension is currently disconnected.
- Kimi VS Code extensions installed:
  - `moonshot-ai.kimi-code@0.5.10`
  - `kingleo.kimi-vscode@0.0.6`

## What We Should Steal

1. Keep intent modes visible and outcome-named.
2. Add session resume/compact/status as first-class cockpit primitives.
3. Keep context attachments visible as chips.
4. Show Kimi/WebBridge health directly in cockpit.
5. Add slash-command style affordances for common operations.
6. Add deliverable presets: Website, Research, Review, Refactor, Browser Check,
   Slide/Doc handoff.
7. Treat tool connectivity as product state, not a hidden daemon detail.

## What We Should Not Copy

- Do not add another full desktop shell. VS Code remains the cockpit.
- Do not duplicate Kimi Code extension features that are already installed.
- Do not make Kimi the whole system; keep it as the design/browser/operator lane.
- Do not hide cost/usage behind membership language. Our cockpit should show
  route receipts and token/fallback metrics.

## Immediate Changes Applied

- Added `cc-kimi-status`.
- Added Kimi status card to the cockpit.
- Documented the Kimi Desktop reference study as a product benchmark.
