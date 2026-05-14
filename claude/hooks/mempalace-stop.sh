#!/usr/bin/env bash
# Stop hook: feed session metadata to mempalace so every session auto-deposits
# a learning drawer instead of being forgotten.
#
# Defensive: missing mempalace, slow palace, or any error must NOT block the
# Stop chain — the user's terminal hangs if this is slow. Time-bounded to 30s.
#
# Wired as the third feedback loop (after: autotuner→CB, reflection-queue→logs).
set -u

# Read stdin once and tee to a buffer — mempalace eats it, but we may want
# to forward to other consumers later without re-reading.
STDIN_BUF="$(cat)"
[ -z "$STDIN_BUF" ] && exit 0

# Fail-soft if mempalace isn't on PATH (fresh machine, broken install, etc).
command -v mempalace >/dev/null 2>&1 || exit 0

LOG_DIR="${HOME}/.claude/state"
mkdir -p "$LOG_DIR"
LOG="${LOG_DIR}/mempalace-stop.log"

# Per-call timestamp + size cap on log (rotate at 100KB).
if [ -f "$LOG" ] && [ "$(wc -c <"$LOG")" -gt 102400 ]; then
  tail -500 "$LOG" >"${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
fi

# Run with a hard timeout. macOS doesn't ship GNU timeout — use perl as the
# portable fallback (always present on macOS) when `timeout` isn't on PATH.
TIMEOUT_BIN="$(command -v timeout || command -v gtimeout || true)"
if [ -n "$TIMEOUT_BIN" ]; then
  printf '%s' "$STDIN_BUF" | "$TIMEOUT_BIN" 30 mempalace --palace "${HOME}/mempalace" hook run --hook stop --harness claude-code >>"$LOG" 2>&1 || true
else
  printf '%s' "$STDIN_BUF" | perl -e '
    use strict; use warnings;
    my $pid = fork();
    if (!$pid) { exec @ARGV; exit 1; }
    eval {
      local $SIG{ALRM} = sub { kill "TERM", $pid; die "timeout\n"; };
      alarm 30;
      waitpid $pid, 0;
      alarm 0;
    };
  ' mempalace --palace "${HOME}/mempalace" hook run --hook stop --harness claude-code >>"$LOG" 2>&1 || true
fi

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) hook-fired" >>"$LOG"
exit 0
