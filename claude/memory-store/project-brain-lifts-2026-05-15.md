---
name: project-brain-lifts-2026-05-15
description: "Inventory of 8 brain primitives lifted from PAI / GSD / OpenSpace / Verdent deep-dive evals on 2026-05-15. Maps each primitive to its source, location, trigger, and wire-in cycle. Reference this when a future session asks \"where does X come from\" or \"what does Y do\" for any of: ISA, Telos, Nyquist gate, HANDOFF.json, EXECUTION MODE CLASSIFIER, skill-metrics, loop-status pane, isa-nyquist-gate."
metadata:
  type: project
  originSessionId: 4716d204-44e4-4db2-a688-011f0cea910d
---
# Brain lifts 2026-05-15

On 2026-05-15 / 2026-05-16, evaluated 5 external systems (GSD, OpenSpace, PAI, Dify, Verdent) and lifted 8 specific primitives. Three shipping commits on `Z5Jonathan-maker/dotfiles`: `2501e85` (lifts), `c4b8179` (backlog + cleanup), `2f539f7` (wire the lifts). Dify deferred, Verdent runtime skipped (UX pattern only).

## Inventory

| Primitive | Source | Lives at | Triggers when |
|---|---|---|---|
| **ISA** (Ideal State Artifact) | PAI v5.0.0 | `~/.claude/skills/isa/SKILL.md` | Multi-file work, redesigns, audits, content commissions — writes `.ai/ISA-<slug>.md` |
| **Telos file** | PAI v5.0.0 | `~/.claude/memory/TELOS.md` | Skills that need teleological context reference this file |
| **Nyquist gate** | GSD | `~/.claude/skills/nyquist-gate/SKILL.md` | Before `/executing-plans` on plans with ≥3 reqs OR any payment/auth/compliance work — writes `.ai/NYQUIST.md` |
| **HANDOFF.json sibling on /checkpoint** | GSD | Extends `~/.claude/skills/checkpoint/SKILL.md` | Every `/checkpoint` invocation emits markdown + JSON; JSON at `~/.claude/state/HANDOFF.json` |
| **EXECUTION MODE CLASSIFIER** (MINIMAL/NATIVE/ALGORITHM + E1-E5) | PAI v6.3.0 | Inline in `~/dotfiles/claude/CLAUDE.md` | Behavioral — task class self-classifies; user can override with E1-E5 inline |
| **skill-metrics hook** (v2 = high-usage auto-queue) | OpenSpace | `~/dotfiles/claude/hooks/skill-metrics.sh` | Stop event; parses Skill invocations from transcript, writes counts to `~/.claude/state/skill-metrics.json`; v2 queues high-usage-without-optimization-log skills to `~/.claude/state/skill-fix-queue.jsonl` |
| **Loop status pane** | Verdent (UX only) | `~/.claude/state/loop-status.md` | Updated by mega-cycle, autonomous-loop, design-director on phase transitions. Inspect via `cc-phase` / `cc-phase watch`. |
| **isa-nyquist-gate** soft-gate | (synthesis, not direct lift) | `~/dotfiles/claude/hooks/isa-nyquist-gate.sh` | PostToolUse hook; fires WARNING when `/executing-plans` invoked without `.ai/ISA-*.md` AND `.ai/NYQUIST.md` in cwd. Disable: `ISA_GATE_OFF=1` or `touch .ai/.isa-gate-off` |

## Companion CLIs (built 2026-05-16)

- `cc-phase` — inspect `loop-status.md` (formatted; supports `watch [N]` and `raw`)
- `cc-handoff` — inspect `HANDOFF.json` (pretty-print; supports field accessors and `age`)

Different from pre-existing `cc-status` / `cc-resume` (which control the cc-loop runtime, not these new state surfaces). Don't conflate.

## Skipped lifts

- **GSD context-monitor** — existing `context-monitor.sh` already superior (4 thresholds + real autocompact-log parsing vs GSD's env-var-guess)
- **OpenSpace MCP daemon** — lifted the mutation pattern without the Python sidecar (alpha tooling, unvetted cloud sharing layer)
- **PAI installer** — would overwrite `~/.claude/` directly. Lifted ISA + Telos + Algorithm classifier as standalone files instead.
- **Dify runtime** — deferred. Revisit when external-facing LLM product emerges. License is modified-Apache with multi-tenant restriction.
- **Verdent runtime** — skipped. Targets non-coders / indie devs. Senior IC out-builds it daily.

## Related

- See `~/.claude/wiki/logs/optimization-log.md` entries dated 2026-05-15 for the structured wins
- See `[[feedback-routing-drift-idempotency]]` for the hook-idempotency lesson learned during sync
- See `[[feedback-dogfood-isa-before-non-trivial]]` for the meta-pattern that emerged from using ISA on the wire-the-lifts cycle itself
- See `[[project-brain-architecture]]` for general brain structure context (this entry is iter 12, layering on top)
