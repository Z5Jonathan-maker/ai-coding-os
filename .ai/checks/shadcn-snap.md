---
name: Shadcn OKLCH Snap
description: Brand tokens are emitted as OKLCH for Tailwind v4 and snap to shadcn primitives.
command: bin/cc-shadcn-snap-check --check
expect: Status: shadcn-snap-ready
---

This check enforces design-token round-tripping (Figma Variables ↔ Tailwind v4
OKLCH CSS vars) and a shadcn/ui primitive whitelist so implementation output
defaults to the dominant component vocabulary instead of bespoke markup.
