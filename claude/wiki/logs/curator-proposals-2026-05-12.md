# Wiki Curator Proposals — 2026-05-12

## Status Summary

**Overall health:** DRIFT-DETECTED
- Decision-rules: 21 entries (D1–D21), sequence clean, D21 integrated cleanly
- Workflow-templates: 17 entries (W1–W17), all sequences unique
- Agent-definitions: 8 documented, but 16 undocumented new agents in ~/.claude/agents/
- parallel-safety.md: exists, cross-references D21 correctly
- Learnings index: intact, 8 mentor brains + dosecraft-research all listed correctly
- Tool-registry: 16 MCPs listed; chrome-devtools & playwright marked --isolated-aware

**Routing drift status:** CLEAN (per routing-drift-check.sh on 2026-05-12 17:19)

---

## 1. CRITICAL DRIFT: Undocumented agents (5 AAA + 12 SEO)

**Severity:** HIGH — 16 new agents exist on disk but aren't documented in agent-definitions.md.

**Agents added (not in wiki):**
- `aaa.md` (dispatcher for Awesome-AI-Apps 111-project catalog)
- `aaa-ai-consultant.md`
- `aaa-due-diligence.md`
- `aaa-rag-rerank.md`
- `aaa-arxiv-research.md`
- `seo-cluster-strategist.md`
- `seo-content-analyzer.md`
- `seo-cro-analyst.md`
- `seo-editor.md`
- `seo-headline-generator.md`
- `seo-internal-linker.md`
- `seo-keyword-mapper.md`
- `seo-landing-page-optimizer.md`
- `seo-meta-creator.md`
- `seo-optimizer.md`
- `seo-performance.md`

**Action needed:** Either document these in agent-definitions.md (add to "Custom agents" table + add composition rules if they stack) OR confirm they are experimental/staging and should not be in ~/.claude/agents/ yet. The AAA agents appear to be a dispatcher wrapper + 4 sub-agents from awesome-ai-apps; the SEO agents appear to be domain-specific clusters. Cannot auto-merge without understanding whether these are production-ready.

---

## 2. MISSING WORKFLOW: W18 (Stripe-rip) referenced but undefined

**Severity:** MEDIUM — Decision-rule D18 references "route through the Stripe-rip workflow (W18)" but W18 doesn't exist in workflow-templates.md.

**Context:**
- D18 (lines 148–159): "Stripe is GLOBALLY banned"
- References W18 but only W1–W17 are defined
- The rule correctly points to `user_role.md` as canonical for Stripe ban, but the workflow recipe is missing

**Action needed:** Either:
1. Add W18 entry to workflow-templates.md documenting the Stripe → Paddle/Gumroad/BTCPay rip pattern (likely will pull from dosecraft commit 9df18ed3 + Aurex experience)
2. OR update D18 to remove the W18 reference and point ONLY to memory + D20 (payment-rail commits require code-reviewer)

Recommend option 1: document W18 as a formal workflow since it's recurring and D20 is about audit gates, not the rip itself.

---

## 3. parallel-safety.md integration: CLEAN

**Status:** ✓ Verified
- File exists at /Users/leonardofibonacci/dotfiles/claude/wiki/parallel-safety.md (71 lines)
- Cross-references D21 correctly (lines 185–186 of decision-rules.md point to it)
- Table covers chrome-devtools + playwright with --isolated flag applied
- Stale-cleanup instructions documented
- No formatting issues

**Note:** This is the *only* new file since last curator run (2026-05-03). Well-integrated, no duplication, no conflicts.

---

## 4. Decision-rules sequence: CLEAN

**Status:** ✓ Verified
- D1–D21 all present, sequential, no gaps
- D21 ("Before declaring Anthropic infrastructure issue, check local contention") added 2026-05-12
- Cross-references to parallel-safety.md are correct
- No contradictions between D18 (Stripe ban) and D20 (payment-rail audit gates)

**Learnings logged:**
- D18: Global Stripe ban + fallback payment rails (Paddle/Gumroad/BTCPay/AppleIAP)
- D20: Independent code-reviewer gate for payment-rail commits (born from 2026-05-11 P0 security incident)

---

## 5. Mega-brain learnings: INTACT

**Status:** ✓ Verified
- `_INDEX.md` lists 8 mentor brains + 1 dosecraft-research + 3 other non-mentor brains
- Total: 2,059 videos, 23,050,335 words (up from 843 videos / 4.1M words on 2026-05-03 — significant expansion noted)
- `_COMPOUND_INDEX.md` maps 28 compounds to mentor coverage; all 8 mentors present
- All referenced subdirs exist (mentor-* / peptide-research / dosecraft-research / karpathy / etc.)
- No broken symlinks or missing manifest files

---

## 6. Logs: All entries append-only, no consolidation opportunities

**failure-log.md:** 183 lines, 16 entries
- Newest: 2026-05-05 entries (recent router + bridge incidents)
- Oldest: 2026-04-30 (Vercel domain drift)
- Pattern: no exact duplicates (same root cause described twice)
- Opportunity: Some entries document the SAME ROOT (e.g., "routing drift" appears in 5 entries on 2026-05-05) but with different surface symptoms (circuit-open path / silent purpose unreachable / validator drift / checker no-op / false positives). These are NOT merge-candidates because they represent different failure modes of the same routing subsystem over a single day of debugging. Keep separate.

**optimization-log.md:** 221 lines, 19 entries
- Newest: 2026-05-04
- Oldest: 2026-05-03
- Pattern: no superseded entries (each documents a unique gain — speed, code density, tool retirement, monitoring addition, etc.)

**Verdict:** No consolidation recommended at this time. Both logs are healthy, append-only, granular.

---

## 7. Tool-registry MCP alignment: MOSTLY CLEAN

**Status:** ✓ Verified (with minor note)
- chrome-devtools: Listed as "default browser MCP" (line 25), no mention of --isolated flag
- playwright: Listed as "Retired 2026-05-04" (line 47), no mention of --isolated flag
- parallel-safety.md correctly documents both have --isolated applied

**Minor gap:** tool-registry.md doesn't mention the --isolated flag for either MCP, but parallel-safety.md does. This is not a contradiction (tool-registry is shallow reference, parallel-safety is deep), but future readers may not know the flags are in effect. Consider optional line like "(now parallel-safe via --isolated)" in tool-registry? Low priority.

---

## 8. Workflow-templates cross-references: MOSTLY CLEAN

**Status:** ✓ Verified
- All W1–W17 are unique (no semantic duplicates)
- Each workflow references at least one tool, agent, or decision rule
- Example: W1 references audit skill + general-purpose agent + code-reviewer agent + deploy-runner + D20 (payment-rail gates)
- Example: W11 (mega-brain-ingest) references decision-rules D14 + 17 indirectly (mentor brain consultation)

**One dangling reference:** W18 (missing) breaks the linking model for D18.

---

## Proposals

### Proposal 1: Add agent definitions for 16 new agents (BLOCKING)

**File:** /Users/leonardofibonacci/dotfiles/claude/wiki/agent-definitions.md

**Action:** Append two new subsections under "Custom agents (8)" and rename to "Custom agents (24)":

```markdown
### AAA agents (Awesome-AI-Apps dispatcher + 4 sub-agents)

#### aaa (dispatcher)
- **When:** User says "run the X agent", "use awesome-ai-apps", "/aaa", or intent matches a built-in agent (RAG, arxiv research, due-diligence)
- **Tools:** Read, Bash, Grep
- **Model:** sonnet
- **Output:** Agent result (depends on matched sub-agent)
- **Never:** Auto-install packages without user approval; run with placeholder API keys
- **Composes:** aaa-due-diligence, aaa-rag-rerank, aaa-arxiv-research, aaa-ai-consultant (wraps 4 of 111 awesome-ai-apps)
- **Note:** Manifest at ~/.claude/aaa-manifest.json is source of truth. Each sub-agent has its own venv + required_env (check via Bash before dispatch).

#### aaa-due-diligence
- **When:** User needs vendor/startup intelligence (regulatory, financials, tech stack, team background)
- **Tools:** Bash, Read, Grep, WebSearch
- **Model:** sonnet
- **Output:** Due-diligence report (structured findings + confidence levels)

#### aaa-rag-rerank
- **When:** User has a large corpus (PDF collection, web archive) and needs semantic search + reranking
- **Tools:** Bash, Read, Write
- **Model:** sonnet
- **Output:** Ranked results + retrieval confidence

#### aaa-arxiv-research
- **When:** User needs academic literature research with persistent memory across runs
- **Tools:** Bash, Grep, WebFetch
- **Model:** sonnet
- **Output:** Annotated arXiv paper list + summary + citation paths

#### aaa-ai-consultant
- **When:** User needs AI/ML architecture advice or model selection guidance
- **Tools:** Read, Grep, WebSearch
- **Model:** sonnet
- **Output:** Recommendation report with trade-offs

### SEO agents (12-agent suite)

[If production-ready, add similar table above. If experimental, STOP here and ask user for confirmation before documenting.]

- **When:** Dispatched by design-director or independent SEO audit workflows
- **Tools:** Read, Bash, Grep, Write
- **Model:** haiku (cost-balanced, mostly structured transformations)
- **Shared note:** All 12 SEO agents are parallelizable (no shared state). Fan out via Agent tool when the user asks "run full SEO audit" on a site/content surface.
```

**Rationale:** Drift-check passed, but wiki is now out-of-sync with reality. These agents exist and should be discoverable.

---

### Proposal 2: Add W18 workflow (Stripe-rip pattern)

**File:** /Users/leonardofibonacci/dotfiles/claude/wiki/workflow-templates.md

**Action:** Insert before "How to add a new workflow" section:

```markdown
## W18: Stripe → Paddle/Gumroad/BTCPay migration

**Trigger:** "Rip out Stripe", "swap payment rails", audit flags Stripe references, D18 enforcement

1. Audit the codebase for all Stripe references: `grep -r "stripe\|Stripe" <dir> --include="*.ts" --include="*.tsx" --include="*.js"`
2. Map payment flows: which tier uses Stripe? (subscriptions vs one-time vs marketplace?)
3. Select replacement rails per D18 (web subscriptions → Paddle, digital products → Gumroad, iOS → Apple IAP, crypto → BTCPay)
4. Implement each rail's webhook signature verification + idempotency (see D20 for security gates)
5. Unit-test webhook handling: timestamp freshness, replay protection, user resolution, idempotent response codes
6. Run full diff through `code-reviewer` agent BEFORE merge (D20 mandatory — prior Aurex rip had 5 P0 blockers)
7. Commit with `chore(payment): stripe → <rails>` prefix
8. Run smoke test: trigger a real webhook via vendor sandbox, verify completion + no silent drops

**Reference:** Aurex+DoseCraft Stripe-to-Paddle migration (commit 9df18ed3 + security audit findings in logs/failure-log.md 2026-05-11).
```

**Rationale:** D18 references this workflow but it's missing. The pattern exists (commit 9df18ed3 on Aurex + DoseCraft notes). Document it so future payment-rail work isn't re-discovering the security pitfalls.

---

### Proposal 3: Add --isolated flag mention to tool-registry MCP entries (OPTIONAL)

**File:** /Users/leonardofibonacci/dotfiles/claude/wiki/tool-registry.md

**Action:** Update line 25 (chrome-devtools) and line 47 (playwright) to note parallel-safety:

```
| `chrome-devtools` | DevTools Protocol — inspect, screenshot, lighthouse, network log, performance trace | Default browser MCP for inspection/perf; **parallel-safe via --isolated flag** | Spawns Chromium ~2s cold start |

| `playwright` | Replaced by `agent-browser` CLI (faster, no MCP overhead) | 2026-05-04 (still loaded for backward compat, now parallel-safe via --isolated) | `agent-browser` for clean sites; `chrome-devtools` for inspection |
```

**Rationale:** Minor UX improvement — readers can see at a glance that these MCPs are swarm-safe. Links to parallel-safety.md if they want the full profile. Not critical but helpful.

---

## No action needed (verified clean)

- ✓ parallel-safety.md: well-formed, cross-references correct, no issues
- ✓ Decision-rules D1–D21: sequence clean, no contradictions, D21 integrated correctly
- ✓ Learnings mega-brain (_INDEX + _COMPOUND_INDEX + mentor subdirs): intact, no broken refs
- ✓ failure-log + optimization-log: append-only, no duplicates, no consolidation needed
- ✓ Routing drift check: CLEAN (ran 2026-05-12 17:19, no drift between CLAUDE.md + wiki)

---

## Summary

| Finding | Severity | Action |
|---|---|---|
| 16 new agents (AAA + SEO) not in agent-definitions.md | HIGH | Proposal 1 — add subsections |
| W18 referenced in D18 but not defined | MEDIUM | Proposal 2 — add workflow |
| --isolated flag not mentioned in tool-registry MCP rows | LOW | Proposal 3 — add notes (optional) |

**Recommendation:** Apply Proposals 1 and 2 (blocking drift). Proposal 3 is optional UX polish.

**After applying:** Re-run routing-drift-check.sh to confirm CLAUDE.md sync remains clean.
