# Swarm Dogfood Audit — 2026-05-23

## Verdict

Five tester agents simulated visual QA, practical workflow, router reliability,
fresh-developer install, and an eight-hour developer day.

Result:

- Engine / routing foundation: strong but not fully reliable
- Installed cockpit: not daily-driver ready before fixes
- Public/sellable launch: blocked

The repeated root issue was the same across agents: the product must become a
truthful continuation system, not a premium-looking dashboard over static state.

## P0 Findings

1. Empty `Continue` could fail.
   The UI said "Add a detail, or just Continue," but the button submitted an
   empty textarea and the extension rejected it.

2. Cockpit Auto could force a bad dry-run route.
   Auto preview parsed `final_class` from a dry run, then executed with
   `--purpose "$PURPOSE"`, locking in any classifier mistake.

3. Full cockpit hid the work stream.
   The result panel existed but was hidden in `panel-mode`, so a user could not
   watch work happen, stop it, copy it, or clear it.

4. Router hard-floor requests could still land on cheap.
   A prompt-detected hard-floor request returned `hard_floor: true` while final
   routing to `cheap/deepseek`.

5. Classifier collisions misrouted daily developer tasks.
   Coding tasks could route to Claude instead of Codex, and "VS Code cockpit UI"
   design work could route to Codex instead of Kimi.

6. Live cockpit state is still not trustworthy enough.
   Mission rows and feed content still include static workstream examples. This
   remains the main daily-driver blocker.

## Fixes Shipped In This Pass

- Empty `Continue` now resolves to the selected mission prompt.
- Cockpit Auto now calls `router-ask` once without forcing the dry-run class.
- Full cockpit keeps the work stream visible.
- Sidebar nav buttons have accessible labels.
- Extension no longer activates on `onStartupFinished`.
- `openOnStartup` now defaults to `false`.
- Packaged-install docs now tell users to generate the VSIX before installing.
- External evaluator now fails package/demo prerequisites instead of treating
  them as harmless skips on macOS/node-capable systems.
- Router hard-floor prompts now force precision before embedding, learned
  overrides, quota, and sticky routing.
- Router classifier checks now cover:
  - hard-floor long audit prompt
  - failing TypeScript unit test bugfix to Codex
  - VS Code cockpit UI redesign to Kimi

## Remaining P0/P1 Blockers

- Replace static mission/workstream data with a real mission-state model:
  repo, branch, last action, next step, dirty files, tests, route, blockers,
  browser proof, artifacts, and checkpoints.

- Build a real resume ledger from git state, router sessions, checkpoints,
  recent transcripts, and project memory.

- Convert raw result output into structured mission events:
  planning, editing, verifying, blocked, done, with raw logs expandable.

- Add automatic mission checkpoints before and after meaningful edits.

- Make degraded-provider preflight route around known quota exhaustion before
  attempting the unavailable provider.

- Make public/fresh-developer install hermetic:
  no required `~/AI-SYSTEM-V2` assumption without bootstrap,
  no missing VSIX artifact path, and no false-green evaluator.

- Add actual VS Code webview smoke/integration testing. Static screenshot
  capture is useful, but it is not proof of the installed extension.

## Current Position

Internal dogfood can continue after these fixes, but public launch should remain
blocked until the cockpit state becomes truthful and a fresh developer can
install, verify, and understand the product in under ten minutes.
