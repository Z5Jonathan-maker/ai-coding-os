---
name: nyquist-gate
description: Validate test-coverage mapping BEFORE executing a plan. Maps every requirement → test command before any code is written. Named after the Nyquist sampling theorem — ensures a feedback signal exists for every requirement. Mandatory before /executing-plans on features with ≥3 requirements. Fails loudly if any requirement lacks a mapped test command. Adapted from GSD's Nyquist Validation primitive.
---

# nyquist-gate — pre-execution test-coverage validation

Every requirement must have a verification signal *before* code is written. If you can't define the test, you don't understand the requirement.

## Why "Nyquist"

The Nyquist sampling theorem says you must sample at ≥2× the highest frequency you want to recover. Applied here: every requirement is a "frequency" of behavior the system must produce; the verification command is the "sampler" that detects whether it's present. No sampler → invisible failure mode → silent breakage.

## When to invoke

Mandatory before `/executing-plans` if the plan has ≥3 requirements OR touches payment / auth / compliance code.

Optional but recommended for any plan with shippable user-visible output.

Skip for:
- Trivial single-file edits with no behavioral change
- Documentation-only changes
- Manual content commissions (essays, decks) where the "verification" is human review

## Composes with

- `/writing-plans` — plan must enumerate requirements before nyquist-gate can map them
- `/isa` — ISCs from the ISA are the requirements (1:1 mapping when present)
- `/executing-plans` — refuses to run until nyquist-gate passes
- `/verification-before-completion` — uses the NYQUIST.md as the verification checklist
- `/test-driven-development` — Nyquist commands ARE the tests in TDD; pair these skills

## Output location

Write the table to `.ai/NYQUIST.md` at project root. Create `.ai/` if absent.

## Template

```markdown
# Nyquist validation — <feature name>

**Generated:** <YYYY-MM-DD HH:MM>
**Plan reference:** `.ai/plan-<slug>.md`
**ISA reference:** `.ai/ISA-<slug>.md` (if exists)

## Requirement → test mapping

| Req ID | Requirement | Test command / procedure | Signal interpretation | Status |
|---|---|---|---|---|
| R-1 | <atomic requirement> | `npm test -- --grep "case A"` | Exit 0 = pass; non-zero = fail | unverified |
| R-2 | <atomic requirement> | `curl -sI https://aurex.bio/checkout` | HTTP 200 = pass | unverified |
| R-3 | <atomic requirement> | Manual: open PDP at 375px, confirm sticky bar visible after scroll | Visual confirmation = pass | unverified |
| ... | ... | ... | ... | ... |

## Gate result

- Total requirements: <N>
- Requirements with mapped command: <M>
- Coverage: <M/N>
- **PASS** if M == N; **FAIL** otherwise.
```

## Workflow

1. **Read the plan** — `.ai/plan-<slug>.md` or whatever the current plan is.
2. **Read the ISA** — `.ai/ISA-<slug>.md` if present; ISCs are first-class requirements.
3. **Enumerate atomic requirements** — split compound requirements into atoms. "User can log in and reset password" → R-1 login + R-2 password reset.
4. **Map each to a test** — prefer automated (test command, curl, lighthouse, lint, typecheck). Fall back to manual procedure ONLY if no automated path exists; flag manual rows clearly.
5. **Compute coverage** — count requirements with non-empty test column.
6. **Render gate result** — if coverage <100%, the gate FAILS. Print which rows are missing tests. Refuse to proceed to `/executing-plans` until they're filled in.
7. **Write `.ai/NYQUIST.md`** — even on failure (so the gaps are visible).

## Gate failure handling

When a requirement has no mappable test, you have three options:

1. **Add a test** — write the test first, then proceed. This is TDD; pair with `/test-driven-development`.
2. **Rephrase the requirement** — if it's unverifiable as written, it's not a requirement, it's a wish. Sharpen it.
3. **Move to manual procedure** — only if 1 and 2 fail. Flag the row with `[MANUAL]` and document why automation isn't possible. Manual rows count toward coverage but are second-class — flag them in the plan reviewer's checklist.

## Anti-patterns

- **Test == "the code compiles"** — typecheck is necessary but not sufficient. Each requirement needs a behavioral signal.
- **Test == "the deploy succeeded"** — deploy success is one signal; doesn't verify the requirement works for users.
- **Compound test commands** — `npm test && lint && typecheck` verifies many things at once; useless for diagnosing which requirement broke. One test per requirement.
- **Tests that always pass** — `echo "ok"` is not a test. The command must FAIL when the requirement is unmet.

## Status maintenance

After execution, update Status column per row:
- `unverified` → starting state
- `verifying` → test currently running
- `pass` → command exited green
- `fail` → command exited red; requirement broken
- `flake` → command non-deterministic; investigate before shipping

## Example (Aurex checkout cycle)

```markdown
| R-1 | BTCPay rail shows live -8% savings in USD | Visual + JS console: `document.querySelector('[data-rail="btc"] .savings').textContent.match(/\$[\d.]+/)` returns non-null | Element present + numeric content = pass | unverified |
| R-2 | NMI card form does not contain @stripe/* imports | `rg -l '@stripe/' components/shop/Checkout.tsx` returns empty | Empty output = pass | unverified |
| R-3 | Compliance copy "in-vitro research applications only" visible on checkout | `curl -s https://aurex.bio/checkout \| grep -c "in-vitro research"` returns ≥1 | Count ≥1 = pass | unverified |
| R-4 | Attestation checkbox required to submit | Manual: load /checkout, try to submit without attestation → form blocks submit | Visual = pass | unverified |
```

## Composes upstream

When this gate passes, mega-cycle / autonomous-loop / executing-plans can run without flying blind. When it fails, the failure mode is *visible* and the agent has a concrete punch list (the unfilled test column).
