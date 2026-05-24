# PUBLIC-REPO-DOGFOOD.md

`cc-public-repo-dogfood` is the larger public-repo coding proof.

It clones the public AI Coding OS repository into an isolated workspace,
creates a branch, introduces a failing test, repairs it through the runtime
adapter, validates Mission Events, writes review evidence, commits locally, and
runs the public CI gate in the mutated clone.

## Run

```sh
cc-public-repo-dogfood
```

Output lives under:

```text
~/.Codex/public-repo-dogfood/<session-id>/
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
    public-repo-gates-after-mutation.log
```

## What It Proves

- fresh public clone works
- a local branch is created
- a failing test is introduced
- the runtime adapter performs the repair
- Mission Events validate
- review evidence is captured
- a local commit is produced
- the mutated public clone passes `cc-public-ci-check`

## Boundary

This is still a controlled public-repo task. It does not claim arbitrary issue
resolution across unknown codebases. It raises the proof level beyond local
fixtures by using the public repository and full public CI gate.
