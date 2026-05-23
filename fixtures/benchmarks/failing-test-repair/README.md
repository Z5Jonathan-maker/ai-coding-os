# Failing Test Repair Fixture

Repair benchmark for coding-agent behavior.

The fixture starts broken on purpose. A correct repair must:

- include HTTP `429` in retryable statuses
- avoid retrying non-idempotent methods unless an idempotency key exists
- keep deterministic exponential backoff behavior

The scoring harness expects `npm test` to fail before repair, applies
`expected.patch`, then expects `npm test` to pass.

```sh
../../../../bin/cc-benchmark-run failing-test-repair
```
