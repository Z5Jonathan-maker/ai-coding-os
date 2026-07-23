---
name: feedback-subtle-motifs-over-chunky
description: "Founder rejects screensaver-read 3D motifs (vivid dual-color, solid spheres, perceptible spin). Prefers ghost/wireframe/spectral textures that read as ambient atmosphere."
metadata:
  type: feedback
  originSessionId: 67ad7bbd-3af8-40c1-b265-6ffb86904e5d
---
For DoseCraft (and likely any premium-pharma-biotech brand the founder ships under), 3D hero motifs must be **structural texture, not visible molecules**. Specific aesthetic rules captured 2026-05-11:

- **No vivid dual-color saturation** (orange + cyan was rejected as "chunky / ghetto"). Monochromatic teal/cyan only, glow accents not fills.
- **No solid sphere atoms** (ball-and-stick balloon-model reads as chemistry textbook, not premium pharma). Wireframe / LineSegments / spectral contours preferred.
- **Imperceptible rotation** (≤0.06 rad/s). Anything fast enough to be legible as "thing spinning" reads as screensaver.
- **Low opacity (≤10%)** for the central motif so it reads as atmospheric texture rather than a focal element. The hero CTA + headline is the focal point.

**Why:** The brand positioning is "MIT Tech Review × pharmaceutical marketing." Vivid colorful 3D = wellness-app aesthetic. Wireframe ghost = clinical-instrument aesthetic. Founder's exact words: "subtle low-key dope" / "premium" / "not a screensaver."

**How to apply:** When proposing any 3D hero / decorative scene for DoseCraft or sibling biotech brands:
1. Default to wireframe-at-7%-opacity or LineSegments/contour rendering
2. Route through KIMI design tier first (per `feedback_kimi_leads_design_and_code`) before implementing
3. Never use vivid orange (#ff6b35) or saturated dual-color on the central motif
4. Reference commit `437782cf` (GhostHelix replacement) as the gold-standard pattern

**History worth noting:** The original DNA helix (commit 025e79eb) shipped with vivid orange + cyan atoms and was on the site for ~1 month before founder explicitly called it out as wrong. The lesson: founder taste-call on 3D aesthetic happens slowly — they tolerate suboptimal designs for a long time before saying so. Default to the most conservative/subtle option from day one rather than waiting for explicit rejection.
