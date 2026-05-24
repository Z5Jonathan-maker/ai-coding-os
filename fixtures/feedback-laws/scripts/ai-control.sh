#!/usr/bin/env bash
set -euo pipefail

ROOT="${AI_SYSTEM_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
cmd="${1:-}"
shift || true

case "$cmd" in
feedback-laws)
  sed -n '1,120p' "$ROOT/memory/feedback-laws.md"
  ;;
depth-check)
  node "$ROOT/scripts/depth-check.cjs"
  ;;
evolve)
  node "$ROOT/scripts/evolve.cjs" "$@"
  ;;
*)
  printf 'fixture control plane: feedback-laws, depth-check, evolve\n'
  ;;
esac
