#!/usr/bin/env bash
# One-time Notion → TEL onboarding.
#
# What this does:
#   1. Opens https://www.notion.so/my-integrations in your browser
#   2. Prompts for the integration token (you paste it in)
#   3. Stores it in macOS Keychain at the service name TEL expects
#   4. Verifies by hitting Notion's /v1/users/me endpoint
#
# What you still have to do AFTER this script (Notion-side):
#   • For each page you want Claude to read, open the page → "..." (top right)
#     → "Connections" / "Add connections" → pick the integration you just made.
#     Notion default-denies; without this step, the integration sees nothing.
#
# Idempotent. Safe to re-run.

set -euo pipefail

KEYCHAIN_SERVICE="cc.notion.integration_token"
INTEGRATIONS_URL="https://www.notion.so/my-integrations"

cyan() { printf "\033[36m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
red() { printf "\033[31m%s\033[0m\n" "$*" >&2; }

cyan "=== Notion → TEL onboarding ==="
echo

if security find-generic-password -s "$KEYCHAIN_SERVICE" -w >/dev/null 2>&1; then
  yellow "An existing token is already in Keychain at service '$KEYCHAIN_SERVICE'."
  read -r -p "Replace it? [y/N] " replace
  if [[ "${replace:-N}" != "y" && "${replace:-N}" != "Y" ]]; then
    green "Keeping existing token. Exiting."
    exit 0
  fi
  security delete-generic-password -s "$KEYCHAIN_SERVICE" >/dev/null 2>&1 || true
fi

cyan "Step 1/3 — Create the integration"
echo "Opening: $INTEGRATIONS_URL"
echo "  • Click 'New integration'"
echo "  • Name it: Claude Code Router  (or anything you'll recognize)"
echo "  • Associated workspace: pick yours"
echo "  • Type: Internal"
echo "  • Capabilities: 'Read content' is the minimum; 'Read user information' helps the verify step"
echo "  • Save → copy the 'Internal Integration Secret' (starts with 'secret_' or 'ntn_')"
open "$INTEGRATIONS_URL" >/dev/null 2>&1 || true
echo

cyan "Step 2/3 — Paste the token"
yellow "(Token is hidden as you type. It will be stored in macOS Keychain, NOT in any transcript or file.)"
read -r -s -p "Notion integration token: " TOKEN
echo
if [[ -z "${TOKEN:-}" ]]; then
  red "No token provided. Aborting."
  exit 1
fi
if [[ ! "$TOKEN" =~ ^(secret_|ntn_) ]]; then
  yellow "Warning: token doesn't start with 'secret_' or 'ntn_'. Continuing anyway."
fi

security add-generic-password -a "$USER" -s "$KEYCHAIN_SERVICE" -w "$TOKEN" -U
unset TOKEN
green "Stored in Keychain at service '$KEYCHAIN_SERVICE'."
echo

cyan "Step 3/3 — Verify"
TOKEN=$(security find-generic-password -s "$KEYCHAIN_SERVICE" -w)
HTTP_CODE=$(curl -sS -o /tmp/notion-verify.json -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  https://api.notion.com/v1/users/me || echo "000")
unset TOKEN

if [[ "$HTTP_CODE" == "200" ]]; then
  if command -v jq >/dev/null 2>&1; then
    NAME=$(jq -r '.name // .bot.owner.user.name // "unknown"' </tmp/notion-verify.json)
    green "✓ Token works. Integration identity: $NAME"
  else
    green "✓ Token works (HTTP 200)."
  fi
else
  red "✗ Verification failed (HTTP $HTTP_CODE). Response:"
  cat /tmp/notion-verify.json
  red "Token saved to Keychain anyway — re-run this script to replace it once you have a working one."
  exit 1
fi
rm -f /tmp/notion-verify.json
echo

green "=== Onboarding complete ==="
cat <<'EOF'

What's still required (Notion-side, manual):
  For EACH page you want Claude to read, open it in Notion and:
    1. Click the "..." menu (top right)
    2. "Connections" → "Add connections"
    3. Pick the integration you just created
  Notion default-denies; without that grant, the integration sees nothing.

Once granted, calls work:
  ~/.claude/tel/client/tel-call.sh notion get_block_children '{"block_id": "<page-id>"}'

Page IDs are the 32-char hex string at the end of any Notion URL.

EOF
