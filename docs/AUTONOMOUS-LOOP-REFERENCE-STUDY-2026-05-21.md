# AUTONOMOUS-LOOP-REFERENCE-STUDY-2026-05-21.md

## Verdict

Yes, the attached autonomous-loop materials help, but mostly as operating
discipline. We should not copy the whole bundle because this system already has
`mega-cycle`, `depth-check`, `nonstop`, `wired-up`, health gates, product
readiness, and several of the same feedback memories.

## Already Covered

- Mega-cycle/depth-check commands exist in the local command layer.
- Key memories already exist in user memory:
  - wakeup cadence
  - silent skip
  - diagnostic first
  - incremental save
  - speculative write
  - self-evolve every cycle
- Product readiness and weekly health already provide install/drift checks.
- Cockpit already shows route, metrics, jobs, checkpoints, product readiness,
  Kimi status, semantic index, and diff hunks.

## Useful Patterns To Keep

1. Counter-action discipline.
   Before claiming a cycle shipped, name how the claim could still be wrong and
   verify that specific risk.

2. Null-result-as-health.
   A healthy autonomous system should sometimes report no safe change, instead
   of forcing fake productivity.

3. Repeated-theme escalation.
   If several cycles find the same class of issue, escalate to root cause or
   architecture instead of repeating surface fixes.

4. Blocklist / HUMAN override.
   Pausing or blocking repeated failed paths should be data-driven and visible.

5. Action law.
   When scope is safe, finding and fix should happen in the same cycle.

6. Depth ladder.
   Track whether work is surface, diagnostic, root-cause, refactor, audit, or
   foundation-level.

## Applied

- Added `cc-loop-quality` as a cockpit-friendly status surface.
- `cc-loop-quality` shows loop state, installed anti-pattern memories, depth
  signal, and harvested operating rules.

## Do Not Import Wholesale

- The zip's scheduler/register-task scripts are generic and would duplicate
  existing launchd/loop/routine infrastructure.
- The installer assumes project-local `.claude` and `memory/` layout; our
  system uses dotfiles plus global `.Codex`/`.claude` layers.
- Blindly copying all memory files would increase retrieval noise.
