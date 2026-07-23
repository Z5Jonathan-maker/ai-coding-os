---
name: project-mym-proxy-vs-tradeable
description: "Audit of which mym-autotrader winners were measured on instruments Jonathan can't actually trade — 3 of 12 bricks are proxy-measured; the diversified book is clean"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-19T22:48:22.469Z
---

2026-07-19 audit (`vault/02-strategies/PROXY-VS-TRADEABLE-AUDIT-2026-07-19.md`) of all 12 brick streams in `engine/state/brick_streams/`:

- **8 genuinely futures-measured** — btc-mbt-rsi2, crabel-energy-grains-7root, gold-swing-daily, mes-orb5-closethrough, mnq-closethrough-stack, regime-book-combined, s12-mnq-fade, trend-pullback-ym, ym-double7s.
- **1 measured on the exact vessel it trades** — equity-rsi2-book (70-name ETF/equity panel; ETFs ARE the instrument, not a proxy).
- **3 proxy-measured:**
  - `gc-mgc-rsi2` — GLD PF 2.54 vs **GC futures 2.05** like-for-like (~19% overstatement); the *gated deployable* futures form is PF ~1.0-1.28 with **negative dollar P&L** (~50-60%, edge effectively gone).
  - `rsi2-dji-ym-swing` — DIA PF 2.28, but YM futures cross-check **2.28-2.45 → transfer CONFIRMED, ~0% gap**. Reconciled.
  - `us30-open-lane` — Dukascopy Dow-**cash CFD** tape, **no futures recompute exists anywhere**. The roster's one UNVERIFIED vessel. Also independently marginal (fails OOS placebo at every split).

**All 4 legs of the diversified book are clean of the proxy gap** — its Sharpe 1.41 / DSR@K50 0.93 / max|rho| 0.087 do not rest on a proxy.

Correction to a claim I made earlier: the "GC futures 1.39" figure is **HQ-23 rsi2_mr GC 30m**, a *different* gold-MR cell that is genuinely futures-measured (+$32,387, n=135). The real like-for-like GLD→GC number is 2.05.

**Bigger lesson than the proxy gap itself — vessel translation:** re-expressing a futures edge at a CFD/FX dealer can kill it outright. `mes-orb5-closethrough` earns only **1.5 bps of notional per trade**, so a 3 bps CFD spread makes it net-negative at any size; `trend-pullback-ym` holds 40 calendar days and financing eats **95%** of its gross edge. Both pinned by tests in `tests/test_leverage_sizing.py` so they can't be quietly revived.

Related: [[reference-where-verified-edge-lives]], [[project-mym-diversified-book-verdict]], [[reference-databento-continuous-metals-gotcha]], [[feedback-dashboards-stay-accurate]]
