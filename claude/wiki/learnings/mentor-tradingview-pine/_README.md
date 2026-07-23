# TradingView Open-Source Pine — Wild Strategy-Rule Corpus

- **Kind:** Source-vein brain (multi-author open-source script corpus), not a single-person mentor.
  Sibling to `mentor-aligrithm/` and `quant-methodology-canon/` in the mega-brain convention, but the
  source is TradingView's public open-source script pool reached through the pine-facade frontend
  endpoint — thousands of authors, likes-ranked, rules extracted verbatim from `strategy.entry/exit()`
  calls and input defaults.
- **Docs:** `_README.md` + `_manifest.json` + `pine-harvest-2026-07-15-distilled.md` = 3 files.
- **Source:** `~/code/projects/mym-autotrader/research/pine/2026-07-15/` (RULES.md + INDEX.json +
  25 raw `.pine` sources). Vein mechanics: `[[reference-tradingview-pine-crack]]` (auto-memory).

## D-WEB — read before using ANYTHING here

Everything in this brain is **web-sourced (D-WEB)**: ideas in, nothing else. Every rule must be
**locally rebuilt** from the distilled pseudocode (never ported by trusting the script) and run
through the honest-fill engine + dual-error gauntlet (`mym-autotrader/engine/`), kill-by-default,
before it touches any money path. **No TradingView equity curve is ever evidence** — TV's backtester
is instant-fill fantasy (`process_orders_on_close`, intrabar favorable fills,
`request.security(..., lookahead_on)` repaint), the same artifact class that manufactured the
falsified in-house +$430k corpus (`[[project-mym-p2-recert-deflated-corpus]]`).
`agreeCount` (likes) = popularity / robustness-of-spec proxy only, **never** an edge proxy.

## When to consult

- Designing or reviewing an **ORB / session-breakout / MR-gate** test — check what the wild consensus
  spec looks like before inventing parameters (canonical windows, thresholds, target ladders).
- Hunting for **selectivity gates** on a validated base (retest counts, volume surge, bias gates,
  ADX-falling, ADF regime, thrust-percentile) — the harvest is gate-rich by design.
- Needing an independent **spec confirmation** (e.g. RSI2 5/95 cross-out; 09:30–09:45 NY OR window).
- Extending the vein: the discovery mechanics (endpoint, `pubscripts-suggest-json`, access flags)
  are documented in the distilled doc — 733 open-source candidates surfaced in the first pass, only
  25 curated; the vein is far from exhausted.

## When to SKIP

- Looking for validated edges — nothing here is validated; the dig-queue cards + gauntlet own that.
- Anything about fills, costs, or performance — discarded at harvest by doctrine.
- Protected/invite-only scripts (access 2/3) — source withheld; do not scrape; open-source only.

## Recall

- `rg -n "<term>" ~/.claude/wiki/learnings/mentor-tradingview-pine/`
- Dig-queue cards (the actionable form): `mym-autotrader/vault/07-opportunity-pipeline/pine-facade-harvest-2026-07-15.md`
- Machine fuel: `mym-autotrader/data/research_corpus/repos-tradingview/tradingview-pine-2026-07-15.json`
