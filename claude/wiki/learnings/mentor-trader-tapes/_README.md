# Trader-Tape Corpus — Verified/Public Trader-Decision Data (H50 vein)

**Kind:** forensic tape corpus (not a single mentor — a population of real trader tapes).
**Born:** 2026-07-15, from the first H50 trader-tape harvest for `mym-autotrader`.
**Raw data:** `~/code/projects/mym-autotrader/research/tapes/2026-07-15/` (33 records:
20 FXBlue per-trade tapes + 13 Darwinex broker-real summaries + harvest scripts in `_tools/`).
**Dig-queue cards:** `mym-autotrader/vault/07-opportunity-pipeline/trader-tape-mine-2026-07-15.md`
(tape-01 … tape-06, all D-WEB, all adjudicated by the random-relabel selection test).

## When to consult

- Before ANY new trader-tape / leaderboard / copy-trading harvest — the deflation anatomy and
  anti-pattern signatures here are the required priors (this vein's trap is the worst in the game:
  leaderboards are survivorship + multiple-testing machines).
- When calibrating what a REAL long-run retail survivor looks like (the Darwinex ceiling numbers).
- When building or extending tape-triage tooling (`engine/acquire/sources/traders.py` plan).
- When someone shows a track record: match it against the signatures in
  `tape-harvest-anatomy-2026-07-15.md` before believing anything.

## When to skip

- Strategy-mechanism research (that lives in the dig-queue cards + the engine, not here).
- Anything peptide/health — wrong brain.

## Docs

| Doc | What it holds |
|---|---|
| [tape-harvest-anatomy-2026-07-15.md](tape-harvest-anatomy-2026-07-15.md) | The durable knowledge from harvest #1: the FXBlue no-auth per-trade API, the Darwinex survivor ceiling, the high-WR/negative-net martingale signature, the deflation anatomy (seed bias, badge caveat, DD-on-balance artifact), the random-relabel selection-test protocol, and the blocked-lane map |

Companions: `scam-corpus/` (vendor anti-patterns), `quant-methodology-canon/` (DSR/deflation
source-of-truth), auto-memory `project-mym-trader-tape-harvest` (the vein's standing discipline).
