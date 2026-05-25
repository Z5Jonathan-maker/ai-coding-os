# Taste-Driven Frontend Wedge

The first product wedge is not "general AI orchestration." It is elite frontend
generation from creative direction.

## Dominant Workflow

```text
intent
  -> Image 2.0 creative reference
  -> sequential asset kit
  -> design DNA
  -> Kimi frontend implementation
  -> browser proof
  -> taste validation
  -> release proof
```

## Product Rule

The user should feel one thing:

```text
describe the desired business outcome, then receive a premium frontend that
keeps the approved visual direction intact.
```

Everything else is infrastructure.

## What Must Stay Hidden

- provider selection
- token balancing
- fallback mechanics
- raw model logs
- routing dashboards
- implementation noise

## Proof Standard

The workflow is only real when it produces:

- a creative brief
- an approved visual reference or canonical reference placeholder
- an ordered creative asset kit when implementation needs exact visual primitives
- design DNA
- an implementation plan
- browser proof
- taste validation
- weighted taste benchmark
- a final proof bundle

The gate for this wedge is `cc-frontend-wedge-check`.
The first-class mission command is `cc-design-handoff "<brief>"`.
The taste scoring gate is `cc-taste-benchmark-check`.
The human-visible flagship demo is `demos/frontend-wedge/ai-coding-os/index.html`.
Its portability and proof-language gate is `cc-frontend-demo`.
The sequential Image 2.0 asset decomposition gate is `cc-asset-kit-check`.

## Named Product Verb

```sh
cc-design-handoff "premium peptide landing page with cinematic hero and pricing"
cc-design-handoff list
cc-design-handoff status --dir .ai/design-handoffs/<mission>
cc-design-handoff continue --dir .ai/design-handoffs/<mission>
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase creative_reference --artifact visual.target.png
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase design_dna
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase tel_deploy --deploy-url <url> --provider vercel --git-sha <sha> --rollback-token <token>
```

This command creates the mission artifact spine for the actual wedge:

- `creative.brief.json`
- `route.receipt.json`
- `design-handoff.json`
- `agent.timeline.json`
- `next-action.json`
- `proof.bundle.json`

It does not pretend to generate images or trigger a credentialed deploy without
approval. It opens the first approval gate: generate or attach
`visual.target.png`, approve it, then continue through asset decomposition, Kimi
implementation, Claude review, and TEL deploy. `continue` emits a lane-specific
action packet for the current phase. `execute` records concrete stage artifacts
when they are locally derivable, records externally produced artifacts when
passed with `--artifact`, and writes `deploy.receipt.json` only from explicit
deploy receipt fields.

## Same-Brief Competitive Benchmark

`fixtures/frontend-wedge/premium-landing/competitive.benchmark.json` compares
AI Coding OS, v0, Lovable, and Bolt against the same brief. The benchmark is
allowed to support product claims only with its honesty constraint intact: it is
a same-brief artifact review unless current live competitor outputs are
regenerated and attached.
