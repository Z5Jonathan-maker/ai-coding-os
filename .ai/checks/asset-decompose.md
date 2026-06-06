---
name: Asset Decompose Pre-Pass
description: Layer-decomposition models can propose the asset kit, but the human-in-loop approval gate is still required per asset.
command: bin/cc-asset-decompose --check
expect: Status: asset-decompose-ready
---

This check encodes the AssetDropper / Qwen-Image-Layered pattern: model proposes
the ordered kit in one pass, then we apply our existing per-asset approval gate.
Model proposals never skip the gate.
