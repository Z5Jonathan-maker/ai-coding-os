# Decision Rules

The "when X, pick Y not Z" logic. Captures non-obvious routing decisions so the brain doesn't relearn them every session.

## D1: Edit vs Write

- **Pick Edit** when modifying an existing file (sends only the diff, cheaper)
- **Pick Write** only for new files OR full rewrites (>50% of file changes)
- **Never Write to overwrite a file you didn't first Read** — the runtime blocks it

## D2: Bash vs MCP for the same operation

- **Pick MCP** for type-safe, schema-validated calls (`gh` ops via github MCP, browser via chrome-devtools)
- **Pick Bash** when the MCP doesn't cover a flag you need OR when the operation is one-shot trivial (`ls`, `cat`)
- **Pick Bash** for chained pipelines — MCPs don't pipe

## D3: Inline work vs Agent delegation

- **Pick inline** when the task is single-step OR your context already has the relevant files loaded
- **Pick Agent** when:
  - Task is independent + parallelizable (3 unrelated edits → 3 parallel agents)
  - Context isolation matters (research that would pollute main context)
  - Sub-task needs different tool scope (read-only Explore vs full-write main)

## D4: Which browser MCP

- **chrome-devtools** = default. Inspection, lighthouse, screenshots, network log
- **playwright** = need test-runner semantics (waitForSelector, fill_form across nav, network mocking)
- **auto-browser** = sensitive flows (login, payment, account ops) where approval gates matter
- ~~browser-use~~ = retired 2026-05-03 (redundant)

## D5: Which design skill

- **design** = English/Western HTML mockup, browser-previewable, default
- **huashu-design** = Chinese 高保真 hi-fi prototype, only when user explicitly asks
- **design-system** = building the token architecture itself (primitive→semantic→component)
- **ui-styling** = React + shadcn implementation (after the visual is approved)
- **ui-ux-pro-max** = lookup library only (read for palettes/styles, don't output from)

## D6: Skip the skill — when

- User typed `/<skill>` literally (skill auto-runs, don't manually invoke)
- Task is trivial single-edit (skill overhead > benefit)
- Skill's "Skip when" section matches current context (where defined)

## D7: When to ask vs when to act

- **Ask** when: destructive op (`rm`, force-push, delete), paid op, irreversible op, user-cross op (Slack/email)
- **Act** when: read-only, local-reversible, no shared-state side effects, scope is unambiguous
- **Default to act** when `effortLevel: max` + bypassPermissions are set AND scope is clear

## D8: When MCP fails

1. Check daily MCP probe report at `~/.claude/audits/mcp-probe-<date>.md` — is it disconnected?
2. Run `~/.claude/scripts/mcp-fallback-resolver.sh <failing-mcp>` — outputs the best healthy fallback OR empty
3. If fallback exists: swap and continue (resolver guarantees the alternative is currently ✓ Connected)
4. If no fallback: stage the work as READY-TO-RUN with clear instruction for when MCP returns
5. Either way: surface to user so they know to re-auth/restart the failed primary

## D9: When auto-memory grows past 180 lines

- Trigger `memory-curator` agent automatically (don't wait for user)
- Curator surfaces consolidation candidates, never deletes without user nod

## D10: When loop iterations stop adding value

- Two consecutive iterations on the same slice with no new findings + no new fixes → STOP
- Composite system score above 95% across all 4 axes → STOP (loop converged)
- Approval gate hit → STOP (do not call ScheduleWakeup)

## D11: When to use research-scout vs WebSearch directly

- **research-scout** = need ≥2 sources, citation rigor matters, claim is load-bearing
- **WebSearch direct** = quick fact lookup, single source acceptable, low stakes

## D12: When to use mempalace vs auto-memory

- **mempalace + recall skill** = "what did we discuss / decide in past sessions" (episodic)
- **auto-memory** = "who is the user / what's their stack / what feedback have they given" (factual)
- Never put episodic in auto-memory or factual in mempalace
