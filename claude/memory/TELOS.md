# TELOS — long-horizon teleology

> Distinct from MEMORY.md (factual auto-memory) and long-term-memory.md (distilled prose).
> This file answers: *what are we actually building toward*?
> Skills that need teleological context (mega-cycle, audit, autonomous-loop, design-director, ISA) should reference this before non-trivial decisions.
> Review cadence: quarterly. Last review: 2026-05-15.

---

## North-star objectives

The 3-5 things that, if achieved, would make the next 12 months a clear win. Phrased as states-of-the-world, not tasks.

1. **Aurex.bio is a category-defining premium biotech storefront** — visibly ahead of competitors on visual identity, trust architecture, and conversion polish. Cited by peers. Compounding organic + repeat revenue.
2. **DoseCraft (mobile + Coach) is a credible Apple-Store-grade product** — Guideline 4 typography permanently resolved, Coach AI feature is the differentiator, App Store review path is frictionless.
3. **The brain (`~/.claude/`) is the cleanest single-operator AI-OS in the wild** — federated runtimes (per AI-OS manifesto), memory composes across layers, skills self-evolve with observability, and the routing layer is so tight that strangers could fork-and-run it.
4. **Compounding-depth autonomous work is real** — mega-cycle / autonomous-loop / depth-check actually climb from surface fixes → root-cause refactors → foundation work without human babysitting. Anti-pattern memories self-apply.
5. **forge as a public OSS contribution** — at least one of `@forge/forms` or `@forge/recorder` lands ≥500 GitHub stars and is reused outside Aurex/DoseCraft.

## Active campaigns (current quarter)

State of the world we're moving toward, with rough deadlines. Update on quarterly review.

- **2026-Q2 — Aurex full-site redesign at 98% QC composite** ✓ (shipped 2026-05-15)
- **2026-Q2 — DoseCraft v1.0.4 approved on App Store** — Guideline 4 typography fix locked in, awaiting submission
- **2026-Q2 — Mega-brain learnings substrate at ≥1000 videos** — currently 843, room to grow
- **2026-Q3 — TEL daemon fully Keychain-backed (no 1Password fallback)** — currently partial

## Skills / capabilities to develop (north-star direction)

Where I want the brain to be more capable, expressed as states.

- **Pre-task definition-of-done is the default** — ISA precedes /writing-plans precedes /executing-plans on any non-trivial task (NEW 2026-05-15)
- **Skill performance is observable** — every skill has applied/completion/fallback metrics; underperformers auto-queued for FIX cycles (NEW 2026-05-15)
- **Autonomous loops produce visible artifacts** — ambient status pane shows current phase + cycle depth (NEW 2026-05-15)
- **Cross-runtime federation is real** — Codex, Kimi, DeepSeek, and TEL are invoked natively for their strongest lanes, not flattened to one generic API
- **Production deploys have a closed loop** — `cc-deploy-watch` catches stale prod within 15 min, never 24 hr

## Anti-goals

Things I am explicitly NOT optimizing for. Important — these prevent good-on-paper distractions.

- **Not optimizing for**: revenue per hour of dev time. Premium quality compounds; rate-driven shortcuts don't.
- **Not optimizing for**: GitHub star count on the brain repo. The brain is for me; if others want it, they fork. No marketing.
- **Not optimizing for**: covering every LLM provider. Claude-first via OAuth; Kimi for design; others only when a *purpose* demands them.
- **Not optimizing for**: feature parity with PAI / GSD / OpenSpace / Verdent. Lift novel patterns, ignore the rest.
- **Not optimizing for**: minimizing tools. The brain is a power-user stack; sprawl is fine when load-bearing.
- **Not optimizing for**: making Aurex "another supplement brand." Premium biotech positioning is the moat.

## Operating posture

How I work, expressed as defaults the brain should respect.

- **Default to action** when scope is clear; ask first when ambiguous or destructive
- **Edit existing files** over creating new ones
- **Workarounds first, hand-off last** (try harder before delegating)
- **Automate aggressively** — outside-the-box automation is welcome
- **No emojis** in code, commits, or files unless explicitly asked
- **Compliance copy locked** on Aurex: "in-vitro research applications only"
- **Stripe banned** on Aurex; BTCPay + NMI Direct Post only

## Review cadence

- Quarterly hard review (whole file)
- Monthly check-ins on active campaigns
- On any north-star objective shift, log a project memory + update this file same day

## Composes with

- `MEMORY.md` (auto-memory index) — factual, what *is*
- `long-term-memory.md` — distilled prose, what *was learned*
- `project-memory.md` — active project state, what *is in flight*
- This file (`TELOS.md`) — directional, what *we're moving toward*

Together: facts + lessons + state + direction = full context.
