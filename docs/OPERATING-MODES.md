# Operating Modes

This repo has two valid operating modes. Most confusion comes from mixing them.

## Public / Portable Mode

Public mode is what a clean clone can inspect and run without the maintainer's
private provider setup.

Included:

- `cc-route` route planning and dry-run receipts
- `ai-lanes.json` lane contracts
- `cc-design-handoff` mission files, phase state, approvals, and offline checks
- `cc-agent-runtime` local/worktree proof bundles
- VS Code cockpit package and webview smoke checks
- TEL server and policy code
- fixtures and public CI gates

Not included:

- provider accounts
- live model billing
- `router-ask` implementation internals
- maintainer Kimi/Claude/Codex sessions
- local TEL credentials
- private `AI-SYSTEM-V2` telemetry

Public mode should be judged as a reference implementation and adapter shell.

## Maintainer / Full-Stack Mode

Maintainer mode is the daily-driver system on the configured machine.

Expected local tools:

- `router-ask`
- `cc-router`
- `codex`
- `claude`
- `kimi`
- `deepseek`
- `cc-image`
- Kimi WebBridge official Chrome extension
- TEL policies and credential backend

In this mode the same handoff phases can call real specialist lanes:

- Image 2.0 / `cc-image` generates visual references and extracts assets.
- Kimi implements UI/browser work from approved references.
- Claude extracts design DNA and reviews taste/architecture.
- Codex handles local engineering proof.
- DeepSeek compresses context and does cheap transforms.
- TEL verifies credentialed deployment actions.

Maintainer mode should be judged by daily-use reliability, latency, proof
quality, and whether the cockpit reduces cognitive load.

Check the live seam with:

```sh
cc-doctor
cc-maintainer-stack
cc-maintainer-stack --strict
```

## Quality Standard

The system is internal, but it is held to public-product quality because that is
the cleanest way to expose weak assumptions.

This means:

- dependencies are named directly
- fixtures are labeled as fixtures
- live calls are labeled as live calls
- route planning is not described as model execution
- docs stay smaller than the product
- claims require artifacts or commands
- the main workflow must be obvious without reading old strategy notes

## Naming Rule

Use small mechanical names in public docs:

- "route planner" instead of "routing kernel"
- "phase runner" instead of "mission operating system"
- "receipt bundle" instead of "proof doctrine"
- "handoff workflow" instead of "frontend wedge"

The ambitious concepts can stay in private strategy notes. The working surface
should be boring, exact, and inspectable.
