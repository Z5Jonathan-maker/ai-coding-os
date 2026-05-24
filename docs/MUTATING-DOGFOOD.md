# MUTATING-DOGFOOD.md

`cc-mutating-dogfood` is the repeatable coding-session proof for AI Coding OS.

It creates an isolated Git workspace, starts from a broken fixture, runs failing
tests, applies real edits, verifies tests, validates Mission Events, writes
review evidence, and commits each recovered cycle.

## Run

```sh
cc-mutating-dogfood --cycles 3
```

Default output:

```text
~/.Codex/mutating-dogfood/<session-id>/
  session.json
  summary.md
  cycles.tsv
  workspace/
  cycle-1/
    initial-test.log
    recovery.log
    final-test.log
    diff-check.log
    diff-stat.log
    patch.diff
    review.log
    mission-events.log
    agent-runtime.log
    commit.log
```

## What It Proves

- a real Git repo is modified
- tests fail before recovery
- source files are edited
- tests pass after recovery
- diff review gates pass
- Mission Kernel artifacts are created per cycle
- Mission Events validate per cycle
- each recovered cycle is committed in the isolated workspace

## Boundary

This is still a controlled fixture, not a claim that the system can autonomously
finish arbitrary production work. Its job is to prove the mutating execution
path is wired and reviewable before moving to larger public repo tasks.
