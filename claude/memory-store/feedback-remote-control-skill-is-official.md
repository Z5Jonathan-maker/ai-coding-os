---
name: feedback-remote-control-skill-is-official
description: "When user mentions /remote-control, do not say "not installed." It IS official Anthropic, but only works in non-sandboxed parent processes (Terminal.app, VS Code). Probing via `claude --print "/remote-control"` from inside another claude session returns "not available" because the child inherits sandbox state — that is NOT proof of absence."
metadata:
  type: feedback
  originSessionId: aeda5184-d147-4d61-98c9-daa4117a8a76
---
**Rule:** When the user says they want to use `/remote-control`, the correct unblock is **spawn `claude` in Terminal.app via osascript** (or have them open a fresh terminal). Do NOT respond "isn't installed" — the skill is official Anthropic.

**Why:** `/remote-control` lets the user drive a Claude Code session from their phone. The user mentions it has worked for them and they were using it 2026-05-04 to control this very session.

**How to apply:**
1. If user says `/remote-control` while in a sandboxed environment (e.g. Claude Code's own VS Code extension when running as inner agent), invoke `osascript -e 'tell application "Terminal" to do script "claude"'` to spawn a non-sandboxed parent.
2. The user can then type `/remote-control` in that fresh Terminal window.
3. Do NOT call `claude --print "/remote-control"` from inside the current session and conclude the skill is missing — that probe inherits sandbox state.

**Past incident:** 2026-05-04 session aeda5184 — Claude said "isn't installed" three times before user clarified it was sandbox-gated. Wasted ~6 turns.
