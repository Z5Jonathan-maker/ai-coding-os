# Image-to-Code 2026 Delta

Three additions to the Image 2.0 + Kimi system absorbed from the June 2026
state of the art. Each replaces a specific manual step with a measured
primitive while keeping the human approval gates that give the system its
taste discipline.

## 1. Rendered-feedback critic loop (`cc-visual-critic`)

Source: UI2Code^N, 1D-Bench, Vision2Web (2026).

The implementation lane (Kimi) now produces N candidate renders, not one.
A pluggable VLM critic ranks them **relative to each other** against the
canonical reference. The winner advances to Claude review; the others are
discarded with their ranks recorded.

Hard rules:

- No absolute fidelity score is emitted. Only relative rank within the set.
- The critic backend is swappable: `local-pixel-proxy` (default, deterministic
  byte-distance proxy for harness use), `claude-vision`, `gpt-vision`,
  `qwen-vlm`. External backends require credentials.
- The critic's `relative_ranking_not_absolute` strategy field must be present
  on every emitted ranking artifact.

Slot in Lane 2: between `kimi_implementation` and `claude_review`.

## 2. Automated asset decomposition pre-pass (`cc-asset-decompose`)

Source: AssetDropper (SIGGRAPH 2025), Qwen-Image-Layered, Canva Magic Layers.

The Asset Decomposition Protocol previously required a human to write the
asset kit JSON by hand from the approved canonical reference. The pre-pass
now lets a layer-decomposition model propose the ordered kit. Every proposed
asset starts at `status: awaiting_human_approval` and the existing per-asset
approval gate is preserved.

Hard rules:

- Proposed assets never enter implementation until a human approves them.
- The proposed kit carries `proposed_by_model: true` and a `proposer_backend`
  identifier on the kit and every asset.
- `rules.model_proposed_assets_do_not_skip_human_approval = true` is a
  schema-level invariant — checks fail if it is missing.

Slot in Lane 1: pre-pass before the human-approved sequential extraction.

## 3. shadcn + OKLCH snapping (`cc-shadcn-snap-check`)

Source: Tailwind v4 OKLCH design tokens, shadcn/ui design system, shadcn/designer.

Implementation output now snaps to shadcn primitives and consumes brand tokens
as OKLCH CSS vars exposed via Tailwind v4 `@theme inline`. This gives Figma
Variables round-tripping and makes "looks pro" the default rather than the
exception.

Hard rules:

- Brand tokens live in `tokens.oklch.json` and round-trip with Figma Variables
  and Tailwind v4 CSS vars.
- Implementation lane prefers shadcn primitives from a declared whitelist.
- `cc-shadcn-snap-check --impl-dir DIR` scans for shadcn imports and brand
  token usage in implementation output.

Slot: artifact added to `creative.asset-kit.json` `handoff_to_kimi.include`;
lint runs as a Lane 2 gate.

## 4. Visual fidelity eval harness (`cc-visual-fidelity-eval`)

Source: Design2Code, WebCode2M, 1D-Bench evaluation methodology.

A fixture-driven harness that runs the critic against known reference +
candidate pairs and asserts the expected winner is ranked first. This is
how we know the critic loop helps instead of feeling fancier.

Hard rules:

- Each case declares `expected_winner` (rank 1) and optionally `expected_last`
  (rank N).
- The harness uses the same critic backend the production loop uses.
- Adding a new backend requires adding cases that demonstrate it ranks
  intended winners correctly before it can be selected as a default.

## What we did not absorb

- **Galileo / Google Stitch**: scaffold quality; no architectural delta.
- **Anima, Locofy**: Figma-plugin niche; covered by our Image 2.0 lane.
- **Generic screenshot-to-code repos**: covered by Image 2.0 + Kimi handoff.
- **Antigravity browser-in-loop**: already implemented as
  `cc-design-handoff execute --phase codex_proof --browser-url`.
- **v0 / Figma Make "edit visually then PR"**: already implemented in the
  cockpit handoff flow.

## Routing

| Prompt | Route |
|---|---|
| "Rank these three Kimi outputs against the reference" | `cc-visual-critic` |
| "Propose the asset kit from this approved reference" | `cc-asset-decompose` |
| "Check this implementation uses shadcn and our OKLCH tokens" | `cc-shadcn-snap-check` |
| "Regression-test the critic across known cases" | `cc-visual-fidelity-eval` |
