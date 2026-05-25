# Full-Stack Ruthless Audit — AI Coding OS — 2026-05-25

Scope: whole repo audit of `/Users/leonardofibonacci/dotfiles` at `446f6c4`.
Mode: local evidence first, then routed second-pass critique through precision,
design, and cheap lanes.

## Executive Verdict

**Keep. Do not trash. But stop calling it “10/10” until the public execution
path and competitive proof catch up.**

This is now a real personal AI coding control plane and a credible open-source
reference architecture. It is not yet a fully credible sellable public developer
product next to Cursor/Cline/OpenHands because a stranger still cannot exercise
the strongest claims without your private/live stack and provider sessions.

The core is strong:

- in-tree route planner: `bin/cc-route`
- live design handoff pipeline: `bin/cc-design-handoff`
- worktree-capable runtime adapter: `bin/cc-agent-runtime`
- VS Code cockpit with Creative Mode state rendering
- TEL code and policies under `claude/tel/`
- Kimi official WebBridge connected on this machine
- green product, public CI, and AI gates

The launch risk is also real:

- public router is still a dry-run classifier, not a live executor
- `cc-product-readiness` still depends on local `~/code/projects/cc-router`
- competitive benchmark is `artifact_contract_only`
- repo surface is too large: 128 `bin/` scripts, 82 top-level docs markdown
  files under `docs/`, 225 markdown files repo-wide
- many proof commands validate contracts/fixtures more than real daily use

## Scores

| Category | Score | Notes |
|---|---:|---|
| Personal daily-driver system | 83/100 | Your machine has Codex, Claude, Kimi, DeepSeek, WebBridge, router, cockpit, and TEL paths alive. |
| Open-source reference project | 74/100 | Interesting architecture, clear wedge, Apache repo, green public CI. Needs simplification. |
| Sellable public developer product | 58/100 | Strong concept, incomplete stranger-run path, no real competitor artifacts yet. |
| Cursor/Cline/OpenHands-level execution maturity | 43/100 | Those tools are battle-tested for code execution loops. This is still wedge-first orchestration. |
| Taste-driven frontend handoff potential | 86/100 | This is the most differentiated part. Keep pushing this, not generic “AI OS.” |

Overall keep/trash rating: **KEEP — 72/100 today**, with a clear path to 85+
if the next work is deletion, proof, and one killer demo rather than more gates.

## Verification Run

All core automated checks passed:

- `bin/cc-product-readiness`: `15/15`, `Status: product-ready`
- `bin/cc-public-ci-check`: `24/24`
- `bin/cc-ai-checks`: `59/59`, `Status: ai-checks-ready`
- `npm audit --omit=dev --audit-level=moderate` in cockpit: `0 vulnerabilities`
- `bin/cc-competitive-benchmark check`: `competitive-benchmark-ready`
- `bin/cc-design-handoff --check`: `design-handoff-check-ready`
- `bin/cc-agent-runtime --check`: `agent-runtime-ready`
- `bin/cc-kimi-status`: Kimi Desktop installed, CLI installed, WebBridge
  `running=true`, `extension_connected=true`, `mode=official-extension`

These gates prove local health and contract consistency. They do **not** yet
prove market superiority or public buyer value.

## What Is Real Now

### 1. The project has a coherent wedge

README now says the real thing:

```text
describe outcome -> approve visual reference -> extract assets -> preserve
design DNA -> implement with UI/browser lane -> review taste/accessibility ->
prove integration -> record deploy proof
```

That is materially better than the old “AI Coding OS” sprawl. The strongest
product is not “Cursor replacement.” It is:

**taste-driven frontend handoff that preserves visual intent through production
implementation.**

### 2. The cockpit is no longer only a command launcher

Recent change `446f6c4` added real Creative Mode state rendering:

- reads `.ai/design-handoffs`
- renders current handoff title, summary, gate, progress
- renders stages and artifacts
- supports image preview URIs for generated visual artifacts
- renders recent mission events

This directly addresses the “visual window” gap.

### 3. The live-stage pipeline is partially real

`bin/cc-design-handoff` has live hooks:

- `creative_reference` can call `cc-image` with explicit `--image-api-ok`
- `asset_decomposition` can call `cc-image`
- `design_dna` can call `claude --print`
- `kimi_implementation` can call `router-ask --purpose design`
- `kimi_implementation --target-repo` can invoke `kimi`
- `claude_review` can call `claude --print`
- `codex_proof` runs local proof commands
- `tel_deploy --live-tel` verifies through TEL

This is no longer pure schema theater. But the public/default proof still often
uses offline fixtures and request packets for portability.

### 4. TEL is present

TEL is not just a 12-line trust JSON. It includes:

- `claude/tel/server/server.py`
- `auth_broker.py`
- `tool_registry.py`
- `policy.py`
- `rollback.py`
- `audit.py`
- service policies for GitHub, Vercel, Gmail, Gamma, Linear, Notion, Glif

Approximate TEL/policy footprint: **1221 LOC**.

### 5. Runtime isolation exists

`cc-agent-runtime` supports `local_process` and `worktree`. The worktree adapter
creates a detached git worktree, runs commands inside it, captures proof, and
cleans up. This is a legitimate primitive.

## Critical Blockers

### B1. Public execution path is still not strong enough

`bin/cc-route` is an in-tree deterministic route planner. It classifies and
prints receipts. It does not execute model calls, measure live cost, maintain
real provider circuits, or fail over live providers.

That is acceptable if positioned as a public dry-run planner. It is not
acceptable if the README implies the public clone contains the full router.

**Fix:** add one public live execution command that works from a clean clone
with one user-supplied key, or make the README say clearly:

> Public repo includes the route planner and mission shell. Live execution
> requires `router-ask`/provider CLIs.

### B2. Product readiness is maintainer-machine readiness

`bin/cc-product-readiness` checks:

- `node "$ROUTER/lib/check-integrity.cjs"`
- `"$ROUTER/bin/cc-router-classifier-check"`

where `ROUTER="${CC_ROUTER_ROOT:-$HOME/code/projects/cc-router}"`.

That means the 15/15 score is true on your machine, but it is not a pure public
repo readiness score. This is fine for your control plane. It is weak for a
public launch claim.

**Fix:** split:

- `cc-public-readiness` = clean-clone public product
- `cc-maintainer-readiness` = your full private stack

### B3. Competitive benchmark is not competitive yet

`cc-competitive-benchmark status` reports:

- `benchmark_status: artifact_contract_only`
- `ai-coding-os`: score 92, captured
- `v0`: pending external capture, no score
- `lovable`: pending external capture, no score
- `bolt`: pending external capture, no score

The check is contract-valid, but the benchmark does not yet prove the project
beats v0/Lovable/Bolt.

**Fix:** run the same prompt through v0, Lovable, and Bolt. Attach prompt,
screenshot/source/code export, and review JSON. Until then, all competitor
language must say “benchmark harness ready, competitor captures pending.”

### B4. The repo is still too noisy

Measured surface:

- 1186 tracked files
- 128 `bin/` commands
- 82 `docs/*.md`
- 225 markdown files repo-wide
- largest files: `cc-design-handoff` 1842 LOC, cockpit extension 1344 LOC,
  `cc-agent-runtime` 560 LOC

The project has good pieces, but it still feels bigger than the product.

**Fix:** create tiers:

- `bin/core/` or documented daily commands: max 12
- `bin/internal/`: checks and fixtures
- `bin/personal/`: backups, launchd, sudoers, tailscale, health-weekly
- docs reduced to README, QUICKSTART, ARCHITECTURE, WEDGE, COCKPIT, SECURITY,
  LIMITATIONS, CONTRIBUTING, RELEASE-NOTES, EVALUATOR-QUICKSTART

### B5. The cockpit UX still risks fragmentation

Kimi/design lane critique was specific:

- no inline diff/apply surface like Cursor
- stages/artifacts/events can become three histories instead of one feed
- Creative Mode can become a mode-switch tax
- route/permission state is partially hidden in drawers
- no explicit keyboard-first flow is documented
- context selection/@mention flow is still not central enough

**Fix:** unify Creative Mode into the normal mission stream:

- one timeline/feed
- inline artifacts
- inline approve/execute buttons
- visible route/permission chip
- keyboard-first `cmd+k`/command palette entry

### B6. Trust/security story is not buyer-grade yet

The shape is strong, but a public security reviewer will still ask:

- What is the TEL threat model?
- What exact actions can each service perform?
- How are undo tokens stored and expired?
- What logs are written?
- Which credential backend is supported in public clones?
- What happens when policy files are absent?

**Fix:** add `docs/THREAT-MODEL.md` and a TEL service/action matrix.

## High-Priority Issues

- **H1:** `vscode/AI-HQ.code-workspace` still references
  `${env:HOME}/AI-SYSTEM-V2` and `${env:HOME}/code/projects/cc-router`.
  Good for you, bad for public portability.
- **H2:** `cc-ask`, `deepseek`, `cc-provider-capacity`,
  `cc-router-receipt`, `cc-router-metrics`, `cc-token-ledger`, and others
  rely on `~/code/projects/cc-router` or fixtures. This is fine if labeled
  as private/full-stack mode.
- **H3:** `cc-context-snapshot` execs
  `$HOME/AI-SYSTEM-V2/scripts/project-context.sh`; public fallback is unclear.
- **H4:** `README.md` is now much better, but still too command-heavy before a
  user sees one visual result.
- **H5:** No single gold demo artifact exists in the repo: screenshot, URL,
  generated reference, generated asset kit, implementation diff, proof bundle.
- **H6:** Version is still `0.1.0` while the project is changing heavily.
- **H7:** Apache-2.0 is fine, but commercial/sellable positioning needs
  `TRADEMARK.md`, `PRIVACY.md`, and explicit “what is open vs private” text.
- **H8:** Massive `claude/wiki/learnings/` content appears in repo file counts
  and secret-grep scans. If this is public, it is distracting and may contain
  irrelevant domain corpus that weakens product clarity.

## What To Keep

Keep these as the actual product spine:

- `README.md` wedge framing
- `ai-lanes.json`
- `bin/cc-route`
- `bin/cc-design-handoff`
- `bin/cc-agent-runtime`
- `bin/cc-trust-gate`
- `claude/tel/`
- `vscode/ai-cockpit/`
- `.ai/checks/` only after pruning/renaming fixture checks honestly
- `fixtures/frontend-wedge/`
- `docs/TASTE-DRIVEN-FRONTEND-WEDGE.md`
- `docs/ARCHITECTURE.md`
- `docs/EVALUATOR-QUICKSTART.md`
- `docs/KNOWN-LIMITATIONS.md`

## What To Delete, Move, Or Demote

Move to `personal/` or remove from public product path:

- backup/self-update/prune/launchd/sudoers/tailscale/grant-access scripts
- old dogfood reports
- old release candidate docs
- overly broad “superiority” docs
- archived reference studies from active docs
- workflow docs that describe private `AI-SYSTEM-V2` as if it is public

Do **not** add another gate until this pruning is done. More gates now would
make the credibility problem worse.

## Missing Pieces Before Serious Public Launch

1. **One public live lane.** A clean-clone user can provide one key and execute
   one real routed task.
2. **One flagship demo.** Same brief -> Image reference -> assets -> Kimi
   implementation -> Claude review -> Codex proof -> deploy receipt.
3. **Real competitor capture.** v0/Lovable/Bolt same brief with artifacts.
4. **Public/maintainer split.** Separate clean-clone readiness from full-stack
   local readiness.
5. **Cockpit single-feed UX.** Merge stages/artifacts/events into one mission
   stream with inline actions.
6. **Threat model.** TEL and trust gates need security-grade documentation.
7. **Command diet.** Cut visible commands to a small core.
8. **Docs diet.** Reduce active docs to under ~12.

## 10-Commit Recovery Plan

1. Add `docs/PUBLIC-VS-MAINTAINER-MODE.md`.
2. Split `cc-product-readiness` into `cc-public-readiness` and
   `cc-maintainer-readiness`.
3. Create `docs/GOLDEN-DEMO.md` and one saved golden handoff artifact bundle.
4. Run and attach real v0 competitor artifact.
5. Run and attach real Lovable competitor artifact.
6. Run and attach real Bolt competitor artifact.
7. Add `docs/THREAT-MODEL.md` for TEL/trust.
8. Add `bin/README.md` with command tiers; move personal commands.
9. Replace or demote old superiority language with evidence-only claims.
10. Merge cockpit stages/artifacts/events into a single mission feed surface.

## Final Rating

This is **not trash**. It is also **not 10/10**.

The project is strongest as a **taste-driven frontend handoff control plane**
with a local-first cockpit and provider-specialized workflow. That part is
interesting enough to keep and develop seriously.

Current honest status:

- **Brilliant concept:** yes.
- **Average execution:** no, above average.
- **Public product-ready:** not yet.
- **Developer-respected if launched today:** only if framed honestly as a
  reference/control-plane project, not as a Cursor/OpenHands killer.
- **Worth continuing:** yes.

The next phase should be proof and simplification, not new architecture.

