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
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase creative_reference --generate-image --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase creative_reference --artifact visual.target.png
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase asset_decomposition --extract-asset hero-background --image-api-ok
cc-design-handoff approve --dir .ai/design-handoffs/<mission> --phase asset_decomposition --artifact creative.asset-kit.json
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase design_dna
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase codex_proof --browser-url http://localhost:3000
cc-design-handoff execute --dir .ai/design-handoffs/<mission> --phase tel_deploy --live-tel --deployment <vercel-url-or-id>
```

This command creates the mission artifact spine for the actual wedge:

- `creative.brief.json`
- `route.receipt.json`
- `design-handoff.json`
- `agent.timeline.json`
- `next-action.json`
- `proof.bundle.json`

It does not trigger image API calls or credentialed deploys without approval.
It opens the first approval gate: generate or attach `visual.target.png`,
approve it, then continue through asset decomposition, Kimi implementation,
Claude review, Codex proof, and TEL deploy. `continue` emits a lane-specific action packet
for the current phase. `execute` records concrete stage artifacts when they are
locally derivable, records externally produced artifacts when passed with
`--artifact`, invokes `cc-image` for `creative_reference` only when
`--generate-image --image-api-ok` is supplied, invokes `cc-image` for one
approved-reference asset at a time when `asset_decomposition --extract-asset
<id> --image-api-ok` is supplied, invokes DeepSeek/cheap first to compress
handoff context for expensive specialist lanes, invokes `router-ask --purpose
design` for the `kimi_implementation` stage by default, invokes the Kimi CLI
against a real repository when `--target-repo <repo>` is supplied, records
`implementation.result.json` with changed files, invokes `claude --print` for
the `design_dna` and `claude_review` stages by default, blocks deploy unlock
when the review fails the taste threshold, blocks deploy when Codex proof has
not passed, runs Codex local proof before deployment, and writes
`deploy.receipt.json` only from explicit deploy receipt fields or an explicit
TEL verification call. Every deploy receipt embeds the implementation target
summary plus Codex proof summary so release proof is tied to changed files,
target repo state, and local gate results.
`--live-tel` uses
`~/.Codex/tel/client/tel-call.sh vercel get_deployment`, stores
`tel.deploy.raw.json`, and writes `tel_call: true` in `deploy.receipt.json`.
`--tel-dry-run` verifies TEL policy/request shape without calling Vercel.
Portable checks use explicitly labeled offline fixtures for live-lane stages.

## Same-Brief Competitive Benchmark

`fixtures/frontend-wedge/premium-landing/competitive.benchmark.json` compares
AI Coding OS, v0, Lovable, and Bolt against the same brief. The benchmark is
allowed to support product claims only with its honesty constraint intact: it is
a same-brief artifact review unless current live competitor outputs are
regenerated and attached. External tools cannot carry numeric scores until
their current-run prompt, screenshot/source, and review artifacts are attached
under `fixtures/frontend-wedge/premium-landing/competitor-artifacts/`.
`cc-competitive-benchmark` is the evidence manager:

```sh
cc-competitive-benchmark create "premium peptide landing page"
cc-competitive-benchmark attach --tool v0 --prompt prompt.md --screenshot v0.png --review review.json
cc-competitive-benchmark score --tool v0
cc-competitive-benchmark check
```

The check blocks unsupported external scores and requires prompt, review, and
screenshot/source/code evidence before an external competitor can be scored.
