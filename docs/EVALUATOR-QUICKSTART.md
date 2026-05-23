# EVALUATOR-QUICKSTART.md

This guide is for someone reviewing the project from a fresh clone.

## Fastest Read

Start with:

```sh
bin/cc-verify-product
```

Expected result on a fully prepared macOS machine:

```text
Status: product-verified
```

For a shorter portable check, run `bin/cc-evaluator-check`. On Linux or a clean
CI runner, the portable gate should pass and macOS-specific steps may be skipped.

## What The Command Proves

- repo syntax and public docs are coherent
- cockpit webview/package smoke is green
- source-controlled AI checks are green
- benchmark fixtures are green
- command registry is complete
- issue templates and workflow YAML parse
- license metadata is aligned
- launch media exists
- public fixture demo works without private project context
- macOS first-run doctor is understandable when run on macOS
- cockpit packaging works when Node/npm are available

## What It Does Not Prove

- private API keys are configured
- Kimi WebBridge has access to your logged-in browser
- maintainer-local services are present
- GitHub Actions can run while account billing is blocked

For full local release validation on the prepared maintainer machine, use:

```sh
cc-release-check
```
