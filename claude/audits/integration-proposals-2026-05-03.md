# Integration audit proposals — 2026-05-03 (iter 17)

Staged 🟡 high-severity findings from the integration audit. **None auto-applied** per prompt rules — each requires user nod because they touch retirement decisions, capability tracking gaps, or operational state changes.

## P1 — MCP retirement decision deferred until iter 18+

**Finding (Check 12):** 8/14 MCPs unused in last 30 days. The mcp-usage-tracker window is biased by the current marathon session (504 chrome-devtools calls inflating the comparison). Need clean usage data over a normal week to make retirement decisions credible.

**Proposal:** Re-run `~/.claude/scripts/mcp-usage-tracker.sh 30` after 7 days of normal usage. Then retire the persistently-zero MCPs.

**Pre-staged retirement commands** (DO NOT RUN until usage signal confirmed):
```bash
# Likely safe to retire (no Aurex use case):
claude mcp remove claude_ai_Vibe_Prospecting

# Decide: re-auth via claude mcp UI OR retire
claude mcp remove claude_ai_Amplitude    # if not adopting product analytics
claude mcp remove claude_ai_Gamma         # if not pitching with cloud slides
```

**Why this is 🟡 not 🔴:** zero idle cost on connected-but-unused OAuth MCPs. Low urgency. Wrong decision is reversible (re-add via `claude mcp add`).

**User nod needed because:** retirement is destructive to OAuth state — re-auth requires another browser flow each time. Don't repeat that work for nothing.

---

## P2 — Built-in agent telemetry gap

**Finding (Surprising #3):** `mcp-usage-tracker` only counts `mcp__<server>__<tool>` calls. `skill-usage-tracker` only counts Skill invocations. The 5 built-in Claude Code agents (Explore, Plan, general-purpose, claude-code-guide, statusline-setup) have **zero usage telemetry**. We can't tell if Plan is invoked once a week or never; same for Explore.

**Proposal:** Extend `~/.claude/scripts/skill-usage-tracker.sh` (or create a sibling `agent-usage-tracker.sh`) to count `tool_use` entries with `name == "Agent"` and parse the `subagent_type` field from the input. Output mirrors the MCP usage report — surfaces dead built-in agents.

**Sketch:**
```bash
# add to or sibling skill-usage-tracker.sh:
jq -r '.message.content[]?
  | select(.type == "tool_use" and .name == "Agent")
  | .input.subagent_type // "general-purpose"' "$f" 2>/dev/null
```

**Why this is 🟡 not 🔴:** missing telemetry doesn't break anything; it limits future retirement/re-routing decisions for built-ins.

**User nod needed because:** new monitor = new launchd plist = new audit-dir output stream. Want to confirm before adding a 9th cron agent.

---

## P3 — `mcp-usage-tracker` window bias

**Finding (Check 12 sub-issue):** A single high-volume session can dominate the 30-day window. chrome-devtools 504 calls vs the others' 0 isn't a fair comparison when 503 of those calls happened today.

**Proposal:** Add a `--exclude-current-session` flag to `mcp-usage-tracker.sh` that drops the most-recent-modified jsonl from the count. OR shift to median-day usage instead of total-window usage.

**Why this is 🟡 not 🔴:** the bias only matters for retirement decisions, not for monitoring. The tracker still surfaces "loaded but unused" correctly — it just can't differentiate "rarely used over 30d" from "heavily used in 1 session."

**User nod needed because:** changing the metric mid-history makes iter-over-iter comparison harder. Worth committing to one definition.

---

## 🟢 Medium (logged only, no action proposed)

These are observation entries — included here for completeness, not for staging:

- **shadcn MCP** in tool-registry but not in `claude mcp list` — by design (project-level only, lives in `~/code/projects/aurex/.mcp.json`). Tool-registry already notes this. **No action.**
- **Snapshot hook count noise** — `~/.claude/hooks/` shows 16 vs `~/dotfiles/claude/hooks/` 17. Difference is the `state/` subdir presence + symlink resolution. Cosmetic. **No action.**
- **Built-in skills (init, review, security-review)** — Anthropic-provided, not in `~/.claude/skills/`. They appear in available-skills list but have no SKILL.md to audit. Out of scope for drift checker. **No action.**

---

## What user must decide before iter 18

1. **P1:** Wait 7 days for clean MCP usage signal? Or retire `claude_ai_Vibe_Prospecting` immediately (clearly no Aurex use case)?
2. **P2:** Add the agent-usage telemetry script + 9th launchd cron agent? Or skip — the gap is real but the workaround (manual jsonl grep) is acceptable?
3. **P3:** Change mcp-usage-tracker definition to exclude-current-session? Or accept the bias as a known caveat in the report header?
