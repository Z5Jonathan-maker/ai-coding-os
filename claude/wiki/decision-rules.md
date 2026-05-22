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
- **agent-browser** (CLI via Bash) = primary scripted browser automation as of 2026-05-04 (vercel-labs/agent-browser, native Rust). Replaces `playwright` MCP. Run `agent-browser skills get core --full` first to load workflow patterns. Use for: nav, click, type, screenshot, eval JS, snapshot (a11y), CDP connect, multi-session. No MCP — invoke directly. **Use for clean sites without bot detection.**
- **camofox-browser** (REST API on `:9377`) = stealth-tier when site has Cloudflare / Google / similar fingerprint detection. Camoufox = Firefox fork with C++-level spoofing of navigator, WebGL, AudioContext, WebRTC, screen geometry — patches happen in browser engine before JS sees them. Source: `~/code/research/camofox-browser/`. OpenAPI at `http://localhost:9377/openapi.json`. Routing rule: try agent-browser first; if you see "blocked" / Cloudflare challenge / 403, switch to camofox-browser. Cost: ~40MB idle RAM, lazy browser launch.
- **Kimi WebBridge** = sensitive flows (login, payment, account ops) using the user's real Chrome session
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

## D13: When to use TEL vs MCP vs direct Bash for credentialed actions

- **MCP** = default. The service has a working MCP, OAuth fresh, action is supported. (e.g. github MCP for issue ops, claude_ai_Figma for design reads.)
- **TEL** = use when:
  - Service has no MCP but has REST/SDK
  - MCP exists but is down + you have credentials in 1Password (TEL is the failover)
  - You want strict whitelisting on a credentialed service (per-action rate limits, audit log, undo tokens)
  - The action is mutating + you want forced approval gates documented in `policies/<service>.yaml`
- **Bash + `op read` inline** = read-only single-shot, throwaway, no need for whitelisting (e.g. `curl -H "Authorization: Bearer $(op read op://Personal/X/credential)" ...`)
- **NEVER** = ask the user to paste a credential into chat. The harness blocks transcript-based credential capture for good reason. Use the OAuth flow (`claude mcp` UI) or 1Password — that's it.

Invocation: `~/.claude/tel/client/tel-call.sh <service> <action> '<args-json>'`. Returns audit_id + optional undo_token. Credential never touches the transcript.

## D14: When to consult a mentor brain (`~/.claude/wiki/learnings/mentor-*/`)

Mentor brains are 4.1M words of curated peptide/TRT/biohacking transcripts from 8 named experts (843 videos). Consult them when:

- User asks "what does <name> say about X?" → recall from `mentor-<slug>/` directly
- User asks a peptide/TRT/biohacking compound question and wants experiential / clinical-voice grounding (not just papers) → check `_COMPOUND_INDEX.md`, route to top-coverage mentor for that compound
- Building Aurex copy that needs to feel grounded in practitioner consensus (without quoting them — copy stays compliant) → scan compound index for the strongest mentor on that compound
- Cross-referencing a mainstream pop-science claim → check `mentor-moreplatesmoredates` (skeptic) or `mentor-jay-campbell` (Huberman debunker)

**Don't consult mentor brains for:**
- Citation-grade claims for Aurex pages — use peer-reviewed `peptide-research` corpus instead (still TBD)
- Compliance-sensitive copy — mentor voices include human-use language Aurex must never repeat
- General software / non-domain questions

**Recall pattern:**
```bash
# semantic across all mined brains
mempalace --palace ~/mempalace search 'YOUR QUERY' | head -20
# direct grep into a single mentor
rg -i 'PATTERN' ~/.claude/wiki/learnings/mentor-bachmeyer/
# compound → mentor lookup
cat ~/.claude/wiki/learnings/_COMPOUND_INDEX.md | grep -i 'BPC-157'
```

Index is in `~/.claude/wiki/learnings/_INDEX.md`; per-mentor profiles + when-to-use in each `_README.md`.

## D15: Brain-grounding is a continuous sweep, not a one-time fix

When a "brain-grounded reauthoring" commit lands for one content surface (e.g. landing free-guides), drift persists in OTHER surfaces. Today's audit (2026-05-11) found dose drift surviving in: Coach RAG, Gumroad packs, library compound pages, blog posts, comparison pages, protocol cards, sales components, marketing copy.

**Rule:** When the user asks for a "brain-grounded sweep," dispatch parallel agents to every content surface simultaneously. Don't ship one surface and assume the others followed. Drift recurs because content surfaces are authored at different times by different paths and they all drift independently.

**Reference:** dosecraft commits 4cff79df (free-guides), 34ca0c4a (library+protocols+showcase), cd4858ca (Coach prompt), 60045123 (blog), d008287 (Gumroad packs in dosecraft-companion).

## D16: GSAP ScrollTrigger viewport gotcha — `start: "top 82%"` silently fails

If a GSAP element is already in viewport at first paint AND its ScrollTrigger uses `start: "top 82%"`, the trigger never fires. Elements stuck at `opacity:0`.

**Fix:** Use `start: "top bottom-=50"` with `toggleActions: "play none none none"`. Fires the moment ANY pixel approaches the viewport, plays once, stays.

**Production incident:** 2026-05-11 — `/pricing` page on dosecraftapp.com had NO TIER CARDS VISIBLE for unknown duration. Three buyable cards rendered with `opacity:0` because the scroll trigger never fired on page load. Founder lost conversions for the duration. Fixed in commit 60045123.

## D17: Protocol-context RAG filtering — compound chapter ≠ protocol chapter

Standalone compound chapters give baseline dose. Protocol chapters (ch.18 Top4, ch.20 Wolverine, ch.22 Longevity) give protocol-context dose, which can differ:
- MOTS-c chapter 07: 5–10 mg per WEEK TOTAL (baseline)
- MOTS-c chapter 22 longevity: 10–15 mg, 2–3×/week (longevity context warrants more)
- BPC-157 chapter 06: 500 mcg–1 mg daily (foundational)
- BPC-157 chapter 20 wolverine: 1 mg/day AT INJURY SITE (acute injury context)

**Rule:** When querying brain for a compound dose, ALSO filter by protocol context if the user is asking in-context. Implementation: `brain-query.py --protocol=<name>` (commit 118833f in dosecraft-companion) — provides 9 named protocol allowlists + dose-line regex extraction.

## D18: Stripe is GLOBALLY banned

Was previously: banned for peptide/RUO vendors only. Updated 2026-05-11 to: banned for the entire DoseCraft stack and any sibling brand the founder ships.

**Replacements:**
- Web subscriptions → Paddle (merchant of record)
- Digital products → Gumroad
- iOS subscriptions → Apple App Store IAP
- Crypto (where applicable) → BTCPay

If Stripe code is found in any project, route through the Stripe-rip workflow (W18). Memory `user_role.md` is the canonical source of this rule.

## D19: Premium-pharma-biotech 3D hero motifs must be wireframe-at-7%-opacity

Three compounding problems killed the original DoseCraft DNA helix as a screensaver: (1) vivid dual-color saturation, (2) solid sphere atoms, (3) perceptible rotation. Eliminate all three simultaneously: monochromatic teal/cyan, LineSegments wireframe at ≤7% opacity, rotation ≤0.06 rad/s.

**Rule:** For premium-pharma-biotech brands (DoseCraft, Aurex, future biotech ventures), default the central 3D hero motif to wireframe-at-7%-opacity. Vivid ball-and-stick is the wellness-app aesthetic, not the brand we're shipping.

**Reference:** commit 437782cf (GhostHelix replacement of MiniHelix). Memory `feedback_subtle_motifs_over_chunky.md`.

## D20: Payment-rail commits require code-reviewer pass before declaring done

The Stripe→Paddle rip shipped with 5 P0 security ship-blockers caught only by an independent code-review agent pass:
- Timing-unsafe signature comparison (timing-attack surface)
- Missing webhook timestamp freshness check (replay attack — free PRO forever)
- 200-on-unresolved-user webhook response (silent payment-event drops)
- `createCheckout` returning success URL instead of hosted checkout URL (users redirect straight to success without paying)
- `createPortal` URL fabrication with customer_id query param (auth bypass — anyone holding any customer ID could land on that customer's portal)

**Rule:** When ripping or migrating payment rails, ALWAYS route the diff through the `code-reviewer` agent BEFORE pushing. Don't trust the implementing agent's self-verification on security-critical code paths.

**Reference:** dosecraft commit 9df18ed3 (5 P0 patches landed after code-review). Pattern logged in `~/.claude/design/logs/winning-patterns.md` under "2026-05-11 · Payment-rail security audit pattern."

## D21: Before declaring "Anthropic infrastructure issue," check local contention

When parallel sub-agents die under heavy MCP usage (especially chrome-devtools, playwright, anything browser-wrapping), the first hypothesis should be **local lock/profile/port contention**, not an Anthropic harness bug. Symptom looks identical: tools hang, watchdog SIGKILLs the agent. Root cause is usually that every parallel sub-agent spawned its own MCP and they're fighting over a shared global resource (Chrome profile dir, fixed port, single backing file).

**Rule:** If a swarm dies and the surface symptom is "harness killed the agents," check `~/.claude/wiki/parallel-safety.md` BEFORE concluding it's an Anthropic issue. The fix is usually one flag (`--isolated`) or one env var (`MEMORY_FILE_PATH`), not a re-architecture.

**Reference:** 2026-05-12 incident — chrome-devtools profile contention killed a 6-parallel swarm in `claude-code-router`; the dying session called it "Anthropic infrastructure" and fell back to sequential. Real fix took 90 seconds.
