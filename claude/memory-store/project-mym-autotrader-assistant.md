---
name: project-mym-autotrader-assistant
description: "mym-autotrader is the home for \"Claude as trading assistant\" — onboarded repo + backtest harness + CI gates added 2026-06-07"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

`mym-autotrader` (GitHub `Z5Jonathan-maker/mym-autotrader`, local
`~/code/projects/mym-autotrader`) is Jonathan's automated MYM (Micro E-mini Dow /
US30) futures system: Pine v5 indicator → FastAPI `/webhook` → 6-stage validator
→ IDLE/SEEKING/IN_TRADE/STAND_DOWN state machine → Tradovate (demo/live) or
sim_local connector. Strategy = quarter-figure grid (125pt @ anchor 1000) +
multi-TF swing bias + 150-175pt stops + TP1/TP2 ladder, 09:00-12:00 ET session.
Companion dashboard is the separate `area61-command-core` Next.js repo.

**Why:** Jonathan wanted "Claude to live in TradingView like an assistant." The
desktop app is sealed ([[reference-tradingview-desktop-cdp-sealed]]), so the
assistant lives in THIS repo instead — it drives his TradingView strategy.

**How to apply:** Done 2026-06-07 — onboarded (CLAUDE.md/AGENTS.md with money +
safety hard rules, docs/ai-memory + .ai), added ruff (E9/F house gate) + mypy to
CI (fixed 4 real type bugs), built a `backtest/` harness that replays OHLC
through the live grid/bias/validator engines (CLI + report + 8 tests, 113 total
green). HARD RULES baked in: never weaken a safety rail, never default to live,
never commit creds. Next: feed real MYM1! intraday history to the backtest;
optional Pine↔config param-sync check; optional in-the-loop Claude validator
stage against sim. 2026-06-07 work was committed 2026-06-08 to branch `backtest-harness-and-ci` (pushed; open a PR to merge).

**2026-06-08 — wired into the brain.** Registered `tradingview` MCP (user scope,
stdio → `~/code/projects/tradingview-mcp-jackson/src/server.js`) — it drives
TradingView WEB in Chrome (desktop is CDP-sealed). connection.js was patched to
probe IPv4/IPv6 loopback with forced Host:localhost (Chrome 148 binds one and
404s other Host values); launch via `scripts/launch_tv_chrome_mac.sh`. Health
check verified (reads window.TradingViewApi). Added `/10-wf-trading` command +
`~/AI-HQ/workflow/trading.md` + routing rows in dotfiles CLAUDE.md (SKILL + MCP
tables). `bybit` MCP registered 2026-06-08 (user ran the command verbatim → classifier
cleared it; user scope, ✓ Connected, keyless = market data only). To add
account/trading: re-run `claude mcp add bybit -s user -e BYBIT_TESTNET=true -e
BYBIT_API_KEY=... -e BYBIT_API_SECRET=... -- npx -y bybit-official-trading-server@latest`. tradingview-mcp-jackson edits are uncommitted (it's a clone
of someone else's repo, not pushed). Dotfiles edits live via symlink but
unpushed — run /sync to persist.

**2026-06-09 — auto-trade path (Tradovate, demo-first). NOT cleared for live.**
The repo's `service/bias_engine`+`grid_engine`+`backtest/engine.py` are the OLD
drifted strategy (swing bias, entry AT the quarter, fixed 150-175 stops) — NOT
BCFX. Canonical BCFX now lives in `service/area61.py` (single source of truth:
contrarian entry at the rejecting candle's CLOSE, stop beyond QF/wick, target
next large quarter) — see [[reference-bcfx-strategy]]. New `backtest/area61_backtest.py`
replays the REAL rules with fill resolution on real 5-min bars.
**Backtest verdict (CORRECTED 2026-06-09): a real, robust edge under conservative
costs.** The initial "no edge" on 1h bars was a FILL-RESOLUTION ARTIFACT
(pessimistic stop-first on coarse 1h bars). With exits resolved on real 5-min
data the verdict flips. Authoritative run = `--duka` (free Dukascopy Dow 5-min,
instrument INSTRUMENT_IDX_AMERICA_E_D_J_IND, cached in data/duka/, via
`backtest/duka_data.py`): 3yr 2023-2026, 1,781 trades, 3x MYM, $1.50 commission:
0pt slip PF 1.96 (+$24.3/trade), 2pt PF 1.63, 4pt PF 1.37 (+$12.3) — edge
SURVIVES heavy slippage; grade filter validated (A+ PF 2.46 > A > C). maxDD
$1.2-3.9k on 3 micros. yfinance `--fine` (60d) agrees. NOTE: data is Dukascopy
CFD index not YM future; 5min≠tick; entry-at-close + stop-at-exact-price are
mildly optimistic → those residuals are what PAPER TRADING resolves. Caveat: still
over-fires (~1.6/day). NEXT: this is enough to justify funding → paper-trade on
Tradovate demo, then live 1 micro only on explicit go. ⚠️ a 34%-win/wide-target
strategy is NOT a 100x/week machine (that was leverage/variance); size responsibly. Tradovate connector
(`connectors/tradovate.py`) is fully built (auth/OSO bracket/WS fills, defaults
demo). User chose to enable Tradovate's paid ~$25/mo API Access (needed even for
demo) 2026-06-09. Setup: `SETUP-TRADOVATE.md` + `scripts/tradovate_smoke.py`
(verifies link, refuses live, no orders). config.yaml created + gitignored.
⚠️ 2026-06-09 user pasted a Tradovate password into chat → told to rotate it;
creds go in config.yaml only, never chat/memory. area61.py + backtest + smoke
test committed on `main` (NOT yet pushed)? — verify branch before relying.

**2026-06-16 — CRITICAL safety-rail bug found + fixed (dual-agent audit, "make bots perfect").**
Two independent code-reviewer agents converged: the stateful safety rails were INERT in
production. `StateMachine.record_trade_result` had ZERO production callers (only tests called it
by hand → green tests masked it), the session never reached `IN_TRADE`, and the 25pt slippage
threshold was defined but never enforced. So max-trades/day, max-consecutive-losses,
daily-loss-limit, slippage, and one-trade-at-a-time ALL could not fire live. FIX: new
`service/fill_handler.py` wires the connector fill stream → slippage enforcement on entry +
`record_trade_result` on exit + IN_TRADE/SEEKING transitions; `execute_validated_signal` now
registers each order (sync, before fills race) + goes IN_TRADE on placement; wired in `app.py`
lifespan + `run_bot_live.py` (was a `print` lambda). `force_stand_down` now fires from IDLE too.
New `tests/test_fill_rails.py` drives trades THROUGH the fill callback (the test that was
missing) — 5 tests, 140 total green, ruff clean, all 5 parity locks still 99.4-100%.
**REMAINING LIVE GATE:** `connectors/tastytrade.py` `_normalize_fill` maps raw streamer payload →
canonical fill dict but is UNVERIFIED vs the live wire format (logs first raw payload, drops
unclassifiable fills fail-safe). MUST finalize field names + entry/STOP/TP event tagging in the
sandbox paper-test before live, else rails go inert on tastytrade. Sim path fully wired+tested.
Lesson: green tests ≠ safe — they hid an inert-rail bug because they fed the counters manually.

**2026-06-16 — BROKER for paper forward-testing RESOLVED + NautilusTrader pilot.** Hard-verified
(2 independent sources each): **tastytrade has NO API paper trading** (account approved + live auth
works, but it's live-only + unfunded — see [[project-tastytrade-connector]]); **Tradovate** demo
API exists but charges **$290/mo CME** for API market data (orders-only avoids it) + needs $1k
funded. **The real solution = Interactive Brokers (IBKR) paper account**: free, indefinite,
API-automatable (ib_async), micro futures /MYM /MNQ /MES, real-time CME data ~$10/mo. Built
**connectors/ib.py** (IBConnector, full BaseConnector: connect to IB Gateway/TWS paper port 7497,
ContFuture front-month resolve, OCA bracket, execDetailsEvent fills tagged entry/STOP/TP) + wired
into both runner factories (broker: ibkr) + config.example ibkr block + requirements (ib_async).
Built-to-spec, untested vs a real Gateway. NEXT: Jonathan opens free IBKR acct → `pip install
ib_async` → run IB Gateway paper + enable API → set broker:ibkr/mode:live/env:paper → read-only
smoke test → forward-test. **NautilusTrader (1.228) installed + piloted** (`backtest/nautilus_pilot.py`):
event-driven backtest of our exact breakout entry (Zig+BOS/HL) on a real MYM futures contract,
HEDGING OMS, bracket exits. 12mo cross-validation: 832 trades, 22% win, +$2,630/2micro — **edge
CONFIRMED positive under realistic event-driven fills** (no look-ahead). The $ gap vs our pandas
$21k/yr is the pilot's simplified mgmt (market entry + full ride to +250, NO half-out/runner) — not
a pandas flaw. Nautilus gives backtest<->live parity by construction + native IBKR+Databento
adapters → candidate long-term home; full adoption = port the half-out/runner + rails. ⚠️ Nautilus
pins **pandas<2.4** (downgraded 3.0.3→2.3.3; 140 tests + parity still green, but isolate in its own
venv eventually). Also added (capability only, runner-wiring half-done): **per-instrument budget**
support — StateMachine `lane` namespacing + FillHandler accepts {symbol: sm} dict, so each
instrument gets its own rails (the account-wide cap let BTC 24/7 starve the RTH strategies in the
sim demo).
