---
name: project-mym-distinction-warroom
description: "distinction.ae = 'The War Room', a $119-149/mo Stripe-billed members PWA (distinction.ae/warroom/) by Kevin / @theforexscalper (TFS, 140K IG, institutional-retail S&D+orderflow+footprint educator). Deep-scraped the PUBLIC surface 2026-07-15: 6 tools (Directional Bias Engine, Live Orderflow, Private Briefings 5-min, Econ Calendar, NYSE Opening Bell, Trade Journal), core instruments MNQ/MES/GC. Public pages LEAK the live bias teaser -> a scrapeable public signal. Member content needs founder's own login. It's a DISCRETIONARY intelligence dashboard, not a validated edge -> value = the feature BLUEPRINT for our own gauntlet-validated super-tool."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**distinction.ae — "THE WAR ROOM" (deep public scrape 2026-07-15 via kimi-webbridge; member area NOT accessed — founder not logged into Chrome).**
Members-only PWA at distinction.ae/warroom/, $119-149/mo (Stripe, "founder price 9 spots"). Built by **Kevin / @theforexscalper (TFS —
The Forex Scalpers)**, 140K IG, 4 courses (Supply & Demand, Orderflow, Prop Firms, Whale Orders). Framing: "not a signal service, not a course —
a real-time intelligence dashboard." PHP/Apache site; pages app.php/about.php/pricing.php/faq.php (some 502 transiently). Scrape saved
scratchpad/distinction/*.txt.

**THE 6 TOOLS (the super-tool blueprint):** (1) **Directional Bias Engine** — live BULLISH/BEARISH per instrument on 9 markets
(MNQ/MES/ES/GC/MGC/CL/EURUSD/GBPUSD/USDJPY), updated every minute, from "institutional orderflow + 2H trend + market structure"; output form =
points-vs-prev-close + a bull/bear label + "look for longs/shorts." (2) **Live Orderflow** — buy/sell volume + delta. (3) **Private Briefings** —
every 5 min NY session (07:30 CET pre-mkt, 08:00/08:30 London, 15:00-16:00 NY every 5min, 21:30 close): trade advice, key levels, S/D zones, risk.
(4) **Economic Calendar** + news countdowns. (5) **NYSE Opening Bell** audio/overlay. (6) **Trade Journal** + weekly reports. Core = MNQ/MES/GC.

**LEAK:** the public app.php/about.php pages embed a LIVE bias widget ("BULLISH MNQ +40 pts, MES +2, GC -22.6 ... 06:13 LIVE UPDATE"). The bias
ENGINE OUTPUT is partially public -> find the JSON endpoint the widget calls (network-capture the public page) to continuously scrape the live bias
signal WITHOUT a login (public-data scrape, in scope). The full member briefings/orderflow feed need the founder's own login (his access = fair game;
kimi-webbridge -> distinction.ae/warroom/ once he's logged in).

**HONEST READ (do NOT overvalue):** it's a DISCRETIONARY intelligence dashboard (S&D/orderflow/footprint bias) by an IG educator — NOT a validated
mechanical edge. This session's whole lesson ([[project-mym-fade-doctrine-verdict]], [[feedback-backtest-measures-robot-not-trader]]) is that these
bias reads don't mechanize into edge; treat "BULLISH MNQ" as a discretionary signal to VALIDATE (does it predict? honest gauntlet test), never to trust.
The VALUE is the feature blueprint, not the alpha.

**SUPER-TOOL PLAN (founder "clone + merge into one super tool"): build OUR War-Room-equivalent on OUR engine + free data — and unlike Distinction,
GAUNTLET-VALIDATE every signal (they assert; we prove).** We already hold ~80% of the components: 2H/1H/30m MTF-trend gate ([[project-mym-mtf-gate-golden-standard]]),
market structure/swing/BOS ([[project-mym-smc-reversal-7th-sleeve]]), orderflow delta (MBO/L3 recorder [[project-mym-mbo-lane]] + databento tick),
auto-briefings (US30 pre-session brief [[project-trading-ai-stack]] + live_scan->ntfy [[project-us30-live-signals]]), journal (crosstrade GetJournalTrades),
free econ calendar, trivial opening-bell timer. Dashboard shell = area61-command-core. Merge with Payout Vault displacement + TradeX gold-bar-close/news-filter.
Related: [[reference-storms-vagafx-recon]] (vendor-DD discipline), [[reference-tradingview-pine-crack]], [[project-mym-qkms-northstar]].

**SECURITY FINDING + THE HARD LINE (2026-07-15):** their bias widget's data comes from `distinction.ae/titan-bias/api.php?key=titan_admin_2026_distinction`
— an **ADMIN-named key hardcoded in the public client-side JS**. This is a leaked credential + a serious hole on THEIR side. HARD RULE: we do NOT use it
to pull member/paywalled/backend content — using a leaked ADMIN credential to reach data behind a paywall is unauthorized-access (CFAA felony territory),
NOT a ToS nicety; it does not move for "full steam"/"ruthless." (Contrast: scraping public data = always fine; the bias itself is server-rendered into the
public HTML + is TRIVIAL — "price vs prev close + bull/bear label" — replicable in one line, no edge.) The leak is itself the valuable DD: a $149/mo
"institutional intelligence" product shipping its admin key in client JS = AMATEUR op → don't pay, don't rely on the signal. Build ours, validated.