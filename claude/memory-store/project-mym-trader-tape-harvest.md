---
name: project-mym-trader-tape-harvest
description: "Vein (founder 2026-07-14): systematically harvest VERIFIED high-performer trader tapes from public performance platforms (involio, Myfxbook, Darwinex, Collective2, eToro, ...), extract entry/exit/stop, reverse-engineer the method, feed the gauntlet. THE trap: leaderboards are survivorship + multiple-testing machines — top-N of 100k users is mostly luck. Discipline = verification-tier filter + blow-up-or-moon reject + cumulative-K deflation + tape-not-claims + the random-relabel SELECTION test. This is the Storms harvest, systematized."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**New intake vein (founder 2026-07-14): find high-profit traders on public performance-listing platforms, study their actual trades
(entry/exit/stops), reverse-engineer the method by studying enough of them, feed the [[project-mym-discovery-engine]] gauntlet.** This is
the [[reference-storms-vagafx-recon]] James-Storms harvest generalized into a standing source category for the [[project-mym-qkms-northstar]].

**PROBED PUBLIC ROUTES (2026-07-14, clean/public only):**
- **Myfxbook** — `myfxbook.com/api/*` LIVE JSON API (get-community-outlook.json returned a real JSON error-envelope; most calls need a
  session token from the USER'S OWN login = fair game). Broker-VERIFIED forex track records. The route we already used for Storms.
- **Darwinex** — documented public DARWIN API (info/quote/trades endpoints confirmed on darwinex-api page; api.darwinex.com blocked from
  this host but the API is real, OAuth, free tier). BROKER-VERIFIED, regulated — the gold standard for tape quality.
- **Collective2** — api.collective2.com (302, exists) + systematic-strategy leaderboards with trade-by-trade; web root 403s (anti-bot) so
  use the API, not the site. Some detail paywalled.
- **involio** — api.involio.com 404; it's a mobile-first social-investing app → the public API is on a different host / GraphQL, needs
  frontend inspection (kimi-webbridge / network capture) to find the endpoint. Deferred until inspected.
- More: eToro (public Popular-Investor stats), ZuluTrade, FX Blue, TradingView published strategies, prop-firm leaderboards (Topstep etc.).
- No trader-performance browser-harness domain skill exists yet (we have ~40 others) → write one when a route is mapped.

**THE DISCIPLINE (non-negotiable — this vein's trap is the WORST in the game):** a leaderboard SELECTS winners by construction, so the top
trader of a 100k-user platform is mostly luck (multiple testing). Naive "copy the top trader" is the exact trap every lesson this session warns
against. Guards, in order:
1. **Verification-tier filter** — broker/platform-VERIFIED live track records only (Darwinex, Myfxbook-verified, Collective2, eToro real-money);
   NOT self-reported screenshots ([[reference-storms-vagafx-recon]]: Storms's badges were real but frozen on a scam broker).
2. **Blow-up-or-moon reject** — kill the small-account high-leverage +1,000%/+10,000% signature; it's variance, not a scalable edge (Storms).
3. **Cumulative-K deflation** — every harvested trader is a LOOK; charge it against lifetime-K + the DSR/SAFFRON hurdle. Harvesting 500 traders
   and keeping the best is a 500-way search that must be deflated exactly like a param sweep.
4. **Tape, not claims** — extract the ACTUAL entry/exit/stop tape (timestamps + prices) where public; reconstruct rules as MULTIPLE hypotheses
   (QKMS §15: never silently invent a rule); re-fill on HONEST prices (their claimed fills are optimistic).
5. **THE DECISIVE TEST — random-relabel selection test** ([[feedback-backtest-measures-robot-not-trader]] G2): does the trader's ACTUAL selection
   beat random entries matched on instrument/session/frequency? That isolates transferable edge from luck AND from their discretionary skill
   (which a backtest can't clone — [[feedback-backtest-measures-robot-not-trader]]). If the mechanizable shell survives honest fills AND the
   selection beats random-relabel, THAT's a real signal to study; otherwise it's a skilled discretionary trader we can't systematize (log + move on).
6. **SCOPE** — public/frontend APIs + the founder's OWN logins; no auth-bypass, no other-users'-private data beyond what the platform publishes,
   no redistribution. Same line as the corpus crack.

**BUILD PLAN:** a `engine/acquire/sources/traders.py` connector (Myfxbook + Darwinex + Collective2 first; involio after frontend inspection) that
pulls verified tapes → a trader-tape processing path (extract tape → reconstruct rule hypotheses → honest-fill re-test → random-relabel selection
test) → the gauntlet, all charged against cumulative-K. Sequence: AFTER the in-flight QKMS intake workflow lands (avoid colliding on
engine/acquire/sources/). Related: [[reference-ig-trading-ad-vetting]], [[feedback-a-winner-is-a-winner-any-asset]].