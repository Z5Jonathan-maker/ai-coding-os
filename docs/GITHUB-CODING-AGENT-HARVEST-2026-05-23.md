# GitHub Coding Agent Harvest — 2026-05-23

Purpose: compare top GitHub coding-agent projects against this system and keep
only capabilities that strengthen the cockpit/router/autonomy architecture
without turning it into a bag of tools.

## Baseline

Current local gates are green:

- `cc-ten-readiness`: 9/9
- `cc-product-readiness`: 15/15
- `cc-fresh-clone-check`: 6/6
- `cc-feedback-law-check`: 8/8

Our product is not a single coding agent. It is a local-first AI coding operating
system: VS Code cockpit, multi-lane router, receipts, permissions, browser
proof, Image 2.0 creative direction, Kimi browser/UI execution, Codex/Claude
engineering lanes, DeepSeek worker lane, TEL credential boundary, and launch
gates.

## Projects Reviewed

Star/fork counts were pulled from the GitHub repository API on 2026-05-23.

| Project | Stars | Useful pattern | Decision |
|---|---:|---|---|
| `google-gemini/gemini-cli` | 104,514 | trusted folders, sandbox/security docs, checkpointing, token caching, custom commands, IDE integration | harvest selectively |
| `openai/codex` | 84,819 | lightweight terminal agent, local execution discipline, minimal interface | already aligned |
| `OpenHands/OpenHands` | 74,609 | agent platform, CLI/SDK/cloud, Docker/runtime isolation, eval infrastructure | optional isolated runner only |
| `cline/cline` | 62,208 | SDK + CLI + IDE + Kanban + teams + scheduled/headless agents + checkpoints | harvest mission/worktree orchestration |
| `aaif-goose/goose` | 45,729 | desktop + CLI + API, custom distributions, MCP extension surface | harvest custom distribution posture |
| `Aider-AI/aider` | 45,200 | repo map, git-native workflow, auto lint/test, image/webpage context, web-chat bridge | mostly covered; strengthen repo-map proof |
| `continuedev/continue` | 33,335 | source-controlled AI checks in `.continue/checks/`, PR status checks, CI enforcement | must harvest |
| `TabbyML/tabby` | 33,541 | self-hosted Copilot alternative | reject for now |
| `QwenLM/qwen-code` | 24,611 | terminal-native agent pattern | no unique gap |
| `RooCodeInc/Roo-Code` | 24,137 | modes: Code, Architect, Ask, Debug, Custom; MCP; editor-native team metaphor | already covered |
| `charmbracelet/crush` | 24,587 | polished terminal agent UX | rejected earlier; still duplicate UI |
| `SWE-agent/SWE-agent` | 19,279 | benchmark/eval discipline, YAML-governed issue-solving harness | harvest benchmark mindset only |
| `opencode-ai/opencode` | 12,678 | TUI, multi-provider config, SQLite session persistence, LSP integration | harvest session ledger idea only |

## Must Harvest

### 1. Source-Controlled AI Checks

Continue's strongest idea is that AI review behavior is code: agents live as
markdown checks in the repo and run as PR status checks. This maps directly to
our feedback-law and readiness philosophy.

Add a small native version:

```text
.ai/checks/
  security.md
  routing.md
  ui-polish.md
  launch-readiness.md
cc-ai-checks
```

Rules:

- checks are markdown, committed with the repo
- each check has name, trigger, command, pass/fail contract
- `cc-ai-checks` can run local-only first
- later it can become a GitHub Action/status check

Why this is worth adding: it converts judgment into versioned policy without
adding a new model, daemon, IDE, or dashboard.

### 2. Workspace Trust Profile

Gemini CLI's trusted-folder/sandbox posture is the missing formal layer around
our permission matrix. We already have permission modes and TEL, but not a
repo-local trust declaration that tells the cockpit how aggressive it may be.

Add:

```text
.ai/trust.json
```

Suggested fields:

```json
{
  "workspace": "trusted-local",
  "allow_shell": true,
  "allow_network": "ask",
  "allow_browser_profile": "ask",
  "allow_secrets": false,
  "destructive_actions": "deny",
  "public_publish": "review"
}
```

Why this is worth adding: it keeps the UI simple while making autonomy safer and
more sellable to external developers.

### 3. Mission Ledger + Worktree State

Cline's Kanban/team direction is important, but we should not copy a task-board
UI. The useful piece is persistent task state tied to separate worktrees and
agent sessions.

Add a compact native ledger:

```text
~/.Codex/state/missions.jsonl
```

Each row:

```json
{
  "id": "route-reliability-pass",
  "repo": "...",
  "worktree": "...",
  "lane": "codex",
  "status": "running|blocked|review|done",
  "next": "run release gate",
  "proof": ["cc-ten-readiness"],
  "updated_at": "..."
}
```

Why this is worth adding: it supports the product's main emotional promise,
"continue where I left off", without adding visible dashboard clutter.

### 4. Token/Cache Ledger

Gemini CLI surfaces token caching; OpenCode persists sessions; our router has
metrics, but the product still needs an explicit "quality-first cost control"
ledger.

Add:

```text
cc-token-ledger
```

Minimum useful output:

- calls by lane
- estimated input/output tokens
- premium calls avoided
- fallback cost
- cache/carry-forward warnings
- prompt bloat over time

Why this is worth adding: our core claim is highest-quality routing with token
optimization. That claim needs visible economics.

### 5. Benchmark Fixture Discipline

SWE-agent's useful pattern is not its whole research harness. The useful piece is
benchmark discipline: claims about agent quality should run against repeatable
fixtures.

Extend existing fixture coverage:

- keep `cc-demo-fixture`
- add 3-5 tiny benchmark repos/tasks over time
- track pass/fail and elapsed time
- do not create a full SWE-bench clone

Why this is worth adding: it lets us compare releases without subjective UI
impressions.

## Already Covered

- **Modes/personas:** Roo Code and Cline have modes; our lanes and tasks already
  cover code/design/browser/research/extract/review. Avoid adding mode sprawl.
- **Repo map:** Aider's repo-map idea is already represented by `cc-repo-map`,
  `cc-repo-index`, semantic index, and cockpit context cards.
- **Checkpoints:** Cline/Gemini/Aider checkpointing is already covered through
  `cc-checkpoints`, git/shadow state, and the cockpit.
- **Browser proof:** Cline/Aider browser/page context is already covered by
  Kimi WebBridge, `cc-browser-proof`, Playwright fallback, and Image 2.0/Kimi
  workflow.
- **MCP/tools:** Cline/Goose/Gemini extension ideas are already covered through
  skills, MCP routing, TEL, and browser lanes.
- **Fresh setup proof:** we are ahead here with `cc-fresh-clone-check` and
  `cc-ten-readiness`.

## Reject For Now

- **New IDE/editor shell:** no Cursor clone, no Crush-like replacement, no second
  cockpit. VS Code remains the product surface.
- **Slack/Telegram/Discord channels:** useful for enterprises later, but it adds
  blast radius and distracts from the developer cockpit.
- **Self-hosted autocomplete server:** Tabby is valuable, but our system is not a
  Copilot replacement. Do not add a completion server until the cockpit/router is
  fully daily-driver proven.
- **Full Docker-first agent runtime:** OpenHands-style isolation is useful for
  untrusted repos, but not as the default. It would reintroduce Docker/OrbStack
  complexity we intentionally removed.
- **Voice-to-code:** Aider has it. Not needed for sellable v1.
- **Provider marketplace:** Goose/Cline-style extensibility is attractive, but
  our simplicity depends on opinionated lanes. Add extension hooks only when a
  real workflow requires them.

## Priority Order

1. `cc-ai-checks` + `.ai/checks/`
2. `.ai/trust.json` + cockpit permission/trust readout
3. `cc-token-ledger`
4. mission ledger backing the cockpit continuation surface
5. benchmark fixture expansion

This is the smallest set that materially levels up the system. Everything else
is either already covered, nice-but-noisy, or belongs after daily-driver proof.

## Implemented

- 2026-05-23: `cc-ai-checks` and `.ai/checks/` added.
- 2026-05-23: `.ai/trust.json` and `cc-trust-profile` added.
- 2026-05-23: `cc-token-ledger` added and wired into source-controlled checks.
- 2026-05-23: `cc-mission-ledger` added and wired into cockpit mission state.

The implementation is intentionally small: committed markdown checks call
existing local proof commands, the trust profile is a machine-readable policy
contract, token economics read from existing router telemetry, and continuation
state is an append-only local ledger. No new model lane, daemon, UI shell, or
provider marketplace was added.

## Sources

- `https://github.com/google-gemini/gemini-cli`
- `https://github.com/openai/codex`
- `https://github.com/OpenHands/OpenHands`
- `https://github.com/cline/cline`
- `https://github.com/aaif-goose/goose`
- `https://github.com/Aider-AI/aider`
- `https://github.com/continuedev/continue`
- `https://github.com/TabbyML/tabby`
- `https://github.com/QwenLM/qwen-code`
- `https://github.com/RooCodeInc/Roo-Code`
- `https://github.com/charmbracelet/crush`
- `https://github.com/SWE-agent/SWE-agent`
- `https://github.com/opencode-ai/opencode`
