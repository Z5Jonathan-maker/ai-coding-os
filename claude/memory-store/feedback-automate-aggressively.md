---
name: feedback-automate-aggressively
description: "Default to maximum automation; treat blockers as puzzles, not handoffs"
metadata:
  type: feedback
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
User wants high-leverage automation. When something looks blocked, look for clever bridges (osascript GUI dialogs, device-flow auth, file-system tricks, launchd jobs, expect-style scripted interaction) before deferring to the user.

**Why:** User explicitly said "automate all you can, think outside the box" during a fresh-Mac setup. Pattern from this conversation: GUI sudo via `SUDO_ASKPASS=osascript-dialog` worked when no-TTY blocked password entry. Generalize this style.

**How to apply:** When a tool fails, brainstorm 2-3 alternative paths before asking the user. macOS-specific: `osascript` for GUI prompts, `open` to fire URLs, `launchctl` for background tasks, `pam_tid.so` for Touch ID, `defaults write` for system prefs. Save the user's attention for irreducible decisions.
