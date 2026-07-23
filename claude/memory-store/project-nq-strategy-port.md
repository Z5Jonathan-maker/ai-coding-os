---
name: project-nq-strategy-port
description: "NQ port of the 3 YM strategies (2026-06-15) — only BREAKOUT-RETEST transfers to NQ; coil + ping-pong (mean-reversion) don't, because NQ trends and doesn't mean-revert at round numbers like the Dow"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Tested the 3 locked YM strategies on NQ (mym-autotrader, 2026-06-15). Jonathan's rule: SAME strategies, NQ-scaled NUMBERS — and NEVER touch the locked YM strategy files (clone for NQ). All NQ work lives in CLONES: backtest/nq_calibrate.py, nq_breakout.py, nq_probe.py (coil), nq_pingpong.py. Locked YM files restored + reverified after an earlier mistake (I'd parametrized them — reverted; S1 99.7%, S2 100%, 130 tests green).

**Calibration:** NQ moves LESS in points than YM. NQ ~$15,874, daily-range med 254, 5m-ATR 12.6 vs YM ~$35,606, 389, 18.8. **NQ/YM range ratio ~0.65** (not 0.4). So NQ numbers = YM x~0.65; breakout best on the QF50 grid with params as YM-fractions-of-QF (brk .12, retest/bleed .16, stop .12, tp1 1xQF, ride 2xQF).

**RESULTS (2 micros, ~6yr):**
- **BREAKOUT-RETEST: CRACKS NQ.** Best = QF50, brk6/retest8/bleed8/stop6, ride+100: 1193 trades/yr, 39% win, **+3.12 avgR** (≈ YM's +3.3), net +$76,380, **+$12,730/yr, DD only $238.** Transfers cleanly — same engine, NQ numbers. (QF75 ride+150 also good: +$11,477/yr.)
- **COIL: does NOT transfer.** Best QF100 ~+$66/yr, QF75 negative. Marginal/breakeven.
- **PING-PONG: does NOT transfer.** Best QF100 edge20/edge ~+$81/yr, most negative. Counter-trade catastrophic (−$1,100 to −$1,750/yr, same as YM).

**WHY (the insight):** NQ (Nasdaq) is momentum/trend-driven and does NOT mean-revert at round-number QFs the way the Dow does. So the TREND strategy (breakout-retest = trade WITH the break + HL retest) works; the MEAN-REVERSION strategies (coil fade, ping-pong fade back to range) get run over. Round-number magnetism is a Dow/YM property, weaker on NQ.

**WIRED INTO THE BOT (2026-06-15):** service/breakout_nq_live.py (NQ breakout detector, NQ params, separate from the untouched locked YM detector) — 99.4% parity vs nq_breakout.py (parity_check_nq_breakout.py; 0.6% = same intentional 1-signal/bar cap as YM). Added to scripts/run_bot.py with a NQ validator config (_nq_overlay: grid quarter_size=50/half=100/full=200, stop_loss_min=4, tp1=50/tp2=100, symbol MNQ) routed separately from the YM validator. Demo (30 sessions): YM breakout 97 / pingpong 4 / coil 4 / NQ breakout 215, all routed through validator->execution->sim, 0 rejected. Locked YM detectors untouched; all NQ code in clones/new files.

**MULTI-PAIR SWEEP (2026-06-15) — tested breakout on ES/RTY/GC/CL/BTC (all in clones, locked YM untouched):**
- **BTC: ACCEPTED, best edge found.** breakout 24/7 (QF250 grid, ride 2xQF) = +3.41R, 41% win, ~2559 trades/yr, ~$37k/yr per 2 MBT, DD ~$210. 24/7 nearly DOUBLES RTH-only (BTC never sleeps + respects $250/$500 levels). Coil/ping-pong on BTC marginal (skip). Wired into bot: service/breakout_btc_live.py (99.5% parity), _btc_overlay (grid 250/500, MBT, 24/7 feed). MBT is a CME micro future (same execution path).
- **ES (S&P): rejected** — +2.89R but only ~$9.5k/yr (MES $5/pt); weakest, marginal.
- **GC (gold): rejected** — +3.12R but ~$9.7k/yr (MGC $10/pt), marginal.
- **CL (crude): rejected** — negative net (edge too thin vs commission).
- **RTY: skipped** — range 0.09x YM, smaller than ES.

**PATTERN:** breakout-retest = universal trend edge (cracks YM/NQ/BTC strongly, ES/GC weakly, CL not; EUR/USD ~+2.6R / $5-8.8k per 2 M6E, marginal). Ping-pong = YM-only. $ ranking per 2 micros real contract value: NQ ~$51k > BTC ~$37k > YM ~$22k > GC/ES/FX ~$9.5k.

**COIL CORRECTION (2026-06-15) — earlier "coil = YM-only" was WRONG, tested single-entry.** Jonathan caught it: the coil's ruleset is RE-ENTER each fresh QF bounce + STACK, which run_range_qf (single entry) doesn't model. Re-tested with stacking (backtest/coil_restack.py) + real contract $: coil is POSITIVE on the INDEX FUTURES — YM +$507/yr/micro (68% win, was $218 single-entry = stacking ~2.5x'd it), NQ +$440 (60%), ES +$209 (75%); BTC marginal +$110 (41%); EUR/USD none -$8 (54%). All SMALL/RARE (10-27 coils/yr) per micro — the real multiplier is leverage on Jonathan's 80% hand-selection (mechanical win 54-75% is the floor). FX coil confirmed dead even tested right. NOTE: the bot's coil_live is still single-entry (conservative); full re-entry/stacking is the discretionary hand-traded version.

**CONTRACT POINT VALUES (fixed in sims 2026-06-15):** MYM $0.50/pt, MNQ $2/pt, MBT $0.10/pt, MES/M2K $5/pt, MGC $10/pt. Backtest rep() defaults to $0.50 (MYM); multiply by the ratio for other pairs.

**BOT ROSTER (5 engines):** YM breakout + ping-pong + coil; NQ breakout; BTC breakout (24/7). All parity-locked, routed through per-instrument validators. See [[project-qf-ladder-backtest-findings]] and [[project-tastytrade-connector]].

**FULL-AUTO MANDATE (2026-06-16): Jonathan will NEVER trade manually — the bot must do 100%.** Breakout + ping-pong were already full-auto. The coil's only manual dependency was its ~80% hand-selection (for safe heavy leverage). Cracked it mechanically: swept rejection-bounce/daily-bias/time-of-day/strict-vol filters (backtest/coil_selection.py) — **daily-bias align is the winner: 69%->73% win, 17 coils/yr, Kelly 53%** (rejection filter hits 77% but only 4/yr = noise; 80% is NOT mechanically reachable at usable frequency — that last ~7% is genuinely his eye). LOCKED daily-bias into service/coil_live.py (default on; 100% parity vs run_range_qf(daily_bias=True); 130 tests green) + the 8%-capped leverage formula (service/coil_sizing.py). Result: coil is fully automated at 73% win / conservative 8% leverage = safe MODEST booster (NOT the 80%/heavy-leverage $1M rocket, which needed discretion). Honest trade: full automation costs the coil's top gear; breakout remains the workhorse (95% of edge). Bot now trades everything, hands-off.
