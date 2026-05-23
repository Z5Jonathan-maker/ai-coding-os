# Long Context Fixture

Cross-file reasoning benchmark for long-context repo analysis.

The scoring script validates that the expected answer cites evidence from
multiple files, identifies the highest-severity risk, and names the concrete
files involved. This measures whether a repo-level answer can be graded, not
just whether the router selected the precision lane.

```sh
../../../../bin/cc-benchmark-run long-context
```
