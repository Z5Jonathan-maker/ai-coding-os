---
name: feedback-defer-to-trading-instinct
description: "Jonathan's hands-on trade-management instincts repeatedly beat the default backtest models — implement his exact spec, validate, don't substitute your own simplification"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

On the mym-autotrader / US30 quarter-figure work, Jonathan's discretionary ideas have beaten the default/simplified models **five times** (2026-06-14/15):

-1. **Directional ping-pong** — symmetric quiet-hours range-fade was −EV (PF 0.84); his refinement "only fade WITH the bias, never counter-trend" flipped it to PF 1.65, 75% win, 0 negative years (cutting counter-trend fades removed the loss source). Validated as a small supplementary quiet-hours lane (STRATEGY.md §13).

0. **Minors hold like majors** — he insisted the 125 halfway QFs carry the same weight as the 250/500 "large" ones. Reaction study confirmed (all tiers ~100pt avg, identical), and re-running VWAP-dir on the full 125-grid was a strict improvement (174→231/yr, PF 2.02→2.23, DD $6.1k→$2.9k, 1→0 neg years). The 250-only filter was leaving ~33% of the edge unused.

1. **Re-entry only after a winning scalp** — I coded "re-enter on any re-tap" (lost −$18k); his rule "re-enter only when we made money" turned it to +$14k. The win/loss filter was the entire edge.
2. **TP 250 not 125** — his instinct (let it run to the next QF) held the same win rate with double the R:R.
3. **Half-out, runner keeps the −50 stop + stack to TP2** — I "improved" it by moving the runner to breakeven; his exact spec (keep runner exposed, stack fresh units on each return-to-entry until TP2) scored higher (+0.84R/day vs +0.81) with lower drawdown.

**Why:** he has real screen-time scalping US30 (CFD, high-leverage small-account scaling). His management captures microstructure the naive backtest defaults miss.

**How to apply:** when he describes a trade-management rule, implement it EXACTLY as stated — do not substitute a "cleaner" version (BE stops, caps, gates he didn't ask for). Backtest his exact spec, report honestly (including fat-tail caveats like stacking risk), then let him decide. Validate, don't second-guess. See [[project-mym-live-config]] and mym-autotrader/docs/ai-memory/STRATEGY.md §12 + decisions.md.
