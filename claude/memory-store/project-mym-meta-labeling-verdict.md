---
name: project-mym-meta-labeling-verdict
description: "2026-07-18: meta-labeling (AFML ch.3+4+7, the 'highest-EV ceiling' lift) does NOT beat our best raw family. On 1119 honest-fill rsi2_mr trades (SPY/QQQ/IWM, raw PF 2.10, 75% win), the uniqueness-weighted purged/embargoed selector takes 100% at the natural p>=0.5 -> meta-PF==raw-PF. Toolkit now complete (added ch.4 weighting, dfbd7a46) but the lift is honestly null."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The highest-EV lift, honestly tested = NULL.** Method-1 meta-labeling (a trained secondary selector that mechanizes the human "which signals to take") was named the one lever with a real edge ceiling. Built the missing companion + ran the definitive experiment.

**Toolkit (backtest/meta_label.py) is now COMPLETE + rigorous:** IRLS logistic regression (interpretable, coefs printed) + purged/embargoed CV (ch.7) already existed; **added AFML ch.4 sample-uniqueness weighting** (dfbd7a46, `average_uniqueness` + weighted `fit_logreg` + `meta_label_cv(uniqueness_weight=True)` reporting `eff_frac`). Overlapping labels no longer over-count -> shrinks the effective sample -> STRICTER, not looser. 5 tests green.

**The experiment (rsi2_mr, our best family, 14 survivors):** 1119 honest-fill trades across SPY/QQQ/IWM (features STRICTLY at the signal bar, no look-ahead; outcome from fills.realize_entry/exit directly, 1:1). raw win 75.2%, raw PF 2.103. Uniqueness-weighted purged/embargoed CV: **eff_frac 0.368** (heavy ETF overlap), and at the natural equal-cost p>=0.5 threshold the selector **takes 100%** -> meta-PF == raw-PF == 2.103. NO improvement. The only stable feature is `ext_atr` (trend-extension in ATR units, +coef sign-consistent all 5 folds -- more extension -> higher win prob) but it cannot form a profitable gate because the base win rate is already so high.

**Why null (not a bug):** when the primary is already GOOD, meta-labeling has little to gate ("if the algorithm is bad, meta-labeling only reduces the downside" -- de Prado). p>=0.5 is the only non-hindsight threshold; higher thresholds = the threshold-scanning the module cautions against. A payoff-ASYMMETRY-aware threshold (MR wins small / loses big) is the one remaining honest-but-careful test -- but that is a prereg shot, not a free scan. Consistent with [[reference-where-verified-edge-lives]], [[reference-what-the-research-points-to]], the module's own Hawkes demo, and the whole kill-by-default doctrine: no easy edge at retail. DO NOT re-chase meta-labeling as a magic bullet. Reproduce: scratchpad/rsi2_metalabel_experiment.py. Related: [[project-mym-engine-self-learning-live]].
