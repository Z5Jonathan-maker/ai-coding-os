#!/usr/bin/env bash
set -euo pipefail

ROOT="${AI_SYSTEM_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"

printf 'feedback-laws.md\n'
sed -n '1,80p' "$ROOT/memory/feedback-laws.md"
printf '\ndepth-check.cjs\n'
node "$ROOT/scripts/depth-check.cjs" || true
printf '\nhard stop: secrets, credentials, deletion, destructive operations\n'
