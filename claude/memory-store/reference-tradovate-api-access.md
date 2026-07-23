---
name: reference-tradovate-api-access
description: "Tradovate API access requirements/costs (2026) — $1k balance gate, $25/mo, demo not free, CME data license; what a $180 account can do"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Tradovate API access requirements (researched 2026-06-14, triangulated from Tradovate staff forum quotes + community, verify on support.tradovate.com as official page was unfetchable):

- **Live API entitlement requires $1,000 equity to ACTIVATE** (one-time gate — can draw below after), plus **$25/month** subscription. Jonathan's $180 live account hit exactly this gate: "The current balance is not eligible to access this entitlement."
- **Demo/sim API also needs the $1,000 + $25/mo — there is NO free API trial.** (CORRECTED 2026-06-15 by Jonathan's direct experience: the "14-day trial gives API access" claim from a 2022 forum quote is FALSE. Do not repeat it. API access requires the $1k gate, period — demo or live.)
- **Market data via API = separate CME Non-Display Cat A license ~$390/mo.** The $25 is ORDER ROUTING only. Avoid the $390 by feeding the bot data from another source (TradingView/Databento) and using the API for ORDERS ONLY — which is how the mym-autotrader connector is built.
- **$180 CAN trade 1 MYM manually** (intraday margin ~$50/micro). Cannot unlock API.
- **Cheaper automation that SKIPS the $1k gate + $390 license:** authorized webhook vendors (PickMyTrade, Autoview) or TradingView's native Tradovate integration hold the entitlement for you, execute via webhook for a small fee. Matches the repo's existing Pine->webhook architecture.

**Path (converges with strategy ruin math — both say fund up):** for a FREE 2-week paper forward-test of the Python bot, use **IBKR paper** (free, full Python API, MYM/MNQ, no balance gate) or **NinjaTrader sim** (free, but C# port). Tradovate has NO free-API path. Then fund Tradovate toward $1k for live (unlocks native API AND exits the high-ruin <$500 zone), OR webhook-vendor route. See [[project-mym-live-config]].

**2026-07-04 REFINEMENT — native NinjaScript-in-NT8 is a DIFFERENT path from the $1k-gated REST API (reframes the $300 cash-account question; research-scout, sources retrieved 2026-07-04):**
- **NinjaTrader OWNS Tradovate** (acquired, closed Jan 2022 → NinjaTrader Clearing LLC; same clearing, identical pricing tiers). So "your NinjaScript bots" and "a Tradovate account" are the same house.
- The **$1k-equity + $25/mo "API Access" gate is specifically the REST/WebSocket API** (external bots: PickMyTrade / CrossTrade / TradersPost). It does NOT clearly apply to **NinjaScript strategies running NATIVELY inside NT8** via the standard brokerage connection. QuantVPS (3rd-party): the Tradovate REST API offers no direct NT8 automation, while NT8 Desktop has native automated-strategy integration. **LOAD-BEARING but UNVERIFIED on vendor-official pages** (support.ninjatrader.com wouldn't fetch — confirm "Tradovate-API-Access" + "Connecting-to-a-Tradovate-Account-NinjaTrader-Desktop", or just open a small account and try).
- Account minimum to OPEN = **$0** (ACH/debit $5 min). Retail real-time CME data = **$12/mo bundled Level I** (NOT the $390 pro/non-display license — that's the REST path). Commissions: Free $0.39/side micro, or $99/mo $0.29/side. NT8 Multi-Provider Mode = data-from-one-provider / orders-to-another, native.
- IMPLICATION: the $300 cash account can run the SAME .cs bots natively in NT8, LIKELY without the $1k REST gate — cheap ($0 open, ~$12/mo data, Free commissions). Caveat: $300 margins ~1-2 MNQ intraday with near-zero buffer (a prove-the-mechanism amount, not survive-volatility); fund up per the roadmap. §12 cash playbook = backtest/cash_300_mc.py.
