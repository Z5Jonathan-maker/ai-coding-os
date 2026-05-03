#!/usr/bin/env bash
# autobrowse wrapper — sources secrets from 1Password at invocation time
# (never persists them to disk, never to transcript), then runs evaluate.mjs.
#
# Default route: OpenRouter → DeepSeek. Override with TEL_PROVIDER env var:
#   TEL_PROVIDER=openrouter  (default — uses OpenRouter as Anthropic-compat proxy)
#   TEL_PROVIDER=anthropic   (direct Anthropic — needs separate non-Max account)
#   TEL_PROVIDER=litellm     (local LiteLLM proxy at localhost:4000)
#
# Usage:
#   ./run.sh --task google-flights
#   ./run.sh --task google-flights --model deepseek/deepseek-r1
#   TEL_PROVIDER=anthropic ./run.sh --task google-flights --model claude-sonnet-4-6
set -euo pipefail

PROVIDER="${TEL_PROVIDER:-openrouter}"
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"

# Default model per provider
DEFAULT_MODEL=""
case "$PROVIDER" in
  openrouter)
    if ! op whoami >/dev/null 2>&1; then
      echo "🔴 1Password CLI not signed in — run: eval \$(op signin)" >&2
      exit 1
    fi
    export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"
    ANTHROPIC_API_KEY="$(op read op://Personal/OpenRouter/credential 2>/dev/null)"
    export ANTHROPIC_API_KEY
    [ -z "$ANTHROPIC_API_KEY" ] && {
      echo "🔴 OpenRouter credential not in 1Password. Set up:" >&2
      echo "   op item create --category='API Credential' --vault=Personal --title='OpenRouter' credential[concealed]='sk-or-...'" >&2
      exit 1
    }
    DEFAULT_MODEL="deepseek/deepseek-chat"
    ;;
  anthropic)
    if ! op whoami >/dev/null 2>&1; then
      echo "🔴 1Password CLI not signed in — run: eval \$(op signin)" >&2
      exit 1
    fi
    unset ANTHROPIC_BASE_URL
    ANTHROPIC_API_KEY="$(op read op://Personal/Anthropic-API/credential 2>/dev/null)"
    export ANTHROPIC_API_KEY
    [ -z "$ANTHROPIC_API_KEY" ] && {
      echo "🔴 Separate Anthropic-API credential not in 1Password (Claude Max OAuth doesn't work for raw API)." >&2
      exit 1
    }
    DEFAULT_MODEL="claude-sonnet-4-6"
    ;;
  litellm)
    export ANTHROPIC_BASE_URL="${LITELLM_URL:-http://127.0.0.1:4000}"
    export ANTHROPIC_API_KEY="${LITELLM_KEY:-sk-litellm-local}"
    DEFAULT_MODEL="${LITELLM_MODEL:-deepseek-chat}"
    ;;
  *)
    echo "🔴 Unknown TEL_PROVIDER=$PROVIDER (use: openrouter|anthropic|litellm)" >&2
    exit 1
    ;;
esac

# If user didn't pass --model, inject the provider default
if ! printf '%s\n' "$@" | grep -qx -- "--model"; then
  exec node "$SKILL_DIR/scripts/evaluate.mjs" --model "$DEFAULT_MODEL" "$@"
else
  exec node "$SKILL_DIR/scripts/evaluate.mjs" "$@"
fi
