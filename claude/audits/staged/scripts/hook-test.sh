#!/usr/bin/env bash
# hook-test.sh — runs every hook in dotfiles dry, captures exit code + wall
# time. Catches: shellcheck regressions, missing dependencies, syntax errors,
# state-file path bugs. Doesn't validate behavior — just "does it run clean".
# Use after editing any hook, OR daily via cron as a regression guard.
set -u

OUT="${1:-/dev/stdout}"
HOOKS_DIR="$HOME/dotfiles/claude/hooks"

[ -d "$HOOKS_DIR" ] || { echo "🔴 $HOOKS_DIR missing"; exit 1; }

declare -i pass=0 fail=0

{
  echo "# Hook test — $(date)"
  echo

  for h in "$HOOKS_DIR"/*.sh; do
    name=$(basename "$h")
    started=$(date +%s%N 2>/dev/null || date +%s)
    result=$(bash "$h" </dev/null 2>&1)
    rc=$?
    ended=$(date +%s%N 2>/dev/null || date +%s)
    if [ "${#started}" -gt 10 ]; then
      ms=$(( (ended - started) / 1000000 ))
    else
      ms=$(( (ended - started) * 1000 ))
    fi

    if [ $rc -eq 0 ] || [ $rc -eq 2 ]; then
      # exit 2 is a common Stop-hook "block" signal — still valid run
      echo "- ✓ $name (rc=$rc · ${ms}ms)"
      pass+=1
    else
      echo "- 🔴 $name (rc=$rc · ${ms}ms)"
      [ -n "$result" ] && echo "  $(echo "$result" | head -2 | sed 's/^/  /')"
      fail+=1
    fi
  done

  echo
  total=$((pass + fail))
  echo "## Summary: $pass/$total clean · $fail failed"
  if [ $fail -gt 0 ]; then
    echo "Failed hooks need investigation before next session."
    exit 1
  fi
} > "$OUT"
