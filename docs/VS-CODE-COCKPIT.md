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
  matrix, checkpoints, jobs, lanes, context pressure, Pulse status, native app
  status, Kimi status, product readiness, and disk readiness
- visual context-pressure and file-change cards: token pressure, output reserve,
  available context, changed-file count, added/removed lines, and hunk summary
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
| `AI: Context Meter` | Show estimated context-window pressure, diff size, output reserve, and available tokens |
| `AI: Context Snapshot` | Show current repo context packet and named provider inclusion state |
| `AI: Session Ledger` | Show recent routed sessions, cwd-aware resume metadata, stale state, and sticky/fallback state |
| `AI: Repo Index` | Show compact workspace file/symbol/status index |
| `AI: Semantic Index` | Show dependency-free symbol map and high-signal definitions |
| `AI: Diff Hunks` | Show changed-file stats, hunk headers, patch preview, and cockpit file-change summary |
| `AI: Checkpoints` | Show shadow Git and session checkpoint timeline |
| `AI: Loop Quality` | Show autonomous loop depth, memory, and anti-pattern readiness |
| `AI: Checkpoint Diff` | Diff current worktree against a shadow checkpoint step |
| `AI: Jobs` | List background/dispatched jobs |
| `AI: Router Health` | Router provider/tier health |
| `AI: System Demo` | Acceptance demo for this machine |
| `AI: Disk Readiness` | Read-only disk gate and cleanup candidate report |
| `AI: Product Readiness` | Paid-product gate across cockpit, router, sync, packaging, and disk |
| `AI: First Run Doctor` | Non-mutating setup report for required, optional, and personal prerequisites |
| `AI: Pulse Status` | Pulse code-density source, skill, and fit status |
| `AI: Native App Status` | Installed native AI app versions and role map |
| `AI: Kimi Status` | Kimi Desktop, CLI, WebBridge, and extension health |
| `AI: Workflow Proof` | One-command readiness, route preview, repo index, and diff surface |
| `AI: Browser Proof` | Kimi WebBridge readiness plus bounded page proof output |
| `AI: Five-Minute Demo` | Readiness, workflow proof, browser proof, and package proof in one flow |
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

Reference component harvest lives at
`docs/REFERENCE-COMPONENT-HARVEST-2026-05-21.md`. It maps remaining product
gaps to prebuilt patterns and records which pieces we harvested locally.

Autonomous-loop reference study lives at
`docs/AUTONOMOUS-LOOP-REFERENCE-STUDY-2026-05-21.md`. It keeps the useful loop
discipline while avoiding duplicate scheduler/runtime noise.

Pulse/native-app reference study lives at
`docs/PULSE-NATIVE-APP-REFERENCE-STUDY-2026-05-21.md`. It keeps Pulse as a
code-density discipline and treats native AI apps as dependency/status surfaces,
not duplicate lanes.

Code-level reference harvesting is governed by
`docs/CODE-HARVEST-WORKFLOW.md`: named gap, best-in-class source, license gate,
clean fit, small surface, and cockpit-visible verification.

`AI: Permission Matrix` is the first Cline-inspired control surface. It shows
the current permission mode, policy version, review/deny rules, and live
decision probes without adding Cline as an active lane.

`AI: Checkpoints` is the second Cline-inspired control surface. It shows
read-only rollback visibility. Restores still require explicit terminal action
through `cc-rollback restore <N>`, which prompts before overwriting files.

`AI: Route Receipt` is the cost/control surface. It shows the latest served
lane/model, fallback status, latency, logged tokens, quota drift, and current
provider circuit state. Token/cost rows state whether provider usage was
supplied; if exact cost is not logged by the provider call, it says so instead
of estimating.

`AI: Save Plan` is the Plan/Act bridge. It writes the route preview plus a
read-only implementation plan to `.ai/plans/` so execution starts from an
artifact, not terminal scrollback.

`AI: Context Meter` and the cockpit Context Pressure card are the first
Roo/Cursor-inspired trust surface. They expose context usage before routing,
including reserved output space and diff pressure, so large prompts fail visibly
before they waste a premium lane call.

`AI: Diff Hunks` and the cockpit File Changes card are the first
Cline/Roo-inspired review surface. They group changed files, added/removed
lines, and hunk headers before sending a review or route request, without
adding apply behavior or hidden write actions.

`AI: Product Readiness` is the 10/10 gate. It checks lane registry, router
smoke, router integrity, system demo, first-run doctor, cockpit install, VS
Code symlinks, disk headroom, repo cleanliness, upstream sync, and product docs.

`AI: First Run Doctor` is the public setup surface. It names required tools,
optional AI lanes, personal services, planned symlinks, package drift, and
credential boundaries without mutating the user's home directory.

`AI: Context Meter` is the Roo-inspired pressure gauge. It estimates input
tokens, reserves output room, and shows remaining context before a route runs.

`AI: Session Ledger` is the Langfuse-inspired session surface. It shows routed
turns, cwd, transcript pointer when available, stale state, models, fallbacks,
and sticky routing without exposing full transcripts.

`AI: Browser Proof` is the agent-browser-inspired output protocol. It reports
WebBridge health and wraps page snapshots in nonce-tagged, bounded boundaries.

`AI: Five-Minute Demo` is the launch demo mode. It runs the same command a
public evaluator can run from the terminal and streams the proof into the
cockpit result panel.

`AI: Pulse Status` confirms the Pulse source and installed skills are present.
It exists to keep generated code dense without adding another model lane.

`AI: Native App Status` reports installed core AI apps plus reference-only
desktop app checks, including installation/version state and each app's role in
the system.

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
