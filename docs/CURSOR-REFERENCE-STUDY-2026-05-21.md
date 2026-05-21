# CURSOR-REFERENCE-STUDY-2026-05-21.md

Purpose: study Cursor as a reference system, not as an adoption target.

Sources:

- Cursor concepts/docs: <https://cursor.com/docs>
- Codebase indexing: <https://docs.cursor.com/chat/codebase>
- Rules / AGENTS.md: <https://docs.cursor.com/en/context>
- Agent modes: <https://docs.cursor.com/agent>
- Inline edit: <https://docs.cursor.com/en/inline-edit/overview>
- Background agents: <https://docs.cursor.com/background-agents>
- Web/mobile background agents: <https://docs.cursor.com/background-agent/web-and-mobile>
- Background Agent API: <https://docs.cursor.com/background-agent/api/overview>
- Bugbot PR review: <https://docs.cursor.com/bugbot>
- Cursor pricing/usage: <https://docs.cursor.com/en/account/usage>

## Why Developers Switch To Cursor

Cursor works because it does not feel like "AI bolted onto an editor." It feels
like an editor where AI is native:

1. **Low-friction edit loop** — inline edit (`Cmd/Ctrl+K`) lets the user select
   code, ask for a change, refine it, and accept/reject without leaving the file.
2. **Agent mode separation** — Ask, Manual, Agent, and Custom modes map to
   different risk levels instead of one generic chat box.
3. **Codebase indexing** — automatic embeddings make the whole project feel
   searchable by natural language.
4. **Rules** — persistent project/user instructions turn agent behavior into
   configuration, not repeated prompting.
5. **Review UX** — generated changes land in a review/diff flow with per-file
   and selective acceptance.
6. **Background work** — agents can run remotely, push branches, and be picked up
   later in the IDE.
7. **PR review** — Bugbot makes code review a managed product surface, not a
   local script.
8. **Model abstraction** — users think "ask Cursor" while Cursor handles model
   availability, Auto selection, and Max/token pricing modes.

## What To Steal

### 1. Intent Modes, Not Provider Buttons

Cursor has explicit modes:

```text
Ask    -> read-only exploration
Manual -> precise targeted edits
Agent  -> autonomous multi-file work
Custom -> specialized workflows
```

Our equivalent should be VS Code tasks and router purposes:

```text
Explain Route       -> read-only routing / planning
Build / Fix         -> code edits
Design / Browser    -> visual/browser/operator
Research / Extract  -> cheap bulk work
System Demo         -> readiness proof
```

Applied locally: added `AI: Ask / Plan`, `AI: Review Diff`,
`AI: Context Snapshot`, and `AI: Jobs` tasks to the VS Code cockpit.

### 2. Context Visibility

Cursor exposes indexing state and indexed files. Developers trust context more
when they can see what the AI knows.

Our equivalent should expose:

- active workspace/project packet
- files included in route context
- ignored files
- memory/doc sources used
- last route receipt

Candidate command:

```text
cc-context-snapshot
```

### 3. Rules As Product Surface

Cursor supports project rules, user rules, AGENTS.md, and legacy `.cursorrules`.
The lesson is not the file format. The lesson is visibility and scoping.

We already have AGENTS.md, skill routing, wiki rules, and project personas.
Needed polish:

- show which rules are active for the current repo
- separate global rules, project rules, and workflow rules in a readable report
- fail health if advertised rules point to missing files

### 4. Inline Edit UX

Cursor's strongest day-to-day feature is likely not the agent. It is the quick
edit loop:

```text
select code -> Cmd/Ctrl+K -> request change -> inspect diff -> refine
```

Our VS Code cockpit currently has task-level routing, not inline edit parity.
This is the largest UI gap.

Potential local replacement:

- keep Claude/Codex extensions for inline edits
- add a documented keyboard path for "selection -> AI direct edit"
- future: small extension command that sends selection + file path to router

### 5. Review Before Apply

Cursor's diff/review flow matters because developers want power with control.

Our equivalent:

- keep git diff as source of truth
- add `AI: Review Diff` task
- make `cc-system-demo` and weekly health verify that review commands exist
- never let autonomous edits skip verification

### 6. Background Agent UX

Cursor background agents are remote, branch-based, and status-visible. Users can
start work away from the desktop and resume in the IDE.

We already have pieces:

- `cc-dispatch`
- jobs under `~/.Codex/jobs/`
- `cc-jobs` / job status concepts
- AI-SYSTEM dashboard
- VS Code cockpit

Missing product polish:

- VS Code task for "Start Background Job"
- VS Code task for "List Background Jobs"
- one readable job status surface
- branch/PR handoff standard

### 7. Managed PR Review

Cursor Bugbot is productized PR review:

```text
PR update -> review diff -> comment findings -> fix links back into editor/web
```

Our equivalent should stay local/TEL/GitHub-safe:

- `AI: Review Diff`
- `cc-push-gate`
- optional TEL/GitHub PR comment only with explicit approval
- project-specific review rules, similar to `.cursor/BUGBOT.md`

## What Not To Steal

- Do not replace VS Code with Cursor. Cursor's value is AI-native UX; our value
  is a cleaner multi-provider operating system.
- Do not hide pricing. Cursor has user complaints around token/cost
  transparency. Our receipts should make costs and fallbacks visible.
- Do not copy remote background agents blindly. Cursor's docs explicitly note
  internet access, auto-running terminal commands, repo write permissions, data
  retention, and prompt-injection/exfiltration risk.
- Do not add another black-box index without visible included/ignored files.
- Do not let agent autonomy bypass our TEL/approval/destructive-action gates.

## Already Better In Our Stack

- clearer lane ownership
- explicit hard-floor review lane
- TEL for credentialed actions
- dotfile-rebuildable VS Code config
- command registry and health gates
- no dependency on one vendor IDE
- model/tool routing is ours, not hidden behind an editor plan

## Still Behind Cursor

- no native sidebar/status pane
- no inline edit parity through our router
- no visual diff/review product flow beyond git/extension defaults
- no background job sidebar
- no codebase indexing visibility report
- no PR-review product surface comparable to Bugbot

## Product Implication

Cursor proves the bar:

```text
AI IDE must make context, edit, review, and background work feel native.
```

Our product should not become Cursor. It should become:

```text
VS Code-native AI operating system
with Cursor-grade UX clarity
and stronger routing/safety/ownership underneath.
```

## Next Local Moves

1. Add cost/receipt display beyond current router usage stats.
2. Add real VS Code sidebar showing route, context, health, jobs, and cost.
3. Add inline-edit parity through the router.
