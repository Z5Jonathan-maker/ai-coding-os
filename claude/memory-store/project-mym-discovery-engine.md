---
name: project-mym-discovery-engine
description: "The autonomous self-learning strategy-discovery gauntlet — BUILT v0 2026-07-14 at mym-autotrader/engine/. Acquire (crack-at-scale) + cumulative-K ledger + DUAL-ERROR gauntlet (kills false positives AND protects false negatives via a multi-execution matrix) + quarantine-not-delete graveyard + generator + 24/7 orchestration. Money-safe by construction (writes ONLY engine/state/, no path to live config, F5-only deploy). The false-negative-proof test PASSES: it would NOT have trashed the canonical RSI2 sleeve."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**BUILT v0 (2026-07-14, founder full-build directive): the 100X autonomous self-learning gauntlet at `mym-autotrader/engine/`.**
Package: contracts + acquire + ledger + gauntlet + graveyard + generator + orchestrate + run.py + tests. Loop: generate →
graveyard-dedup → DUAL-ERROR gauntlet → cumulative-K ledger → {GREEN: shadow_book / QUARANTINE|DEAD: graveyard} → resurrection
scan → ntfy. Reuses the honest-fill engines (h125/h151/h166) + backtest/phase1 deflation/placebo/OOS + the DSR.

**THE FALSE-NEGATIVE SPINE (the founder's core requirement — "don't accidentally trash strategies that would make us money"):**
every candidate runs a MULTI-EXECUTION MATRIX (entry: next_open/limit_below/close/stop_through × exit: on_signal/first_up_close/
time_stop/target) BEFORE any kill; DEAD-ROBUST only if it dies ACROSS the reasonable execution space; else QUARANTINE with a
machine-readable KILL_REASON + REOPEN_PREDICATE (NEW_DATA/NEW_REGIME/DELISTING_AWARE_UNIVERSE/NEW_EXECUTION/MORE_SAMPLE) →
resurrection queue re-tests when the predicate holds. **THE PROOF TEST PASSES**: canonical Connors-RSI2-on-ETFs → verdict GREEN
NOT DEAD-ROBUST (next_open/close LIVE, limit_below/first_up_close DIE, robustness 0.25) — the engine would NOT have trashed the
~5% edge we nearly lost in H165/H166. (Integration also CAUGHT a real false-negative bug: the generator↔gauntlet decision-shape
mismatch would have zero-filled every candidate → DEAD-ROBUST by construction; fixed with an adapter.)

**MONEY-SAFETY (structural, proven):** write surface = engine/state/{candidates,graveyard,k_ledger,shadow_book} + ntfy ONLY;
static `assert_no_forbidden_imports(engine/)==[]` proves NO import from service/connectors; a test asserts service/ + connectors/
+ engine/state/ are byte-identical (sha1) before/after a full cycle. NO code path to service/validated_whitelist.json — promotion
to live is FOUNDER-F5 ONLY, by hand outside the package. The engine discovers; it cannot deploy. Tests: engine 135 pass/1 skip;
repo 878 pass (1 pre-existing failure not ours); ruff clean; live smoke 12-candidate cycle → 7 GREEN ETF-rsi2 + 5 deferred, exit 0.

**v0 IS ETF-ONLY + HONEST GAPS (v1 queue):** (1) only the ETF-MR lane has a data loader — orb_momentum(MNQ/MES/MGC)/pairs are
DEFERRED-never-tested (biggest v1 lift = wire futures/pairs panels — Databento `.v.0`, but Databento is PAID = founder decision).
(2) DSR deflates at static K_BASELINE=13191 not the live cumulative-K the loop publishes (honest-forever-K not yet consumed).
(3) pre-registered KillCriterion ignored (gauntlet uses hardcoded legs). (4) NO promotion correlation cap → promoted 7 correlated
ETF sleeves (violates the decorrelated-book doctrine). (5) forward-test = queue only (no paper-fill runner / no decay-monitor
generating alarms). (6) engine.acquire content-puller BUILT+TESTED but NOT wired into the cycle + corpus-miner returns [] — NOW
FIXABLE: the ~2,900-article corpus is persisted durably at `data/research_corpus/` (3.18M words, gitignored). (7) SAFFRON defaults
permit ~5-7 promotions/cycle (tune).

**SWITCHES TO TURN ON (founder):** 3 launchd plists STAGED UNLOADED at engine/orchestrate/launchd/ (GENERATE Mon 03:00, GAUNTLET
nightly 02:00 +resurrect, MONITOR daily 17:30) — `launchctl load -w` to activate. Governor defaults 64 candidates/256 gauntlet-calls/
3600s per cycle. F5 boundary hard + unchanged. Realizes the [[project-mym-portfolio-reframe]] perpetual-engine architecture +
[[project-mym-mr-dig-queue]] as the generator's seed hypotheses. Corpus at data/research_corpus/ (from the API-crack playbook,
[[reference-storms-vagafx-recon]] technique). Related: [[feedback-backtest-measures-robot-not-trader]] (the passover is the human
escape hatch the engine defers to).