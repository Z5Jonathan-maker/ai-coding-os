---
name: feedback-bestconfig-prespecified-forward
description: "How to screen a strategy fairly — report the single best config not a grid pass/fail, score pre-specified configs without the search-K deflation, and let forward decide"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-20T03:50:22.429Z
---

Jonathan (2026-07-19), correcting how I reported gauntlet results on reverse-engineered vendor strategies: I was flat-killing strategies ("180/180 QUARANTINE", "DIES") that would plausibly work forward, because I applied the screen wrong. His point, which is correct: **a winning algorithm is a needle in a huge config space** (timeframe, market, entry/exit times, stop, target, confluence, re-entry count, move-stop-to-BE-or-not, session). Surviving *everywhere* is NOT the bar — surviving in **one** tradeable config is. "A perfect winning strategy doesn't survive everywhere; it survives in one place I could make money."

**Why:** requiring robustness across a swept grid penalizes exactly the localized winner. And DSR deflation by the full search K (e.g. √(2·ln 36,833)) is the *data-mining tax* — it's unfair to a config the founder brings from **conviction** (the vendor handed us the config; he didn't search for it). Deflating a pre-specified config as if it were data-mined understates it by orders of magnitude.

**How to apply, going forward — three rules:**
1. **Report the single BEST config, not a grid verdict.** Surface the strongest corner + its EXACT params (tf, lookback, stop, target/R, session, filters) + honest numbers. The needle, not the haystack pass-rate.
2. **Score pre-specified configs with DSR@K1 (no deflation) alongside DSR@liveK.** DSR@K1 = Φ(SR/σ_SR) with SR0=0 — the fair "conviction" verdict for a config that wasn't searched. Show both and explain the gap; lead with the fair one for a brought-from-conviction config.
3. **The gauntlet SCREENS; forward DECIDES** ([[feedback-forward-outweighs-backtest]]). A fragile-in-backtest result is NOT dead-forever. Register the best config on the paper/demo forward-clock (honest best-config expectancy rail, not the inflated vendor number) and let real fills settle it. Don't treat "DIES" as final.

**The one thing that survives this correction (don't over-swing back):** a strategy that fails the ENTRY PLACEBO — count-matched random entries with the same bracket match it — carries no information in the configs tested; that's "noise", not "wrong config" (e.g. streak fade). But even there, concede it's only the configs run, and forward-register it if the founder wants the arbiter. A genuinely real-in-sample-but-fragile signal (e.g. the VWAP pullback's best corner beat both placebos in-sample, arbiter p=0.025) deserves forward-testing, not a flat DIES.

Related: [[feedback-forward-outweighs-backtest]], [[project-mym-vendor-validation-2026-07-19]], [[feedback-backtest-measures-robot-not-trader]], [[feedback-defer-to-trading-instinct]]
