---
name: feedback-dosecraft-ai-features-be-bold
description: "When designing DoseCraft AI-content features (Coach, Curriculum, generators), default to BOLD — concrete doses, named protocols, real answers. Single hedge per module, never stacked. Compliance posture is shipped at the brand level; over-caveating individual features kills the value-prop the brand fought to ship."
metadata:
  type: feedback
  originSessionId: c965723c-215a-44b0-be03-c8a9f39935a1
---
When proposing a new AI-content feature for DoseCraft (Coach, Curriculum, stack generators, protocol builders, anything that GENERATES recommendations), default to **bold**:

- Generate concrete dose recommendations for the user's stated goal — not "research-described ranges only"
- Name practitioners' protocols specifically (Wolverine, Top4, etc.) — not abstracted-out generalities
- Give the user the actual answer they came for, with the evidence tier as the qualifier
- One hedge per module (or per course) is the cap — never stack

**Why:** DoseCraft's hero says "Get a REAL answer." The brand fought through Apple Guideline 1.4.3 + FTC posture by framing as research/educational — that defense lives at the BRAND level (disclaimers, footers, "research use only" framing). Re-litigating it inside every individual feature with refusal-to-recommend logic destroys the value-prop the brand already won. The product Coach gives concrete doses today — Curriculum/Generators should match that posture, not retreat from it. See [[feedback-path-b-be-bold]] for the same principle applied to PDF copy.

**How to apply:** When designing a new AI-generation feature, ask three questions:

1. Does it answer the user's actual question (concrete dose, named protocol, real recommendation)? If no, redesign.
2. Does it use the same practitioner-consensus framing as Coach (cycles 22/24/43/47 prompt rules)? If yes, ship.
3. Does it stack additional caveats beyond Coach's single-hedge pattern? If yes, strip them.

Compliance is enforced at the **prompt level** (audit-coach-prompt.sh, 6 required sections, ordering rules) and the **brand level** ("research use only" footer, evidence tiers). Don't re-add it at the feature-design level.

**Anti-pattern (what I did 2026-05-14):** proposed Classbuild-style curriculum feature, stacked these caveats:
- "MUST refuse to generate dose recommendations for individuals — only 'research-described ranges'"
- "Append compliance footer to every generated module"
- "Lock the prompt with audit-coach-prompt.sh style enforcement"

User corrected: "you're restricting it too much, it's the opposite of what we stand for." The 1st and 2nd are anti-DoseCraft; the 3rd is the actual cycle-46 pattern (good, but I framed it as new restriction rather than existing rail to inherit).
