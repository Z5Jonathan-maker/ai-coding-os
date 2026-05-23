# QUICK-DEMO.md

This is the shortest human-facing proof path for the AI Coding Operating
System. It exists for reviewers who need to understand the product before they
read architecture docs or long readiness logs.

Run:

```sh
bin/cc-demo-quick
```

Expected result:

```text
Status: quick-demo-ready
```

## What It Proves

1. Representative task prompts route to the intended AI lanes.
2. A public fixture workflow can run without private project context.
3. The 10-scenario benchmark suite is green.
4. The cockpit webview still has its required continuation surfaces.
5. Workspace trust policy is enforced before cockpit routing.
6. Mission continuity is available for the cockpit home surface.

## What It Does Not Prove

This is not the full release gate. It intentionally avoids clean-tree and
upstream-sync requirements so it can run while a developer is actively working.

For the strict release proof, run:

```sh
cc-verify-product
cc-ten-readiness
```
