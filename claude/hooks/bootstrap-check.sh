#!/bin/bash
# SessionStart hook: nag the user about pending bootstrap steps that
# are blocking full god-mode autonomy. Quiet when nothing's pending.
#
# Checks:
#   - mempalace palace initialized
#   - sudoers drop-in installed
#   - tailscale authed
#   - cc-backup LaunchAgent loaded (only if restic exists)
#   - NTFY_TOPIC set
#
# Surfaces ONE compact additionalContext block if anything is pending.
# Runs at most once per day per cwd to avoid being annoying — a marker
# file at ~/.claude/hooks/state/bootstrap-check.last tracks the date.
set -u

STATE_DIR="$HOME/.claude/hooks/state"
mkdir -p "$STATE_DIR"
LAST_FILE="$STATE_DIR/bootstrap-check.last"

today=$(date +%Y-%m-%d)
last=$(cat "$LAST_FILE" 2>/dev/null || echo "")
[ "$last" = "$today" ] && exit 0

pending=()

[ -d "$HOME/mempalace" ] && [ -n "$(ls -A "$HOME/mempalace" 2>/dev/null)" ] \
  || pending+=("mempalace not initialized → cc-bootstrap mempalace")

[ -f /etc/sudoers.d/00-askpass ] \
  || pending+=("sudoers drop-in missing → cc-bootstrap sudoers")

/opt/homebrew/bin/tailscale status 2>&1 | grep -q '^100\.' \
  || pending+=("tailscale not authed → tailscale up --hostname=imac --ssh --accept-routes")

if command -v restic >/dev/null 2>&1 || [ -x /opt/homebrew/bin/restic ]; then
  launchctl list 2>/dev/null | grep -q com.user.cc-backup \
    || pending+=("cc-backup LaunchAgent not loaded → cc-bootstrap restic")
fi

grep -q '^export NTFY_TOPIC' "$HOME/.zprofile" 2>/dev/null \
  || pending+=("ntfy push topic not set → cc-bootstrap ntfy-prompt")

# Stamp the date BEFORE bailing on empty so we don't re-check on every
# session start once everything is done.
echo "$today" >"$LAST_FILE"

[ ${#pending[@]} -eq 0 ] && exit 0

# Build the additionalContext message.
{
  echo "[bootstrap-check] $(date +%Y-%m-%d) — ${#pending[@]} pending operational steps:"
  for p in "${pending[@]}"; do echo "  • $p"; done
  echo ""
  echo "Run 'cc-bootstrap all' for an interactive walkthrough, or 'cc-bootstrap status' for read-only check. Mention this to the user only if relevant to the current task — don't lead with it."
} >/tmp/bootstrap-check.$$.txt

# Emit JSON. Skip on any python error.
python3 -c "
import json, sys
try:
    with open('/tmp/bootstrap-check.$$.txt') as f:
        ctx = f.read()
    print(json.dumps({'hookSpecificOutput': {'hookEventName': 'SessionStart', 'additionalContext': ctx}}))
except Exception:
    pass
" 2>/dev/null
rm -f /tmp/bootstrap-check.$$.txt
exit 0
