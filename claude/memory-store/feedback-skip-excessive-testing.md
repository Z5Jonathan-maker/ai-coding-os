---
name: feedback-skip-excessive-testing
description: "Don't unit-test library behavior (Zod schemas, well-typed config). Runtime validation against real data is enough."
metadata:
  type: feedback
  originSessionId: 0cd60cea-bd1e-41ae-8950-77343eb34f6a
---
User pushed back on writing schema-level unit tests (vitest.config + schema.test.ts) for a Zod schema during the 2026-05-14 Gumroad cycle-1 work.

**Why:** Testing a Zod schema by hand-rolling 12 cases tests Zod's library, not my code. The schema IS the contract — if the definition compiles via `z.infer<>`, it's correct. Adding test infra (vitest.config, jsdom, @testing-library/*) for that is over-engineering and slows ship velocity.

**How to apply:**
- Trust well-established libraries (Zod, Yup, io-ts, valibot) — write the schema, don't unit-test it
- Same rule for: framework config files, type-only contracts, JSON schemas, generated code
- DO unit-test: business logic, custom transforms, API clients, state machines
- DO runtime-validate: aggregate at the boundary where real data flows through the schema — that's the real check
- Counter-signal: when the user says "ship it" / "fully autonomous" / "less testing," they want runtime+integration coverage, not exhaustive unit coverage of library behavior
- See also: [[feedback-try-harder-before-delegating]] (similar action-first preference)
