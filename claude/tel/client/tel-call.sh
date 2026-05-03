#!/usr/bin/env bash
# tel-call.sh
# Claude-callable wrapper around the TEL HTTP API.
#
# Usage:
#   tel-call.sh <service> <action> '{"key":"value"}'
#   tel-call.sh --list
#   tel-call.sh --health
#   tel-call.sh --dry-run gamma create_presentation '{"title":"X","outline":[...]}'
#   tel-call.sh --undo undo_<token>
#
# The wrapper never logs the response body to stdout if it might contain
# sensitive content — it pipes through jq with a redaction pass.
set -euo pipefail

TEL_URL="${TEL_URL:-http://127.0.0.1:8765}"
DRY_RUN=false

case "${1:-}" in
  --health)
    curl -fsS "$TEL_URL/health" | jq .
    exit 0
    ;;
  --list|--registry)
    curl -fsS "$TEL_URL/registry" | jq .
    exit 0
    ;;
  --reload)
    curl -fsS -X POST "$TEL_URL/reload" | jq .
    exit 0
    ;;
  --undo)
    [ -z "${2:-}" ] && { echo "usage: $0 --undo <undo_token>" >&2; exit 1; }
    curl -fsS -X POST "$TEL_URL/undo/$2" | jq .
    exit 0
    ;;
  --audit)
    svc="${2:-}"
    if [ -n "$svc" ]; then
      curl -fsS "$TEL_URL/audit/recent?service=$svc&limit=20" | jq .
    else
      curl -fsS "$TEL_URL/audit/recent?limit=20" | jq .
    fi
    exit 0
    ;;
  --dry-run)
    DRY_RUN=true
    shift
    ;;
esac

SERVICE="${1:-}"
ACTION="${2:-}"
ARGS_JSON="${3:-{}}"

[ -z "$SERVICE" ] || [ -z "$ACTION" ] && {
  echo "usage: $0 [--dry-run] <service> <action> '<args-json>'" >&2
  echo "       $0 --health | --list | --reload | --undo <token> | --audit [service]" >&2
  exit 1
}

REQUEST_ID="req_$(date +%s)_$(uuidgen 2>/dev/null | head -c 8 || openssl rand -hex 4)"
CLIENT="${TEL_CLIENT:-claude-code-cli}"

ENVELOPE=$(jq -n \
  --arg service "$SERVICE" \
  --arg action "$ACTION" \
  --argjson args "$ARGS_JSON" \
  --arg request_id "$REQUEST_ID" \
  --arg client "$CLIENT" \
  --argjson dry_run "$DRY_RUN" \
  '{service:$service, action:$action, args:$args, request_id:$request_id, client:$client, dry_run:$dry_run}')

curl -fsS -X POST "$TEL_URL/execute" \
  -H "Content-Type: application/json" \
  -d "$ENVELOPE" | jq .
