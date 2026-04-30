# MIGRATION DISCIPLINE

The new-config platform is not for "porting old project mess in." It is
for systematically rehabbing each Tier-1 project to a known standard,
without infecting the platform with patterns we explicitly rejected.

This doc is the yardstick. /onboard, /audit, /design, /huashu-design,
/ui-ux-pro-max, cc-new-editorial, cc-mercury, cc-loop — all of them
defer to this.

## The bright lines (what the new config requires)

Every project under the new config MUST have:

1. **`CLAUDE.md`** — scoped specialist instance (role, scope, memory protocol, stack). NOT the inherited global CLAUDE.md verbatim.
2. **`AGENTS.md`** — cc-swarm persona definitions (designer / frontend-eng / backend-eng / reviewer).
3. **`DESIGN.md`** — visual identity in the [google-labs/design.md](https://github.com/google-labs-code/design.md) format. Hard rules per project (no gradients, no shadow >1px, etc.) explicit.
4. **`SESSION-HANDOFF.md`** — auto-updated by `session-handover.sh` Stop hook. Always reflects the last working session.
5. **`ARCHITECTURE.md`** (if shape ≠ marketing site) — stack, module map, data model, key flows, constraints, known debt.
6. **`.env.example`** — every key the code reads, with safe placeholder values.
7. **A `vercel.json` OR `.vercel/project.json`** — explicit deploy target binding.

## What the new config refuses

These patterns from the old projects are **not allowed to come into the rehab**:

- ❌ `create-next-app` boilerplate README left as-is
- ❌ Mixed Next.js routers (App Router + Pages Router both active)
- ❌ Mixed major versions (React 18 + 19, Tailwind 3 + 4)
- ❌ "experimental_" feature usage without a comment explaining why
- ❌ Hardcoded API keys, even in test files
- ❌ Comments that restate code (per `/karpathy-guidelines` + `/pulse`)
- ❌ Files that exist but nothing imports (per `wired-up-stop.sh` hook)
- ❌ More than 3 levels of folder nesting in `components/` without a structural reason
- ❌ shadcn primitives ALSO copied AND imported from `node_modules` (pick one)
- ❌ `lib/utils.ts` or `lib/helpers.ts` god-files >300 lines
- ❌ Routes that fetch data inside the page component instead of route loaders
- ❌ Mixing styling systems on the same page (CSS modules + Tailwind + inline styles)
- ❌ `console.log` left in production code paths
- ❌ Untyped `any` outside of explicit interop boundaries
- ❌ Multiple state managers (Zustand + Jotai + React Context all in one repo)
- ❌ Duplicate auth flows (e.g. NextAuth AND Clerk AND custom session)

## /onboard's discipline contract

When `/onboard` runs against a Tier-1 project, it will:

1. **READ the entire repo first.** No writes until classification + audit-light is complete.
2. **List every refuse-pattern violation found.** Surface — don't auto-fix.
3. **Write the 4-5 spec docs as PROPOSALS, not as rewrites.** If a doc exists with content, propose a DIFF, never overwrite.
4. **Stop after writing docs.** Code changes happen in subsequent /audit + targeted user requests, never silently.

The user reviews the proposals + decides which violations to fix vs accept-as-debt. Every fix becomes a tracked task; nothing is auto-resolved.

## The rehab sequence (per Tier-1 project)

For each of: ClaimPilot → Aurex → dosecraft → Care Claims website (rough order of complexity):

```
0. cd ~/code/<project> ; git status (must be clean — abort if not)
1. /onboard                          → read + classify + audit-light + write proposals
2. /audit                            → deep punch list (Critical / High / Medium)
3. Review punch list with user; pick top 3-5 Critical items
4. For each Critical item:
   - Open a fresh git branch
   - Fix it
   - Run /audit again to confirm no regression
   - Commit + push + PR
5. Update SESSION-HANDOFF.md (auto via Stop hook)
6. After all Critical resolved: schedule weekly /audit via cloud Routine
   so drift is caught early
```

**ClaimPilot first** because:
- Just pushed yesterday → mental model freshest
- Internal-only → no public risk while learning the rehab process
- Has a separate `backend/` dir → first real backend work on the new config

## What does NOT get onboarded (and stays out of /audit, /maintain, etc.)

Tier-3 projects. Period.

```
mym-autotrader        — back burner, leave it
area61-command-core   — back burner
wholesale-command-center — back burner
Eden                  — back burner
careclaims-instagram  — back burner
thepurelycompany      — deprecated (least important per user)
thepurelycompany-v7   — deprecated derivative
```

If you `cd` into one of these and run `/onboard`, **refuse**. Surface the
discipline doc instead. The platform should not waste cycles on
projects the user has already decided are not worth rehabbing.

## What Tier-2 (keep-live) gets

NOT full rehab. Just `/maintain` (cloud Routine):

- Weekly dep-bump PR (security only — no major-version jumps)
- Monthly lighthouse re-run; alert via ntfy if score drops >10 points
- Vercel deploy-failure alert (if a build breaks, push notification)
- Yearly renewal check on any external services (domains, certs)

No active development. Don't /design or /huashu-design against them.
Don't /audit beyond the monthly auto-run.

## Mac-unlocks (now possible, were not on Windows)

Specifically for **dosecraft** (Expo + EAS App Store submission):

- Native iOS Simulator (Xcode required)
- EAS Build local mode (vs cloud) — faster iteration, free
- TestFlight upload via Transporter or `eas submit -p ios`
- App Store Connect API key (.p8) — store in 1Password, read at runtime per `cc-mercury` pattern
- Apple Developer cert + provisioning profile (managed via EAS or fastlane match)
- Push notification certs (APNs) if dosecraft uses push

A future `/expo` or `/mobile` skill will codify this — but don't ship that skill until dosecraft is /onboard-ed and we know the actual current state of its iOS config.

## How this doc evolves

When a NEW pattern proves out across 2+ Tier-1 projects, add it to "the new config requires" section. When a NEW anti-pattern appears, add it to "the new config refuses." This doc is the source of truth — every other tool defers to it.

Last updated: 2026-04-30. Tier-1: ClaimPilot, Aurex, dosecraft, Care Claims website.
