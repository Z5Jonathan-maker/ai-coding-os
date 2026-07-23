---
name: reference-tradingview-desktop-cdp-sealed
description: TradingView Desktop v3.x blocks CDP via Electron fuses — no MCP can drive the desktop app; use Pine+webhooks or web-in-Chrome instead
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

TradingView Desktop **v3.2.0** (and v3.x generally) is cryptographically sealed
against remote debugging. Launching the binary with `--remote-debugging-port`
errors with `bad option`, and `strings` on the Electron Framework shows hardened
fuses (`NODE_OPTIONS ignored due to disabled nodeOptions fuse`). Verified
2026-06-07.

Consequence: **every TradingView-MCP on GitHub is dead on this Mac** — they all
depend on CDP (`tradesdontlie/tradingview-mcp`, `LewisWJackson/tradingview-mcp-jackson`,
the BitGet fork). The "v2.14 launch fix" forks predate this lockdown; their
`launch()` still uses the same direct-flag spawn.

Real integration surfaces for "Claude in TradingView":
1. **Pine scripts + alert webhooks** — TradingView's only sanctioned extension
   point. This is what Jonathan's [[project-mym-autotrader-assistant]] already uses.
2. **TradingView web in a Chrome launched with CDP** — the same MCPs attach to a
   `tradingview.com/chart` page target. Gotcha: Chrome 148 anti-DNS-rebinding
   404s the `/json/list` endpoint unless the Host header is exactly `localhost`
   (chrome-remote-interface rewrites it to 127.0.0.1 → fails). Needs a host patch.

Don't re-attempt desktop CDP. If the ask is "Claude as trading assistant," route
to the mym-autotrader repo (Pine/webhook/backtest work), not the app.
