---
name: isa
description: Articulate the Ideal State Artifact (ISA) for a non-trivial task BEFORE execution. Generates a structured definition-of-done with discrete Ideal State Criteria (ISCs) that double as verification checkpoints. Use before any task that lacks a crisp done-state — features, redesigns, audits, multi-step refactors, content commissions. Different from /writing-plans (which outputs HOW) — ISA outputs WHAT-DONE-LOOKS-LIKE. Adapted from Daniel Miessler's PAI v5.0.0 ISA primitive.
---

# isa — Ideal State Artifact

Articulate the ideal end-state of a task BEFORE you write the plan, so you can build *toward* something verifiable instead of *away* from a vague request.

## When to invoke

Mandatory before:
- Any redesign (page, system, brand)
- Any multi-step refactor touching ≥3 files
- Any audit or research deliverable
- Any content commission (essay, deck, PRD)
- Any autonomous loop with a ship gate

Skip for:
- Single-file edits
- One-shot lookups
- Conversational replies

## Composes with

- `/writing-plans` — ISA outputs the WHAT, /writing-plans outputs the HOW. Always run ISA first.
- `/audit` — ISA defines what the audit is measuring against.
- `/verification-before-completion` — ISCs *are* the verification checklist.
- `/nyquist-gate` — every ISC must have a mapped test command (Nyquist requirement).
- `mega-cycle` — each cycle ends when ISCs are all green.

## Output location

Write the ISA to `.ai/ISA-<slug>.md` in the project root (per AI-OS manifesto §11 directory structure). Slug = kebab-case of the task name.

## Template

Generate exactly this structure. Do not improvise sections; consistency matters more than expressiveness.

```markdown
# ISA — <task name>

**Generated:** <YYYY-MM-DD HH:MM>
**Owner:** <user or agent>
**Scope:** <one sentence; reject scopes wider than a sentence>

## Vision (1-3 sentences)

What does the world look like when this is done? Write in present tense as if it has shipped. No qualifiers, no "we will," no "the system should." It IS this way.

## Ideal State Criteria (ISCs)

Numbered, atomic, verifiable. Each ISC must:
- Have a clear pass/fail signal
- Map to a test command (if testable in code) or a verification procedure (if not)
- Be independently checkable — don't compound criteria with "and"

| ID | Criterion | Verification | Status |
|---|---|---|---|
| ISC-1 | <atomic done-state> | <test command or procedure> | pending |
| ISC-2 | <atomic done-state> | <test command or procedure> | pending |
| ... | ... | ... | ... |

## Anti-goals

What this is explicitly NOT doing. Prevents scope creep. List items the agent might be tempted to do but shouldn't.

- <thing we are not doing>
- <thing we are not doing>

## Out-of-scope (deferred)

Items that are valuable but explicitly for a future cycle. Distinct from anti-goals (which are permanent No's).

- <thing deferred>

## Constraints

Hard rules that must hold throughout execution. Examples: compliance copy locked, no new dependencies, must ship to main, no schema migrations.

- <constraint>

## Stakeholders / approvers

Who has to sign off on each ISC before it can be marked complete? Default: user. Override for delegated cycles.
```

## Workflow

1. **Read the request** — the user's prompt or upstream task description.
2. **Draft Vision** — write the present-tense world-after-this-ships paragraph FIRST. If you can't write it, you don't understand the task yet — ask the user.
3. **Decompose into ISCs** — 3-10 criteria. Atomic. Verifiable. Reject vague criteria like "good UX" — instead "page passes Lighthouse a11y ≥95 mobile."
4. **Identify verification per ISC** — if a test command, write it. If a procedure, name it. If not verifiable, the ISC is broken — rewrite.
5. **List anti-goals** — what would a junior agent overdo here? List those.
6. **Write to `.ai/ISA-<slug>.md`** — create `.ai/` if absent.
7. **Confirm with user** — read back the Vision + ISC count. If user says "go," proceed to /writing-plans. If "no," iterate the ISA.

## Status maintenance

As work progresses (in the same session or later), update the Status column: `pending` → `in-progress` → `verified` → `signed-off`. The ISA file is the single source of truth for whether the task is done — not a feeling, not a "looks good to me."

## Examples

### Bad ISA criterion (rejected)
> ISC-3: The homepage should feel premium.

Not atomic, not verifiable, no signal.

### Good ISA criterion (accepted)
> ISC-3: Homepage hero LCP ≤2.5s on mobile (Lighthouse mobile preset, throttled 4G).
> Verification: `lighthouse https://aurex.bio --preset=mobile --only-categories=performance` returns LCP ≤2500ms.

Atomic, has signal, has command.

## Anti-pattern to watch

If an ISA's ISCs all read like "Implement X" rather than "X is true," you've drifted into /writing-plans territory. Stop. ISA = state-of-the-world after, not steps-to-get-there.
