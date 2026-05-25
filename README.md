# Taste-Driven Frontend Handoff Runner

[![Public CI](https://github.com/Z5Jonathan-maker/ai-coding-os/actions/workflows/public-ci.yml/badge.svg)](https://github.com/Z5Jonathan-maker/ai-coding-os/actions/workflows/public-ci.yml)

This repo is an opinionated macOS AI coding workspace for one primary job:
preserve approved visual direction through frontend implementation. Mechanically,
it is a local phase runner, receipt system, and VS Code cockpit around the flow:

```text
brief -> visual reference -> asset kit -> design DNA -> implementation
      -> review -> local proof -> deploy receipt
```

It is not a hosted AI IDE and it is not a universal autonomous engineer. The
public repo contains the planner, phase machine, cockpit, trust/TEL contracts,
fixtures, and proof gates. Full live execution depends on local provider tools
and accounts such as `router-ask`, Kimi, Claude, Codex, DeepSeek, Image 2.0,
Kimi WebBridge, and TEL policies.

## What Runs

Main workflow:

```sh
cc-design-handoff "premium landing page with a cinematic hero and pricing"
cc-design-handoff status --dir .ai/design-handoffs/<mission>
cc-design-handoff continue --dir .ai/design-handoffs/<mission>
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase creative_reference --generate-image --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase creative_reference --artifact visual.target.png
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase asset_decomposition --extract-asset hero-background --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase asset_decomposition --artifact creative.asset-kit.json
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase design_dna
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase kimi_implementation --target-repo /path/to/app
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase claude_review
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase codex_proof
```

Each mission writes durable artifacts instead of relying on chat scrollback:

- `design-handoff.json`
- `route.receipt.json`
- `next-action.json`
- `agent.timeline.json`
- `creative.brief.json`
- `visual.reference.manifest.json`
- `creative.asset-kit.json`
- `design.dna.json`
- `implementation.result.json`
- `taste.validation.json`
- `codex.proof.json`
- `deploy.receipt.json`
- `proof.bundle.json`

## What Is In This Repo

- `bin/cc-design-handoff` — phase runner for the handoff workflow.
- `bin/cc-route` — deterministic route planner/classifier backed by
  `ai-lanes.json`. It prints dry-run receipts; it is not the live executor.
- `bin/cc-agent-runtime` — local/worktree runtime adapter that writes mission
  proof bundles.
- `vscode/ai-cockpit/` — VS Code webview cockpit over the local commands and
  handoff state.
- `claude/tel/` — Trusted Execution Layer server/policy code for credentialed
  actions.
- `.ai/checks/` and `fixtures/` — portable contract checks and benchmark
  fixtures.
- dotfiles and macOS setup files used by the maintainer stack.

## What Is External

The full private daily-driver stack uses tools that are not fully vendored here:

- `router-ask` / `cc-router` for live model execution and telemetry
- Kimi CLI and Kimi WebBridge for browser/UI work
- Claude CLI for design DNA and review stages
- Codex CLI for engineering execution and proof
- DeepSeek API wrapper for cheap compression/extraction
- ChatGPT/Image 2.0 or `cc-image` for visual references and asset extraction
- local TEL credentials and service policies for deploy verification

Public clones can run the planner, fixtures, cockpit smoke, and offline checks.
Maintainer machines with those provider tools can run the full live workflow.

## Proof Commands

Portable checks:

```sh
bin/cc-public-ci-check
bin/cc-design-handoff --check
bin/cc-agent-runtime --check
bin/cc-cockpit-webview-smoke
bin/cc-competitive-benchmark check
```

Maintainer/full-stack checks:

```sh
bin/cc-ai-checks
bin/cc-product-readiness
bin/cc-maintainer-stack
bin/cc-kimi-status
```

The competitor benchmark contract lives at
`fixtures/frontend-wedge/premium-landing/competitive.benchmark.json`. It is
currently an artifact contract unless fresh same-brief v0/Lovable/Bolt outputs
are attached.

## Install

Current target: macOS Apple Silicon.

```sh
git clone git@github.com:Z5Jonathan-maker/ai-coding-os.git ~/dotfiles
~/dotfiles/install.sh --dry-run
~/dotfiles/install.sh
brew bundle install --file=~/dotfiles/Brewfile
~/dotfiles/install.sh
```

`install.sh --dry-run` is non-mutating and reports symlinks, required tools,
optional lanes, Brewfile drift, and VS Code extension drift.

## Start Here

- `docs/OPERATING-MODES.md`
- `docs/ARCHITECTURE.md`
- `docs/TASTE-DRIVEN-FRONTEND-WEDGE.md`
- `docs/EVALUATOR-QUICKSTART.md`
- `docs/KNOWN-LIMITATIONS.md`
- `docs/COMMAND-REGISTRY.md`

## Boundaries

- This is local-first and macOS-first.
- Public clones do not include provider accounts or credentials.
- `cc-route` plans routes; live execution is delegated to external adapters.
- Fixture checks prove contracts, not market superiority.
- Credentialed actions require TEL policy and explicit approval.

Apache-2.0. See `LICENSE`.
