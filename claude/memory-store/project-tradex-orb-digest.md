---
name: project-tradex-orb-digest
description: "TradeX ORB $100 Whop course fully scraped 2026-07-13 (all 29 lesson transcripts via mux HLS VTT pull): MNQ 5-min ORB, gold-bar CLOSE entry (honest-fill archetype), news-folder filters + manipulation trade = the testable IP; performance claims = TV Strategy Tester (zero trust); indicators claimable to Z5jonathan TV"
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**TradeX ORB (Whop, $99.99/mo, TradeX Labs "Ben"/THESAMURAI):** founder bought it; fully digested
2026-07-13. Digest + all 29 transcripts: `mym-autotrader/forensics/h134-tradex/` (commit 7d67013).
Scrape method that WORKS for whop/mux (reuse: harvest.py): mux-player DOM → playback token →
stream.mux.com master m3u8 → subtitles.m3u8 → VTT segments → clean prose. Mux thumbnails are
signed (403) — VTT captions are the extraction route. Caveat: auto-captions garbled (pseudo-
Ukrainian) on parts of ~6 lessons; all operative rules recovered.

**System:** NQ/MNQ 5-min (V2=15m), invite-only Pine (Sniper v3.6 V1-V4 + ORB System Builder v1.5).
Entry = market at "gold bar" CLOSE (breakout candle closes beyond range) = honest-fill-compatible
archetype, same family as our H126 survivor. Signals 09:35-12:00 ET, flat by 12:00, creator trades
only to 10:30. Indicator supplies stop/TP lines. Claims = TradingView Strategy Tester = instant-fill
class, ZERO trust; but trade-list Excel is exportable once indicators claimed (fastest falsification:
replay their trades on our tape/fills).

**The stealable IP (testable filters, B2/B3 in [[project-mym-portfolio-reframe]] build queue):**
(1) 08:30 red-folder news day = trade; news-candle H/L = magnetic targets; (2) pending red-folder
09:30-10:30 = blackout until release; (3) yellow-folder-only day = chop, skip/downsize; (4) signal
must also break pre-9:30 HOD/LOD in first 15min (else mid-range chop); (5) "manipulation trade" =
post-9:30 sweep of HOD/LOD then gold-bar close out the OPPOSITE range side (confirmation-triggered
reversal — honest-fill-robust archetype); (6) break-even management made it LESS profitable
(independently matches our findings); (7) evals: high risk / speed-run, blowing some is fine
(= [[feedback-goat-evals-speed-first]], independently converged).

**How to apply:** never trust their tester numbers; rebuild filters in our engine with historical
econ-calendar data + honest gauntlet vs ORB5. Indicators claimable to founder's TV (Z5jonathan) via
Whop TradingView page. Creator automates via TradersPost→Apex (banned there — his risk; we'd use our
own stack). Related: [[project-mym-qf-falsified-orb-validated]], [[user-prop-accounts-no-apex]].

**VERDICT 2026-07-13 (H136 filters + H137 real configs) — TradeX has NO honest mechanical edge. BURY.**
H136: the TradeX news-filter pack on ORB5 = 0/5 work (F3 session-HOD/LOD-break was a regime-beta trap:
PF 2.16 but placebo PF 1.78). H137: the ACTUAL TradeX ORB variants honestly filled = coin-flips —
**V4 (11-min OR, 1.5R) PF 1.03 / V1 (14-min OR) PF 0.965 / QuantORB (9:30-9:45 OR, +maxrange+mintarget)
PF 1.146 but placebo p=0.30 (indistinguishable from luck)**, all correlated 0.27-0.64 to ORB5 anyway.
Consistent with their OWN tester showing V4 losing (-PF 0.594) last 30d. The channel-of-passers is
survivorship + prop-eval variance (see forensics/payoutvault/why_people_pass.py: a ZERO-edge method
passes 20-33% of Goat evals, most in <=2 days, at aggressive size; funded survival ~0%). Fully cracked +
spec'd (forensics/h134-tradex/reverse-eng/CRACKED-SPEC.md via pine-facade metaInfo) but nothing to deploy.

**GAUNTLET AUDIT 2026-07-13 (H140, founder challenged the ruler after a reputable vendor failed).** Two
independent confirmations the DEAD verdict is TRUSTWORTHY, not the gauntlet being too harsh:
(1) CALIBRATION — negative control (random-direction ORB) passes only 6% (FPR controlled ≤ nominal 10%);
positive controls (Bernoulli sign-injection preserving true PF) show POWER = 78-90% at true PF 1.25,
94-99% at PF 1.4, borderline 55-65% at PF 1.15, across n=1000-1400. So a real PF-1.25 edge would be caught
~85% of the time — TradeX's absence of a pass means the edge isn't there (PF 1.03). **Our gauntlet is
CALIBRATED, not a kill-everything machine (it passed ORB5 PF 1.48 p=0.000 the same day).**
(2) A++ BEST-SHOT — Benny's ACTUAL filtered method (QuantORB + 08:30-news-day + no-pending-news +
HOD/LOD-break) scores PF 1.537 / OOS 1.859 but placebo p=0.37 = DAY-TYPE BETA (a coin flip does as well
37-46% of the time on the same selected days). 0/7 filter variants survive.
**KEY DURABLE LESSON — the DAY-TYPE-BETA TRAP (confirmed 3× in one day):** filters that SELECT days
(news/trending/HOD-LOD-break/macro-bias-agree) create ride-to-EOD directional asymmetry that inflates PF
with NO directional edge — the placebo PF rises WITH the real one. Struck 3× on 2026-07-13: H136 F3
(PF 2.16), H140 TradeX A++ (PF 1.54), H141 macro-bias-on-ORB5 (AGREE PF 1.34, placebo 0.04 in ISOLATION →
REDUNDANT once decomposed vs the trend gate: zero lift within TREND days; the RANGE-day lift fails its own
scoped placebo). **RULE: run the placebo THROUGH the day-filter AND decompose any day-selection filter
against ORB5's existing prior-day-trend gate for INCREMENTAL lift — an isolated good PF+placebo is NOT
enough.** Founder's TradeX×Vault-Engine COMBINE idea (H141) = DEAD/redundant: the Engine's macro bias is
mostly price-drift re-labeled (2/4 proxy votes are NQ drift), adds nothing the trend gate lacks; and the
literal Engine (LLM, no history) is un-backtestable anyway.
Related: [[project-payout-vault-closed]], [[project-mym-portfolio-reframe]], [[feedback-backtest-measures-robot-not-trader]].
