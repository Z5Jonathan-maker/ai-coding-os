# PROPRIETARY-SYSTEM-DOCTRINE.md

This is the durable synthesis from the May 2026 system bundle:
three-tier router notes, 95% token-reduction doctrine, Claude/Codex
desktop workflows, autonomous-loop prompts, mega-cycle system, historical
global-config audits, and credential migration notes.

## Non-negotiables

1. **Quality floor before compression.** A shorter prompt, config, memory,
   or output only ships if behavior is equal or better. Compression without
   an eval is just a smaller guess.
2. **Routing before reasoning.** Classify first. Use the smallest competent
   lane. Escalate on failure. Do not fan out to multiple models unless the
   task is explicitly parallel and each output has a use.
3. **Browser/UI routes to Kimi.** Screenshots, click flows, website audits,
   responsive checks, and visual inspection are `design/kimi` by default.
4. **Architecture/high-stakes routes to Codex/Claude.** System design,
   security, payment, compliance, irreversible refactors, and final QA stay
   on the precision lane.
5. **Bulk transforms route cheap.** Summaries, extraction, JSON cleanup,
   classification, dedupe, and compression belong to DeepSeek/cheap unless
   they become high-stakes.
6. **Long-term memory is sacred.** Do not delete or compress durable memory
   without a backup, rationale, index update, and rollback path.
7. **Every self-modification has proof.** Any change to router rules,
   operating docs, memory, or global config needs a metric or smoke test.
8. **No silent skips.** Every filter/drop/ignore path in stateful scripts
   should have a named reason counter or explicit log.
9. **Persist incrementally.** Scripts that mutate queues, trackers, state
   files, or external resources save after each successful mutation.
10. **Verify before writing truth fields.** Do not write a URL, file path,
    deploy SHA, credential status, or generated asset reference until the
    resource exists.

## Interface Standard

The coding cockpit is a reproducible surface, not a hand-tuned app:

- VS Code User config, tasks, keybindings, MCP config, and extensions live
  under `~/dotfiles/vscode`.
- Claude/Codex runtime mirrors are symlinked from dotfiles.
- `install.sh` must converge the system on a fresh profile.
- `cc-health-weekly` is the recurring proof that the interface still matches
  source of truth.
- Shell startup must be silent in non-tty and `TERM=dumb` contexts.

## Router Standard

The router is only developer-tier when both docs and tests agree.

- `cc-router-smoke` owns deterministic dry-run examples.
- Weekly health runs the smoke test.
- Browser/UI misroutes are bugs, not subjective calls.
- Quota balancing is a backstop. If quota constantly overrides routing, fix
  classification, not the quota.
- Hard-floor tasks may force the expensive lane, but they still obey output
  discipline.

## Autonomous Loop Standard

Autonomy compounds only when depth increases:

- Each cycle should be at least as deep as the previous comparable cycle:
  surface fix → diagnostic+fix → root-cause → structural refactor →
  system audit → foundation rebuild.
- Recurring soft failures override rotation.
- A null result is valid when it proves a suspected issue is absent.
- Two repeated no-progress cycles require a strategy change.
- Every shipped cycle records: what shipped, what broke, what surprised.

## Token Discipline

Use fewer tokens by changing protocol, not by dropping signal.

- Reference paths/IDs/hashes by default. Inline only hot data under roughly
  200 tokens that the next step will actually use.
- Emit deltas, not state dumps.
- Distill tool results before carrying them forward.
- Cache or compute deterministic answers before asking a model.
- Report measured compression separately from memory growth and doctrine
  growth.

## Credential Standard

- Keychain-first.
- 1Password only as explicit fallback via `CC_ALLOW_1PASSWORD_FALLBACK=1`.
- No ambient API-key loading in normal shell startup.
- No PATs or raw secrets in Codex/Claude config files.
- TEL remains the correct path for credentialed third-party actions.

## External Gateway Standard

Free-tier aggregators are research candidates, not core infrastructure until
they pass a security and ToS review.

- Self-host only.
- Never expose a free-tier proxy publicly.
- Store upstream keys in Keychain/TEL or an encrypted local store.
- Treat free-tier intelligence as volatile; never route hard-floor work there.
- Require health, rate-limit, fallback, and sticky-session telemetry before
  connecting it to VS Code, Claude, Codex, or autonomous loops.

## Adopted In This Pass

- `zsh` startup is now silent in automation contexts.
- `fnm` startup failures degrade silently.
- power-mode no longer conflicts with zsh aliases or prints function bodies.
- Browser/screenshot prompts now route to `design/kimi`.
- `cc-router-smoke` verifies expected platform decisions.
- Weekly health checks router smoke, VS Code, command registry, retired
  references, broken symlinks, retired LaunchAgents, npm globals, and shell
  startup silence.

## Follow-Up Queue

1. Build a broader router eval set with 25-50 prompts and expected classes.
2. Convert old global-config audit items into a closed checklist and mark
   resolved/unresolved with evidence.
3. Add skip-reason counters to stateful cleanup/update scripts that silently
   ignore files or commands.
4. Decide whether `cc-ask` remains a supported direct router wrapper or
   becomes a compatibility shim around `router-ask`.
5. Archive historical generated audits outside active search while preserving
   distilled lessons.
6. Vet FreeLLMAPI/FreeLLM-style gateways in an isolated repo before any core
   routing integration.
