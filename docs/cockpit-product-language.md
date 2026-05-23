# Cockpit Product Language

This is the product-language contract for `cc-cockpit`. It exists to stop the interface from drifting back into SaaS dashboard, admin panel, or dev-tool UI.

## Core Feeling

The cockpit opens mid-motion. It does not ask the user to start over. It preserves context, shows momentum, and makes the next right action obvious.

The emotional sequence is:

1. Calm
2. Continuity
3. Momentum
4. Trust
5. Focus
6. Inevitability

If an element does not reinforce that sequence, hide it, demote it, or remove it.

## Product Principles

- Continuity over command. The primary surface resumes work; it is not a blank prompt.
- Momentum is the north star. Every visible element should prove progress or clarify the next move.
- Complexity is handled, not shown. Routing, providers, modes, and operational mechanics belong in proof/details surfaces.
- One workspace. The UI should feel singular and environmental, not assembled from cards.
- Less UI, more intelligence. Prefer quiet confidence over visible configuration.

## Emotional Hierarchy

1. Continue current work
2. Current mission and next step
3. Progress and recent momentum
4. Mission threads
5. Supporting context
6. System details, hidden by default

## Component System

### Continue Work Hero

The hero is the soul of the product.

Required:
- Dominant current mission title
- Last session memory
- Next best step
- One obvious Continue action
- Ambient depth or horizon lighting
- No visible modes, route labels, provider names, or setup language

Forbidden:
- "What would you like to build?"
- Blank command boxes as the primary element
- Segmented controls
- Dense metadata
- Dashboard cards

### Mission Thread

A thread is a living mission, not a ticket.

Required:
- Project name
- Momentum state
- Next move
- One quiet status signal

Forbidden:
- Table layout
- Visible route/provider columns
- Dense file/test/model metadata
- Jira-style issue density

### Activity Stream

Activity is proof of momentum, not logs.

Required:
- Narrative phrasing
- Recent completed action
- Lightweight timing
- Visual continuity with the hero

Forbidden:
- Timestamps as the main content
- Raw logs
- Provider names unless proof mode is expanded

### Sidebar

The sidebar is environmental navigation.

Required:
- Quiet hierarchy
- Minimal contrast
- Calm spacing
- Integrated atmosphere

Forbidden:
- File explorer energy
- Dense categories
- Heavy separators
- Utility-first labels

### Context Chips

Context chips are ephemeral hints.

Required:
- Subtle, low-contrast treatment
- Only visible when useful
- Plain language focused on confidence

Forbidden:
- Mode switchers
- Permanent configuration rows
- Provider/model labels

## Material Language

- Base: deep navy-black with ambient violet and cyan light.
- Surface: layered depth through glow, blur, shadow, and translucency.
- Borders: only hairline or inset light. Never hard card outlines.
- Shadows: atmospheric, not boxy.
- Light is part of the interface.

## Typography

Typography carries the product.

- Display: large, calm, editorial, confident.
- Metadata: quiet, smaller, never visually dominant.
- Labels: rare. If required, keep them soft.
- All caps: only for tiny environmental captions.
- Body copy: short and purposeful.

## Motion

Motion should feel ambient, not animated.

Use:
- Breathing gradients
- Slow hover lift
- Soft fades
- Inertia-like transitions
- Magnetic primary actions
- Progressive reveal

Avoid:
- Bouncy motion
- Loud transitions
- Spinners as a primary state
- Motion that draws attention away from continuing work

## Anti-Patterns

Never ship:
- Prompt-first home screens
- Mode switchers in the hero
- Route/model/provider labels in the main UI
- Metrics as primary content
- Card grids
- Log feeds
- Hard borders
- Excessive labels
- Dashboard rows
- Anything that says "look what the system can do" instead of "just continue"

## Architecture Rule

The cockpit is not a dashboard with a hero. The cockpit is the hero.

Navigation, activity, threads, proof, and context are supporting atmosphere. They must never visually compete with the continuation surface.

Default desktop hierarchy:

1. Ambient sidebar, icon-first and quiet
2. Continuation surface occupying most of the viewport
3. Momentum layer, faint and secondary
4. Mission threads as living continuation links
5. Proof/details hidden until requested

If a future layout makes the eye land on navigation, widgets, metrics, route proof, or task rows before the current mission, it violates this document.

## Current North Star

- Composition brief: `docs/cockpit-cinematic-composition-brief.md`
- Prototype: `.design-mocks/cockpit-environment-v1.html`
- Desktop proof: `docs/media/cockpit/composition/environment-v1-desktop.png`
- Mobile proof: `docs/media/cockpit/composition/environment-v1-mobile.png`

Production layout work should migrate toward this composition system instead of continuing to polish the older dashboard shell.
