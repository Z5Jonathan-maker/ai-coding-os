---
name: project-harvest-culture
description: "Harvest Culture — full-stack church/movement web app built 2026-07-04 (location, stack, run flow, gotchas)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 47f38cad-12ab-49cc-9c90-8a31eedc8418
---

**Harvest Culture** — production-ready full-stack church/"movement" site + admin CMS. Built 2026-07-04 from a "world-class edition" master build prompt (Awwwards-grade brief). Editorial/brutalist LA street aesthetic (Anton + Inter + Caveat Brush; ink `#0B0B0D` / bone `#EDEAE3` / ember `#FF6A3D`; film grain, cinematic grayscale photo treatment, live "Road to 100,000 Souls" counter).

- **Location:** `~/code/projects/harvest-culture` (pnpm workspace: `web/` + `server/`). Not yet a git repo.
- **Stack:** Vite 6 + React 19 + TS strict + Tailwind 3 + Motion + TanStack Query + React Router 7 (web); Hono + tRPC v11 (superjson) + Drizzle + better-sqlite3 + bcrypt + JWT-in-httpOnly-cookie (server). End-to-end types via `import type { AppRouter }` (path alias `@server/*`).
- **DB:** dev = zero-config SQLite (`server/data/harvest.db`); MySQL swap documented in ARCHITECTURE.md. Uses **committed migrations** (`server/drizzle/` incl. `meta/`), NOT interactive `drizzle-kit push`.
- **Run:** `pnpm install` → `pnpm db:migrate` → `pnpm db:seed` → `pnpm dev` (web :5173, api :8787). Admin at `/admin`, seeded `admin@harvestculture.org` / `HarvestCulture!2026`. Public site renders typed fallback content (`web/src/lib/fallback.ts`) if API is down.
- **Verified:** both packages typecheck clean, web builds, server boots, auth + role gating (401 w/o cookie) + public writes all pass.

**DESIGN LAW (2026-07-04, Jonathan: "dark theme looks AI generated, not premium"):** public site is **paper-first light editorial** — cream paper `#F4F0E7` field, ink type, real photography (duotone), ember scalpel; at most 1-2 `.theme-ink` inversions per page (Soul Counter monument, footer). Admin stays dark. CSS-var semantics (`--fg/--muted/--surface/--field-bg/--edge`) drive shared primitives. NEVER ship near-black+neon-accent as the default field again. Codified in DESIGN.md §4.

**CLIENT PRIORITY #1 (2026-07-04, from Jonathan):** the upcoming **car giveaway event** — Jesus & Kassandra Hernandez need **registrations NOW**. Built `/win` (ad-ready single-action registration page, countdown, live count, QR scan-to-register in admin Giveaways, utm-tracked). **Soul Winning Saturdays** = their weekly Saturday street outreach where most decisions happen; photos incoming from Jonathan — wire them via admin Media when uploaded (hero, events, leaders portraits; audit P0-1 local-imagery fix pairs with this). Don't over-build elsewhere while this is the focus.

**Voice lineage — STANDING HARD RULE (2026-07-04, reaffirmed by Jonathan: "always"):** ALL tonality/verbiage on Harvest Culture must match the revival stream of **Rodney Howard-Browne / The River at Tampa Bay / RMI** and **Jonathan Shuttlesworth / Revival Today**. Applies to every future word — pages, emails, campaigns, seed copy, admin labels. Authentic verbiage: "win the lost at any cost", "a great awakening", "the greatest harvest of souls the world has ever seen", the **100-million-soul** vision (the site's "Road to 100,000" is one local stake in it), soul-winning / power evangelism / rivers of living water / the fire, bold "I Just Got Saved!"-style directness, healing + power of God spoken plainly, zero hedging. Litmus test: would it sound at home from The River's pulpit or a Revival Today broadcast? If it reads like generic church-marketing, rewrite. Tonal alignment only, NOT an official-affiliation claim (user hasn't confirmed attribution). Codified in repo `DESIGN.md` §2.

Gotchas hit (both cost time):
1. pnpm 10+ blocks native build scripts — must add `onlyBuiltDependencies: [better-sqlite3, esbuild]` to `pnpm-workspace.yaml`, then compile (`npm run build-release` in the better-sqlite3 pkg dir on macodel; prebuild-install had no matching binary).
2. **tRPC v11 reserves `apply`** as a procedure name — `volunteer.apply` crashed the router at boot ("Reserved words used in `router({})` call: apply"). Renamed to `volunteer.submit`. Avoid reserved names (apply/call/bind/then/name/…).
