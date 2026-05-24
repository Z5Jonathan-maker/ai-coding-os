# FRESH-CLONE-VERIFY.md

Fresh-clone verification proves the public setup works outside the active
checkout and does not mutate a new home directory during dry-run evaluation.

## Command

```sh
cc-fresh-clone-check
```

To test a local checkout instead of GitHub:

```sh
CC_FRESH_CLONE_SOURCE="$PWD" cc-fresh-clone-check
```

The command creates a temporary clone and temporary home, then verifies:

1. public CI passes in the clone
2. `install.sh --dry-run` reports first-run readiness
3. the VS Code cockpit packages as a VSIX
4. the public fixture demo runs from the clone
5. the temporary home remains empty

## Verified Result

Date: 2026-05-23

```text
passed=6 failed=0
Status: first-run-ready
Status: fresh-clone-ready
```

Expected optional misses in a clean temp home:

- `cc-router` clone is optional unless the evaluator wants the full local
  router development checkout.
- Routing smoke and benchmark route checks fall back to a labeled committed
  routing-contract fixture when `AI-SYSTEM-V2` is not installed.
- Token-ledger proof falls back to committed fixture telemetry when live router
  usage logs are not present.
- Feedback-law proof falls back to `fixtures/feedback-laws` when the full local
  `AI-SYSTEM-V2` control plane is not installed.
- VS Code extensions are optional until the real installer is run.
- Kimi WebBridge under the temp home is optional.
