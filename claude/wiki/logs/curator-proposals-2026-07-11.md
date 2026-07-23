# Wiki Curator Proposals — 2026-07-11

Post-campaign maintenance pass on `~/.claude/wiki/` following extensive mym-autotrader H20→H58 development cycle.

## Structure check

- 6/6 expected files present: ✓
  - tool-registry.md: 109 lines
  - agent-definitions.md: 148 lines
  - workflow-templates.md: 276 lines
  - decision-rules.md: 188 lines
  - logs/failure-log.md: 194 lines
  - logs/optimization-log.md: 436 lines

## Key findings

### 1. Routing drift: cc-health retirement contradiction

**Issue:** tool-registry.md line 83 still lists `cc-health` as an active monitoring tool, but CLAUDE.md (line 133) claims it "was retired in the 2026-05-19 cleanup." However, optimization-log.md entries dated 2026-05-20+ reference `cc-health-weekly` as operational.

**Severity:** Medium — documentation contradiction creates confusion about which monitoring tool is canonical.

**Affected files:**
- `/Users/leonardofibonacci/.claude/wiki/tool-registry.md:83` — references cc-health in health-monitoring section
- `/Users/leonardofibonacci/.claude/CLAUDE.md:133` — claims retirement in 2026-05-19 cleanup
- `/Users/leonardofibonacci/.claude/wiki/logs/optimization-log.md:328` — references cc-health-weekly as active (2026-05-20 entry)

**Proposal:** Resolve the contradiction by determining the actual status:
- If cc-health is ACTUALLY retired → update tool-registry.md line 83 to remove reference and redirect to AI-SYSTEM-V2
- If cc-health is STILL ACTIVE → update CLAUDE.md line 133 to mark it as current, not retired
- Flag the discrepancy to the user for authoritative judgment

---

### 2. Orphan skills: 8 Clerk-related unrouted skills

**Issue:** routing-drift-check.sh found 8 skills on disk but not routed in CLAUDE.md:
- clerk-backend-api
- clerk-cli
- clerk-custom-ui
- clerk-nextjs-patterns
- clerk-orgs
- clerk-setup
- clerk-testing
- clerk-webhooks

**Severity:** Low — these are likely project-context skills (ClaimPilot or similar) that don't need global routing.

**Location:** `~/.claude/skills/clerk-*` (mostly symlinked to `~/.agents/skills/`)

**Proposal:** Clarify ownership:
- If Clerk skills are ClaimPilot-specific (project-scoped), add a note to CLAUDE.md under the MCP section explaining project-scoped skills are exempt from drift checks
- If these should be globally routed, add rows to CLAUDE.md SKILL ROUTING TABLE with appropriate trigger conditions
- Recommend: mark as "project-scoped" and update routing-drift-check.sh allowlist

---

### 3. No failure-log/optimization-log duplicates found

**Status:** Clean ✓

Log entries are unique by root cause (failure-log) and by optimization (optimization-log). No near-identical entries that should be merged.

---

### 4. No strategy reversals in logs

**Status:** Clean ✓

Searched for references to strategies known to be killed (RangePlay, overnight scalp, absorption, noise-band momentum) — found zero mentions in either log. No earlier entries celebrating these strategies that need to be marked as superseded.

**Note:** The trading campaign entries (2026-07-09+) focus on validation methodology (placebo testing, strategy verification) rather than celebrating specific killed strategies.

---

### 5. Cross-reference gap: workflow-templates.md doesn't reference trading doctrine

**Issue:** workflow-templates.md has no cross-references to:
- `cost-tiering` doctrine (D-CT in mym-autotrader)
- `beta-controls-in-phase-1` patterns
- `deployable-quantum` (D-DQ) — live in mym-autotrader/docs/ai-memory/gauntlet

**Severity:** Low — these are project-specific patterns, not global workflows yet.

**Proposal:** Add a new workflow W19 documenting the trading-research gauntlet pattern, OR add a "Cross-project references" section to workflow-templates.md noting that mym-autotrader's `vault/15-architecture-decisions` and `vault/08-decision-register` + `docs/ai-memory/decisions.md` define the cost-tiering and quality gates for trading work. This surfaces the pattern for future campaigns without duplicating the docs.

---

### 6. Tool registry outdated MCP status

**Issue:** tool-registry.md doesn't reflect latest MCP additions from CLAUDE.md:
- Missing: `tradingview` MCP (web-CDP, user-scoped stdio)
- Missing: `bybit` MCP (official bybit-official-trading-server, 243 tools)
- Missing: `crosstrade` MCP (mentioned in memory as live)
- Stale reference: `camofox-browser` marked as optional/archived but not marked with "Status: archived"
- Stale reference: `octogent` mentioned as archived but no entry in tool-registry

**Severity:** Medium — docs don't match current tool availability.

**Affected files:**
- `/Users/leonardofibonacci/.claude/wiki/tool-registry.md` — MCPs section (lines 22-36)

**Proposal:** Update tool-registry.md MCPs section to add:
```
| `tradingview` | Read/control live TradingView chart (state, indicators, Pine, OHLCV, draw) | TradingView WEB CDP automation | user-scoped stdio; targets Chrome; Desktop v3 is CDP-sealed |
| `bybit` | Bybit market data + account + trading (243 tools) | Crypto market data / live trading | Official bybit-official-trading-server; keyless=data only; API key unlocks account; testnet mode available |
| `crosstrade` | Deploy strategies to live NT8 account via CrossTrade | Writing NT8 deployments to live account | Internal CLI, money-code hard rules apply |
```

And update camofox entry to mark as "Status: Archived — restore only if Kimi WebBridge + clean sites fail."

---

### 7. decision-rules.md content is current

**Status:** Clean ✓

Checked D13 (TEL) — current status matches ("daemon live; Keychain-first").
Checked D14 (mentor brains) — references are accurate.
No trading-related decision rules from the recent campaign contradict existing rules.

---

### 8. Logs growth: optimization-log.md nearly 2x failure-log.md

**Observation (not a problem):** 436 lines vs 194 lines.

This reflects the H20→H58 campaign having MORE optimizations logged than failures, which is healthy. The trading strategy validation cycle generated many incremental wins (Academy lessons, University updates, testing methodology improvements) with few regressions.

---

## Summary of proposals

| Proposal | Severity | Action |
|----------|----------|--------|
| Resolve cc-health retirement status | Medium | Update CLAUDE.md OR tool-registry.md; ask user to clarify |
| Classify Clerk skills as project-scoped | Low | Add note to CLAUDE.md; update drift-check allowlist |
| Add trading doctrine cross-reference (W19) | Low | Add new workflow template linking to mym-autotrader decisions |
| Add missing MCPs to tool-registry | Medium | Add tradingview, bybit, crosstrade; mark camofox as archived |
| (No action needed) Deduplicate logs | N/A | No duplicates found |
| (No action needed) Flag reversals | N/A | No reversal entries found |

---

## Operational notes

- All 6 wiki files have load-bearing content — no unused sections
- Failure-log and optimization-log are append-only, no entries deleted ✓
- Routing drift caught 8 orphans; all low-severity (project-scoped)
- No decision-rule contradictions with current trading campaign outcomes
- Wiki is ready for continued use; no blocking issues

