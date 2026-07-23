---
name: project-sudo-wrapper
description: "PATH-based sudo wrapper at ~/dotfiles/bin/sudo auto-injects -A and uses askpass helper. Lets non-TTY callers (playwright, brew helpers) sudo without prompts. Programs hardcoding /usr/bin/sudo bypass it."
metadata:
  type: project
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
A `sudo` wrapper at `~/dotfiles/bin/sudo` (committed in dotfiles repo, on PATH ahead of `/usr/bin`) automatically passes `-A` to the real sudo and points `SUDO_ASKPASS` at `~/dotfiles/bin/sudo-askpass`. The askpass helper resolves the macOS password by:

1. Reading `op://Personal/macOS/password` from 1Password CLI (biometric Touch ID gate). Requires 1Password Settings → Developer → "Integrate with 1Password CLI" + a "macOS" item with a "password" field.
2. Falling back to an osascript GUI dialog if 1P isn't available.

`SUDO_ASKPASS` is also exported in `~/.zprofile` so login shells / non-interactive invocations have it set.

**Why:** macOS BSD sudo doesn't honor `Defaults askpass=` directive (Linux sudo does), so we can't make sudo auto-resolve passwords for non-`-A` callers via sudoers config alone. The wrapper sidesteps that by ensuring every call goes through `sudo -A`.

**How to apply:**
- This unblocks `playwright install chrome`, brew casks that sudo `installer`, and similar tools that previously failed with "a terminal is required."
- Bypass: programs that call `/usr/bin/sudo` directly (absolute path) skip the wrapper. Rare in practice. Examples that work via the wrapper: `npx playwright install chrome`, brew tap/install with system-dep installers.
- Verified end-to-end 2026-04-29: cold-cache `sudo` from non-TTY shell resolved password via askpass, installed Chrome, browser-use rendered github.com.
- For maximum autonomy, complete the 1P side: open 1Password → Settings → Developer → enable "Integrate with 1Password CLI" + "Use SSH agent". Add macOS account password as a "Login" item named "macOS" in the Personal vault. Then sudo is fully Touch-ID-gated, no GUI dialog.
