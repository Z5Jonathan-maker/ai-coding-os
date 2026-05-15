---
name: onboard
description: Bring an existing (messy) project onto the new Claude Code config. Reads what's actually in the repo, classifies project shape (marketing site / CRM / e-commerce / SaaS / API / library), then writes 4-5 scoped specialist docs (CLAUDE.md / AGENTS.md / DESIGN.md / SESSION-HANDOFF.md / ARCHITECTURE.md when non-marketing) REFLECTIVE of actual content — not generic templates. AGENTS.md is written as a full project constitution per AI-OS manifesto §12 (mission / stack / commands / forbidden changes / required checks / model routing / file ownership / personas), and the manifesto §11 directory structure (/docs/ai-memory/ + /.ai/) is scaffolded with README stubs + signal-driven content. Use when the user says "onboard this project", "/onboard", "rehab this codebase", "set up this old project", or runs /onboard inside a directory. Different from cc-new-editorial (greenfield) — onboard is for EXISTING messy code.
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

### Step 5 — Write AGENTS.md (project constitution)

AGENTS.md is the constitution every agent reads before acting on this
project. It captures the durable rules: stack, commands, forbidden
changes, model routing, file ownership, personas. Per AI-OS manifesto
§11+§12. Adapt:

```markdown
# AGENTS.md

The constitution for AI agents working in this project. Every agent reads this before acting.

## Project mission
<one paragraph: what this product does and for whom>

## Stack
- Framework: <next / svelte / express / fastapi / etc>
- Hosting: <vercel / render / aws / fly / etc>
- Database: <postgres / mysql / sqlite / none>
- Auth: <clerk / supabase / custom / none>
- Payment: <btcpay / nmi / none>  *(if Stripe is banned, say so here)*
- Email: <postmark / resend / none>
- Background jobs: <inngest / launchd / cron / none>
- Storage: <s3 / r2 / none>
- Testing: <vitest / jest / playwright / none>

## Commands
- Install: `<cmd>`
- Dev: `<cmd>`
- Test: `<cmd>`
- Build: `<cmd>`
- Lint: `<cmd>`
- Type-check: `<cmd>`
- Deploy: `<cmd>`

## Deployment rules
<who deploys, when, gating checks, env diffs, rollback path>

## Coding style
- <rule 1, e.g. "no `any` in TS">
- <rule 2, e.g. "no comments restating what code does">
- <rule 3>

## Design style
See DESIGN.md for full system. Hard rules:
- <key brand constraint, e.g. "never break the in-vitro framing">
- <typography rule>
- <spacing/color rule>

## Forbidden changes
- <thing agents must never do, e.g. "never add Stripe (RUO vendor risk — banned)">
- <e.g. "never modify lib/env.ts without explicit approval">
- <e.g. "never weaken the 'in-vitro research applications only' copy">

## Required checks (pre-ship)
- <e.g. "lint passes">
- <e.g. "type-check passes">
- <e.g. "no new console.error in production paths">
- <e.g. "no untranslated strings if i18n is wired">

## Model routing rules (project-specific overrides)
Defaults come from the global router (~/.claude/CLAUDE.md routing tables).
Project overrides:
- Code-touching tasks: codex tier; verify=flag (or 'gate' for prod-touching)
- Design tasks: KIMI via `router-ask purpose=ui_design` (KIMI owns audit + code)
- Architecture / high-stakes review: precision tier
- Research / web scraping: swarm tier
- <project-specific override here, if any>

## File ownership
- `<path>` — <agent role / "human only" / "designer + frontend-eng">
- `app/api/*` — backend-eng
- `components/*` — designer + frontend-eng
- `lib/env.ts` — human only (secrets boundary)
- `*.config.*` — human only

## Environment notes
- Required env vars: <list NAMES, never values>
- Secret store: <1Password vault path / op:// reference>
- `.env.example` is the source of truth for variable names

## Known pitfalls
- <thing that's bitten before>
- <e.g. "Next.js 16 strict mode breaks legacy <Image /> usage in /admin">
- <e.g. "Fastlane match auth burns through OTPs — use stored profile when possible">

## How agents should summarize completed work
After every meaningful change:
1. Update SESSION-HANDOFF.md "Where we are" + "Open threads" + "Next steps"
2. Append a one-line digest to `/docs/ai-memory/task-history.md`
3. If a non-obvious decision was made, add a row to `/docs/ai-memory/decisions.md`
4. If new known pitfalls emerged, add to the section above

## Personas (for cc-swarm fan-out and mercury delegation)

### designer
Focus: visual hierarchy, typography, color, spacing, micro-interactions.
Reads: DESIGN.md, components/ui/*, app/globals.css.
Writes: components/, tokens, animation.

### frontend-eng
Focus: React/Next patterns, accessibility, performance, responsive.
Reads: components/, hooks/, lib/.
Writes: same. Doesn't touch backend.

### backend-eng *(if shape needs it)*
Focus: API routes, DB schema, auth, payments, webhooks.
Reads: app/api/, lib/db/, lib/auth/.
Writes: same. Doesn't touch UI.

### reviewer
Focus: cross-cutting consistency, dead code, drift from CLAUDE.md/DESIGN.md.
Read-only — surfaces issues, doesn't fix.
```

When re-running /onboard on a project with an existing AGENTS.md:
- Read the existing file first
- If it has user-edited content (any section beyond the template stub),
  MERGE new sections rather than clobbering
- Show a diff before writing if the merge is non-trivial

### Step 6 — Scaffold /docs/ai-memory/ and /.ai/ (manifesto §11)

The AI-OS manifesto defines a per-repo memory layer that all agents
read. /docs/ai-memory/ holds durable project knowledge; /.ai/ holds
runtime artifacts (workflows, prompts, reports, screenshots, verifier
output from cc-tasks gate-mode).

Always create the directory structure. Write only the files where there's
real signal — do not create empty placeholder docs (honesty constraint).
Each created directory gets a README.md so the convention is discoverable.

```bash
# Always create:
mkdir -p docs/ai-memory .ai/{workflows,prompts,reports,screenshots,verifications}
```

#### /docs/ai-memory/ files (write only when there's signal)

| File | Always? | What goes in it |
|---|---|---|
| `project-overview.md` | yes — derive from package.json + README + first-pass scan | What product. For whom. Stage (alpha/beta/prod). One paragraph. |
| `architecture.md` | only if shape ≠ marketing | Same content as root ARCHITECTURE.md. If root file exists, write a one-line pointer here instead of duplicating. |
| `decisions.md` | yes — start empty with header | ADR-lite log. Append when a non-obvious decision is made. Format: `## YYYY-MM-DD — <decision>` + Why + Alternatives considered + Status. |
| `design-system.md` | only if DESIGN.md exists | Pointer: "See ../../DESIGN.md for full system. Highlights: …" |
| `api-contracts.md` | only if /api/ or /server/ exists | Endpoint inventory: method + path + auth + request/response shape. Generated from code where possible. |
| `known-issues.md` | yes — start with audit-light findings | Running list of known bugs, edge cases, "todo someday." Severity tagged. |
| `deployment.md` | yes for non-marketing | Pointer to AGENTS.md "Deployment rules" + extras: rollback procedure, env-var reference, monitoring URLs. |
| `agent-routing.md` | yes — short pointer | Points to global `~/.claude/CLAUDE.md` routing table + lists project-specific overrides (matches AGENTS.md "Model routing rules" section). |
| `task-history.md` | yes — start with stub | Header + comment: "This file is appended to by agents on completion of meaningful work, OR auto-extracted from `cc-tasks list --tier <project>` weekly." |

Stub for `task-history.md`:
```markdown
# Task History

Append a one-line digest after every completed meaningful task. Format:

`YYYY-MM-DD — <agent> — <one-line summary> — [task-id from cc-tasks if applicable]`

Auto-extraction (manual for now):
```bash
cc-tasks list --tier precision --limit 50 | tail -n +3 > /tmp/recent-tasks.txt
# review and append relevant lines here
```
```

Stub for `decisions.md`:
```markdown
# Decisions Log (ADR-lite)

Append a section every time a non-obvious decision is made.

## YYYY-MM-DD — <one-line decision>

**Context:** <why this came up>
**Decision:** <what was chosen>
**Alternatives considered:** <what was rejected and why>
**Status:** active | superseded by <date>
```

#### /.ai/ subdirectories (always create with README stubs)

| Path | README content (one-liner each) |
|---|---|
| `.ai/workflows/README.md` | "User-defined ops workflows. e.g. ship-checklist.md, weekly-audit.md, release-playbook.md" |
| `.ai/prompts/README.md` | "Reusable prompt templates for project-specific recurring tasks. Versioned." |
| `.ai/reports/README.md` | "Audit reports, dependency scans, lighthouse runs, security scans. Filename pattern: YYYY-MM-DD-<kind>.md" |
| `.ai/screenshots/README.md` | "Visual evidence from chrome-devtools / playwright runs. Filename pattern: YYYY-MM-DD-<feature>-<state>.png" |
| `.ai/verifications/README.md` | "Verifier output from `cc-tasks` gate-mode runs (verdict + findings). Filename pattern: <task-id>.json" |

If `/.ai/` already exists with content, leave it alone — only add missing
README stubs.

### Step 7 — Write DESIGN.md if missing

Use the format from google-labs-code/design.md. Pre-fill from any signals
found (existing CSS variables, shadcn theme, fonts in next/font, brand
colors in components). If completely absent, scaffold with placeholders
+ tell the user which fields they need to fill before /design will be
useful.

### Step 8 — Write SESSION-HANDOFF.md

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

### Step 9 — Write ARCHITECTURE.md (only if shape is CRM/e-commerce/SaaS/API)

Marketing sites don't need it. Non-marketing projects do.

**Path choice:** if root `ARCHITECTURE.md` already exists, leave it at
root and write `/docs/ai-memory/architecture.md` as a one-line pointer.
If neither exists, write to `/docs/ai-memory/architecture.md` (the
manifesto §11 location) and skip the root file.

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

## AI-OS manifesto §11+§12 alignment

This skill realizes the per-repo memory-and-constitution layer the
manifesto specifies. Output structure:

```
<repo-root>/
├── CLAUDE.md                       (project-specific Claude config)
├── AGENTS.md                       (constitution — manifesto §12)
├── DESIGN.md                       (visual identity)
├── SESSION-HANDOFF.md              (living state)
├── ARCHITECTURE.md                 (only if shape ≠ marketing AND root preferred)
├── docs/ai-memory/                 (manifesto §11 — durable agent knowledge)
│   ├── project-overview.md
│   ├── architecture.md             (or pointer to root ARCHITECTURE.md)
│   ├── decisions.md                (ADR-lite, append-only)
│   ├── design-system.md            (pointer to DESIGN.md)
│   ├── api-contracts.md            (only if /api/ exists)
│   ├── known-issues.md             (seeded from audit-light)
│   ├── deployment.md               (deploy specifics)
│   ├── agent-routing.md            (project routing overrides)
│   └── task-history.md             (cc-tasks digest sink)
└── .ai/                            (manifesto §11 — runtime artifacts)
    ├── workflows/                  (user-defined ops workflows)
    ├── prompts/                    (reusable templates)
    ├── reports/                    (audits, scans, lighthouse)
    ├── screenshots/                (visual evidence)
    └── verifications/              (cc-tasks gate-mode verdicts)
```

Composes with the rest of the AI-OS:
- Phase 0 (`cc-tasks` queue at ~/.claude/state/tasks.db) — task-history.md
  filtered/extracted from `cc-tasks list --tier <project>` digests
- Phase 1 (verifier-as-gate) — `.ai/verifications/<task-id>.json`
  populated by gate-mode runs
- DESIGN.md — single source of truth, design-system.md is a pointer
- AGENTS.md "Model routing rules" — project overrides on the global
  routing table in ~/.claude/CLAUDE.md
