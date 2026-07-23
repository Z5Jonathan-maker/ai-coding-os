---
name: reference-tradingview-pine-crack
description: "TradingView open-source Pine-source crack (2026-07-15) via the public pine-facade frontend endpoint: fetch script page -> extract scriptIdPart PUB;<hash> -> GET pine-facade.tradingview.com/pine-facade/get/PUB;<hash>/last -> JSON .source = full Pine. No auth, no Cloudflare fight. Unlocks the whole TV open-source-strategy vein. The code IS the rule spec (no reconstruction), but TV's backtester is fill-fantasy — port the RULE to our honest-fill gauntlet, never trust their equity curves."
metadata:
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**TradingView open-source Pine-source crack (public frontend API, no auth) — 2026-07-15:**
1. `curl -sL` the script page with a browser User-Agent (e.g. https://www.tradingview.com/script/<shortid>-<slug>/) → HTTP 200, no Cloudflare
   challenge on the script pages. `grep -oE 'PUB;[a-f0-9]{20,}'` → the **scriptIdPart** (`PUB;<32-hex>`).
2. `GET https://pine-facade.tradingview.com/pine-facade/get/PUB;<hash>/last` → JSON with a `source` field = the FULL Pine code.
This is the endpoint TV's own frontend calls; works for any OPEN-SOURCE published script (closed/invite-only scripts won't expose source).
Proven on 4 scripts in one shot (13k-40k chars each). This is the [[project-mym-qkms-northstar]] §10 code-repo route for the TV lane
(build as `engine/acquire/sources/tradingview.py`).

**THE VEIN (founder 2026-07-15): TradingView open-source strategies.** BEST property vs the paper/tape veins — the code IS the deterministic
rule spec (market/session/entry/exit/stop all explicit), so NO reconstruction guesswork (QKMS §15 is trivial here). WORST property — TV's
backtester is the instant-fill fantasy that killed our fade catalog: `process_orders_on_close=true`, `calc_on_order_fills=true`, intrabar
stop+limit fills (favorable-fill assumption when a bar spans both), repaint. **NEVER trust the script's equity curve.** Port the RULE into our
honest-fill engine + dual-error gauntlet, kill-by-default. Most "scam or slam" guru scripts will die; the value is the occasional rule that
touches a vein we've already validated, or a clean new structural idea.

**The 4 studied (source saved scratchpad/tv-scripts/*.pine):**
- **BigDaddyMax ORB (RukKSuD3)** — ON-VEIN (our ORB5, [[project-textbook-open-lane]] cousin). NY 09:30-09:45 ORB; CONTINUATION = first candle
  CLOSE outside ORB → market entry, stop = ORB-mid (or opposite side), TP = 1R; REVERSAL = if breakout fails and price CLOSES back inside ORB →
  close & flip, stop = failed-breakout swing extreme, TP = 1R; EOD close. RELATIVELY honest (slippage=1 tick + $2.50/contract commission, 1R
  fixed targets — no runaway). The **failed-ORB-reversal leg is a genuinely NEW testable idea** we haven't isolated. Worth an honest test on MNQ/MES.
- **TJR London Fakeout (Y65vR4oQ)** — SMC/ICT liquidity-sweep fade, LONDON session (new; we've focused NY). Asia range (00:00-08:00 London) →
  during London wait for a sweep of Asia H or L → wait for opposite Break-of-Structure (pivot, close-confirmed) → fade entry; stop = sweep extreme,
  TP = opposite Asia liquidity. Two-phase sweep→BOS mirrors our [[feedback-qf-two-phase-premove]] re-entry idea and the [[project-mym-smc-reversal-7th-sleeve]].
  No costs modeled → inflated. Mechanized fades mostly die honest ([[project-mym-fade-doctrine-verdict]]) but London-session is untested — honest test.
- **EvenDyer VWAP (7TUbUB53)** + **ScamOrSlam Rauf (sk6MVZEb)** — pulled (21k/40k chars), not yet transcribed. VWAP touches our live VWAP-dir
  ([[project-mym-live-config]]); Rauf = a day-trading indicator combo. Transcribe in the connector build.

**PLAN:** `engine/acquire/sources/tradingview.py` (pine-facade route) → transcribe Pine → honest-fill gauntlet, charged against cumulative-K.
Sequence AFTER the in-flight QKMS intake workflow lands (avoid colliding on engine/acquire/sources/). Also write a browser-harness
`tradingview/` domain skill capturing the pine-facade route. Related: [[project-mym-trader-tape-harvest]] (sister harvest vein).