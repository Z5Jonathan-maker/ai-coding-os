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
4. the release tarball/checksum/manifest can be built from the clone
5. the public fixture demo runs from the clone
6. the temporary home remains empty

## Verified Result

Date: 2026-05-23

```text
passed=7 failed=0
Status: first-run-ready
Status: fresh-clone-ready
```

Expected optional misses in a clean temp home:

- `cc-route` ships in this repo and is the default route-decision engine for
  routing smoke, benchmark route checks, Mission Kernel, Agent Runtime, quick
  demo, and workflow proof.
- The private `cc-router`/`AI-SYSTEM-V2` checkout is optional unless the
  evaluator wants the maintainer's full local execution gateway.
- Token-ledger proof falls back to committed fixture telemetry when live router
  usage logs are not present.
- Router receipt and metrics surfaces fall back to the same committed telemetry
  fixture when private router telemetry is absent.
- Feedback-law proof falls back to `fixtures/feedback-laws` when the full local
  `AI-SYSTEM-V2` control plane is not installed.
- VS Code extensions are optional until the real installer is run.
- Kimi WebBridge under the temp home is optional.
