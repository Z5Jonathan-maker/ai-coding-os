# `cc-loop` — 24/7 unattended Claude runner (design, NOT YET INSTALLED)

This document describes the auto-loop wrapper + launchd LaunchAgent that
turn the iMac into a true 24/7 autonomous Claude box. The runner script
is **not yet installed** — installation requires explicit authorization
because it runs `claude -p --permission-mode bypassPermissions` continuously
without a human at the keyboard. To authorize, paste:

> "Build `cc-loop` at `~/dotfiles/bin/cc-loop` and the matching
> `com.user.cc-loop.plist` LaunchAgent. I authorize a 24/7 autonomous Claude
> loop on this iMac with `bypassPermissions`, 30-min cycle timeout, and a
> `~/.cc-paused` touch-flag killswitch."

## What it survives

| Failure mode | Mitigation |
|---|---|
| Hung session (stdin block, network stall) | Per-cycle watchdog: SIGTERM at `CC_LOOP_TIMEOUT` (default 1800s), SIGKILL 30s later |
| Anthropic 429 / rate limit / quota | Greps cycle output for `429\|rate.?limit\|quota\|overloaded\|too many requests` → sleeps `CC_LOOP_RATE_BACKOFF` (default 3600s) |
| Crash loop | Counter of consecutive non-zero exits; `≥CC_LOOP_MAX_ERRORS` (default 5) trips circuit breaker → cooldown `CC_LOOP_COOLDOWN` (default 300s), then resets counter |
| Machine reboot / panic | LaunchAgent `KeepAlive=true` + `RunAtLoad=true` → restarts on login |
| User wants to stop unattended work | `touch ~/.cc-paused` → loop polls every `CC_LOOP_PAUSE_POLL` (default 30s) and sleeps until removed |

## Files this design produces

```
~/dotfiles/bin/cc-loop                   # the runner (NOT YET WRITTEN)
~/dotfiles/launchd/com.user.cc-loop.plist.template  # LaunchAgent (template)
~/dotfiles/bin/cc-pause                  # touch ~/.cc-paused
~/dotfiles/bin/cc-resume                 # rm ~/.cc-paused
~/dotfiles/bin/cc-status                 # read state file, pretty-print
~/.claude/cc-loop.log                    # rolling log (created at first run)
~/.claude/cc-loop.state                  # KV state (last_exit, consecutive_errors, last_run, last_event)
~/.cc-paused                             # touch-flag killswitch (created/removed by user or scripts)
```

## Tunables (env, with defaults)

```
CC_LOOP_TIMEOUT=1800       per-cycle hard kill (s)
CC_LOOP_MAX_ERRORS=5       consecutive non-zero exits → trip breaker
CC_LOOP_COOLDOWN=300       breaker cooldown (s)
CC_LOOP_RATE_BACKOFF=3600  sleep when rate-limit detected (s)
CC_LOOP_PAUSE_POLL=30      pause-flag check interval (s)
CC_LOOP_INTER_CYCLE=10     pause between successful cycles (s)
CC_LOOP_MODEL=opus         claude --model arg (set "" to use default)
CC_LOOP_PERMISSION=bypassPermissions  --permission-mode arg
```

## Killswitches (in priority order)

1. `touch ~/.cc-paused` — non-destructive pause; `rm ~/.cc-paused` resumes.
2. `launchctl unload ~/Library/LaunchAgents/com.user.cc-loop.plist` — stops launchd from restarting; doesn't kill in-flight cycle.
3. `pkill -TERM -f cc-loop` — kills in-flight cycle. launchd will respawn unless also unloaded.
4. `rm ~/Library/LaunchAgents/com.user.cc-loop.plist && launchctl unload ...` — full removal.

## Cycle pseudocode

```
while true:
    while exists(~/.cc-paused): sleep CC_LOOP_PAUSE_POLL
    out = mktemp
    fork: claude -p $(cat $PROMPT) --permission-mode $PERM > $out 2>&1 &  pid=$!
    fork: (sleep $TIMEOUT; kill -TERM $pid; sleep 30; kill -KILL $pid) &  wd=$!
    wait $pid; rc=$?
    kill $wd 2>/dev/null
    tail -c 4000 $out >> $LOG
    if grep -qiE '429|rate.?limit|quota|overloaded' $out:
        sleep CC_LOOP_RATE_BACKOFF
        continue
    state.last_exit = rc
    if rc == 0:
        state.consecutive_errors = 0
    else:
        state.consecutive_errors += 1
        if state.consecutive_errors >= MAX_ERRORS:
            sleep COOLDOWN
            state.consecutive_errors = 0
    sleep INTER_CYCLE
```

## v1 must-have: outcome-bound circuit breaker (Ralph pattern)

Before cc-loop ships, the cycle MUST gate completion on real outcomes,
not just `claude -p` exit code. The current `loop-guard.sh` /
`error-gate.sh` / `wired-up-stop.sh` hooks catch *in-session* misbehavior
but cannot detect "the agent thinks it's done but the build is broken."

Per the Ralph pattern (https://github.com/frankbria/ralph-claude-code),
each cycle should also:

1. **Run the project's verifier** after the cycle exits 0 — typically the
   project's `make check` or `npm test` or whatever `tools.verify` is
   configured to. Cycle outcome = `claude_rc == 0 AND verifier_rc == 0`.
2. **Detect a no-progress condition** — if the cycle did not modify any
   tracked files AND did not emit a checkpoint, count that as a "no-op"
   cycle. After N consecutive no-ops, deactivate (probably done OR stuck).
3. **Detect output decline** — keep a rolling 5-cycle window of cycle
   stdout length. If the average drops below a threshold, that's a tell
   the agent is repeating itself and not advancing.
4. **Honor an explicit EXIT_SIGNAL** — accept a sentinel like
   `EXIT_SIGNAL: TASK_COMPLETE` or `EXIT_SIGNAL: BLOCKED` in the cycle
   output as a clean shutdown signal that bypasses the verifier.

Implementation sketch — added to `run_one_cycle`:

```bash
# After existing rate-limit + breaker checks:
if [ "$rc" -eq 0 ]; then
  # Outcome verification
  if [ -n "$CC_LOOP_VERIFIER" ]; then
    if ! bash -c "$CC_LOOP_VERIFIER" >> "$LOG_FILE" 2>&1; then
      log "VERIFIER failed; treating cycle as failure"
      rc=1
    fi
  fi
  # No-progress detection
  if ! git -C "$CC_LOOP_REPO" diff --quiet HEAD 2>/dev/null \
     && [ ! -f "$HOME/.claude/checkpoints/$(ls -t $HOME/.claude/checkpoints | head -1)" ]; then
    state_set noop_cycles 0
  else
    nc=$(state_get noop_cycles 0); nc=$((nc+1))
    state_set noop_cycles "$nc"
    if [ "$nc" -ge "${CC_LOOP_NOOP_LIMIT:-3}" ]; then
      log "no-progress for $nc consecutive cycles; deactivating"
      touch "$HOME/.cc-paused"
      return 0
    fi
  fi
fi
# EXIT_SIGNAL detection
if grep -qE 'EXIT_SIGNAL:\s*TASK_COMPLETE' "$out"; then
  log "EXIT_SIGNAL TASK_COMPLETE; pausing loop"
  touch "$HOME/.cc-paused"
fi
```

This is the difference between "unattended Claude" and "unattended Claude
that knows when it's actually done." Shipping cc-loop without it is the
single biggest autonomy footgun in the stack.

## Risk acknowledgement

This design intentionally creates an always-on autonomous agent on the iMac.
Risks the user accepts by authorizing:

- Any code execution as the user can drop work into `$PROMPT` and it will be
  executed by Claude with `bypassPermissions`. The 39-entry deny list +
  loop-guard + nonstop hooks are the in-session brakes; cc-loop adds no new
  ones.
- Mistaken or hostile prompt content can be re-attempted indefinitely (until
  circuit breaker trips, then again after cooldown).
- Anthropic Max usage will accumulate continuously. Rate-limit detection
  backs off per session but the box will burn the daily allowance.
- Logs at `~/.claude/cc-loop.log` are local-only but contain task content.
  Treat them as private.

These are the tradeoffs the harness wants the user to opt into explicitly,
which is why this document exists before the runner does.
