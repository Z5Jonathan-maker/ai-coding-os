---
name: project-remote-control
description: "Tailscale CLI installed + tailscaled daemon running. User must complete first-time auth at the URL printed by `tailscale status`. Then phone-side Tailscale app + tailscale ssh imac → done."
metadata:
  type: project
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
Tailscale is installed and the system daemon is running, but **first-time auth pending**:

- **CLI:** `/opt/homebrew/bin/tailscale` ✓ (formula installed via brew)
- **Daemon:** `com.tailscale.tailscaled` loaded in launchctl (verified PID 49686 at install time)
- **Hostname:** `imac` (set via `tailscale up --hostname=imac --ssh`)
- **SSH mode:** enabled (`--ssh` flag), so phone-side `tailscale ssh imac` connects without macOS sshd

**To complete auth (one-time, ~30 sec):**
1. Visit the auth URL printed by `tailscale up` (saved in session transcript) OR re-run `tailscale up --hostname=imac --ssh --accept-routes` and click the new URL
2. Sign into Tailscale (free personal tier; can use GitHub OAuth — Z5Jonathan-maker)
3. On phone: install Tailscale app, sign in with same account, the iMac shows up
4. From phone: any SSH client (Termius, Blink) → `tailscale ssh imac` (key-based, no password)

**GUI cask did NOT install** — `brew install --cask tailscale-app` keeps bypassing our sudo wrapper because it calls `/usr/bin/sudo -u root` with absolute path, not via PATH. CLI is sufficient for headless remote access. If GUI menubar item is desired later: download installer pkg from tailscale.com manually.

**Why:** User explicitly stated "this computer could never sleep, and we actually need true autonomy so that if a pop up or a command comes instead of it just stopping me in my tracks ... All autonomously. That's true god mode." Tailscale provides phone↔Mac connectivity without port forwarding or VPN config.

**How to apply:**
- Once authed, the iMac is reachable as `imac` from any device on the tailnet (Magic DNS handles naming)
- Combined with the no-sleep pmset config, the iMac is permanently available
- Combined with the sudo wrapper + 1P askpass, all remote operations work without typing passwords from the phone
- Combined with osascript Accessibility being ON, UI automation can run from a remote SSH session
