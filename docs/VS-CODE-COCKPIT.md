# VS-CODE-COCKPIT.md

VS Code is the cockpit. The router and lane registry are the engine room.

## Native UI

The native cockpit extension lives at `vscode/ai-cockpit/` and is installed by
`install.sh` into `~/.vscode/extensions/z5jonathan.ai-system-cockpit-0.1.0`.
It can also be packaged with `cc-package-cockpit`.

It adds:

- an Activity Bar container named `AI Cockpit`
- a sidebar dashboard for readiness, route receipt, permissions, checkpoints,
  jobs, lanes, and disk gate
- an in-sidebar prompt composer with selected modes, route preview, streaming
  results, attached file/diff context, current file/selection context, and
  `cmd+enter` execution
- inline report rendering for route receipts, router metrics, permission
  matrix, checkpoints, jobs, lanes, Kimi status, product readiness, and disk readiness
- a status bar readiness button
- command palette actions for the same intent modes as the task layer

The extension is deliberately a UI wrapper over existing commands. It does not
create a second router, model menu, or hidden agent runtime.

## First-Run Flow

1. Open VS Code.
2. Open the `AI Cockpit` Activity Bar view.
3. Run `System Demo`.
4. If it fails, fix the listed gate before doing serious work.
5. Run `Explain Route` before ambiguous work.
6. Use intent actions, not raw model actions, for normal work.

## Task Map

| Task | Purpose |
|---|---|
| `AI: Status` | Concise cockpit status snapshot |
| `AI: Full System Status` | Full AI-SYSTEM-V2 status surface |
| `AI: Doctor` | System doctor |
| `AI: Explain Route` | Show which lane should handle a request |
| `AI: Lane Route` | Show the fallback chain for a capability |
| `AI: Ask / Plan` | Read-only planning/question mode |
| `AI: Build / Fix` | Code and system work |
| `AI: Design / Browser` | UI, screenshots, browser, visual/operator work |
| `AI: Research / Extract` | Cheap summarization, extraction, transforms |
| `AI: Browser Check` | Validate browser/UI task routing for a target |
| `AI: Route Receipt` | Show latest route decision, fallback, quota, token receipt |
| `AI: Router Metrics` | Show usage mix, fallback pressure, failures, tokens, and sessions |
| `AI: Permission Matrix` | Show allowed, review-required, and denied autonomy boundaries |
| `AI: Save Plan` | Write a read-only plan artifact to `.ai/plans/` |
| `AI: Review Diff` | Review current git diff through the precision lane |
| `AI: Context Snapshot` | Show current repo context packet |
| `AI: Repo Index` | Show compact workspace file/symbol/status index |
| `AI: Checkpoints` | Show shadow Git and session checkpoint timeline |
| `AI: Checkpoint Diff` | Diff current worktree against a shadow checkpoint step |
| `AI: Jobs` | List background/dispatched jobs |
| `AI: Router Health` | Router provider/tier health |
| `AI: System Demo` | Acceptance demo for this machine |
| `AI: Disk Readiness` | Read-only disk gate and cleanup candidate report |
| `AI: Product Readiness` | Paid-product gate across cockpit, router, sync, packaging, and disk |
| `AI: Kimi Status` | Kimi Desktop, CLI, WebBridge, and extension health |
| `AI: Workflow Proof` | One-command readiness, route preview, repo index, and diff surface |
| `AI: Claude Direct` | Direct Claude escape hatch |
| `AI: Codex Direct` | Direct Codex escape hatch |

Cursor reference study lives at `docs/CURSOR-REFERENCE-STUDY-2026-05-21.md`.
The main lesson is to expose intent modes, context visibility, review flow, and
background job status inside the cockpit without adopting Cursor as the IDE.

Cline reference study lives at `docs/CLINE-REFERENCE-STUDY-2026-05-21.md`.
The main lesson is visible control: approval matrix, checkpoints, cost, and
rollback need to be obvious before autonomy feels safe.

Kimi Desktop reference study lives at
`docs/KIMI-DESKTOP-REFERENCE-STUDY-2026-05-21.md`. The main lesson is that
tool connectivity, sessions, context pressure, file attachments, and outcome
modes need to be visible product state.

`AI: Permission Matrix` is the first Cline-inspired control surface. It shows
the current permission mode, policy version, review/deny rules, and live
decision probes without adding Cline as an active lane.

`AI: Checkpoints` is the second Cline-inspired control surface. It shows
read-only rollback visibility. Restores still require explicit terminal action
through `cc-rollback restore <N>`, which prompts before overwriting files.

`AI: Route Receipt` is the cost/control surface. It shows the latest served
lane/model, fallback status, latency, logged tokens, and quota drift. If exact
cost is not logged by the provider call, it says so instead of estimating.

`AI: Save Plan` is the Plan/Act bridge. It writes the route preview plus a
read-only implementation plan to `.ai/plans/` so execution starts from an
artifact, not terminal scrollback.

`AI: Product Readiness` is the 10/10 gate. It checks lane registry, router
smoke, router integrity, system demo, cockpit install, VS Code symlinks, disk
headroom, repo cleanliness, upstream sync, and product docs.

The sidebar composer is the native daily-driver path. It keeps the current
file or selected code visible as context, attaches extra files or git diff as
chips, lets the user switch between Build, Design, Research, Route, and Plan
without opening a terminal, and streams route/output back into the sidebar.

## Keyboard Map

| Shortcut | Action |
|---|---|
| `cmd+alt+1` | Claude terminal |
| `cmd+alt+2` | Codex terminal |
| `cmd+alt+3` | Kimi terminal |
| `cmd+alt+4` | DeepSeek terminal |
| `cmd+alt+5` | AI System terminal |
| `cmd+alt+c` | Build / Fix |
| `cmd+alt+d` | Design / Browser |
| `cmd+alt+r` | Research / Extract |
| `cmd+alt+h` | Status |
| `cmd+alt+t` | System Demo |
| `cmd+alt+p` | Ask / Plan |
| `cmd+alt+shift+p` | Save Plan |
| `cmd+alt+v` | Review Diff |
| `cmd+alt+m` | Permission Matrix |
| `cmd+alt+k` | Checkpoints |
| `cmd+enter` | Run selected cockpit composer mode |
| `cmd+l` | Focus cockpit composer when the sidebar has focus |

## Product Standard

No duplicate coding shells. No model hype buttons. The interface exposes intent:

```text
build
design/browser
research/extract
route explanation
system readiness
```

Everything else belongs behind the router.
