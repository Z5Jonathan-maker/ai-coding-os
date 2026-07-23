---
name: project-mym-smc-reversal-7th-sleeve
description: "SMC reversal (founder's ICT checklist) tested on YM 2026-06-28 — QF coincidental, but HTF-gated+session/ATR config (CONF) is an additive candidate 7th sleeve; edge transfers cross-instrument; pending CPCV/DSR hardening"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-28: Founder gave a precise ICT/SMC reversal checklist (liquidity sweep → MSS → 0.71 fib + order-block confluence → limit → stop beyond sweep → 2R) + his quarter-figure addition, asked to A–E-matrix-test whether QFs add edge on YM. Built `mym-autotrader/backtest/smc_reversal.py` (backtest-only; 1-min YM 2021–26; R-multiples net of $4.5 RT+1tick; full + OOS 2024–26). His "4H/1H/30M all-aligned" HTF filter IS our MTF gate (reused).

**QF = coincidental, NOT additive edge.** A (QF off) PF 1.63; B (QF must-align) 1.81 full but INVERTS OOS (1.46 < A 1.54). Tell: D≈E (QF-align with gate OFF = PF ~1.05 = nothing) → QFs only "work" where the gate already put you. Soft at-QF/not split also evaporates OOS. Re-confirms reversals don't cluster at QFs; don't gate this model on QFs.

**The SMC ceremony is null without the gate** (D/E PF 1.05 — matches the killed bare-IFVG/sweep verdicts). The EDGE = **MTF gate + NY session (09:30–16:00 ET) + high-ATR regime (≥median)**. OOS-surviving single-adds: NY-session (PF 2.10), high-ATR (2.07). FVG-confirm HURTS (1.04); opposing-liquidity TP worst (1.03), fixed 2R/3R win; VWAP overlaps regime; BE/partials/trail smooth DD only.

**CONF = SMC + gate + NY-session + high-ATR + 2R:** YM OOS PF 2.01 / +0.52R. **Additive 7th-sleeve candidate** (NOT a §12 repackage): daily-R corr to §12 −0.10 / fade book −0.07; 11% same-side day overlap; adding it equal-risk improves the book (OOS R-per-DD 49.9→53.6, OOS maxDD 19.0→18.6R). **Edge is market-agnostic** (gross PF holds OOS: YM 3.1/NQ 2.7/ES 3.4/RTY 3.7) but net is micro-cost-bound: deploy YM (primary)+NQ (secondary); ES marginal; RTY cost-broken (3pt stop on $0.50 instr).

The MTF gate is now the validated core edge across a THIRD strategy family. Filed: `vault/07-opportunity-pipeline/smc-reversal-htf-gated.md` (status validating) + decisions.md 2026-06-28c. OPEN gates: CPCV/DSR + robustness + per-year DONE (survives, ~75% confidence) → Pine/parity DONE (detector+NinjaScript+Pine built, parity YM 98.5%) → Sim101 forward-test (gate before live).

**CONF v2 (2026-06-28d):** tested the public guru canon (Turtle/Raschke/ORB/Market-Profile-80/VWAP-cont/Donchian) AND the reconstructed "James Storms" US30 model on YM — ALL NULL after costs except one find. James's model = mechanically identical to CONF; his "tiny risk → giant runner" management FALSIFIED (runner LOWERS OOS exp; top-5 runners only 5-27% of net — no fat tail). His returns = leverage/survivorship, not mechanics. The ONE adoptable upgrade = the **DISPLACEMENT candle** (body ≥ 1.0×ATR14(5m) between sweep & MSS) → CONF OOS PF 2.0 → 3.26; + 1/3 scale-out ladder (1R/2R/3R, BE after TP1, smooths equity, win 66%) + Asia/London session H/L sweep refs (~2× frequency). Baked into the v2 detector/NinjaScript/Pine. Public canon null is filed at [[guru-canon-and-james-storms]] (vault/03-failed-research) — don't re-test. Relates to [[project-mym-mtf-gate-golden-standard]], [[project-mym-qf-falsified-orb-validated]], [[reference-ig-trading-ad-vetting]].
