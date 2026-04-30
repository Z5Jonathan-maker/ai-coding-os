---
name: onboard
description: Bring an existing (messy) project onto the new Claude Code config. Reads what's actually in the repo, classifies project shape (marketing site / CRM / e-commerce / SaaS / API / library), then writes 4-5 scoped specialist docs (CLAUDE.md / AGENTS.md / DESIGN.md / SESSION-HANDOFF.md / ARCHITECTURE.md when non-marketing) REFLECTIVE of actual content — not generic templates. Use when the user says "onboard this project", "/onboard", "rehab this codebase", "set up this old project", or runs /onboard inside a directory. Different from cc-new-editorial (greenfield) — onboard is for EXISTING messy code.
---

# /onboard — bring existing project onto the new config

The user has multiple existing messy projects (Care Claims adjusting
site, Care Claims CRM, Aurex e-commerce, etc.) built with old tooling
he no longer wants to touch directly. /onboard rehabs each one.

**This skill is idempotent — re-running on the same project updates the
docs without clobbering existing user-edited content.**

## When invoked

Run a structured 7-step onboarding pass:

### Step 1 — Discover

Read repo state, no judgment yet. Capture:

```bash
# Framework + stack
cat package.json 2>/dev/null | jq '{name,scripts,dependencies,devDependencies}' | head -50
cat next.config.* tailwind.config.* tsconfig.json components.json 2>/dev/null
cat requirements.txt pyproject.toml Cargo.toml go.mod 2>/dev/null

# Repo structure
ls -la
find . -maxdepth 3 -type d -not -path '*/node_modules/*' -not -path '*/\.*' | head -30

# Existing docs (don't overwrite — read first)
ls -la README.md CLAUDE.md AGENTS.md DESIGN.md SESSION-HANDOFF.md ARCHITECTURE.md 2>/dev/null

# Git context
git log --oneline -10 2>/dev/null
git status -sb 2>/dev/null
git remote -v 2>/dev/null
```

### Step 2 — Classify project shape

| Shape | Detection signals |
|---|---|
| **Marketing / landing site** | Next.js + few pages + heavy CSS/animation; no /api routes; no DB; no auth |
| **CRM / internal tool** | Auth + DB schema + role-based access + tabular data + many forms; few public pages |
| **E-commerce** | Stripe / payment lib + product schema + cart state + order/inventory models |
| **SaaS app** | Auth + DB + multi-tenancy + billing + dashboards |
| **API / backend service** | No frontend OR thin admin; heavy /api or /server; DB; queues/workers |
| **Library / package** | `package.json` `main`/`exports`; tests heavy; minimal app shell |
| **Monorepo** | Turborepo / Nx / pnpm workspaces / lerna |
| **Mobile app** | React Native / Flutter / SwiftUI / Kotlin |

State the classification explicitly. If ambiguous (often the case in messy
projects), pick the dominant shape and call out the secondary.

### Step 3 — Audit-light pass (defer deep audit to /audit skill)

Quick read of obvious issues:
- Outdated deps (>= 1 major version behind)
- No CI config
- No tests OR tests broken
- Missing `.env.example`
- No DESIGN.md / no documented brand
- Mixed framework versions (e.g. App Router + Pages Router both)
- Vendored code that should be a dep
- TODO/FIXME density

Keep it brief — full audit is what `/audit` does.

### Step 4 — Write CLAUDE.md (scoped specialist instance)

Adapt this template to the project. Edit, don't paste verbatim:

```markdown
# CLAUDE.md — <project-name> (Specialist Instance)

This is the scoped Claude Code instance for **<project-name>**.
For non-<project-name> work, exit this workspace.

## Role

You are a **<role per project shape, e.g. "senior product engineer for a
claims-adjusting business" / "senior front-end engineer for a Swiss-
minimal marketing site" / "senior full-stack engineer for an RUO peptide
e-commerce">**.

## Scope

In scope:
- <project-shape-specific list — e.g. "auth flows, DB migrations, claim
  intake forms" or "homepage, pricing, blog, CTAs">

Out of scope (exit and use the appropriate workspace):
- <list — usually backend if marketing site, frontend polish if CRM, etc.>

## Memory protocol

Before any work, silently read:
- `memory/decisions.md` — what we picked + why
- `memory/preferences.md` — aesthetic + technical preferences with evidence
- `memory/tensions.md` — unresolved disagreements + open questions
- `memory/patterns.md` — patterns extracted from shipped work

If any file is missing, create it with an initial entry. Memory stays
in `./memory/` — scoped to this project only.

## Stack (from /onboard discovery)

<auto-filled: framework, key deps, deploy target, db/auth choices>

## Working style

- Direct. No filler, no preamble. Lead with the answer or the action.
- Push back with evidence when a call is wrong.
- Act first, explain after.
- For destructive ops (delete data, drop columns, force-push, hit prod
  Stripe in non-test mode), ALWAYS confirm.

## Hooks active

This project inherits the global hook stack:
nonstop, loop-guard, no-ask-human, context-monitor, error-gate,
secret-paste-guard, session-handover, session-resume, ntfy-notify,
wired-up-stop, bootstrap-check.
```

### Step 5 — Write AGENTS.md (cc-swarm role definitions)

Define the agent personas this project uses. Adapt:

```markdown
# AGENTS.md

Agent persona definitions for cc-swarm fan-out and mercury delegation.

## designer
Focus: visual hierarchy, typography, color, spacing, micro-interactions.
Reads: DESIGN.md, components/ui/*, app/globals.css.
Writes: components/, tokens, animation.

## frontend-eng
Focus: React/Next patterns, accessibility, performance, responsive.
Reads: components/, hooks/, lib/.
Writes: same. Doesn't touch backend.

## backend-eng (if shape needs it)
Focus: API routes, DB schema, auth, payments, webhooks.
Reads: app/api/, lib/db/, lib/auth/.
Writes: same. Doesn't touch UI.

## reviewer
Focus: cross-cutting consistency, dead code, drift from CLAUDE.md/DESIGN.md.
Read-only — surfaces issues, doesn't fix.
```

### Step 6 — Write DESIGN.md if missing

Use the format from google-labs-code/design.md. Pre-fill from any signals
found (existing CSS variables, shadcn theme, fonts in next/font, brand
colors in components). If completely absent, scaffold with placeholders
+ tell the user which fields they need to fill before /design will be
useful.

### Step 7 — Write SESSION-HANDOFF.md

A single-file living checkpoint. Adapt:

```markdown
# SESSION-HANDOFF.md

**Last updated:** <date>
**Last working session:** <one-line summary>

## Where we are
<state of the project — what's shipped, what's in progress>

## Open threads
- <thing in progress>
- <decision pending>

## Next steps (if you pick this back up cold)
1. <concrete action>
2. <concrete action>
3. <concrete action>

## Files in flight
- `path/to/file` — <what's changing>

## Active blockers
- <thing waiting on user / external / time>

## Recently learned
- <surprise or lesson worth keeping>
```

This file gets UPDATED by `session-handover.sh` Stop hook automatically
after the first /onboard. Future sessions read it via `session-resume.sh`
SessionStart hook.

### Step 8 — Write ARCHITECTURE.md (only if shape is CRM/e-commerce/SaaS/API)

Marketing sites don't need it. Non-marketing projects do:

```markdown
# ARCHITECTURE.md

## High-level
<one-paragraph what-it-is>

## Stack
- Framework:
- Hosting:
- Database:
- Auth:
- Payment:
- Email:
- Background jobs:
- Storage:
- Monitoring:

## Module map
<dirs + responsibility>

## Data model
<key entities, relationships>

## Key flows
<2-4 critical user/system flows>

## Constraints
<RUO compliance, HIPAA-adjacent, age-gating, regulated content, etc.>

## Known debt
<technical debt list — fed from the audit-light pass>
```

## After /onboard completes

Tell the user:
1. Files written (with paths) + files left alone (because user-edited)
2. Project classification + reasoning
3. Top 3-5 things to address (from audit-light)
4. Suggested next command: `/audit` for full punch list, or pick one of
   the top 3 and start

## Composition with the rest of the stack

| Skill / hook | How /onboard composes |
|---|---|
| `/audit` | Onboard runs audit-light; /audit is the deep version with lighthouse + dep-check + dead-code |
| `/design` | After onboard, /design reads the new DESIGN.md as source of truth |
| `cc-new-editorial` | Greenfield path; /onboard is the brownfield path |
| `session-handover.sh` (Stop hook) | Updates SESSION-HANDOFF.md every Stop after onboard |
| `session-resume.sh` (SessionStart) | Reads SESSION-HANDOFF.md to pick up cold |
| `mercury` | Project-specific CLAUDE.md gives mercury the role + scope when DM'd from phone |
| `cc-swarm` | AGENTS.md defines per-agent personas the swarm respects |

## Safety constraints

- **NEVER overwrite user-edited docs without confirming.** Read existing
  files; if they have non-template content, MERGE / APPEND / propose a
  diff — don't clobber.
- **Don't infer brand voice / colors / messaging from a 5-second look.**
  If the existing site doesn't expose these clearly, scaffold DESIGN.md
  with placeholders + ask the user to fill before generating mockups.
- **Don't rewrite code in this skill.** /onboard is a documentation +
  classification pass. Code changes happen in subsequent /design,
  /audit, and direct user requests.

## Honesty constraints

- If the project is too messy to classify cleanly (e.g. abandoned
  half-migrations, mixed framework versions, no clear dependency
  graph), SAY SO and recommend a "decompose first" pass before any docs.
- If a doc you'd write would just be empty placeholders (no signal),
  DON'T write it — surface "not enough signal yet" and ask for input.
- If the project's README contradicts the actual code (common in messy
  projects), flag both versions and ask which is current.
