# CLINE-REFERENCE-STUDY-2026-05-21.md

Purpose: study Cline as a reference system, not as an adoption target.

Sources:

- Cline overview: <https://docs.cline.bot/cline-overview>
- Cline GitHub README: <https://github.com/cline/cline>
- Cline CLI overview: <https://docs.cline.bot/usage/cli-overview>
- Cline docs index: <https://docs.cline.bot/llms.txt>
- Cline checkpoints: <https://docs.cline.bot/core-workflows/checkpoints>

## Why Developers Use Cline

Cline works because it is an autonomous coding agent that stays inside the
editor while keeping the user in control. The strong pattern is:

```text
agent can read/write/run/browse
but every meaningful action has approval, review, cost, and rollback affordance
```

It is less polished than Cursor as an IDE, but it is stronger as an open,
auditable agent loop inside VS Code.

## What Cline Does Well

### 1. Human-In-The-Loop Approvals

Cline's product promise is simple: it can edit files, run terminal commands,
use a browser, and call tools, but actions require approval unless explicitly
auto-approved.

Our equivalent:

- harness approval gates
- TEL for credentials
- destructive command restrictions
- `cc-review-diff`
- `cc-system-demo`
- `cc-permission-matrix`

Status: visible approval matrix is now exposed through `AI: Permission Matrix`
and summarized in `AI: Status`.

### 2. Plan And Act

Cline makes exploration/planning different from execution. That reduces risk
and helps users trust the agent before it touches files.

Our equivalent:

- `AI: Ask / Plan`
- `AI: Save Plan`
- `AI: Explain Route`
- `AI: Build / Fix`

Status: plan-to-act handoff can now be saved through `AI: Save Plan`, which
writes the route preview and implementation plan to `.ai/plans/`.

### 3. Checkpoints

Cline's checkpoint system uses a shadow Git repository separate from the user's
Git history. It captures file state after agent actions, supports compare and
restore, and makes auto-approve less scary.

Our equivalent:

- `git-shadow-checkpoint.sh`
- `cc-rollback`
- normal git diff
- `cc-checkpoints`

Status: checkpoint timeline is now exposed through `AI: Checkpoints`; diffs are
available through `AI: Checkpoint Diff`. Restore remains explicit through
`cc-rollback restore <N>`.

### 4. Tool Surface And MCP

Cline exposes tools, MCP servers, plugins, hooks, and provider config as product
surfaces. The useful idea is not "install more MCP." It is:

```text
tools must be named, scoped, permissioned, and visible
```

Our equivalent:

- command registry
- lane registry
- TEL policies
- MCP routing table
- health checks

Gap: no cockpit view showing which tools are allowed for the current task.

### 5. Cost Visibility

Cline tracks tokens and API cost across task loops and individual requests.

Our equivalent:

- router usage logs
- route receipts
- `cc-router-receipt`

Status: route receipt and quota drift are now exposed through `AI: Route Receipt`
and summarized in `AI: Status`. Exact cost is shown only when logged.

### 6. CLI And Headless Mode

Cline supports interactive CLI, headless JSON, piped context, schedules, and
permissions. This makes the same agent core usable from IDE, terminal, CI, and
automation.

Our equivalent:

- VS Code tasks
- `router-ask`
- `cc-dispatch`
- `cc-jobs`
- launchd scheduled jobs

Gap: JSON event output is not standardized across our commands.

### 7. Kanban / Multi-Agent Worktrees

Cline's Kanban product runs multiple agents in parallel, each card in its own
worktree with dependency chains.

Our equivalent:

- `cc-dispatch`
- subagents
- worktree guidance
- job list/status/output

Gap: no visual task board.

## What To Steal

1. **Visible approval matrix** — implemented
   - Show: read files, write files, run commands, browser, MCP, credentials,
     network, destructive actions.

2. **Checkpoint timeline** — implemented
   - Surface `git-shadow-checkpoint` and `cc-rollback` in VS Code tasks.

3. **Plan artifact** — implemented
   - `AI: Ask / Plan` should optionally write a plan file or route receipt.

4. **Cost and token receipt** — partially implemented
   - Add concise route/cost/quota output to `cc-cockpit-status`.

5. **Tool permissions view**
   - Show which lanes/tools are allowed, review-required, or denied.

6. **Headless JSON protocol**
   - Standardize command output for productizable automation.

7. **Task board later**
   - A lightweight job board is a future layer, not a current blocker.

## What Not To Steal

- Do not add Cline as another active coding lane.
- Do not add broad auto-approve/YOLO behavior.
- Do not let MCP/tool marketplace sprawl into the active system.
- Do not let model provider menus become the user-facing product.
- Do not make shadow checkpoints consume disk without retention policy.

## Already Better In Our Stack

- Stronger explicit lane ownership.
- Hard-floor Claude review lane.
- TEL credential boundary.
- Kimi browser/operator lane is first-class.
- Dotfile-rebuildable VS Code config.
- Weekly health and command registry.
- We can choose memberships/API paths deliberately instead of using one extension's provider flow.

## Still Behind Cline

- no integrated compare/restore UX
- no visual multi-agent board
- no standardized JSON event stream

## Product Implication

Cline proves a serious developer wants autonomy only when rollback and approval
are obvious.

Our product rule:

```text
Power is acceptable only when control is visible.
```

The next local improvement should be `cc-permission-matrix`: a compact readout
of what this system can do automatically, what requires review, and what is
denied.
