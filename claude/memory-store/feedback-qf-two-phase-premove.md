---
name: feedback-qf-two-phase-premove
description: "Jonathan's core QF read — first touch is a PRE-MOVE (liquidity grab), the real trade is the failed-retest RE-ENTRY at the same QF; systems must signal the re-entry not the first touch"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Jonathan's actual QF brain (taught live 2026-06-15 watching YM/MYMM26 morning): a quarter-figure move comes in **two phases**, and my scanner/backtests have been signaling the WRONG one.

- **Phase 1 = the pre-move.** First touch of the QF fades, grabs the obvious liquidity, bounces. It LOOKS like the trade. It is NOT — it's the setup. It validates that the level is live and clears out weak hands.
- **Phase 2 = the real trade = the RE-ENTRY.** Price comes back to the QF it already broke, **fails to reclaim it**, and THAT failed retest is where the size/big move goes — the pre-move stacked the real sellers (or buyers) at the level. Example this morning: dump 51,875→51,750 + bounce back = pre-moves; the conviction short was the re-entry at 51,875 on the failed reclaim.

**Why it matters:** the live scanner + ping_pong/range backtests fire on the FIRST touch (the pre-move) and call it the signal — backwards. They must instead detect: QF break → return to QF → failed reclaim → THEN signal. The re-entry is the trade; the first touch only proves the level.

Connects to his existing edges: re-entry-only-on-win discipline, "load big size on the QF re-tap" stacking, and [[feedback-backtest-measures-robot-not-trader]] (mechanical first-touch backtest = strategy with HIM removed; the pre-move/re-entry discrimination IS his edge). See also [[feedback-defer-to-trading-instinct]] and [[reference-bcfx-strategy]].

**The management that makes it near-zero-drawdown (taught 2026-06-15 via this morning's YM tape, 2 micros @ 51,875 QF short):**
1. Enter **2 positions** at the QF (51,875).
2. Price hits **TP1 = ±125** (51,750) → **pull ONE contract**, bank +125 (~$62.50 on MYM @ $0.50/pt).
3. **Move the runner's stop to +50** (51,825) — a *locked-profit* stop, not breakeven.
4. Price reverses → runner stops out **in profit at +50** (~$25). So the first entry is GREEN both ways — TP on one, profit-stop on the other. The reversal pays you, it doesn't cost you.
5. Price returns to the QF (51,875) = the failed-retest re-entry → **re-enter 2 positions** for the real move.

The first entry pays you to wait for the re-entry. **Re-entry only happens BECAUSE the first scalp won** — the level proved itself, you booked profit both directions, THEN you reload. Never re-enter an unproven level. This is the same engine as the half-out manager + stacking in [[project-mym-live-config]] and [[feedback-defer-to-trading-instinct]] — the two-phase structure (this note) and the half-out/re-entry management are ONE picture, not two.

**CONFIRMED ENTRY RULE (Jonathan, 2026-06-15 — implement EXACTLY, don't substitute):**
- **Entry = LIMIT at the QF**, filled on the tag. Do NOT wait for a rejection close. Any tag of the QF triggers the fill — no specific candle (not "the 9:30 candle"), no close-confirmation.
- **Initial stop = ABOVE the rejection wick** (the high of the spike for a short / low for a long) — NOT a flat 50. A flat −50 sits exactly on the wick and gets stopped before the move (proven: on 2026-06-15 the 09:30 open wicked to 51,925 = QF+50 exactly; flat-50 stop = −2R, stop-above-wick = the full winning cycle).
- **The "+50" is the runner's STOP-PROFIT**, not initial risk: once the first position reaches its target (TP1 +125), the runner's stop moves to +50 (lock). On a range reversal the runner stops in profit at +50.

**Proof (today's YM replay, backtest/live_replay.py, halfout_lock50, limit@QF + wick stop):** NAIVE first-touch+flat-50 = −2.00R (stopped on the wick, never in). HIS rule = +12.58R, every leg green, 3 re-entries. Across 6yr history (entry still first-touch in that harness) lock50 mgmt = highest win 44% / lowest DD 795pt. The remaining brokenness is ENTRY TIMING in the historical setups() generator + the live scanner (both still first-touch) — port limit@QF + wick-stop there next.

**PING-PONG REGIME RULE (Jonathan, 2026-06-15):** in the ping-pong (range) regime, do NOT counter-trade. If you DO take a counter-trade, use VERY TIGHT stops above the QF (for a short) / below it (for a long). I.e. ranging fades get tight QF-hugging stops — the opposite of the breakout trade's wider structural stop. Bleed minimal when wrong; the level either holds immediately or you're out cheap. (Distinct from the open-fade initial stop which clears the wick.)

**How to apply:** when building/tuning any QF signal — model entry = limit at QF on the tag, stop above the wick, half-out + runner→+50, re-enter at QF after a TP1. Regime-specific stops: ping-pong fades = very tight above/below the QF (no counter-trading); breakout-retest = stop under the HL/structure (wider, ride to +250). The current live scanner + ping_pong/range backtests fire on first touch with flat stops = WRONG. Tooling: backtest/live_replay.py (today's tape), backtest/pyramid_sim.py mode='halfout_lock50'. Still-open: (1) does a held reclaim of the QF flip it to the opposite-side trade? (2) sizing on pre-move vs re-entry — same N each time per today, confirm.
