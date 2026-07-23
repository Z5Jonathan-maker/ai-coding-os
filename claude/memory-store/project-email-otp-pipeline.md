---
name: project-email-otp-pipeline
description: "gh-mail-code reads the latest verification code from Mail.app's iCloud inbox; gh-auto-auth auto-fills it when GitHub triggers sudo-mode email verification. Reusable pattern for any service that emails OTPs."
metadata:
  type: project
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
When a service (GitHub, AWS, banks, etc.) emails an OTP/verification code to the user's iCloud inbox, the device's Mail.app receives it and AppleScript can read it without browser clicks.

**Pattern:**
1. AppleScript `tell application "Mail" to get content of message of inbox whose sender contains "..."`
2. Regex out the digit code from the body (typically 6-8 digits on its own line)
3. Type into the verification page input field

**Tools:**
- `~/dotfiles/bin/gh-mail-code` — fetches latest GitHub verification code. `--since-now --timeout=N` waits for a NEW email vs. returning a stale one. Returns code on stdout, exit 0.
- `~/dotfiles/bin/gh-auto-auth` — Playwright autofill detects `input[name='otp']` / `input[autocomplete='one-time-code']`, calls `gh-mail-code --since-now`, types code, submits.

**Verified end-to-end 2026-04-29:** gh re-auth with `user` scope (which forces sudo-mode reauth + email OTP) completed autonomously. Token scopes captured: `admin:public_key, admin:ssh_signing_key, gist, notifications, read:org, repo, user, workflow, write:packages`. GitHub display name "Jonathan Cimadevilla" set via `gh api -X PATCH user`.

**How to apply:**
- For other services that email OTPs (AWS, banks, Cloudflare, etc.), copy the gh-mail-code pattern with a sender filter (`whose sender contains "no-reply@aws.amazon.com"` etc.).
- This unblocks the previously-painful "sudo-mode" reauth that was stalling Playwright at the OTP page.
- Mail.app must be running and signed into the iCloud account that receives the codes. Verified 2026-04-29: Mail.app PID present, account `z5jonathan@icloud.com` configured, inbox accessible.
- Combine with `op-token` for any flow needing both stored-credential lookup AND email OTP.
