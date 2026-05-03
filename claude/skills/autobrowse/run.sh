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

# Hard prereq: browse CLI must be installed (the actual browser executor).
# Without it, no model provider matters — autobrowse can't execute.
if ! command -v browse >/dev/null 2>&1; then
  echo "🔴 'browse' CLI not installed — autobrowse depends on it" >&2
  echo "   Install with: npm install -g @browserbasehq/browse-cli" >&2
  exit 1
fi

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
USER_PASSED_MODEL=false
printf '%s\n' "$@" | grep -qx -- "--model" && USER_PASSED_MODEL=true

run_evaluate() {
  local model="$1"; shift
  if [ "$USER_PASSED_MODEL" = "true" ]; then
    node "$SKILL_DIR/scripts/evaluate.mjs" "$@"
  else
    node "$SKILL_DIR/scripts/evaluate.mjs" --model "$model" "$@"
  fi
}

# Try the chosen provider's default model first
if run_evaluate "$DEFAULT_MODEL" "$@"; then
  exit 0
fi

# Fallback ladder when on openrouter (only — anthropic/litellm don't have a
# meaningful sibling fallback within the same provider config).
if [ "$PROVIDER" = "openrouter" ] && [ "$USER_PASSED_MODEL" = "false" ]; then
  echo "🟡 deepseek-chat failed — falling back to deepseek-r1 (more reasoning)" >&2
  if run_evaluate "deepseek/deepseek-r1" "$@"; then
    exit 0
  fi
  echo "🟡 deepseek-r1 failed — final fallback to anthropic/claude-sonnet-4.5 via OpenRouter" >&2
  echo "   (uses OpenRouter credits — routes to Claude without needing a direct Anthropic API key" >&2
  echo "    or breaking your Claude Max subscription model)" >&2
  exec node "$SKILL_DIR/scripts/evaluate.mjs" --model "anthropic/claude-sonnet-4.5" "$@"
fi

exit 1
