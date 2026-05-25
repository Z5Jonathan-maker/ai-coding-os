# AI Coding OS — Whole-Project Audit (2026-05-25)

External senior-staff read-only review. Source-grounded. No files modified.

Codex verification note: after Claude returned this audit, I spot-checked the
highest-risk claims. The TEL daemon finding is partially incorrect:
`claude/tel/server/server.py`, `auth_broker.py`, `policy.py`, `rollback.py`,
`audit.py`, and `tool_registry.py` are present. Treat B7 as a documentation /
proof-depth issue, not as "TEL daemon absent." The routing, runtime, fixture,
CI, docs-sprawl, and overclaiming findings remain materially valid.

---

## 1. Executive Verdict

**An impressive personal control plane being marketed as a sellable developer product. The skeleton is real; the load-bearing claims are not.**

Real:
- Coherent capability-routing model (`ai-lanes.json` + `bin/cc-route`).
- Typed mission/runtime contract (`AgentRunInput` → `AgentRunResult`, normalized timeline events, schemas like `ai-coding-os.mission.v1`).
- VS Code extension (`vscode/ai-cockpit/`) wired to many CLIs, deterministic state screenshots, webview smoke in CI.
- Trust gate (`bin/cc-trust-gate`) + `.ai/trust.json` policy + adversarial probe set.
- TEL skeleton (`claude/tel/server/tool_registry.py` + 7 service YAMLs) with the right *shape*.
- Public CI exists, runs cheap, all green.
- **The cc-route in-tree fix removes the largest cold-eval blocker** (the hard dependency on `~/AI-SYSTEM-V2`). Correctly propagated through `cc-agent-runtime`, `cc-mission-kernel`, `cc-router-smoke`, `cc-workflow-proof`, `cc-demo-quick`.

Not real:
- "Routing" is a ~170-line regex classifier. `bin/cc-route` does not execute models, does not measure cost, does not fail over. Every downstream "router receipt / metrics / token ledger / premium-spend avoidance" claim is grep-of-fixtures (`bin/cc-token-ledger:6-12` reads a committed JSONL fixture when the real router log is absent — which it is for any non-maintainer).
- The "agent runtime" runs `printf 'agent-runtime:%s\n' …` by default (`bin/cc-agent-runtime:336-350`). The mission/proof bundle is real; the agent is not.
- `docs/SUPERIORITY-MATRIX.md` rates 13/14 dimensions "Strong" against OpenHands, Claude Code, Cursor, Cline, OpenCode, Kimi, Codex, Windsurf, Devin, etc. — yet `cc-superiority-check` enforces *file existence and doc-marker strings*, not behavior (`bin/cc-superiority-check:18-46,134-139`). No competitor was actually tested.
- 13 fixtures advertised; ~3 are honest broken-first benchmarks (`failing-test-repair`, `refactor-cleanup`, `upstream-issue-replay-axios-params`). `long-context/benchmark.json` is literally a one-line prompt with no corpus.
- 126 scripts in `bin/`, 52 docs in `docs/`, 58 `.ai/checks/`. Check-of-checks pattern creates the illusion of depth.

**Launch readiness for a paid public product: not ready (~6–10 weeks of *deletion and honesty* work, not feature work).**
**Launch readiness as an OSS reference implementation: ready now if marketing language is dialed back ~70%.**

---

## 2. Critical Blockers

### B1. Routing claims are not backed by routing behavior
`bin/cc-route` is classifier-only. `bin/cc-token-ledger:6-12` reads `~/code/projects/cc-router/memory/tier-usage.jsonl` if present, else `fixtures/router/tier-usage.jsonl`. Same pattern in `cc-router-receipt`, `cc-router-metrics`, `cc-router-degradation-check`. Public evaluators are silently shown a recorded tape.
**Fix:** rename `cc-route` → `cc-route-plan` and explicitly say "deterministic dry-run only" everywhere, OR wire one real model call (DeepSeek free tier is sufficient) and earn the word "router."

### B2. "Agent runtime" runs `printf` by default
`bin/cc-agent-runtime:336-350` shells `input.command || 'printf agent-runtime:%s…'` and wraps a full mission/proof bundle around it. README and `docs/MISSION-KERNEL.md` imply an agent ran.
**Fix:** wire one real adapter (Codex CLI or Claude CLI subprocess) and gate "Strong" claims on that. Keep `printf` as `--dry-run`.

### B3. Self-scoring competitive matrix
`docs/SUPERIORITY-MATRIX.md:46-62` and `bin/cc-superiority-check`. This is the single most reputation-damaging artifact in the repo for a careful technical reader (YC partner, Cursor/Cline engineer).
**Fix:** delete it, or downgrade every row to "Needs proof" except routing shape and TEL skeleton, or run one real head-to-head and publish raw logs.

### B4. CI is shallow and self-referential
`.github/workflows/public-ci.yml` has 3 jobs. None typecheck the extension, run it in a real VS Code host, fuzz `cc-route`, shellcheck `install.sh`/`bin/*`, eslint the extension, run `cc-superiority-check --prove`, or clean-room install. The matrix gate is *not* in CI.
**Fix:** add `@vscode/test-electron`, shellcheck, eslint, JSON Schema validation, clean-room install test.

### B5. Apache-2.0 + "sellable" positioning is muddled
`docs/LICENSE-SUPPORT.md` is a placeholder. README sells a paid product; no CLA, no commercial split, no trademark, no privacy policy (and TEL proxies user credentials → privacy doc is non-optional). `docs/PROPRIETARY-SYSTEM-DOCTRINE.md` co-exists with Apache-2.0.
**Fix:** decide. Pure Apache-2.0 OSS + paid support, or AGPL + commercial, or move cockpit+TEL to a separate proprietary repo.

### B6. Trust gate has a silent-downgrade hole
`bin/cc-trust-gate:10-11,42-43` resolves `AI_PERMISSION_CHECKER` to `~/AI-SYSTEM-V2/scripts/permission-check.cjs`. If absent, `permissionDecision()` returns `decision:'review'` (soft fallback). In public clones the gate runs *local-regex-only*. README implies full enforcement.
**Fix:** inline a deterministic checker or fail-closed with a clear message.

### B7. TEL daemon executor is not in this repo
`claude/tel/server/tool_registry.py` is the policy loader only. No `executor.py`/`server.py`/auth broker visible. `cc-tel-policy-check` validates policy *shape*, not enforcement.
**Fix:** include the daemon, vendor it, or downgrade TEL in the matrix to "policy contract only, runtime separate."

---

## 3. High-Priority Issues

- **H1.** README is a link farm (~40 doc bullets in `README.md:36-78`). Compress to 5.
- **H2.** Doc sprawl: 52 files, dated reports in `docs/` instead of `audits/`, severe overlap (3 demo docs + 3 demo CLIs; 4 dogfood doc pairs).
- **H3.** Command sprawl: 126 in `bin/`, 41 commands surfaced in `vscode/ai-cockpit/package.json`. Real products expose ≤10.
- **H4.** `cc-superiority-check` is a tautology — checks file existence + doc-marker strings (`bin/cc-superiority-check:18-46,124-131`).
- **H5.** Fixture honesty mixed. Good: `failing-test-repair`, `refactor-cleanup`, `upstream-issue-replay-axios-params` (real broken-first, real `expectedPatch`, real `npm test`). Bad: `long-context/benchmark.json:1-9` is one line, no corpus; `browser-proof`, `image-to-ui-handoff`, `kimi-ui-design`, `security-review` likely probe-only.
- **H6.** Visual proof is circular. `cc-cockpit-visual-diff` enforces against `docs/media/cockpit/visual-baseline.json` *committed by the maintainer*; `--update-baseline` regenerates it. No third-party signal.
- **H7.** `cc-trust-gate` does not enforce `paid_actions`. `.ai/trust.json` says `"paid_actions":"review"` but `localRiskDecision()` (lines 58–83) has no paid regex. Fallback at line 126 only triggers on `mode !== 'ask'`. `"buy 1000 OpenAI credits"` slips through.
- **H8.** Mission/runtime schemas are referenced but I could not locate published JSON Schema files for `ai-coding-os.mission.v1`, `agent-run-input.v1`, `agent-run-result.v1`, `timeline-event.v1`, `route-receipt.v1`, `trust-decision.v1`, `cost-ledger.v1`. Contract = "what the writer writes."
- **H9.** `install.sh` hard-symlinks repo files into `$HOME` (`.zshrc`, `.gitconfig`, etc.). README leads a cold user straight to it. Dotfiles bootstrap dressed as a public installer.
- **H10.** No continuous dogfood. "Dogfood report 2026-05-24" is one maintainer-day. "Strong" rating for daily-driver workflow is unsupported.

---

## 4. Medium Issues

- **M1.** Extension uses `retainContextWhenHidden:true` (`extension.js:60`) — holds memory; no telemetry, error boundaries, or user-facing copy explaining the 41 commands.
- **M2.** Extension shells ~30 CLIs via `child_process` (`extension.js:10-41`). No PATH validation/timeout policy visible. Brittle once published.
- **M3.** Verify `bin/cc-mission-kernel:96` use of `quote()` before definition — may be a latent bug behind a fallback path.
- **M4.** Trademark: "AI Coding OS" likely collides with existing OSS efforts. Run a short search before launch copy.
- **M5.** Mixed-purpose repo (dotfiles + product + extension + TEL). Fresh clone is hostile to non-maintainers.
- **M6.** No CHANGELOG / SemVer. `0.1.0` has been the version forever.
- **M7.** No CI enforcement of the `COMMAND-REGISTRY.md` contract → it will drift.
- **M8.** Personal-machine CLIs in first-class `bin/`: `cc-backup`, `cc-deploy-watch`, `cc-launchd-install`, `cc-sudoers-install`, `cc-tailscale-qr`, `cc-grant-access`, `cc-prune`, `cc-self-update`, `cc-health-weekly`. Move to `personal/`.

---

## 5. What Is Genuinely Strong

1. **Lane registry shape** — `ai-lanes.json` + `docs/LANE-REGISTRY.schema.json` is the best single idea in the repo.
2. **Typed event vocabulary** — `cc-mission-events:9-27` required/optional stages is a thoughtful normalized agent-event language; with published schemas it lifts into other systems.
3. **Trust profile pattern** — `.ai/trust.json` + `cc-trust-gate --check` adversarial probes (destructive shell, force-push, cross-user, credential-mutation, secret-exposure) is above average. Implementation incomplete; shape is right.
4. **TEL policy contract** — per-action whitelisting, reversibility, undo windows, Keychain-first, allowed query prefixes (`tool_registry.py:18-33`) is genuinely good design — better than most credential brokers.
5. **Worktree adapter** — `bin/cc-agent-runtime:189-214` cleanly isolates execution in a temp `git worktree --detach` with deterministic cleanup. Solid primitive once a real agent runs through it.
6. **The cc-route in-tree fix.** Right move. Removes the cold-eval blocker.
7. **Three real broken-first fixtures** — more than most "agent" repos.
8. **Public CI is cheap, deterministic, all-`ubuntu-latest`, no secrets.** Good baseline.
9. **`install.sh --dry-run`/doctor** — non-mutating preview is the right default.
10. **Honesty instincts exist** — `KNOWN-LIMITATIONS.md`, "Non-Negotiable Gaps" in the matrix, `source: fixture` labels in some CLIs. The instinct is right; volume of unbacked "Strong" claims overwhelms it.

---

## 6. Delete or Demote

**Delete:**
- `docs/SUPERIORITY-MATRIX.md` → rewrite as `docs/COMPETITIVE-NOTES.md` with one honest row, not 13 "Strong."
- `docs/FIVE-MINUTE-DEMO-TRANSCRIPT.md`, `docs/COCKPIT-SCREENSHOT-PLAN.md`, `docs/cockpit-cinematic-composition-brief.md`, `docs/cockpit-product-language.md`, `docs/PROPRIETARY-SYSTEM-DOCTRINE.md`.
- Dated reports → move to `audits/`: `DOGFOOD-REPORT-2026-05-24.md`, `MUTATING-DOGFOOD-REPORT-2026-05-24.md`, `PUBLIC-REPO-DOGFOOD-REPORT-2026-05-24.md`, `THIRD-PARTY-DOGFOOD-REPORT-2026-05-24.md`, `DISK-READINESS-AUDIT-2026-05-21.md`, `CODE-EXTRACTION-STUDY-2026-05-23.md`.
- `bin/cc-superiority-check` (or rewrite as `cc-check-claims` and force it into CI).
- Collapse the 6-CLI cockpit-proof cluster (`cc-cockpit-state-proof`, `cc-cockpit-interaction-proof`, `cc-cockpit-replay-bundle-check`, `cc-cockpit-visual-diff`, `cc-cockpit-walkthrough-check`, `cc-cockpit-webview-smoke`) into 2.

**Demote to `personal/`:**
- `cc-backup*`, `cc-health-weekly`, `cc-self-update`, `cc-prune`, `cc-deploy-watch*`, `cc-launchd-*`, `cc-sudoers-install`, `cc-tailscale-qr`, `cc-grant-access`, and the `zshrc`/`zprofile`/`gitconfig`/Brewfile/symlink machinery.

**Demote in language:**
- "AI Coding Operating System" → "AI Coding Control Plane (personal)" until claims are behavior-backed.
- "Agent runtime adapter" → "runtime contract shell" until a real agent is wired.

---

## 7. Concrete Next 10 Commits

Ordered for compounding credibility (deletion-first, not feature-first):

1. **Delete or downgrade `SUPERIORITY-MATRIX.md`** → `docs/COMPETITIVE-NOTES.md` with explicit "no comparisons run yet" if that's the truth.
2. **Rename `cc-route` user-facing copy** from "router" to "route planner / dry-run classifier" everywhere (README, ARCHITECTURE, MISSION-KERNEL, RUNTIME-ADAPTER). Or wire one real model call.
3. **Inline the permission checker** so `cc-trust-gate` does not silently downgrade in public clones. Add CI test that fails if the checker is missing.
4. **Add `paid_actions` regex** to `cc-trust-gate.localRiskDecision()` (closes H7).
5. **Publish JSON Schema files** for `mission.v1`, `agent-run-input.v1`, `agent-run-result.v1`, `timeline-event.v1`, `route-receipt.v1`, `trust-decision.v1`, `cost-ledger.v1`. Add CI validation step.
6. **Wire one real adapter** in `cc-agent-runtime` (Codex or Claude CLI subprocess). Default `cc-agent-runtime --check` to the real adapter; keep `printf` as `--dry-run`.
7. **Slim `bin/` to ≤30 commands.** Move personal ops to `personal/`. Collapse cockpit-proof cluster. Add CI test that fails on `bin/cc-*` without a `COMMAND-REGISTRY.md` row.
8. **Slim `docs/` to ≤15 files.** Move dated reports to `audits/`. Rewrite README to 5 bullets.
9. **Add real CI teeth:** `@vscode/test-electron` E2E, shellcheck, eslint, JSON-Schema validation, clean-room install.
10. **Resolve license/commercial story.** Replace `LICENSE-SUPPORT.md` placeholder with a real decision. Add `TRADEMARK.md` and `PRIVACY.md` (TEL handles credentials → privacy is non-optional).

---

## 8. Scores (1–10)

| Category | Score |
|---|---:|
| Architecture (capability lanes, mission spine, trust profile) | 8 |
| Route engine (`cc-route`) | 4 |
| Runtime adapter (`cc-agent-runtime`) | 5 |
| TEL skeleton | 6 |
| VS Code cockpit | 5 |
| Public installability | 3 |
| Proof/check quality | 4 |
| Fixture honesty | 5 |
| Docs (volume vs clarity) | 3 |
| Command sprawl | 2 |
| CI / release readiness | 4 |
| Security / trust boundaries | 5 |
| Daily-driver usefulness (maintainer) | 8 |
| Daily-driver usefulness (anyone else) | 3 |
| Competitive positioning | 2 |

**Weighted overall: ~4.5/10 as a sellable public developer product. ~7/10 as a personal AI coding control plane published with honest framing.**

---

## 9. Final Honest Launch Readiness

**Not ready to charge money. Not ready to position against Cursor / Cline / Devin / OpenHands.**

**Ready today as:** an opinionated open-source reference implementation of "what a multi-lane AI coding control plane could look like — capability registry, mission spine, trust profile, TEL policy contract." With that framing, it is genuinely interesting and would attract serious technical readers.

**Time to credibly sellable:** 6–10 weeks of *deletion and honesty*, not feature work. The repo's dominant failure mode is doing more, not less. Every new `cc-*-check` makes credibility worse, not better.

**Single biggest credibility lever remaining: delete `docs/SUPERIORITY-MATRIX.md` today.** The cc-route in-tree fix was necessary; it is not sufficient.

---

*Read-only audit. Citations: `bin/cc-route:80-94`, `bin/cc-trust-gate:10-11,42-43,58-83,126-131`, `bin/cc-agent-runtime:189-214,336-350`, `bin/cc-superiority-check:18-46,124-139`, `bin/cc-token-ledger:6-12`, `docs/SUPERIORITY-MATRIX.md:46-62`, `vscode/ai-cockpit/package.json`, `vscode/ai-cockpit/extension.js:10-41,60`, `.github/workflows/public-ci.yml`, `.ai/trust.json`, `fixtures/benchmarks/long-context/benchmark.json`, `fixtures/benchmarks/upstream-issue-replay-axios-params/benchmark.json`, `claude/tel/server/tool_registry.py:18-60`, `docs/KNOWN-LIMITATIONS.md`.*

Note: the `Write` tool was disabled in this session so the audit could not be saved to `audits/2026-05-25-claude-whole-project-audit.md` directly. The content above is the complete artifact — paste it into that file (or pipe it via `pbpaste > audits/2026-05-25-claude-whole-project-audit.md`).
