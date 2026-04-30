# COMPLETE SETUP — finish god-mode in one Sunday

Single source of truth for every step the harness blocks me from running
on your behalf. Run `cc-bootstrap all` for an interactive walkthrough,
or work through this list manually.

## TL;DR — one block, copy/paste

```bash
# Always-safe (no creds, idempotent)
~/dotfiles/bin/cc-bootstrap launchd

# Everything else, interactive (one prompt per step)
~/dotfiles/bin/cc-bootstrap all

# Read-only sanity check (no changes)
~/dotfiles/bin/cc-bootstrap doctor
```

## What `cc-bootstrap all` does, in order

### 1. cc-prune LaunchAgent — `cc-bootstrap launchd`
Daily 04:30 prune of `~/.claude/{debug,projects,file-history,checkpoints}`.
No credentials needed. Closes the silent-killer disk-fill gap that takes
down 24/7 boxes.

### 2. mempalace — `cc-bootstrap mempalace`
- Init palace at `~/mempalace`
- Mine `~/.claude/projects/` (your accumulated session history) — slow first
  time, idempotent after
- Register the `mempalace` MCP server with claude
- Result: `/recall <query>` returns verbatim chunks of past sessions

### 3. sudoers drop-in — `cc-bootstrap sudoers`
Wires `Defaults askpass=...` so `/usr/bin/sudo` (called directly by brew
helpers, system installers) flows through your askpass instead of
prompting on a TTY that doesn't exist. Validates with `visudo -cf` first;
typo means refused install, no broken sudo.

Requires entering your sudo password once during install.

### 4. ntfy push — `cc-bootstrap ntfy-prompt`
Picks a random topic, appends `export NTFY_TOPIC=...` to `~/.zprofile`.
Then install the ntfy iOS app and subscribe to that topic. From then on,
the `ntfy-notify.sh` Stop hook pushes to your phone when Claude finishes
a turn.

### 5. cc-backup (restic → B2) — `cc-bootstrap restic`
Requires you to first:
- Create a Backblaze B2 bucket (or pick S3/Wasabi)
- Add a 1P item "Restic B2 backup" in vault Personal with fields:
  - `password` (random 32 bytes — generate in 1P)
  - `b2_account_id` (B2 application key ID)
  - `b2_account_key` (B2 application key)

Then `cc-bootstrap restic` installs restic via brew, runs `cc-backup
init`, and loads the daily 03:30 LaunchAgent. Backs up `~/.claude/`
operational state + dotfiles to your bucket.

## Things `cc-bootstrap` does NOT do

These need browser clicks, not shell commands:

### Tailscale OAuth
Open the URL printed by `tailscale status`, sign in (GitHub OAuth →
Z5Jonathan-maker is fine), then verify with `tailscale status` showing a
100.x.x.x address.
```bash
tailscale up --hostname=imac --ssh --accept-routes
# follow the printed URL
```

### 1Password Service Account
For full headless sudo (no biometric needed):
1. Visit my.1password.com → Developer → Service Accounts
2. Create one, scope to **Personal** vault
3. Copy the `ops_…` token
4. Edit `~/.zprofile`, uncomment the line, paste the token
5. New shells will then have op working without a 1P app prompt

### Hammerspoon + Rectangle Accessibility
System Settings → Privacy & Security → Accessibility → toggle on for
both apps. Sequoia's SwiftUI tree blocks scripted toggling.

### macOS password rotation
System Settings → Touch ID & Password → Change Password. Then update
the "macOS" item in the **Personal** 1P vault so the askpass keeps
working.

## Things requiring a separate explicit auth from you

### `cc-loop` runner
The 24/7 unattended `claude -p` runner. Designed in
`~/dotfiles/docs/cc-loop-design.md` with watchdog + circuit breaker +
rate-backoff + Ralph-style outcome verification. The runner script
itself is not yet written because it needs a named-scope authorization.

To authorize, paste this verbatim into a Claude Code session:

> *Build `cc-loop` at `~/dotfiles/bin/cc-loop` and the matching
> `com.user.cc-loop.plist` LaunchAgent. I authorize a 24/7 autonomous
> Claude loop on this iMac with `bypassPermissions`, 30-min cycle
> timeout, and a `~/.cc-paused` touch-flag killswitch. Bake in the
> Ralph-style outcome-bound circuit breaker per the design doc.*

### Pushing dotfiles to main
For routine pushes after this initial stretch, paste:
> *yes, push to main on dotfiles*

The harness reads this as named-scope authorization for that specific
repo + branch combination. Generic "push" / "deploy" / "ship it" reads
as encouragement, not authorization.

## How to know you're done

```bash
cc-bootstrap doctor
```

Should show all green ✓. The bootstrap-check SessionStart hook will
also stop nagging you once the list is clean.
