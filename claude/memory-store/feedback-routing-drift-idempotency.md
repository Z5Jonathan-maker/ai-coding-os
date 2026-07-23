---
name: feedback-routing-drift-idempotency
description: "Hooks that write tracked files (committed in dotfiles) MUST be idempotent — no wall-clock timestamps in file body. Otherwise pre-commit \"files modified by hook\" infinite-loops on every retry. Use `$(date +%Y-%m-%d)` not `$(date)`."
metadata:
  type: feedback
  originSessionId: 4716d204-44e4-4db2-a688-011f0cea910d
---
# Hooks that write tracked files must be idempotent

Any hook that runs during pre-commit AND writes to a tracked file must produce IDENTICAL output on re-run. Non-determinism (wall-clock timestamps, monotonic counters, environment-dependent values) makes the file change between hook runs, which trips pre-commit's "files modified by this hook" check and causes the commit to fail. The natural retry triggers the SAME modification, producing an infinite loop.

**Why:** Hit on 2026-05-15 during the dotfiles backlog sync. `routing-drift-check.sh` wrote `# Routing drift report — $(date)` to `claude/audits/drift-<date>.md`. Each pre-commit run produced a fresh wall-clock timestamp, the file content differed from the staged version, pre-commit aborted with "files were modified by this hook", `git add -A && git commit` looped without progress through multiple retries until the root cause was traced. Cost: ~5 commit attempts before the underlying issue surfaced.

**How to apply:**
- For any hook in `~/dotfiles/claude/hooks/` or `~/dotfiles/claude/scripts/` that writes to a path inside dotfiles, use `$(date +%Y-%m-%d)` (day-resolution, matches typical filename), `$(date +%Y-%m)` (month), or omit timestamps entirely.
- Reserve `$(date)` (full wall-clock) for hooks that write to `~/.claude/state/` (gitignored / untracked) or `/tmp/`.
- Same rule for any other non-deterministic source: random UUIDs, process IDs, ephemeral env vars (`$HOSTNAME` is fine, `$SECONDS` is not).
- When designing a new hook, ask "if I re-run this immediately, does the output change?" Yes → either the file must be untracked, or the non-determinism must move into a sidecar.

**Anti-test:** before merging a new hook, run it twice with no state changes and `diff` the output. If non-empty diff, the hook is non-idempotent — fix before shipping.

Related: `[[project-brain-lifts-2026-05-15]]` — this lesson surfaced during the sync of those lifts.
