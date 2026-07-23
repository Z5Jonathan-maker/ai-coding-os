---
name: project-mym-overnight-scalp-falsified
description: "Overnight QF-FADE has no edge (coin flip) — but Jonathan's ESTABLISHED-RANGE method DOES work (PF 1.28, validated 2026-06-25)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

**Two findings, don't conflate them (2026-06-25):**

**1. The QF-FADE overnight is dead.** ScalpRotation_v1 (lone-QF-tap fade, +15/-8) = ~37% win = bracket geometry by chance; the "75% bounce" was a 4pt tick artifact. Exhaustively falsified (`backtest/scalp_recal.py` + `backtest/overnight_scalp.py`): contrarian vs directional-EMA, light-vol, 6 brackets, 4 EMAs, 4 sub-sessions — NOTHING crosses PF 1.0 (0.83–0.98). A lone QF is 50/50 on direction. DO disable ScalpRotation_v1; do NOT loosen its filter. The §13 "directional ping-pong (EMA bias)" claim was also a backtest artifact.

**2. Jonathan's REAL overnight method WORKS — it's an ESTABLISHED-RANGE play, not a fade.** (His spec, his words 2026-06-25; I initially strawmanned it and wrongly declared overnight dead — corrected.) Method: overnight low-vol consolidation → price establishes a RANGE that uses a QF as ONE edge (support OR resistance), the OTHER edge a drawn line where touches cluster (range often SMALLER than 125, e.g. ~40pt). Wait until the range is ESTABLISHED (QF edge bounced ≥2x), enter AT the QF edge, TIGHT stop just beyond the QF, **target = the OBSERVED opposite edge** (not a fixed QF distance), trade WITH the oscillation, re-load each return to the QF. **The range-IDENTIFICATION is the alpha.** `backtest/ping_pong_v2.py`: PF 1.28, +$6,751/yr/micro, 7/7yr green, IS(1.29)≈OOS(1.28), survives 3pt slip (1.18). Robust at every param (lookback/touches/de/stop/range-band all green). Default: look=30m, tol=12, min_touch=2, rng 35–130, de_max=0.45, stop_buf≈18–25.

**IMPLICATION:** the overnight income engine is THIS (the range method), not ScalpRotation. Revives the overnight lane killed in the scalp-falsification. NEXT: lock config → NinjaScript bot (replace ScalpRotation on Sim101) → forward-test (the live range-identification is the gate). Update STRATEGY.md §13. Hard lesson re-confirmed: backtest his REAL method, never a strawman ([[feedback-backtest-his-real-method-not-strawman]]). Affects [[project-mym-best-playbook]].
