---
name: user-ide
description: "Primary IDE is Google Antigravity (migrated from VS Code 2026-05-16). Antigravity is a VS Code fork with autonomous coding agents built in."
metadata:
  type: user
  originSessionId: 56623a47-e194-4900-a28b-fca9beec0626
---
User is moving primary development environment from VS Code to **Google Antigravity IDE** as of 2026-05-16.

- Antigravity is Google's agentic IDE (launched Nov 2025), built as a fork of VS Code — so most extensions (including Claude Code) and the `code`-style CLI should still work, but the binary name may differ (e.g. `antigravity` on PATH).
- Global CLAUDE.md still says "VS Code (`code` in PATH)" under Identity — that line is now partially stale and should be updated once the new CLI name is confirmed post-install.
- VS Code may stay installed as a fallback; don't assume it's been uninstalled.
- When suggesting "open in IDE" workflows or file-link formats, default to Antigravity-compatible commands.

Related: [[project-brain-architecture]] (env assumptions documented there)
