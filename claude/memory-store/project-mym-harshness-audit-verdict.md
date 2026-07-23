---
name: project-mym-harshness-audit-verdict
description: "2026-07-17 full-humility audit of ALL gauntlet components (same humility as the fill fix): tail-floor IS mis-calibrated (wrong functional form, too harsh on fat-tails) but kills nothing the placebo/bootstrap don't; screen-K was too LENIENT (fix=tighten); commission over-harsh by design but neutral; OOS/sample/slippage/liquidity FAIR. NET JUSTIFIED REVIVALS = ZERO. The day's kill-conclusion holds across the whole calibrated gauntlet."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-17 (commit b74b132, report-only):** Audited every gauntlet component for excess harshness with the same humility that found the fill-model tick. Per-component verdict:
- **Tail-floor (ex-top-1/ex-top-3) = MIS-CALIBRATED** — prime suspect CONFIRMED. Fixed k=3 is not scale-consistent (~0.3% haircut at n=1000 vs ~10% at n=30): too HARSH on real fat-tailed edges (false-kills 62-83% of the real ORB5CT/MES edge at n=30-200) AND too LENIENT on diffuse fakes (0% catch of a 12-lucky-print fake). BUT it flips NOTHING — every tail victim also dies on the direction-placebo + IID bootstrap + t-test. **Correct fix = demote ex-top-1/3 to a REPORTED DIAGNOSTIC, drop redundant tail_ex1 (ex3>0 => ex1>0), make the DIRECTION PLACEBO the primary real/fake discriminator for fat-tailed families.** Matches Providence's flag-not-kill. This is a LOOSENING (changes no live verdict) -> needs founder sign-off.
- **DSR / cumulative-K = FAIR** (logarithmic hurdle; over-kills nothing justified). The one "mirage revival" (BandMomentum MNQ DSR 0.687@K=6) dies at the honest discovery grid K=120 (0.188) AND on the live board (absent families default K=1000 -> 0.056 DEAD; never in candidates/graveyard). Actual fix runs the OPPOSITE way: screen-K in family_k.json was too LENIENT (band=6, ramp=16) -> TIGHTEN to discovery-grid counts (>=120). A tightening = money-safe.
- **OOS 70/30 = FAIR** (kills survive the split sweep + show genuine recent decay). Floated CPCV/WF-majority swap is TOO LENIENT (launders recency, would revive PrecAM|ES unjustified) -> REJECTED. Optional tightening: single-point -> fraction-BAND [0.60,0.80] (verdict-neutral).
- **Entry commission $2.50/side = TOO HARSH ~2.7x by design** vs venue $0.91-0.95, but verdict-NEUTRAL (futures friction tiny vs contract notional; only flip band is PF~1.0 noise). Leave.
- **Sample floor / +1t entry slippage / liquidity gate = FAIR** (power-justified; entry genuinely crosses the spread unlike a resting stop; liquidity gate dormant/test-only).
- **Gates p-value/PF = re-measuring Fable-only** (the K3-send that blocked it was the problem, not the measurement).

**HEADLINE: net justified GREEN/Tier-2 revivals across all 8 components = ZERO.** The gauntlet is NOT systematically too harsh; the two too-harsh legs (tail-floor wrong-form, commission margin) flip nothing, and the single most actionable correction is a too-LENIENT screen-K (a tightening). The day's kill-conclusion holds across the whole calibrated gauntlet. Related: [[reference-providence-alpha-rigorous-peer]], [[project-mym-fill-calibration-vindicated]], [[project-mym-fade-doctrine-verdict]].
