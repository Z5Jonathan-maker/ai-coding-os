---
name: wired-up
description: Arm or disarm the wired-up-stop hook. When armed, Stop is blocked if the working tree contains source files that nothing else imports/references — i.e. orphan code. Use when the user says "no orphan code", "wire everything up", "/wired-up", or is about to do a code-heavy unattended session.
---

# wired-up — block stop on orphan source files

The wired-up Stop hook scans changed/untracked source files and blocks
Stop if any have zero references elsewhere. Off by default because
it's noisy in non-code sessions.

## `/wired-up` or `/wired-up on`

```bash
touch ~/.claude/hooks/state/wired-up.activate
```
Confirm: "wired-up armed. I won't stop with orphan source files in the
tree."

## `/wired-up off`

```bash
touch ~/.claude/hooks/state/wired-up.deactivate
```

## What counts as orphan

- Tracked-or-untracked source files in the cwd's git repo
- Extensions: ts/tsx/js/jsx/py/go/rs/rb/php/java/kt/swift
- Skipped: tests, specs, index.*, main.*, __init__.py, files <5 non-blank lines
- "Reference" = grep finds the basename (or its stem) in another source
  file via import/require/from/quoted-path patterns

## When it blocks

You'll see in the Stop response:
```
[wired-up] You added source files that nothing else references:
  - src/foo.ts
  - lib/helpers/baz.py
Wire them in (import, register, render, route) or delete them before stopping.
```

Fix path: either write the import/registration in another file, or
delete the orphan. Don't argue with the hook — it's preventing dead
code from accumulating in long autonomous sessions.

## Composes with

- `nonstop` — wired-up gives nonstop a *real* reason to restart with
  actionable feedback rather than just blanket "keep working".
- `session-handover` — checkpoints will reflect that Stop was blocked
  for orphan reasons, so a fresh session can pick up the wiring task.
