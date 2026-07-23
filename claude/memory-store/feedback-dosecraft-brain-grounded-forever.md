---
name: feedback-dosecraft-brain-grounded-forever
description: "ANY AI-generated content for DoseCraft (Coach, Curriculum, PDFs, blog posts, protocols, articles, social copy, course modules, infographics — anything) MUST be grounded in the DoseCraft master brain (Neon corpus, 246K chunks, 21 mentors, 56 compounds tagged). Generic AI output without brain substrate is forbidden — it dilutes the entire brand thesis."
metadata:
  type: feedback
  originSessionId: c965723c-215a-44b0-be03-c8a9f39935a1
---
**Rule.** Every AI-generated content surface for DoseCraft pulls from the master brain before producing output. No exceptions. Generic LLM content that "sounds like" peptide expertise is the failure mode — the brand differentiator is mentor-grounded specificity, not general intelligence styled by voice notes.

**Why:** DoseCraft's positioning is *"powered by the top minds in the industry — this isn't just generic information."* That promise lives in every output. The Master Protocol Bible (sold on Gumroad), the Coach chat, the article series, the reversal protocol PDFs — all were built by pulling from the corpus, not by styling Claude's general training. Anything that breaks that contract — even a single output that's "smart" but unsourced — dilutes the brand thesis the user has spent years building. The user has corrected this 3+ times in one session; the lesson is clear and stops being optional.

**How to apply:**

1. **The brain.** Live at `~/code/projects/dosecraft-companion/lib/brain.ts` (Neon Postgres, 246K chunks, 11K docs, 21 mentors — Bachmeyer / Bachmeyer-Rumble / Niddam / Campbell / Koniver / Trigili / Ayubace / Huberman / Greenfield / Hyman / Attia / MorePlatesMoreDates / Layne-Norton / Hyman / et al. + dosecraft-research + peptide-research). 56 compounds tagged. Vector + FTS + compound-tag hybrid search.

2. **The CLI** (the only correct way to query from outside the Coach):
   ```bash
   cd ~/code/projects/dosecraft-companion
   node --import tsx scripts/brain-cli.mjs stats
   node --import tsx scripts/brain-cli.mjs compound BPC-157
   node --import tsx scripts/brain-cli.mjs docs <compound> --limit=N
   node --import tsx scripts/brain-cli.mjs hybrid "<topic>" [--compound=X] [--mentor=Y]
   ```
   (The `--import tsx` invocation is required since Node 20 deprecated the `--loader` API the brain-cli's old `register('tsx/esm', ...)` pattern used. Patched 2026-05-15.)

3. **The orchestrator** (proven, lives at `~/code/projects/dosecraft/scripts/paths/generate-chapter.mjs`):
   - Reads master-brain voice/style notes (dosecraft-master-brain-notes.md)
   - Calls `brain-cli hybrid` for per-topic chunks + `brain-cli docs` for compound full-doc tier
   - Assembles substrate block (cap 100K chars — Opus 4.7 1M handles big context)
   - Pipes prompt + substrate + chapter task through `claude -p` (Max subscription, $0 marginal)
   - **Instructs Claude explicitly: if substrate is silent on a specific dose/mechanism, SAY SO — never fill from training**

4. **The proof.** 2026-05-15 Hashimoto Chapter 1 generated with 9 brain sources (27K substrate chars) → 6.4K output that cited the corpus explicitly ("the corpus describes...", "practitioner observation is...", "roughly 90% of hypothyroidism is autoimmune" — that stat traceable to Mark Hyman + Ben Greenfield substrate). Voice locked, no mentor name attribution, single hedge.

5. **Failure modes the user has named:**
   - "if we're not generating reports protocols, etc., with this brain, we're failing"
   - "this is the opposite of what we stand for" (when output stacked compliance caveats)
   - "you're restricting it too much" (when feature design re-litigated brand-level compliance)
   - "this all has to be fed data from my brain" (when substrate-empty generation was attempted)
   - All three correctives apply to **any future AI output for DoseCraft**, forever, across every session.

6. **What "grounded forever" means concretely:**
   - **Coach chat:** already does this via `lib/retrieve.ts` — preserve, don't regress
   - **Paths / Curriculum:** generate-chapter.mjs pipeline (proven)
   - **PDF protocols / reversal docs (Gumroad pattern):** brain-cli + Claude pipeline same shape
   - **Blog posts / articles:** brain-cli for source chunks, hybrid by compound + topic
   - **Social copy / Instagram carousels:** brain-cli for the authority anchor, voice notes for tone
   - **Email nurture / waitlist drips:** brain-cli for the "why this protocol" specificity
   - **Future modalities (audio narration, slides, infographics, quizzes):** same substrate pipeline; only the output format changes

7. **Pre-flight check before ANY generation task for DoseCraft.** Before producing the first character of generated content, the agent must answer:
   - **Q1: What brain queries will I run?** (List them — usually 4-8 hybrid queries + 1-3 compound full-doc fetches per chapter)
   - **Q2: What substrate-size budget am I targeting?** (Default: 80-100K chars, capped per source)
   - **Q3: What happens when substrate is silent on a specific?** (Answer: flag it explicitly in output, NEVER fabricate from training)
   - If any answer is "general knowledge" or "I'll wing it" → STOP, run brain queries first.

8. **The recurrence guard.** Per [[feedback-dosecraft-ai-features-be-bold]] + cycle-15 mega-prompt rule ("every root-cause fix earns its recurrence guard"): a pre-push or pre-ship audit script could grep DoseCraft-bound generated content for telltale general-AI patterns (lack of substrate citations, hedge-stacking, "consult a healthcare professional" boilerplate) and fail loud. Worth adding to `scripts/audit-*.sh` chain when content-pipeline ships.

This rule supersedes any prior generation pattern that didn't include brain grounding. Future Claude sessions on DoseCraft work: **read this before generating anything.**
