# SPEC-001: Shadow-Git Checkpoints Bound to Phase Boundaries

Status: ready-for-codex
Owner-lane: codex (implementation), claude (review)
Depends-on: none
Blocks: SPEC-002 (git-as-mission-state may reuse the shadow plumbing)

## Why

Today, when a target-repo-writing phase (`kimi_implementation`, `codex_proof`)
produces a wrong-but-not-obviously-wrong result, the only rollback is
`git reset` on the target repo, which loses everything since the last
commit. The mission tracks *what happened* via receipts but offers no way
to *go back*. This is the single biggest missing safety primitive in
the handoff workflow.

Cline solved this with a shadow git repo + three restore modes. Steal it,
bind it to our phase boundaries (not per-tool-call), keep it
mission-local.

## Scope

In:
- Auto-snapshot the target repo before and after every target-writing phase.
- Auto-snapshot the mission directory before and after every phase.
- New CLI: `cc-design-handoff checkpoints …` and `cc-design-handoff restore …`.
- New receipt schema and append-only log.
- Fixtures + CI coverage.

Out (explicitly):
- Per-tool-call snapshots (we snapshot per phase boundary, not per file
  edit — simpler, sufficient for our model).
- Replacing the JSON mission ledger with git (that is SPEC-002).
- Cross-machine sync of checkpoints (mission-local only).
- Auto-prune / GC of shadow repos (manual `rm -rf .checkpoints/`).
- Any new external dependency. Use system `git` via `spawnSync`.

## Design

### Storage layout

Per-mission, alongside the existing JSON tree:

```
.ai/design-handoffs/<mission-id>/
  …existing files…
  checkpoints.log.json          # append-only array of checkpoint receipts
  .checkpoints/
    target.git/                 # bare-ish shadow repo for target repo
    mission.git/                # bare-ish shadow repo for mission JSON
```

Two separate shadow repos (not one mixed work-tree) because:
- Target repo path is dynamic (`--target-repo`), mission dir is fixed.
- Restore modes need to act on each independently.

Each is initialized with `git init --bare=false` in `.checkpoints/<name>.git`
and operated via `git --git-dir=<path>/.git --work-tree=<target>`. Use
`core.worktree` config so successive commands don't need the flag.

### When to snapshot

Two boundaries per phase:

1. **Pre-execute** (`stage: "pre"`) — taken at the top of any execute path
   that may write to target or mission. For target-writing phases this
   captures rollback state; for mission-only phases it captures mission
   state.
2. **Post-complete** (`stage: "post"`) — taken inside `markComplete()`
   after the existing logic finishes writing handoff + proof bundle.

A `kimi_implementation` phase therefore produces 2 checkpoints in
`target.git` and 2 in `mission.git`. A `creative_reference` phase
produces 0 in `target.git` (no target writes) and 2 in `mission.git`.

### Which phases write to target

A phase writes to the target repo iff its definition has
`target_repo_writes: true`. Add this field to the phase records created
in `createHandoff()` (bin/cc-design-handoff:410). Phases that get `true`
today:

- `kimi_implementation`
- `codex_proof`

All others default to `false`. The flag is the single source of truth —
do not infer from phase id elsewhere.

If `target_repo_writes` is true but the mission has no `--target-repo`
recorded, skip the target snapshot, append a warning event to the
timeline, and continue. Do not fail the phase.

### Checkpoint receipt

Append to `<missionDir>/checkpoints.log.json` (create if missing):

```json
{
  "schema": "ai-coding-os.checkpoint.v1",
  "id": "ck_2026-05-25T13-48-00Z_kimi_implementation_pre",
  "mission_id": "…",
  "phase_id": "kimi_implementation",
  "stage": "pre",
  "trigger": "auto-pre-execute",
  "created_at": "2026-05-25T13:48:00Z",
  "target": {
    "path": "/abs/path/to/app",
    "commit": "<sha in target.git>",
    "changed_files_count": 12,
    "skipped": false,
    "skip_reason": null
  },
  "mission": {
    "commit": "<sha in mission.git>",
    "changed_files_count": 3
  },
  "note": null
}
```

ID format is `ck_<iso8601-utc-with-dashes>_<phase-id>_<stage>`. Stable,
sortable, human-readable, no collisions within a mission.

Commit messages in the shadow repos:
`checkpoint: <id>` — minimal, parseable.

### CLI

New subcommands in `bin/cc-design-handoff`:

```
cc-design-handoff checkpoints --dir <mission> [--json]
cc-design-handoff restore     --dir <mission> --checkpoint <id>
                              --mode files|mission|both
                              [--dry-run]
```

`checkpoints` prints a table (or JSON array) of every entry in
`checkpoints.log.json`: id, phase, stage, created_at, target sha (short),
mission sha (short), changed counts.

`restore`:
- `--mode files` → `git --git-dir=<target.git> --work-tree=<target>
  checkout <sha> -- .`
- `--mode mission` → same against `mission.git` and the mission dir,
  with `.checkpoints/` excluded from work-tree to avoid recursion.
- `--mode both` → both.
- `--dry-run` prints the list of files that would change (via
  `git diff --name-only <sha> -- .`) and exits 0 without touching disk.
- After a non-dry restore, append a new checkpoint receipt with
  `trigger: "post-restore"` and a `note` recording the restored id +
  mode. The restore itself is rollback-able.

Refuse to restore mission to a checkpoint whose phase has already been
superseded by a later phase's `markComplete` unless `--force` is passed.
This prevents foot-guns where a user rolls back mission state but leaves
later phases pointing at stale data.

## Implementation

New module `bin/lib/cc-checkpoints.js` exporting:

```js
module.exports = {
  initShadows(missionDir, targetPath),        // idempotent; creates .git dirs
  snapshot(ctx),                              // ctx = {missionDir, handoff, phase, stage, trigger}
  list(missionDir),                           // returns receipts array
  restore({missionDir, checkpointId, mode, dryRun, force}),
  receiptPath(missionDir),                    // helper
};
```

Edits to `bin/cc-design-handoff`:

1. Add `const cp = require('./lib/cc-checkpoints');` at top.
2. In `createHandoff()` (bin/cc-design-handoff:410), tag phases:
   set `phase.target_repo_writes = true` for `kimi_implementation` and
   `codex_proof`; `false` otherwise.
3. Add a helper `function preExecute(dir, handoff, phase)` that calls
   `cp.snapshot({missionDir: dir, handoff, phase, stage: 'pre',
   trigger: 'auto-pre-execute'})`. Invoke it at the entry of each
   executor (search for `phase.status =` writes inside execute paths
   around lines 1737–1797 and call `preExecute` before mutation).
4. In `markComplete()` (bin/cc-design-handoff:399), after the existing
   writes, call `cp.snapshot({…, stage: 'post', trigger:
   'auto-post-complete'})`.
5. Extend argv dispatch to handle `checkpoints` and `restore`
   subcommands.

Edit `.gitignore`: add `.ai/design-handoffs/*/.checkpoints/` so shadow
repos never get committed to the outer ai-coding-os repo.

## Tests / fixtures

Add `fixtures/checkpoints/`:

- `basic/` — synthetic mission with one `kimi_implementation` phase
  against a one-file target repo. Asserts:
  - 2 commits land in `target.git`, 2 in `mission.git`.
  - `checkpoints.log.json` has 2 entries.
- `restore-modes/` — runs phase, mutates target file post-hoc, then
  exercises `--mode files`, `--mode mission`, `--mode both`, and
  `--dry-run`. Each asserts the right side of the world changes.
- `no-target-repo/` — runs `creative_reference` only. Asserts
  `target.git` has 0 commits, `mission.git` has commits, no warnings
  about missing target.
- `dirty-target/` — target repo has uncommitted local edits before phase
  runs. Asserts they're captured in the pre-snapshot.
- `force-required/` — runs two phases, attempts mission restore to
  phase-1 checkpoint without `--force`; asserts refusal with non-zero
  exit; retries with `--force`; asserts success.

Wire into `bin/cc-benchmark-fixtures` and CI
(`.github/workflows/public-ci.yml`).

## Acceptance criteria

A merge of this spec is acceptable iff:

1. All pre-existing fixtures still pass (`bin/cc-benchmark-fixtures
   --check`).
2. All five new fixtures above pass.
3. `bin/cc-design-handoff checkpoints --dir <mission>` exits 0 with a
   non-empty list after running any phase.
4. `bin/cc-design-handoff restore --dir <mission> --checkpoint <id>
   --mode files --dry-run` lists changed files and changes nothing on
   disk.
5. `bin/cc-design-handoff restore --dir <mission> --checkpoint <id>
   --mode files` reverts target files only; `mission.json` files
   unchanged.
6. Inverse for `--mode mission`.
7. `.gitignore` rule prevents shadow repos from leaking into outer-repo
   `git status`.
8. No new entries in `package.json` / no new runtime dependencies.
9. `bin/cc-doctor` (if it exists by merge time, otherwise skip) reports
   checkpoint health: latest checkpoint id per mission.
10. Spec doc updated with "Status: shipped" and a one-line PR link at
    the top.

## Failure modes / what to fail loud about

- Shadow repo init fails → fail the phase, do not proceed (this is the
  safety primitive; degrading silently defeats the purpose).
- `git` binary not on PATH → fail at first checkpoint attempt with a
  clear message pointing at `cc-doctor`.
- Mission dir on a filesystem that doesn't support hardlinks (rare) →
  shadow repos still work; nothing special required.
- Concurrent mission writes from two processes → out of scope. Document
  in the doc string that handoffs are single-writer per mission.

## What this spec does *not* do

It does not:

- Replace `.ai/design-handoffs/<id>/*.json` with git. That's SPEC-002.
- Track per-tool-call edits. Phase-boundary granularity only.
- Provide a UI in the cockpit. CLI first; cockpit surfaces in a
  later spec.
- Expose checkpoints to external agents (no MCP server yet).
- Garbage-collect old checkpoints.

## Hand-off to Codex

When Codex picks this up:

1. Branch from `main`: `feat/spec-001-checkpoints`.
2. Implement in this order: module → integration into `markComplete` →
   `preExecute` wiring → CLI subcommands → fixtures → CI.
3. Open PR with body linking back to this spec path.
4. Claude review gate: read the diff against acceptance criteria 1–10,
   not against personal style preferences.
