---
name: project-us30-live-signals
description: Live US30 signal scanner (the 3 bot strategies) pushing to phone via ntfy + forward-tally scorecard; launchd-scheduled on the iMac
metadata: 
  node_type: memory
  type: project
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

The LIVE signal system that pushes the 3 validated strategies to Jonathan's phone runs from
**`~/code/projects/mym-autotrader/service/live_scan.py`** (NOT the us30-dashboard `.py` files —
those `multi_watch`/`watch`/`scan` are superseded + their launchd jobs are `.disabled`). Driven by
launchd **`com.jonathan.us30signals`** every 300s via `scripts/run-live-scan.sh` (TradingAgents
venv python, which has yfinance). Data = **yfinance dated micro contracts** `MYMM26.CBT` /
`MNQM26.CME` (NEVER continuous =F — silent roll = ~380pt basis error; RE-PIN at each quarterly
roll). ntfy topic = `cc-imac-c1ac6b58f282` (in ~/.zprofile). Every signal → `logs/signals.jsonl`.

**3 lanes = the bots' 3 strategies (parity):** (1) `morning-vwap` (the breakout/VWAP-dir edge,
PF2.23) — 09:45-10:30 RTH window, MYM **and** MNQ, both push. (2) `coil-scalp` — overnight QUIET
hours, **MYM-only**. (3) `pingpong` — overnight QUIET hours, **MYM-only**. QUIET = 18:00-09:30 ET.

**FIXED 2026-06-16:** ping-pong was firing for MNQ too (would push untested signals) — gated to
`label == "MYM"` like coil. **Only morning-vwap transferred to NQ; coil + ping-pong did NOT** (NQ
trends, doesn't mean-revert at round numbers — see [[project-nq-strategy-port]]). So MNQ runs
morning-vwap only.

**FORWARD TALLY (record-keeping until live/paper is sorted):** `service/forward_tally.py` walks
each journaled signal forward on real 5m bars (8h horizon), records first-touch outcome
(stop / tp1/2/3 / scratch) + R (risk=|entry-stop|), caches to `logs/signals_resolved.jsonl`
(never re-scored). `--push` sends the per-lane scorecard to phone. Scheduled daily 16:15 ET Mon-Fri
via **`com.jonathan.us30tally`** → `scripts/run-tally.sh`. First record (2026-06-17): morning-vwap
38 signals, 55% win, +2.33 avgR. This morning's live hit: morning-vwap LONG MYM @ 52,000 → all 3
TPs (+125/+250/+375), stop never threatened — verified on YM=F.

**MORNING-VWAP CONFIG LOCKED ON EVIDENCE (2026-06-17, qf_vwap.py sweep, 3 micros ex-2020):**
the validated lane = QF+VWAP mean-reversion fade, BIDIRECTIONAL (shorts ARE in-strategy: above
VWAP at QF resistance → short toward VWAP; below → long). Open-only window 09:45-10:30, **dev=0**
(stretch filter KILLS it: dev≥0.5 → 9 trades, PF 0.7). **STOP=50** wins decisively: PF **2.02** vs
stop100 PF 1.63, net +$107k vs +$90k, DD $6.1k vs $7.3k. **Trades/day (max_day param added to
qf_vwap.run):** 1/day=PF2.02/+$107k/DD$6k/1 neg yr; **2/day=PF1.89/+$150k/DD$8.5k/0 neg yrs (CHOSEN
— Jonathan picked more profit; 2nd trade adds +$43k, also honors bot max-2-trades rail)**;
3/day=+$163k; unlimited=+$168k (diminishing). **BUG FOUND + FIXED:** live scan_morning trigger
already MATCHED qf_vwap (dev0/stop50) — but had NO per-day cap → re-journaled the same setup every
5-min scan (~15 "signals"/day, mostly dups) and the forward tally double-counted by minute →
inflated record. Fixes: live_scan MAX_PER_DAY=2 push cap per (pair,lane) + setup-dedup; forward_tally
_key now date-level (not minute) + 2/day cap. Reset signals_resolved.jsonl → faithful: 44 raw → 12
distinct setups, 58% win, +2.92R. **parity_check_morning.py BUILT + run (2026-06-17): 94.1% match** vs qf_vwap(grid="all",dev0,
stop50,2/day). KEY: scan_morning's `big[z]>=large` filter == backtest **grid="all"** (NOT "large"=
500-multiples) → it was ALREADY the canonical PF-2.23 all-grid config; no flip needed (my earlier
"large-grid gap" used the wrong baseline). Aligned tol→max(20,round(atr*.1)) + grid→quarter_levels
(both NO-OPs — confirmed _grid==quarter_levels candidate set + trigger/config all match). **Residual
6% = cap-counting semantics ONLY:** backtest max_day counts 2 TRADES/day (same level can repeat);
live caps 2 DISTINCT setups/day (dedup'd) → live picks up an extra distinct setup on repeat-days
(2135 vs 1963 signals). NOT a strategy divergence — live's distinct-setup rule is arguably better.
Lane declared LOCKED at 94% (benign, fully-understood residual). To hit ~99% would mean making the
backtest count distinct-setups not trades (measurement tweak, not done — diminishing returns). NB earlier "+375 all 3 TPs" morning report was WRONG — used
YM=F continuous (~380pt basis off the dated MYMM26.CBT the signal fires on); tally uses the correct
dated contract but yfinance dated-micro data is thin → resolution accuracy vs real Tradovate feed
is a separate open risk.

**4th LANE ADDED 2026-06-17 — breakout-retest (the trend-break lane).** Born from studying a day
where the morning fade stopped out (-50, normal grab) but the REAL move was a 2pm afternoon
breakdown (~760pt) the morning lane structurally can't catch (window 09:45-10:30). The afternoon
move = a BOS+retest breakdown = the validated breakout-retest strategy, which ran in the bot but
was NOT in the phone scanner. Wired into live_scan as `scan_breakout` (reuses the parity-locked
`service.breakout_live.BreakoutRetestDetector` == backtest/breakout_retest.py, so live==backtest;
replays today's 1m RTH bars through a fresh detector each poll, emits the most-recent signal).
**INDEPENDENT lane** — fires regardless of the other 3, can be OPPOSITE the fade (separate
strategies, per Jonathan). **BOTH pairs LIVE (2026-06-17):** MYM (BreakoutRetestDetector, QF125,
+$21.9k/yr) + MNQ (BreakoutRetestNQDetector, QF50/ride+100, 39% win +3.12R +$12.7k/yr DD$238) —
each its own parity-locked detector; scan_breakout picks by label. Breakout is the ONLY non-morning
lane on NQ (coil/pingpong are YM-only). Verified both detectors caught today's afternoon breakdown
(MYM SHORT @51,500, MNQ SHORT @29,650). MYM breakout = 37% win, +3.39R, +$21.9k/yr,
DD$476 (2 micros, full RTH; edge is UNIFORM/volume — 37% win at any per-day cap, so **uncapped**).
Verified: scan_breakout caught TODAY's afternoon SHORT @ 51,500 (the move the fade missed).

**CAP ARCHITECTURE CHANGED 2026-06-17 (Jonathan): per-STRATEGY caps, NOT account-wide.** The old
account-wide max-2-trades/day was a single-strategy artifact that starved lanes (BTC ate the budget
in the sim). Now each strategy runs its OWN backtested frequency: morning-vwap 2/day, coil/pingpong
2/day, breakout UNCAPPED (LANE_CAP dict in live_scan + forward_tally). **Account-wide DOLLAR
protection ($150/day loss limit) is being made RELATIVE** — it's account-size/#-strategies dependent,
so it becomes a %-of-equity scaling circuit-breaker in the BOT's execution layer (TODO when IBKR goes
live), NOT a fixed $. The $-loss + consec-loss + slippage rails stay as the real blowup-protection;
the trade-COUNT cap is what moved per-strategy. 140 tests green.

**ROLL EXECUTED + STALENESS ALARM (2026-06-18).** June (MYMM26/MNQM26) expired today; yfinance froze
the June feed at ~09:25 ET on expiry → scanner ran clean (exit=0) but on stale data → ZERO signals
all morning (Jonathan noticed at lunch, empty ntfy). NOT a code bug — the contract-roll gap I'd
flagged. FIX: re-pinned PAIRS to **MYMU26.CBT / MNQU26.CME** (Sept; ~400pt basis above June, Sept
vol 1454/46814 vs June's collapsed 109). Signals resumed instantly. **Backfill (backtest/backfill_gap.py)
of the dead window:** overnight = nothing (correct); this morning the freeze cost the OPEN shorts —
MYM breakout SHORT @52,375 +13.2R + morning-vwap SHORT @52,375 +5.0R (the day's best); later LONGs
stopped; MNQ breakout LONG @30,400 +7.1R was caught on the re-pin. **NEW: data-health alarm** in
live_scan (`check_health`/`_alert_health`, STALE_MIN=25) — pushes an urgent phone alert ONCE/day/pair
if the feed is frozen/dead/no-data (suppressed weekends + 17:00 ET maintenance). Would've caught this
at 09:30. NEXT ROLL ~2026-09-15 U->Z (logged in live_scan PAIRS comment). 140 tests green.

**Overnight coverage:** coil/ping-pong only fire in QUIET hours, so the iMac must stay awake
overnight → **`com.jonathan.us30caffeinate`** runs `caffeinate -s -t 57600` (16h) Sun-Thu 17:45 ET.
Caveat: launchd can't WAKE a sleeping Mac (that needs `pmset` + sudo), only hold it awake — so it
relies on the Mac being awake at 17:45 to start. If overnight lanes show gaps, check this.
