# THIRD-PARTY-DOGFOOD.md

`cc-third-party-dogfood` is the external public-repo coding proof.

It clones a third-party public repository into an isolated workspace, pins a
known ref, creates a branch, introduces a failing test, repairs it through the
runtime adapter, validates Mission Events, writes review evidence, commits
locally, and reruns the third-party test gate.

The default target is:

```text
https://github.com/jonschlinkert/is-odd.git
a80ee0d831a8ee69f1fad5b4673491847975eb26
```

## Run

```sh
cc-third-party-dogfood
```

Output lives under:

```text
~/.Codex/third-party-dogfood/<session-id>/
  session.json
  summary.md
  repo/
  logs/
    initial-failing-test.log
    agent-runtime.log
    mission-events.log
    review.log
    patch.diff
    commit.txt
    final-git-log.txt
    final-git-status.txt
    third-party-tests-after-mutation.log
```

## What It Proves

- an external public repo can be cloned
- a pinned upstream ref is used
- a local dogfood branch is created
- a failing test is introduced
- the runtime adapter performs the repair
- Mission Events validate
- review evidence is captured
- a local commit is produced
- the third-party test suite passes after the mutation

## Boundary

This is a controlled external-repo task. It does not claim arbitrary
open-source issue resolution across unknown codebases. It closes the
self-referential proof gap by moving the mutating workflow outside this repo.
The next stronger proof is a real external issue or PR-quality patch with
review scoring.
