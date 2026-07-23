---
name: reference-product-demo-video-playbook
description: How to build a product demo / pitch video (Remotion or Playwright) — reusable across projects
metadata: 
  node_type: memory
  type: reference
  originSessionId: 30d30640-e9d6-47cc-9733-84ca2af078f8
---

Full playbook at [~/.claude/wiki/product-demo-video-playbook.md](file:///Users/leonardofibonacci/.claude/wiki/product-demo-video-playbook.md). Built for UniFi ([[project-unifi-monarch-clone]]), portable to any web product.

Two methods: **Remotion** (React-coded motion graphics, flagship/max-polish, `npm i -D remotion @remotion/cli @remotion/google-fonts`, render `npx remotion render src/remotion/index.ts <Comp> out.mp4`) or **Playwright** (record the real app in motion — must run HEADED or content renders blank). Music = GitHub CC0 (`SoundSafari/CC0-1.0-Music`, freepd subfolder = true public domain), picked by **librosa** metrics not title (tempo/energy/beat), bed via ffmpeg loudnorm. Encode mp4+webm+webp poster → click-to-play `<video preload="none">`. Conversion 60s arc: hook→contrast→benefit-slide/product-proof×N→emotional payoff→trust→risk-reversal CTA. Gotchas: brew ffmpeg lacks drawtext (use ImageMagick PNGs), Remotion hooks-in-.map() fail ESLint, Veo pillarbox crop=1080:720:100:0.
