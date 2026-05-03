# Routing Graph — task class → skill / agent / MCP

Frozen 2026-05-03. The intelligence layer that should live inside CLAUDE.md.

| Task class | Primary skill | Fallback skill | Agent to delegate | MCP to use | Notes |
|---|---|---|---|---|---|
| Generate prompt for any AI tool | `prompt-master` | — | — | — | Single-shot, never loop |
| Audit existing project | `audit` | `onboard` (if first-time) | code-reviewer (for diff slices) | chrome-devtools (lighthouse) | Output to ./audits/ |
| Onboard messy project | `onboard` | `audit` | Explore (codebase scan) | github | Generates CLAUDE.md, AGENTS.md, DESIGN.md |
| Design UI mockup (HTML/CSS) | `design` | `huashu-design` (if Chinese-style hi-fi) | — | — | Self-contained, browser-previewable |
| Design system tokens | `design-system` | — | — | claude_ai_Figma | Three-layer: primitive→semantic→component |
| shadcn/Tailwind component build | `ui-styling` | — | — | shadcn (project-level) | React-only |
| Visual style decisions | `ui-ux-pro-max` | — | — | — | 50+ styles, 161 palettes lookup |
| Brand voice / identity | `brand` | — | — | — | — |
| Banner / social asset | `banner-design` | — | — | — | — |
| Slide deck | `slides` | — | — | claude_ai_Gamma | HTML+Chart.js |
| Code review (>50 lines) | — | — | **code-reviewer** | — | Independent diff review |
| Codebase exploration | — | — | **Explore** | — | Read-only search agent |
| Implementation planning | — | — | **Plan** | — | Returns step plan, no edits |
| General multi-step task | — | — | **general-purpose** | — | Catch-all delegation |
| Recall past session content | `recall` | — | — | mempalace | MemPalace semantic search |
| Save state mid-session | `checkpoint` | — | — | — | ~/.claude/checkpoints/ |
| Daily morning standup | `morning` | — | — | github | Open PRs + brew + recent commits |
| Verify dev env health | `health` | — | — | — | Dotfile symlinks, gh auth, MCPs |
| Push dotfiles to GitHub | `sync` | — | — | github | Auto-message if none given |
| Arm "don't stop" mode | `nonstop` | — | — | — | Pairs with wired-up |
| Arm "ship before stop" gate | `wired-up` | — | — | — | Pairs with nonstop |
| Decide cloud vs local execution | `route` | — | — | — | cc-loop vs Routines |
| Compress conversational output | `caveman` | — | — | — | Drops articles, filler |
| Compress generated code | `pulse` | — | — | — | No restate-comments, dense functions |
| Apply Karpathy LLM rules | `karpathy-guidelines` | — | — | — | Surgical changes, simplicity first |
| Browser automation (full session) | — | — | general-purpose | playwright OR auto-browser OR browser-use OR chrome-devtools | **4 browser MCPs is too many — pick one default** |
| Lighthouse / perf audit | — | — | — | chrome-devtools | `lighthouse_audit` |
| Figma design read | — | — | — | claude_ai_Figma | URL parsing built in |
| GitHub issue/PR ops | — | — | — | github | Native gh CLI also works |
| Gmail / Drive / Calendar | — | — | — | claude_ai_Gmail / Gdrive / Gcal | OAuth-gated |
| Library docs lookup | — | — | — | context7 | Beats web search for API/SDK docs |

## Browser MCP precedence (currently undefined → fix)
Recommend: **chrome-devtools** for inspection/perf, **playwright** for testing, **auto-browser** for sensitive supervised flows, **browser-use** retired or scoped to remote/cloud only.

## Skill collisions to resolve
1. `design` vs `huashu-design` — `design` for English/Western mockups, `huashu-design` only when user explicitly asks for 花叔/Chinese-style hi-fi
2. `design` vs `ui-styling` vs `ui-ux-pro-max` — `design` = HTML/CSS mockup output, `ui-styling` = React+shadcn implementation, `ui-ux-pro-max` = lookup library (use AS data source, not as output skill)
3. `nonstop` vs `wired-up` — both mutate Stop behavior, document the layering: arm `wired-up` first (gate ship), then `nonstop` (no question-end)

## Agents to add (current: 1, target: 8+)
- `research-scout` — long-form web research with citation rigor
- `codebase-archaeologist` — git-history-aware investigation
- `design-critic` — pulls in `ui-ux-pro-max` rules + `karpathy-guidelines` for design review
- `deploy-runner` — Vercel/build/alias/promote chain
- `dependency-warden` — `npm outdated`, `knip`, security advisories
- `memory-curator` — walks ~/.claude memory, dedupes, expires
- `skill-router` — meta-agent that maps user intent to this graph
- `pr-builder` — gh pr create with template, body, reviewers
