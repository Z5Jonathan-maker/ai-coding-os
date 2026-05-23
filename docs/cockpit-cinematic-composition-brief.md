# Cockpit Cinematic Composition Brief

This brief replaces the old "dashboard polish" strategy.

The cockpit should not be generated from dashboard primitives. It should be composed like a cinematic product environment: light, typography, memory, and motion establish structure before any UI component appears.

## Source Artifact

- Mock: `.design-mocks/cockpit-environment-v1.html`
- Desktop proof: `docs/media/cockpit/composition/environment-v1-desktop.png`
- Mobile proof: `docs/media/cockpit/composition/environment-v1-mobile.png`

This is the current north-star composition direction. Production code should migrate toward this artifact, not continue polishing the older dashboard layout.

## Composition Thesis

The screen opens mid-story.

The user should feel:

1. The project is alive.
2. The system remembers.
3. The next move is obvious.
4. The machinery is already handled.

The app should not feel like a place to configure agents. It should feel like returning to a project that has been patiently holding state.

## Shot Breakdown

### Wide Shot

Purpose: establish atmosphere and continuity.

- Deep navy-black base
- Violet/cyan light bloom
- Large editorial mission title
- Horizon-like depth shape
- Continue action suspended in the environment
- Activity visible only as a faint proof layer

Avoid:
- boxed dashboard sections
- equal-weight columns
- panelized right rail
- visible route/provider language

### Medium Shot

Purpose: expose memory and next action.

- Last session and next best step sit under the mission title
- Two short fragments, not a paragraph wall
- Typography is the structure
- No visible controls besides Continue

Avoid:
- prompt boxes
- mode selectors
- utility rows
- status dashboards

### Detail Shot

Purpose: prove momentum without logs.

- Narrative activity events
- Soft timeline
- Recent preview artifact
- Quiet timing

Avoid:
- raw timestamps
- terminal output
- provider/model names
- alert-style logs

## Component Directions

### Continuation Surface

The continuation surface is not a card. It is the environment.

Required:
- largest visual object on the screen
- cinematic material
- visible memory
- one primary Continue action
- no visible configuration

### Mission Threads

Threads are not rows.

Required:
- 2-3 visible threads max on desktop
- larger breathing room
- no table columns
- no route/test/file metadata in default view
- each thread reads like an active project memory

### Ambient Navigation

Navigation should almost disappear.

Required:
- icon-first
- soft active state
- no text labels in default desktop view
- no heavy separators

### Activity Layer

Activity should feel like proof of life.

Required:
- placed inside or near the hero
- visually secondary
- narrative wording
- fades at the bottom

## Prompt Pack For Image 2.0

Use these for visual references only. Kimi/Codex implements after direction is approved.

### Continue Work Hero

Create a cinematic AI-native workspace hero for a desktop app called cc-cockpit. The screen should feel like returning to work already in progress, not opening software. Deep navy-black environment, violet and cyan ambient light, soft horizon depth, editorial oversized typography, one glowing Continue button, subtle project memory text, no dashboard panels, no charts, no route/model labels, no admin UI, no prompt box as the main element. Mood: calm, intelligent, inevitable, alive.

### Mission Thread

Create a premium AI-native mission thread component, not a task card. It should feel like a living project memory: project title, last active state, next move, soft atmospheric material, no table columns, no Jira energy, no dense metadata. Inspired by Linear restraint, Arc spatial warmth, and Apple Focus calm. Dark cinematic environment, subtle glow, rich whitespace.

### Activity Stream

Create a lightweight proof-of-momentum activity stream for an AI workspace. It should feel narrative and calm, not like logs. Events: rendered responsive pricing section, verified browser flow, creative reference applied, tests passed. Use a soft timeline, ambient glow, quiet timing, and an optional preview artifact. No terminal text, no provider names, no monitoring dashboard.

### Ambient Sidebar

Create an icon-first environmental sidebar for a cinematic AI workspace. It should feel integrated into the background like Arc or Kimi, not like VS Code or admin navigation. Deep navy glass, soft violet active state, minimal labels or no labels, calm spacing, no heavy borders.

### Motion Reference

Create a motion-board reference for a cinematic AI workspace: breathing background light, slow hover lift on Continue, soft fade-in of memory text, subtle parallax horizon, progressive reveal of activity events. No flashy animation, no bouncy motion, no loading spinners. Motion should communicate continuity and calm intelligence.

## Implementation Gate

Before moving any prototype into the VS Code extension, verify:

- The first eye landing is the mission title, not navigation.
- The only obvious action is Continue.
- Route/model/provider details are invisible by default.
- Threads do not use table structure.
- Activity reads like project memory, not logs.
- The screen still works with 30-40% of visible UI removed.
