---
name: user-1password
description: "1P CLI integration is on; SSH agent on; vault is named "Personal" (not "Private"); macOS Login item exists for sudo-askpass."
metadata:
  type: user
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
User's 1Password is fully wired:

- **Vault name:** `Personal` (single vault — not "Private", which was my wrong default).
- **CLI integration:** ON (`op account list` returns `z5jonathan@icloud.com` / `C3WVLA6NGFCTTI56VCGPC36JNQ`).
- **SSH agent:** ON. Socket at `~/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock`. `ssh_config` has `Host *` block with `IdentityAgent` pointing at it.
- **macOS Login item** in Personal vault — `op://Personal/macOS/password` resolves the macOS account password. Used by `~/dotfiles/bin/sudo-askpass` for unattended sudo.

**How to apply:**
- Any `op://` references should use `Personal/<item>/<field>` — never `Private`.
- For new credentials the user mentions storing in 1P, default to creating in `Personal` vault unless told otherwise.
- `sudo-askpass` is fully wired (verified 2026-04-29 — `sudo -k && sudo true` resolves silently via 1P).
