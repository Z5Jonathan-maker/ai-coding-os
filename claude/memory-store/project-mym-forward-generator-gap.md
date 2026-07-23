---
name: project-mym-forward-generator-gap
description: "The real bottleneck on forward-testing mym-autotrader winners — 10 of 13 bricks have no entry_fn implementing their certified rule, so they cannot be registered"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-19T22:48:40.723Z
---

2026-07-19. Jonathan asked to put every remaining winner on demo forward-testing and "let it fire as much as it possibly could." Attempting the batch registration exposed the actual blocker:

**Only 3 of 13 bricks could be registered. The other 10 have no `entry_fn` in `engine/generator/signals.py` that implements their certified rule.**

The trap: a near-miss generator is WORSE than none. Registering `orb_entry` for the close-through bricks would forward-test a *trade-through* breakout — a strawman that either fakes a win or fires a false retirement on a strategy that was never actually run. The agent correctly refused rather than registering approximations.

Blocked, with the reason each is not just a config away:
- `mes-orb5-closethrough` + `mnq-closethrough-stack` — brick is CLOSE-through + OR-body-direction + skip-doji (+ H96b prior-day trend-HI gate on MNQ); `orb_entry` is trade-through.
- `gold-swing-daily` — 40-day Donchian + Supertrend-flip exit.
- `s12-mnq-fade` + `us30-open-lane` — quarter-figure VWAP-dir fade, 3-unit ladder, MTF gate. No fade entry_fn exists at all.
- `trend-pullback-ym` — swing_lab fastMA/trendMA pullback + chandelier.
- `crabel-energy-grains-7root` — NR7-compression OCO stretch breakout, and it's a 7-root vol-parity PORTFOLIO, not a single-vessel sleeve.
- `equity-rsi2-book` — not an entry_fn problem: its 70-name yfinance panel vessel isn't in `FUTURES_VESSELS`/`ETF_VESSELS` (`ETF_BASKET` is a different 28-name universe).
- `regime-book-combined` — an aggregate router over 3 sleeves, not a registerable sleeve.

**Standing rule this established:** every new generator must PROVE fidelity by reproducing its brick's filed numbers, and where it can't, the honest divergence gets recorded as the forward rail rather than papered over. Precedent — `double7_mr` implements the published UNGATED rule while the certified cell is chop-GATED (PF 3.53), so its `backtest_expectancy_usd` rail was set to the reproduction it actually runs (**$1,148.02/trade, n=48, PF 1.95**) with a `fidelity_caveat`, NOT the gated $1,848.66. Holding forward fills to a number the rule cannot produce would fire a false retirement.

Related: [[feedback-forward-outweighs-backtest]], [[project-mym-forward-fidelity-verdict]], [[project-mym-fidelity-certificate-2026-07-16]], [[project-mym-proxy-vs-tradeable]]
