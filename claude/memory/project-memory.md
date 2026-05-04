# Project Memory — active project state

Active state of in-flight work across projects. Updated by
`/skills/consolidate-memory` AND manually as the user pivots between
projects.

## Format

One section per active project. Each section: current focus, open threads, blockers.

## Aurex (primary)

**Current focus:** Production-readiness audit + UI/UX /loop refinement

**Open threads:**
- Cart/checkout pages need `export const dynamic = 'force-dynamic'` (audit P7)
- No idempotency on order creation — race on double-click can create 2 orders
- No CSP header in vercel.json
- NMI rail still not wired to /checkout
- 500KB chunk persists (likely Recharts on first-paint)
- products.ts MOTS-c molecular formula needs reconciliation against PubChem
- IMAGE-GEN-SPEC.md lists 7 phantom SKUs

**Recently shipped (last 24hr):**
- WebP conversion of marketing PNGs (-58MB / -94%)
- 14 PDP marketing heroes wired (gpt-image-2)
- 2 section parallax bgs (EvidenceBanner, HomeStackTeaser)
- MagneticCTA primitive + useMagnetic hook + 5 CTAs wired
- ScrollTrigger registered globally + bridged to Lenis
- Stagger reveals on 4 grid surfaces
- Blur placeholder on PDP hero
- Focus-visible audit (CommandPalette + ReviewSubmitForm fixed)
- KLOW/GLOW research-data corrected (was sema/cagri lie)
- 11 sites of KLOW/GLOW miscategorization purged

## Brain / dotfiles (secondary)

**Current focus:** Roman Knox memory patterns adoption + audit-skill content extension

**Open threads:**
- consolidate-memory skill needs nightly cron schedule
- research-scout skill needs API budget approval before scheduling
- Wiki should pull in Roman Knox PDF references for posterity (done — wiki/learnings/external-references/claude-body-liam-haley-2026-04-26.md and forthcoming roman-knox-2026-05-04.md)

## Mega-brains (background)

**Current focus:** corpus assembly for cross-session recall

**State:**
- 8 mentor brains (843 → ~2,160 videos after auto-CC expansion)
- peptide-research: 140 → ~400 docs / 4.3M words
- karpathy: 10 articles + YouTube ingest pending
- mempalace mining of new content in flight (PID 49040 may still be running)
