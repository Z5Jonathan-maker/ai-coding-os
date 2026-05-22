# ROUTER-WIRING-STUDY.md

Study target: external systems that route across many models/tools and
what their wiring teaches our global multimodal system.

Sources studied:

- FreeLLMAPI repo/readme: <https://github.com/tashfeenahmed/freellmapi>
- FreeLLMAPI project site: <https://tashfeenahmed.github.io/freellmapi/>
- FreeLLMAPI core files: `server/src/services/router.ts`,
  `ratelimit.ts`, `providers/base.ts`
- Charmbracelet Crush repo/readme: <https://github.com/charmbracelet/crush>
- Crush AGENTS architecture notes:
  <https://github.com/charmbracelet/crush/blob/main/AGENTS.md>
- Video reference study: `docs/VIDEO-REFERENCE-STUDY-2026-05-20.md`
- Attached 95% token-reduction, triple-router, autonomous-loop, mega-cycle,
  desktop/live-preview, and historical global-config audit bundle.

## Core Translation

FreeLLMAPI routes across API providers. We route across execution lanes:

| FreeLLMAPI concept | Our equivalent |
|---|---|
| provider | tool/platform lane: Kimi, Codex, Claude, DeepSeek, ChatGPT, Browser |
| model | capability mode: browser_control, architecture, summarization, image, code |
| key | credential/session/capacity handle: OAuth session, CLI login, API key, local daemon |
| fallback chain | ordered lane fallback per capability |
| rate limit | quota, session health, user approval budget, tool availability |
| cooldown | temporary lane suppression after failure |
| sticky session | keep a workflow on the same tool/model/session while context matters |
| encrypted key store | Keychain/TEL-backed credential handle registry |
| OpenAI-compatible endpoint | unified local command/API front door |
| dashboard | VS Code cockpit + health/status surfaces |

The important idea: their router is not "pick a model." It is a resource
allocator over providers, keys, health, rate limits, fallback order, and
conversation continuity. Our router should become the same thing for tools.

## Wiring Worth Stealing

### 1. Provider Adapter Interface

FreeLLMAPI has one provider base class and one adapter per provider. Crush
has provider configuration/model resolution separated from agent execution.

Steal:

```text
ToolAdapter {
  id
  capabilities
  health()
  canHandle(task)
  execute(task, context)
  cooldown(error)
  telemetry(result)
}
```

For us, each lane should implement the same shape:

- `kimi-webbridge`
- `codex`
- `claude`
- `deepseek`
- `chatgpt-image`
- `browser-use/playwright`
- `tel`

Current gap: `cc-router` routes classes, but health/execution semantics are
still scattered across scripts, CLIs, docs, and MCP assumptions.

### 2. Rate/Quota/Capacity Ledger

FreeLLMAPI tracks RPM/RPD/TPM/TPD per `(platform, model, key)`. Our equivalent
should track:

- per-lane success/failure count
- last healthy timestamp
- cooldown-until timestamp
- session/login status
- daily/free quota where relevant
- approval/safety class
- average latency
- last routed task class

For us the key should be:

```text
capability:lane:session_or_credential
```

Examples:

- `browser_control:kimi-webbridge:chrome-extension`
- `summarize:deepseek:api-keychain`
- `architecture:claude:oauth-max`
- `image:chatgpt:desktop-session`
- `creative_direction:chatgpt-image:canonical-reference-set`

This is more useful than raw model quota because tool availability is often
binary: logged in, daemon running, extension connected, CLI configured.

### 3. Dynamic Penalty + Cooldown

FreeLLMAPI demotes models after 429s and decays the penalty over time. That
pattern maps directly to flaky tools.

Steal:

- failure adds penalty
- success reduces penalty
- penalty decays after time
- hard failures set cooldown
- router skips cooled-down lanes

Use cases:

- Kimi extension disconnected → cool down Kimi browser lane, use Playwright
  for non-auth local tasks, keep Kimi for auth-required once reconnected.
- DeepSeek timeout → temporary cooldown, use OpenRouter/free fallback.
- ChatGPT image session challenge → cool down image lane, return explicit
  "reauth needed" instead of retrying.
- Kimi not connected → skip Kimi for non-auth browser work until reconnected.

### 4. Sticky Sessions

FreeLLMAPI keeps multi-turn chats on the same model for 30 minutes to avoid
context discontinuity. Crush supports session-based work and model switching
while preserving context.

Steal:

- sticky session per workflow, not only per chat
- session TTL, default 30-60 minutes
- sticky can be overridden by hard failure or explicit user reroute

Our examples:

- design review started in Kimi stays in Kimi until the design loop ends
- code refactor started in Codex stays in Codex unless hard architecture
  review is requested
- bulk extraction started in DeepSeek stays cheap for follow-up transforms
- image generation and creative direction stay in ChatGPT/image lane with
  prompt/style continuity
- UI implementation from an approved image reference stays in Kimi until the
  design loop ends

Current gap: `router-ask` has session flags, but the system-level workflow
does not yet expose a clear "lane session ledger" to VS Code/health.

### 5. Unified Front Door

FreeLLMAPI gives clients one OpenAI-compatible endpoint and one bearer token.
Crush gives one terminal app that can switch providers/tools.

Steal:

- one front door for humans and tools
- one receipt format for every routed action
- every response includes routed-via metadata

For us:

```json
{
  "task_id": "...",
  "capability": "browser_control",
  "lane": "kimi-webbridge",
  "fallback_chain": ["kimi-webbridge", "playwright", "codex"],
  "sticky_session": "...",
  "health_at_route": "healthy",
  "result_artifact": "...",
  "telemetry": {"latency_ms": 1234, "attempts": 1}
}
```

This should become the canonical receipt across `intent-route.sh`,
`router-ask`, VS Code tasks, and health.

### 6. Dashboard/Admin Surface

FreeLLMAPI has a dashboard for keys, fallback chain, analytics, and
playground. Crush has a sessioned terminal UI with persistent contexts.

Steal for VS Code:

- visible lane health
- active sessions
- fallback order
- last failures
- prompt/class smoke tests
- one-click route dry run

Current VS Code task setup is good, but it is still command-centric. The next
developer-tier step is a small dashboard/status document or task output that
shows lane state as a table.

### 7. Narrow Scope + Explicit Limitations

FreeLLMAPI is clear about what it does not support: images, audio, vision,
embeddings, multi-tenant auth, SLA. That clarity is a strength.

Steal:

- every lane declares unsupported capabilities
- router should fail with "unsupported by this lane" instead of pretending

For us:

- DeepSeek cheap lane: no browser, no credentials, no final security gate
- Kimi browser lane: not final architecture authority
- Free-tier gateway lane: no hard-floor, no secrets, no production autonomy

## What Not To Steal

- Do not expose a free-tier gateway publicly.
- Do not make free-tier aggregators a hard dependency for core work.
- Do not route hard-floor/security/payment/compliance work to volatile free
  tiers.
- Do not store upstream keys in plaintext config.
- Do not add another dashboard unless it reads the same ledger as health.
- Do not let "unified endpoint" hide capability loss. Tool routing needs
  capability truth, not just API compatibility.

## Target Architecture For Our System

```text
VS Code / Claude / Codex / CLI
        |
        v
intent-route.sh / router-ask
        |
        v
Capability Classifier
        |
        v
Lane Registry  <---->  Lane Health Ledger  <---->  Credential Handles
        |
        v
Fallback Planner + Sticky Session Resolver
        |
        v
Tool Adapter Execute
        |
        v
Receipt + Telemetry + Health Update
```

## Lane Registry Shape

```json
{
  "id": "kimi-webbridge",
  "capabilities": ["browser_control", "screenshots", "ui_analysis"],
  "credential": "chrome-session",
  "healthCommand": "~/.kimi-webbridge/bin/kimi-webbridge status",
  "executeCommand": "kimi-webbridge command",
  "fallbacks": ["playwright", "codex"],
  "hardFloor": false,
  "unsupported": ["final_security_review", "payment_compliance"],
  "cooldownPolicy": {"failurePenalty": 3, "decayMinutes": 2}
}
```

## Implementation Sequence

1. **Router eval set** — expand `cc-router-smoke` from 5 examples to 25-50
   capability prompts.
2. **Lane registry file** — add a versioned JSON/YAML registry for lanes,
   capabilities, health commands, fallback chains, and unsupported work.
3. **Lane health ledger** — append JSONL for route attempts, health, cooldowns,
   and sticky sessions.
4. **Unified receipt** — make `intent-route.sh` and `router-ask` emit the same
   receipt fields.
5. **Cooldown/penalty resolver** — apply FreeLLMAPI-style dynamic demotion to
   flaky lanes.
6. **VS Code status task** — display lane health and active sticky sessions.
7. **Optional free-tier gateway sandbox** — vet FreeLLMAPI in an isolated repo;
   only integrate as a cheap/experimental lane after ToS/security review.

## Immediate Architectural Decisions

- We should copy the **provider adapter + health ledger + penalty + sticky
  session** pattern.
- We should not copy the idea that everything is "just an OpenAI-compatible
  endpoint." Our system routes tools, not only text models.
- The registry must be capability-first. Model/provider names are secondary.
- Health and routing must share the same data. Separate dashboards become
  another drift source.
- The router should optimize for capability correctness first, cost second.

## Current Plug-In Candidates

| Candidate | Plug-in role | Status |
|---|---|---|
| FreeLLMAPI | cheap experimental OpenAI-compatible fallback | study only |
| Crush | terminal-native alternate coding lane | removed; reference pattern only |
| Kimi WebBridge | primary browser/UI/operator lane | active |
| DeepSeek | cheap transform/summarize/extract lane | active |
| Codex | engineering execution and local code changes | active |
| Claude | precision/hard-floor reasoning and global architecture | active |
| ChatGPT image | creative/image/reference lane | active by policy, needs receipt parity |

## Next Concrete Patch

Build `docs/LANE-REGISTRY.schema.json` and `config/lane-registry.json`, then
teach `cc-health-weekly` to verify:

- every registry lane has a command or explicit external connector
- every capability has at least one primary lane
- every non-hard-floor lane has a fallback or explicit no-fallback reason
- every active lane has a health probe
