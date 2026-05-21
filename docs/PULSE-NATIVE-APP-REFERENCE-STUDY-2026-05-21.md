# Pulse + Native App Reference Study — 2026-05-21

## Decision

Pulse is a code-density protocol, not a model, IDE, or lane. It should stay
embedded in code-generation and cleanup workflows, exposed as `cc-pulse-status`,
and kept out of the router as a separate destination.

Native AI desktop apps are reference surfaces and dependency checks. The cockpit
should show which apps exist, what role each owns, and whether bridge/connectivity
pieces are live. It should not become a launcher full of duplicated model
buttons.

## Pulse Fit

Local source:

- `~/code/research/wassim-drive/PULSE-TOKEN-EFFICIENCY-COMPACTOR.md`
- `~/dotfiles/claude/skills/pulse/SKILL.md`
- `~/.agents/skills/pulse/SKILL.md`

Rules worth keeping:

- generated code should be compact, direct, and behavior-preserving
- comments explain non-obvious decisions only
- targeted reads beat dumping whole files into context
- tests, error messages, and user-facing copy are not compressed when clarity
  matters
- Pulse composes with the cockpit as a quality discipline, not another button
  asking the user to pick a model

Implemented surface:

- `cc-pulse-status`
- `AI: Pulse Status`
- sidebar `Pulse` card

## Native App Lessons

### Codex Desktop

OpenAI describes Codex Desktop as a command center for agents, with parallel
agent tasks, project threads, worktrees, diff review, editor handoff, and skills.
The useful lesson for this system is not to replace VS Code. The useful lesson is
to expose supervision state: jobs, diffs, checkpoints, route receipts, skills,
and proof packets.

Already covered locally by:

- `cc-jobs`
- `cc-diff-hunks`
- `cc-checkpoints`
- `cc-workflow-proof`
- cockpit composer and result stream

Source: https://openai.com/index/introducing-the-codex-app/

### ChatGPT Desktop

OpenAI positions ChatGPT Desktop around screen/file context, screenshots, voice,
web search, and IDE edits. For this stack, ChatGPT stays the creative/image lane
and a desktop app dependency check. It should not be the primary coding cockpit.

Implemented surface:

- `cc-native-app-status` reports `/Applications/ChatGPT.app`

Source: https://chatgpt.com/features/desktop/

### Claude Desktop

Claude Desktop's useful pattern is secure extension/MCP-style connectivity and a
visual interface for longer-running work. Anthropic documents desktop extensions,
local app/data connections, and Cowork running in an isolated local VM with
folder-scoped access.

For this stack, that validates TEL/MCP boundaries and visible permission state.
Claude remains the architecture/review lane, not the everyday UI shell.

Implemented surfaces:

- `cc-permission-matrix`
- `cc-native-app-status`
- TEL and MCP status in the broader AI-SYSTEM-V2 dashboard

Source: https://support.claude.com/en/articles/10065433-install-claude-desktop

### Kimi Desktop / Kimi Code

Kimi's official docs position Kimi as long-context, multimodal, agentic, and
file-heavy. Kimi Code is a coding assistant for terminal/IDE, and Kimi Agent
handles end-to-end tasks with tools, docs, sheets, slides, deep research, and
website generation.

For this stack, Kimi remains the design/browser/operator lane. The critical
product requirement is visible bridge health, because the value depends on
WebBridge and extension connectivity being live.

Implemented surfaces:

- `cc-kimi-status`
- `cc-native-app-status`
- cockpit `Kimi` card

Sources:

- https://www.kimi.com/help/getting-started/overview
- https://www.kimi.com/code
- https://www.kimi.com/help/agent/agent-overview

### Perplexity Desktop

Perplexity's current Mac direction is relevant as a reference, especially its
Personal Computer positioning: global task bar, active-app awareness, native app
control, local files, voice, web automation, background work, and orchestration
across frontier models.

Local finding: Perplexity Desktop is not installed on this machine. There is an
old archived Perplexity CLI/bin reference, but no active app. Therefore
Perplexity should remain study/reference material only unless deliberately
installed later.

Implemented surface:

- `cc-native-app-status` reports Perplexity as missing/reference-only

Sources:

- https://www.perplexity.ai/personal-computer
- https://apps.apple.com/ph/app/perplexity-ask-anything/id6714467650?mt=12

## Cockpit Rule

Reference apps can teach product patterns, but they do not become active lanes
unless they add an independent capability, safety boundary, or cost advantage.

The cockpit should expose:

- intent modes
- current context
- route proof
- diff/checkpoint/job state
- cost/quota and permission boundaries
- native dependency health

It should avoid:

- duplicate IDEs
- duplicate assistant shells
- unowned model buttons
- reference tools promoted into core stack without a clear role
