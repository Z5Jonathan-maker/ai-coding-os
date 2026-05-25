# Phase Checkpoints

`cc-phase-checkpoint` is the handoff undo primitive.

It creates shadow Git commits under:

```text
refs/cc-phase-checkpoints/<mission>/<phase>/<label>
```

The command uses a temporary Git index, so it can snapshot a dirty working tree
without changing the real index, HEAD, or staged files.

Common use:

```sh
cc-phase-checkpoint create --repo /path/to/app --mission <id> --phase kimi_implementation --label target-pre
cc-phase-checkpoint list --repo /path/to/app --mission <id>
cc-phase-checkpoint show --repo /path/to/app --ref refs/cc-phase-checkpoints/<id>/kimi_implementation/target-pre
cc-phase-checkpoint restore --repo /path/to/app --ref refs/cc-phase-checkpoints/<id>/kimi_implementation/target-pre
```

`cc-design-handoff execute` writes checkpoints automatically unless
`--no-checkpoint` or `CC_DESIGN_HANDOFF_NO_CHECKPOINT=1` is set.
