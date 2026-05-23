# Refactor Cleanup Fixture

Broken-first refactor benchmark.

The implementation has duplicated normalization logic and fails a new edge-case
test. A correct repair centralizes normalization without changing public
behavior.

```sh
../../../../bin/cc-benchmark-run refactor-cleanup
```
