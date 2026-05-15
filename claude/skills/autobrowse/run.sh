#!/usr/bin/env bash
# autobrowse wrapper — prefers Keychain for runtime secrets, then falls back
# to 1Password when needed, then runs evaluate.mjs.
#
# Default route: Claude Max subscription via cliproxy. Fallback: DeepSeek via
# OpenRouter. Override with TEL_PROVIDER env var:
#   TEL_PROVIDER=cliproxy    (default — Claude Code monthly subscription via local proxy)
#   TEL_PROVIDER=claude_max  (alias for cliproxy)
#   TEL_PROVIDER=openrouter  (DeepSeek via OpenRouter Anthropic-compat proxy)
#   TEL_PROVIDER=anthropic   (direct Anthropic — needs separate non-Max account)
#   TEL_PROVIDER=litellm     (local LiteLLM proxy at localhost:4000)
#
# Usage:
#   ./run.sh --task google-flights
#   ./run.sh --task google-flights                   # Claude Max primary
#   TEL_PROVIDER=openrouter ./run.sh --task google-flights
#   ./run.sh --task google-flights --model deepseek/deepseek-r1
#   TEL_PROVIDER=anthropic ./run.sh --task google-flights --model claude-sonnet-4-6
set -euo pipefail

PROVIDER="${TEL_PROVIDER:-cliproxy}"
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$HOME/local/opt/node/bin:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
ECOSYSTEM_ENV="$HOME/code/scripts/ecosystem-env.sh"
ALLOW_OP_FALLBACK="${CC_ALLOW_1PASSWORD_FALLBACK:-0}"

if [ -r "$ECOSYSTEM_ENV" ]; then
  # shellcheck disable=SC1090
  . "$ECOSYSTEM_ENV"
fi

resolve_secret() {
  local secret_name="${1:-}"
  local env_name="${2:-}"
  local keychain_service="${3:-}"
  local op_ref="${4:-}"
  local value=""

  if [ -n "$secret_name" ] && command -v load_secret_from_registry >/dev/null 2>&1; then
    load_secret_from_registry "$secret_name" "$ALLOW_OP_FALLBACK" || true
    eval "value=\${$env_name:-}"
    [ -n "$value" ] && {
      printf '%s' "$value"
      return 0
    }
  fi

  if command -v load_secret_var >/dev/null 2>&1; then
    load_secret_var "$env_name" "$keychain_service" "$op_ref" || true
    eval "value=\${$env_name:-}"
    [ -n "$value" ] && {
      printf '%s' "$value"
      return 0
    }
  fi

  eval "value=\${$env_name:-}"
  [ -n "$value" ] && {
    printf '%s' "$value"
    return 0
  }

  if [ -n "$keychain_service" ] && command -v security >/dev/null 2>&1; then
    value="$(security find-generic-password -a "${USER:-$LOGNAME}" -s "$keychain_service" -w 2>/dev/null || true)"
    [ -n "$value" ] && {
      printf '%s' "$value"
      return 0
    }
  fi

  if [ "$ALLOW_OP_FALLBACK" = "1" ] && [ -n "$op_ref" ] && command -v op >/dev/null 2>&1; then
    value="$(op read "$op_ref" 2>/dev/null || true)"
    [ -n "$value" ] && {
      printf '%s' "$value"
      return 0
    }
  fi

  return 1
}

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
    export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"
    ANTHROPIC_API_KEY="$(resolve_secret openrouter OPENROUTER_API_KEY "cc.openrouter.api_key" "op://Personal/OpenRouter/credential" || true)"
    export ANTHROPIC_API_KEY
    [ -z "$ANTHROPIC_API_KEY" ] && {
      echo "🔴 OpenRouter credential missing from Keychain." >&2
      echo "   Seed Keychain service cc.openrouter.api_key or rerun with CC_ALLOW_1PASSWORD_FALLBACK=1" >&2
      exit 1
    }
    DEFAULT_MODEL="deepseek/deepseek-chat"
    ;;
  anthropic)
    unset ANTHROPIC_BASE_URL
    ANTHROPIC_API_KEY="$(resolve_secret anthropic ANTHROPIC_API_KEY "cc.anthropic.api_key" "op://Personal/Anthropic-API/credential" || true)"
    export ANTHROPIC_API_KEY
    [ -z "$ANTHROPIC_API_KEY" ] && {
      echo "🔴 Separate Anthropic API credential missing from Keychain." >&2
      echo "   Seed Keychain service cc.anthropic.api_key or rerun with CC_ALLOW_1PASSWORD_FALLBACK=1" >&2
      exit 1
    }
    DEFAULT_MODEL="claude-sonnet-4-6"
    ;;
  litellm)
    export ANTHROPIC_BASE_URL="${LITELLM_URL:-http://127.0.0.1:4000}"
    export ANTHROPIC_API_KEY="${LITELLM_KEY:-sk-litellm-local}"
    DEFAULT_MODEL="${LITELLM_MODEL:-deepseek-chat}"
    ;;
  cliproxy | claude_max)
    export ANTHROPIC_BASE_URL="${CLIPROXY_URL:-http://127.0.0.1:8317}"
    export ANTHROPIC_API_KEY="${CLIPROXY_KEY:-cliproxy-local-key}"
    DEFAULT_MODEL="${CLIPROXY_MODEL:-claude-sonnet-4-6}"
    ;;
  *)
    echo "🔴 Unknown TEL_PROVIDER=$PROVIDER (use: openrouter|anthropic|litellm|cliproxy|claude_max)" >&2
    exit 1
    ;;
esac

# If user didn't pass --model, inject the provider default
USER_PASSED_MODEL=false
printf '%s\n' "$@" | grep -qx -- "--model" && USER_PASSED_MODEL=true

run_evaluate() {
  local model="$1"
  shift
  if [ "$USER_PASSED_MODEL" = "true" ]; then
    node "$SKILL_DIR/scripts/evaluate.mjs" "$@"
  else
    node "$SKILL_DIR/scripts/evaluate.mjs" --model "$model" "$@"
  fi
}

run_evaluate_with_env() {
  local base_url="$1"
  shift
  local api_key="$1"
  shift
  local model="$1"
  shift
  if [ "$USER_PASSED_MODEL" = "true" ]; then
    ANTHROPIC_BASE_URL="$base_url" ANTHROPIC_API_KEY="$api_key" \
      node "$SKILL_DIR/scripts/evaluate.mjs" "$@"
  else
    ANTHROPIC_BASE_URL="$base_url" ANTHROPIC_API_KEY="$api_key" \
      node "$SKILL_DIR/scripts/evaluate.mjs" --model "$model" "$@"
  fi
}

# Try the chosen provider's default model first
if run_evaluate "$DEFAULT_MODEL" "$@"; then
  exit 0
fi

# Fallback ladder for the default routing policy:
#   cliproxy (Claude Max) -> OpenRouter DeepSeek chat -> OpenRouter DeepSeek r1
#   -> OpenRouter Claude
if [ "$USER_PASSED_MODEL" = "false" ] && { [ "$PROVIDER" = "cliproxy" ] || [ "$PROVIDER" = "claude_max" ]; }; then
  OR_KEY="$(resolve_secret openrouter OPENROUTER_API_KEY "cc.openrouter.api_key" "op://Personal/OpenRouter/credential" || true)"
  if [ -n "$OR_KEY" ]; then
    echo "🟡 Claude Max path failed — falling back to DeepSeek via OpenRouter" >&2
    if run_evaluate_with_env "https://openrouter.ai/api/v1" "$OR_KEY" "deepseek/deepseek-chat" "$@"; then
      exit 0
    fi
    echo "🟡 deepseek-chat failed — falling back to deepseek-r1 (more reasoning)" >&2
    if run_evaluate_with_env "https://openrouter.ai/api/v1" "$OR_KEY" "deepseek/deepseek-r1" "$@"; then
      exit 0
    fi
    echo "🟡 deepseek-r1 failed — final fallback to Claude via OpenRouter" >&2
    exec ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1" ANTHROPIC_API_KEY="$OR_KEY" \
      node "$SKILL_DIR/scripts/evaluate.mjs" --model "anthropic/claude-sonnet-4.5" "$@"
  fi
fi

# Secondary ladder when explicitly using OpenRouter:
if [ "$PROVIDER" = "openrouter" ] && [ "$USER_PASSED_MODEL" = "false" ]; then
  echo "🟡 deepseek-chat failed — falling back to deepseek-r1 (more reasoning)" >&2
  if run_evaluate "deepseek/deepseek-r1" "$@"; then
    exit 0
  fi
  echo "🟡 deepseek-r1 failed — final fallback to Claude via OpenRouter" >&2
  exec node "$SKILL_DIR/scripts/evaluate.mjs" --model "anthropic/claude-sonnet-4.5" "$@"
fi

exit 1
