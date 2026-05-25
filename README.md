# Taste-Driven Frontend Handoff

[![Public CI](https://github.com/Z5Jonathan-maker/ai-coding-os/actions/workflows/public-ci.yml/badge.svg)](https://github.com/Z5Jonathan-maker/ai-coding-os/actions/workflows/public-ci.yml)

This repo packages an opinionated local AI workspace for one focused workflow:

```text
describe the business outcome
  -> generate or attach an approved visual reference
  -> extract implementation assets
  -> preserve design DNA
  -> implement through the UI/browser lane
  -> review taste and accessibility
  -> record deploy proof
```

The wedge is not "another chat IDE." It is a handoff system for preserving
premium creative direction through production frontend implementation.

## Why It Exists

Most AI coding tools can generate UI. Fewer preserve taste. This system treats
creative direction as a first-class execution layer:

- Image 2.0 / ChatGPT owns static visual direction and canonical assets.
- Kimi owns browser/UI implementation from approved references.
- Codex owns local engineering, checks, packaging, and proof.
- Claude owns hard review, architecture, and taste/quality critique.
- DeepSeek handles cheap transforms and extraction work.
- TEL records credentialed deploy actions behind an audit boundary.

The user-facing idea is simple: approve the visual target first, then keep every
later stage accountable to that target.

## Main Workflow

```sh
cc-design-handoff "premium peptide landing page with cinematic hero and pricing"
cc-design-handoff list
cc-design-handoff status --dir .ai/design-handoffs/<mission>
cc-design-handoff continue --dir .ai/design-handoffs/<mission>
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase creative_reference --generate-image --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase creative_reference --artifact visual.target.png
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase asset_decomposition --extract-asset hero-background --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase asset_decomposition --artifact creative.asset-kit.json
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase design_dna
```

Each mission writes portable artifacts:

- `creative.brief.json`
- `route.receipt.json`
- `design-handoff.json`
- `agent.timeline.json`
- `next-action.json`
- `design.dna.json`
- `implementation.plan.json`
- `taste.validation.json`
- `deploy.receipt.json`
- `proof.bundle.json`

Credentialed deploys are not performed silently. A deploy result is recorded
only through an explicit TEL receipt step. `tel_deploy --live-tel` verifies a
Vercel deployment through TEL and stores `tel.deploy.raw.json`; without that
flag it only records a supplied receipt. `creative_reference --generate-image`
calls `cc-image` only when `--image-api-ok` is supplied, then stores
`visual.reference.manifest.json` and waits for human approval.
`asset_decomposition --extract-asset <id>` uses the approved visual reference
to extract one asset at a time through `cc-image`, also gated by
`--image-api-ok`, then updates `creative.asset-kit.json` and waits for
approval. The `claude_review` stage is the
first live execution lane: by default it calls `claude --print`, stores
`taste.validation.raw.md`, writes `taste.validation.json`, and blocks deploy
unlock if the review fails its threshold. The `kimi_implementation` stage also
calls the live design route by default through `router-ask --purpose design`,
stores `implementation.raw.md`, and writes `implementation.plan.json`.
`design_dna` also calls `claude --print` by default, stores
`design.dna.raw.md`, and writes structured implementation constraints instead
of a hardcoded taste template.

## Proof Commands

Fast proof:

```sh
bin/cc-demo-quick
```

Focused wedge proof:

```sh
bin/cc-design-handoff --check
bin/cc-frontend-wedge-check
bin/cc-taste-benchmark-check
bin/cc-cockpit-webview-smoke
```

Maintainer-machine readiness:

```sh
bin/cc-ai-checks
bin/cc-product-readiness
```

The same-brief competitor benchmark lives at
`fixtures/frontend-wedge/premium-landing/competitive.benchmark.json`. It
compares this workflow against v0, Lovable, and Bolt as an artifact review. It
is not a live SaaS benchmark unless fresh competitor outputs are attached.

## VS Code Cockpit

The bundled VS Code cockpit exposes:

- Creative Handoff create/status/continue/approve
- primary continuation composer
- permission mode selector
- route preview
- review/diff/context attachment
- readiness and proof surfaces

Install/update it through the normal dotfiles installer.

## Install

Current install target is macOS Apple Silicon.

```sh
git clone git@github.com:Z5Jonathan-maker/ai-coding-os.git ~/dotfiles
~/dotfiles/install.sh --dry-run
~/dotfiles/install.sh
brew bundle install --file=~/dotfiles/Brewfile
~/dotfiles/install.sh
```

`install.sh --dry-run` is non-mutating and reports planned symlinks, required
tools, optional lanes, Brewfile drift, and VS Code extension drift.

## What This Repo Contains

- macOS dotfiles and install scripts
- `ai-lanes.json` and in-tree `cc-route`
- VS Code cockpit extension under `vscode/ai-cockpit/`
- design handoff CLI and proof gates under `bin/`
- fixtures for frontend wedge, taste benchmark, browser proof, and public CI
- docs for architecture, install, security, limits, and reference studies

Detailed docs are intentionally kept out of the README. Start with:

- `docs/TASTE-DRIVEN-FRONTEND-WEDGE.md`
- `docs/CREATIVE-DIRECTION-KERNEL.md`
- `docs/ARCHITECTURE.md`
- `docs/EVALUATOR-QUICKSTART.md`
- `docs/KNOWN-LIMITATIONS.md`
- `docs/REFERENCE-INDEX.md`

## Boundaries

- This is not a universal autonomous software engineer.
- This is not a live SaaS benchmark suite.
- This does not ship credentials or provider accounts.
- Public clones use labeled fixtures where private router/provider telemetry is
  unavailable.
- Live deploys and other credentialed actions require TEL policy and explicit
  approval.

## License

Apache-2.0. See `LICENSE` and `docs/LICENSE-SUPPORT.md`.
