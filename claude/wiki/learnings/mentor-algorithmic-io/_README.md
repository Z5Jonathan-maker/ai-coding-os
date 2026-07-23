# Algorithmic.io — Quant-Validation Methodology Brain (ES Range-Level-Fade Desk)

- **Kind:** Quant-trading methodology mentor (sibling to `mentor-aligrithm/` — same mega-brain
  convention, different solo desk, single-source corpus).
- **Docs:** `_README.md` + `_manifest.json` + `validation-corpus-digest.md` = 3 files.
- **Source posts digested:** 17 of 28 published blog posts (all methodology + signal + legitimacy
  posts; the remaining ~11 are marketing/positioning — scanned, low-yield, not deep-fetched).
- **Source:** `algorithmic.io/blog`, mined via WebFetch (no bot-blocking, no auth, no archive.org
  needed). Full raw dossier: `~/code/projects/mym-autotrader/forensics/research-mine/algorithmic-io-blog/dossier.md`.
- **Mined:** 2026-07-12, as part of the 5-source research-mine wave (see
  `~/code/projects/mym-autotrader/forensics/research-mine/SYNTHESIS.md` for the cross-source ranking
  that put this source at DEEP-MINE-YES, the only one of five to earn it alongside the academic
  sweep — see `../quant-methodology-canon/`).

## Who/what this is

**Algorithmic.io** is a one-person, anonymous-founder futures-indicator shop selling a three-tool
TradingView suite (Midnight Grid / Quantum Vision / Turning Points) for ES/NQ/YM index futures. Its
blog is the unusual part: instead of hype, it publishes a genuinely rigorous quantitative-validation
corpus around a single strategy family — fading "first-visit" interactions with 14 range-derived
structural levels, backtested on **6.3M one-minute ES bars, Jan 2008 -> Mar 2026, 89,774-143,538
qualifying signals across 4,721 sessions.** The validation stack (16-point data-integrity checklist,
Bonferroni, 3-flavor walk-forward, Monte Carlo, session-level bootstrap + ADF/ACF, subsample dual
dropout, ML-vs-base-rate negative control, MAE-at-resolution, cost/slippage-survival, DD-management
formulas, year-by-year decay audit, per-level ablation) is a close cousin to MYM's own gauntlet.

**Legitimacy verdict (carried from the dossier): REAL research desk, 0 hard scam markers, 2 soft**
(no dollar-income claims, mild "Quantum Vision" branding but they *published that ML did not help* —
the opposite of black-box hype). The **signal-construction math is fully gated** behind the paid
product; **the validation methodology is 100% free**. Mine it for method, never trust it for edge —
anonymous author, self-reported/un-audited backtest, one near-tautological Monte Carlo claim (flagged
in the digest), and a 52%->63% post-2018 win-rate regime shift that inflates their "OOS beats IS"
headline.

## When to consult this brain

- **Auditing MYM's own DoF/confidence-interval discipline for intra-session trade clustering** —
  the session-level (cluster) bootstrap finding (★ #1 below) is the single highest-value item: it
  quantifies a **1.4x standard-error widening** from treating correlated intraday trades as
  independent samples. Cross-check against MYM's own effective-N / 8-category DoF ledger.
- **Confirming or extending the bar-END/bar-START (boundary-instant) look-ahead bug class** — their
  MAE-measurement bug (★ #2) is an independently-discovered instance of the exact bug class fixed in
  MYM tonight (2026-07-12), inflating MAE ~9x by measuring across the full observation window instead
  of clipping to entry->resolution. Pairs with the Zhang decision-timing-leakage paper in
  `../quant-methodology-canon/canon-formulas.md`.
- **Adding an inverse-of-data-mining sanity gate** — the ML-can't-beat-base-rate negative control
  (★ #3): RF/XGBoost on 9 features scored 72.39%/72.31% against a 72.4% unconditional base rate. If
  boosted trees on the full feature set can't beat the naive rate, the edge is structural, not a
  hidden metadata filter. Cheap, honest, complements DSR/PBO from the opposite direction.
- **Cost-model / prop-firm DD-sizing sanity checks** — liftable MES cost constants (0.848pt/$4.24
  RT) + "survives 2x slippage" stress gate, and DD-sizing formulas (daily budget =
  trailing_DD/eval_days x 0.5; size = trailing_DD/longest_streak) to cross-check against
  `vault/01-prop-firms/` and `scripts/challenge_sizing.py`.
- **What NOT to mine further** — their *signals* (the 14 Midnight-Grid levels, buy/sell-zone
  formulas, first-visit trigger mechanics) are paywalled and unnecessary: the family overlaps MYM's
  already-validated QF-fade lane, so there's nothing to gain by reconstructing it. The ~11 un-fetched
  marketing posts are low-yield (spot-checked, same tone, nothing new). Their Monte-Carlo permutation
  test as described is near-tautological (label-shuffle preserves aggregate win rate) — do not copy
  its design; MYM's count-matched placebo-first (D-MT) is the correct version of what they were
  reaching for.

## Recall pattern

```bash
# Keyword grep across this brain
rg -i 'PATTERN' ~/.claude/wiki/learnings/mentor-algorithmic-io/

# Or against the full raw dossier in the source repo
rg -i 'PATTERN' ~/code/projects/mym-autotrader/forensics/research-mine/algorithmic-io-blog/dossier.md
```

**Mempalace semantic ingestion: not yet run.** `mempalace` was not a live tool in the session that
built this brain (deferred-only, per the routing table's 3-layer MCP delivery note). Point a live
mempalace connection at this directory in a future session to enable semantic recall; until then,
`rg` keyword search is the reliable path — same status as `mentor-aligrithm/`.

## Provenance

Built from the `algorithmic-io-blog` dossier inside the founder-authorized research-mine wave (see
`~/code/projects/mym-autotrader/forensics/research-mine/SYNTHESIS.md` header and the standing
`FOUNDER-AUTHORIZATION.md` precedent already carried by `mentor-aligrithm/_README.md`). Actions
taken to build this brain: reading already-written dossier/synthesis markdown, writing new markdown
under `~/.claude/wiki/learnings/`. Zero new network activity, zero code/config/credential changes,
zero money-path contact.

**D-WEB applies to everything in this brain**: every mechanic, formula, and candidate here is
ideas-only. Nothing touches the money path without a local rebuild and the full gauntlet (CSCV/PBO,
DoF counting, parameter-stability, walk-forward, count-matched placebo, kill-by-default) — same as
`mentor-aligrithm/` and every other external source.
