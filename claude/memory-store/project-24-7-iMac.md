---
name: project-24-7-iMac
description: "pmset configured to disable all sleep modes. Don't propose sleep tuning unless the user explicitly asks to revert."
metadata:
  type: project
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
The iMac is configured for 24/7 unattended operation:

- `sleep 0` — no system sleep
- `displaysleep 0` — display never blanks (CRT-era burn-in concerns don't apply to modern displays)
- `disksleep 0` — internal SSDs always responsive
- `powernap 0` — no scheduled wake activity beyond power-state events
- `tcpkeepalive 1` — keep TCP sockets alive across power transitions
- `womp 1` (default — wake on magic packet enabled, useful for remote)

Set 2026-04-29 via `sudo pmset -a sleep 0 displaysleep 0 disksleep 0 powernap 0` — silent through the sudo wrapper at `~/dotfiles/bin/sudo` + 1P-backed askpass.

**Why:** User explicitly requested "desktop can never sleep, needs to run 24/7" — supporting persistent SSH access, long-running pentests/scans (shannon), local model serving (Ollama), background workflows (atuin / triple-tier router / launchd jobs).

**How to apply:**
- Don't propose sleep settings tweaks unprompted.
- If the user asks to revert: defaults are typically `sleep 1`, `displaysleep 10`, `disksleep 10`, `powernap 1`. Revert via `sudo pmset -a sleep 1 displaysleep 10 disksleep 10 powernap 1`.
- If they ask "why is my display always on" — this is intentional.
- For temporary sleep prevention (one-off long task): use `caffeinate -d -i -s -t <seconds>` — doesn't change persistent settings.
