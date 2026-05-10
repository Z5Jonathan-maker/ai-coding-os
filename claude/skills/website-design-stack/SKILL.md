---
name: website-design-stack
description: Production website-building rubric. Animation-tier classification (conservative/moderate/aggressive/editorial/static), library-mix per tier, the 6 mandatory landing-page sections, ship gate checklist, and on-demand reference-repo cloning for grep-able source. Use when the user says "build a website", "design a landing page", "ship a marketing site", "/website-design-stack", or starts a flagship hero-experience project. Adapted from the augen-clone "$50K website" bundle (Wassim Younes, April 2026).
---

# website-design-stack — production website-building rubric

This skill captures the operating rubric from a battle-tested website-building Claude Code workspace. It does NOT clone gigabytes of reference-library source by default — disk is finite. Instead it gives you the entry-point path map and a one-liner to clone any single library on-demand when you actually need to grep its source.

## When to invoke

- User says "build me a landing page", "ship a marketing site", "design a website"
- User starts a flagship hero / 3D-experience project
- User says `/website-design-stack`
- Before writing the first commit on a net-new client site

## Step 1 — classify the site

| Type | Animation tier | Library mix |
|---|---|---|
| B2B / dashboard / productized service | **Conservative** | shadcn-ui + motion (minimal) |
| Landing page (default) | **Moderate** | shadcn-ui + magicui + motion |
| Editorial / Swiss / hardware-adjacent | **Editorial (minimal + typographic)** | shadcn-ui primitives stripped of gradients/shadows; Inter Tight or Space Grotesk; GSAP for scroll only if needed |
| Flagship / launch / hero showcase | **Aggressive** | + react-bits + R3F + drei + gsap + lenis |
| Docs / blog / static marketing | **Static** | hyperui + astro, OR shadcn-ui + Next.js |

**Editorial triggers:** brief mentions "editorial", "Swiss", "Bauhaus", "journal", "instrument", "hardware", "quiet", "considered" — or explicit refs like `augen.pro`, `linear.app`, `teenage.engineering`. Editorial palette: `#F5F3EE` bg, `#111111` fg, hairline `#D9D6CF`, zero gradients, radii ≤ 4px.

**Hard rule:** never mix tiers on the same page. Consistency beats maximalism.

## Step 2 — scaffold

Always install:
```
react@18+ next@14+ typescript tailwindcss@3.4+
clsx tailwind-merge class-variance-authority lucide-react
framer-motion next-themes sonner
```

Moderate tier adds: `@radix-ui/react-*` primitives as needed.
Aggressive tier adds: `three @react-three/fiber @react-three/drei gsap @gsap/react lenis`.

## Step 3 — design tokens

Use CSS variables so dark/light swaps are one-line:

```css
--bg: #07070a;
--bg-soft: #0d0d13;
--surface: #10101a;
--text: #eef0f5;
--text-dim: #9aa0ad;
--text-mute: #5c6472;
--grad-primary: linear-gradient(135deg, #7b8cff 0%, #a85fff 100%);
--line: rgba(255,255,255,0.06);
--line-hot: rgba(255,255,255,0.12);
```

Typography defaults: display = geometric sans (Space Grotesk, Inter Tight); body = humanist sans (Inter, Geist); mono = JetBrains Mono / Geist Mono / Fira Code.

## Step 4 — six mandatory landing-page sections (in order)

1. **Hero** — h1 with gradient accent, sub-copy, primary CTA, secondary link
2. **Social proof** — testimonials or logo marquee (magicui `<Marquee>`)
3. **Feature grid** — 3-column cards or bento layout
4. **Showcase** — R3F 3D object, MagicUI beams, or ReactBits hero component
5. **CTA section** — final conversion push with big button
6. **Footer** — minimal, links + contact

## Step 5 — animate with ONE primary engine per page

| Engine | Use for |
|---|---|
| **Motion (framer-motion)** | DOM (enter/exit, hover, drag, presence) |
| **GSAP (+ ScrollTrigger)** | Scroll-driven timelines, SVG morphs |
| **R3F `useFrame`** | 3D scenes |

**Never animate the same CSS property via Motion AND GSAP** — they conflict silently. If two animators need the same element, give each its own DOM layer.

For aggressive-tier sites, **Lenis is the single scroll driver** — subscribe ScrollTrigger to Lenis's `scroll` event, not the native one.

## Step 6 — ship gate (don't declare done before all of these pass)

- [ ] Lighthouse ≥ 90 on mobile
- [ ] Dark mode works via `selector` strategy
- [ ] Zero console errors
- [ ] Primary CTA tested end-to-end
- [ ] OG image + meta tags present
- [ ] Hover states on every interactive element
- [ ] `prefers-reduced-motion` respected (short-circuit Motion variants)
- [ ] Tested on real mobile (not just DevTools)

## Reference library — canonical entry-point paths

When a site genuinely needs a pattern that's only obvious from reading library source, clone the relevant repo on-demand and grep into it. Don't pre-cache all 1.9 GB.

| Library | Clone command | Canonical grep path |
|---|---|---|
| shadcn-ui | `git clone --depth 1 https://github.com/shadcn-ui/ui ~/cache/shadcn-ui` | `apps/v4/registry/new-york-v4/ui/*.tsx` |
| magicui | `git clone --depth 1 https://github.com/magicuidesign/magicui ~/cache/magicui` | `registry.json`; `apps/www/registry/magicui/*.tsx` |
| syntaxui | `git clone --depth 1 https://github.com/ansub/syntaxui ~/cache/syntaxui` | `src/components/` |
| react-bits | `git clone --depth 1 https://github.com/DavidHDev/react-bits ~/cache/react-bits` | `src/` |
| hyperui | `git clone --depth 1 https://github.com/markmead/hyperui ~/cache/hyperui` | `src/components/*.astro`; `src/pages/components/` |
| motion | `git clone --depth 1 https://github.com/motiondivision/motion ~/cache/motion` | `packages/framer-motion/src/` |
| gsap | `git clone --depth 1 https://github.com/greensock/GSAP ~/cache/gsap` | `src/` (`ScrollTrigger.js`, `Draggable.js`, `Flip.js`); `esm/` |
| three.js | `git clone --depth 1 https://github.com/mrdoob/three.js ~/cache/three-js` | `src/` (core); `examples/jsm/` (addons) |
| react-three-fiber | `git clone --depth 1 https://github.com/pmndrs/react-three-fiber ~/cache/r3f` | `packages/fiber/src/` |
| drei | `git clone --depth 1 https://github.com/pmndrs/drei ~/cache/drei` | `src/` (all helpers; `src/index.ts` is catalog) |

**Rule:** never install what's already referenced in these repos. Read source, lift the pattern, compose from primitives.

**Per-repo package manager** (don't cross-contaminate):
- pnpm: shadcn-ui, magicui, motion, hyperui
- yarn: react-three-fiber
- npm: syntaxui, react-bits, gsap, three-js, drei

## Reference site

A complete editorial-tier reference implementation lives at:
```
~/code/research/wassim-drive/augen-design-stack/augen-reference-site/
```
83 MB, builds with `npm install && npm run dev`. Read its `README.md` first — the mandate (flat, quiet, engineered, no gradients, no glassmorphism, no radius > 4px) is the editorial-tier constitution.

## Memory templates

Empty templates are at `~/code/research/wassim-drive/augen-design-stack/memory-templates/`:
- `design-log.md` — what shipped, what broke, what surprised
- `preferences.md` — aesthetic + technical preferences with evidence
- `tensions.md` — unresolved disagreements, open questions, scope-lift log
- `patterns.md` — patterns extracted from shipped sites

Copy these into a new project's `memory/` when you start a site. Read them at session start; write to them after every ship.

## Composition with existing skills

| Goal | Stack |
|---|---|
| Mock up before scaffolding | `/design` (HTML/CSS/SVG mockup) → this skill (production) |
| High-fidelity prototype before scaffolding | `/huashu-design` → this skill |
| Pick a style/palette/font | `/ui-ux-pro-max` (lookup) → this skill |
| Build design tokens | `/design-system` (token architecture) → this skill |
| Implement components | `/ui-styling` (shadcn/Tailwind) inside this skill |
| Audit a finished site | `/audit` post-ship |

## Source

Adapted from Wassim Younes's *augen-website-package* (Flux Growth Agency, April 2026 free Drive bundle). The original CLAUDE.md is preserved at `~/code/research/wassim-drive/augen-design-stack/DESIGN-STACK-CLAUDE.md` for reference.
