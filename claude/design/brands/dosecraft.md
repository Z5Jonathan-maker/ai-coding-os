# DoseCraft — Brand Memory

**Last updated:** 2026-05-11 (post brand migration commit `59b3a11a`)

## Brand identity

- **Product**: DoseCraft — peptide protocol tracking + AI Coach platform
- **Domain**: dosecraftapp.com (apex) / app.dosecraftapp.com (web app)
- **Positioning**: "Your Private Peptide Protocol War Room" — MIT Tech Review × pharmaceutical marketing
- **Audience**: Serious self-experimenter biohackers who'd otherwise keep 40 PubMed tabs open
- **NOT**: wellness-app pastels, hexagon-biotech-template tropes, generic SaaS gradient blobs, consumer-orange aesthetics

## Canonical palette (post-2026-05-11 migration)

| Role | Hex | Use |
|---|---|---|
| `night` | `#0F1115` | Primary background (dark mode default) |
| `night-2` | `#161922` | Card / surface background |
| `night-3` | `#1F2330` | Elevated surface |
| **`teal` (primary accent)** | **`#1E7A8C`** | **All CTAs, primary glows, gradient starts, brand mark accents** |
| `teal-accent-light` | `#29A0B8` | Gradient mid-tone, hover states |
| `accent-deep` | `#1D4E5C` | Pressed states, deep accent washes |
| `glow` | `#5BC4DC` | Cyan glow — hairlines + 8% washes max, NEVER fills |
| `paper` | `#FAFAF7` | Light-mode bg + on-dark body text |
| `paper-dark` | `#E8E5DE` | Body text on dark |
| `ink` | `#1A1A1F` | Body text on light |
| `graphite` | `#5C5C66` | Muted text |
| `steel` | `#8B8B95` | Disabled state |

**DEPRECATED:** `#ff6b35` (orange) was the previous primary accent — fully purged in commit `59b3a11a`. Kept as `--color-dc-orange` token to preserve any logo asset references, but never use for new design work. Founder feedback 2026-05-11 confirmed orange reads as "chunky / consumer-tier."

## Typography

- **Display / Headings**: Hoefler Text bold serif. Weight contrast matters more than size — 56pt bold-serif lands harder than 80pt sans.
- **Body / UI**: SpaceGrotesk (currently bundled).
- **Numerics / data readouts**: SpaceGrotesk with `font-variant-numeric: tabular-nums` so dose readouts column-align.

## CTA pattern

- Primary CTA: teal gradient `#1E7A8C → #29A0B8` fill with paper text. Equivalent visual weight to the previous orange CTA.
- Secondary CTA: teal-bordered ghost button on dark surface, paper text.
- Tertiary / link: paper-dark text with `#5BC4DC` cyan underline-on-hover.

## 3D hero motif rule (per `feedback_subtle_motifs_over_chunky.md`)

The hero 3D scene MUST be:
- Wireframe / LineSegments / spectral contour (NEVER ball-and-stick / solid spheres)
- Monochromatic cyan or teal (NEVER vivid dual-color saturation like orange + cyan)
- ≤7% opacity for the central motif
- ≤0.06 rad/s rotation (imperceptible as spin, reads as breathing)

Reference implementation: commit `437782cf` (GhostHelix in `apps/landing/src/components/three/hero-lab-scene.tsx`).

## Editorial posture (cross-references)

- `feedback_mentor_corpus_no_attribution.md` — never name Bachmeyer/Huberman/etc. in rendered content
- `feedback_path_b_be_bold.md` — Path B framing: bold + hedge once
- `feedback_coach_belongs_to_dosecraft.md` — Coach is DoseCraft product, not Aurex
- `feedback_subtle_motifs_over_chunky.md` — 3D motif rule above
- `feedback_kimi_leads_design_and_code.md` — KIMI owns design audit + code; Claude orchestrates

## Payment rails (post 2026-05-11)

- Paddle = web subscriptions (merchant of record)
- Gumroad = digital products (Master Protocol Bible + condition packs)
- Apple App Store IAP = iOS subscriptions
- Stripe is BANNED across the entire stack (per `user_role.md`)

## Commits to reference when proposing future design work

- `437782cf` — Ghost wireframe hero motif (gold-standard 3D pattern)
- `59b3a11a` — Brand orange→teal migration (36 files; tokens + components + pages)
- `9df18ed3` — Paddle webhook security hardening pattern (timing-safe sig, ts freshness, 5xx-on-unresolved, authenticated portal sessions)
- `60045123` — GSAP ScrollTrigger viewport gotcha fix (`start: "top bottom-=50"`)

## QC bar

- Design output ≥95% composite score (per CLAUDE.md design intelligence suite)
- Print-grade designs ≥98%
- Verify against this brand memory file BEFORE shipping; if a proposal conflicts with these tokens or rules, surface to founder before implementing
