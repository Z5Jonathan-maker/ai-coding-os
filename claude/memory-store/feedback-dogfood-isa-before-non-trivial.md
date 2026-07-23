---
name: feedback-dogfood-isa-before-non-trivial
description: "When starting non-trivial multi-file work, write the ISA (Ideal State Artifact) FIRST per the new /isa skill. Vision + numbered ISCs in `.ai/ISA-<slug>.md` BEFORE writing-plans or executing-plans. Validated on the wire-the-lifts cycle 2026-05-15 — the ISA's 8 ISCs prevented scope creep and gave the final verification its checklist."
metadata:
  type: feedback
  originSessionId: 4716d204-44e4-4db2-a688-011f0cea910d
---
# Dogfood /isa before non-trivial work

Write the ISA in `.ai/ISA-<slug>.md` BEFORE `/writing-plans` and BEFORE touching any code, on any task that touches ≥3 files, redesigns/audits anything, or has any payment/auth/compliance surface. The ISA's ISCs serve double duty: they're the pre-task definition-of-done AND the post-task verification checklist. Skip the ISA on anything trivially scoped (single-file edits, one-shot lookups, conversational replies).

**Why:** Tested on the lift-enforcement cycle 2026-05-15. Wrote `.ai/ISA-lift-enforcement.md` with 8 numbered ISCs before touching `session-resume.sh` / `skill-metrics.sh` / etc. Result: scope stayed contained, every ISC had a verification command, and the post-cycle check was a literal walk-through of the table (7 satisfied directly, 1 satisfied transitively by pre-existing DoseCraft HANDOFF.json — which was caught precisely BECAUSE the ISC said "fresh HANDOFF.json present" and I checked instead of overwriting blindly).

**How to apply:**
- For any work matching ALGORITHM-mode triggers in CLAUDE.md (features ≥3 files, redesigns, audits, refactors, autonomous loops, content commissions, cross-repo work, payment/auth/compliance), start by calling `/isa` or writing `.ai/ISA-<slug>.md` directly.
- Each ISC must have a verification command (or named manual procedure). If you can't write the test, you don't understand the requirement — sharpen it.
- ISA precedes `/writing-plans`. WHAT-DONE-LOOKS-LIKE before HOW-TO-GET-THERE.
- ISA precedes `/nyquist-gate`. ISCs feed Nyquist's requirement→test mapping naturally.
- The `isa-nyquist-gate.sh` PostToolUse hook will WARN (not block) if `/executing-plans` runs without both `.ai/ISA-*.md` and `.ai/NYQUIST.md`. The warning is your reminder to dogfood.

**Anti-pattern:** writing an ISA whose ISCs all read "Implement X" rather than "X is true." That's `/writing-plans` content, not ISA content. ISA is state-of-the-world AFTER, not steps to get there. Sharpen criteria to "feature accessible at /url returns 200" or "test command `npm run X` exits 0", never "build the feature."

Related: `[[project-brain-lifts-2026-05-15]]` — defines the ISA primitive's origin and location. See also: `/isa` skill SKILL.md.
