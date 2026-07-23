---
name: project-textbook-open-lane
description: "The validated US30 NY-open \"textbook\" lane (PF 1.63) — canon trigger corrections from full transcript re-read; what was tested and rejected"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Built 2026-06-10 after the missed ~900pt 50,750 short. Full transcript re-read
(preserved at `mym-autotrader/docs/strategy-source/transcripts/` — 46.7k words)
exposed that our trigger spec deviated from BCFX canon: the body>=50% filter was
OUR invention (canon = max wick <= body, pinbars OK); canon also requires zone
QUALITY (daily area with multiple prior reactions, mod2) and ROLE matching (a
zone's rejection history has a side).

**Validated spec (PF 1.63, +0.38R, 3yr Duka, 3/4 years positive):** 15m AREA-61
contrarian trigger at a LARGE quarter with >=3 same-side daily rejections in 30d,
stop beyond the session extreme, targets next large quarters, one-move-a-day NY-open
discipline. Engine: `mym-autotrader/service/textbook.py`; study:
`backtest/textbook_study.py`; live: `us30-dashboard/textbook_live.py` + watch.py
(textbook lane outranks the 1H swing lane in the 9:25–11:35 window).

**Why:** the system was firing garbage (stale 4H bar, TP1=the-zone-itself bug,
both fixed same day) while blind to the real open-session move.

**How to apply:** never re-test these REJECTED variants without new evidence —
5m trigger TF (PF 1.21), 2.0 confirmation lane even fully gated (PF 0.82),
momentum/pdc bias filter (worse), tightening tol (hurts). Calibration caveat:
yfinance vs Duka daily OHLC skews role counts ±1 near the threshold — ENTER NOW
needs role>=3; OPEN WATCH ping covers role 1–2 zones with the 30d history line.
Related: [[reference-bcfx-strategy]], [[project-mym-autotrader-assistant]],
[[feedback-one-trade-per-day-ny-open]].

**UPDATE 2026-06-11 — "THE ONE":** Jonathan locked the SNIPER siege config as canonical
(spec + numbers in mym-autotrader decisions.md 2026-06-11): 4+ taps at proven LARGE QF,
9:30-11:00 entries, one/day, cluster stop, QF-grid ladder, lock@+75. 75% win / PF 1.74 /
DD $3,470 / 20 trades/3yr on clean real-YM. Champion variant = volume version.

**UPDATE 2026-06-14 — CANON v2: per-pair sweet spots wired; RTY DEMOTED.** Multi-
objective optimizer (win+PF up, drawdown down, volume floor) + full battery (era-split
+ grid-nudge) found and validated each pair's sweet spot. WIRED: YM siege tap<=5 +
entry>=9:50 (89.5%/PF 5.62/DD-net 0.08); BTC siege tap<=5 + $2k-figure (87.5%/PF 8.86);
ES already double-gated (10Y-falling + concentrated-wall role_days<=4, PF 5.25). Tap-cap
principle live (fade<=5 taps; 6+ = break territory — the two lanes confirm each other's
boundary). **RTY DEMOTED from canon** — net-negative in the rigorous harness across ALL
windows + variants (the locked PF 2.26 was a looser-harness artifact; 77% win masked
sub-1.0 PF from small-cap tail moves). RTY now research-only. Empire = YM/ES/BTC live +
GC rare-bird. Self-running weekend battery scheduled (cron Sun 8am). Full ledger:
mym-autotrader/docs/ai-memory/decisions.md 2026-06-14.

**UPDATE 2026-06-12 — empire mega-sweep locked (full ledger in decisions.md 2026-06-12):**
corpus method (signals + post-hoc combos + era-split + nudge battery; ES's "100% win"
died at reproduction — corpus champions MUST reproduce in a clean full-run first).
Locked: GOLD ONE paper lane (settle siege x ORB-against, PF 5.3-6.6, ~8/yr); YM crown
TAG (overnight-extreme wall + VWAP-contra, tag-only on live siege alerts); BTC lane 2
paper ($2,000-figure break, PDH/L-confluent, ORB-aligned, PF 3.70/94%). RTY/ES baselines
stand (their champions were artifacts). Unifying law: QF power spikes where overnight/
prior-day extremes coincide + mega-figures outrank quarters + ORB context picks the side
(indices=with-trend pullback, gold=counter-trend extension fade).

**UPDATE 2026-07-13 — HONEST-FILL RE-CERT: the ARCHETYPE survives, this CONFIG is FRAGILE. Do NOT
treat "PF 1.63 validated" as certified.** During the fill-fantasy investigation (H122-H124 killed the
whole QF LIMIT-fade catalog as ~80% look-ahead), H126 honest-fill-verified this lane as the
CONFIRMATION-TRIGGERED template. GOOD NEWS: the confirmation-trigger MECHANIC survives honest fills —
entering at the 15m wick-rejection's REAL close (not a limit at the phantom zone) degrades PF only
1.79→1.44 (~20% haircut), NOT the sign-flipping collapse (10-100→<1.0) that vaporized the limit-fade.
That is the proof-of-concept: the confirmation entry is the honest-fill-robust archetype. BUT this
SPECIFIC config does NOT deploy-certify: under the full kill-by-default gauntlet it FAILS the OOS
count-matched placebo at every split (P_oos 0.13/0.34/0.23, all above the 0.10 kill bar), OOS third is
thin (PF 1.15, expR -0.16 at 70/30), and the edge lives ONLY at role>=3 (role 1/2 net-NEGATIVE honestly
filled). So it is a real FULL-sample edge (P_full 0.037) that OOS is not separable from random NY-open
fading. Trade small forward-paper only, do NOT scale, "PF 1.63" was optimistic. Forensics:
forensics/h126/us30_open_template/. The right next move (running as H127): re-cut the dead QF-fade family
as the founder's REAL two-phase re-entry and re-run the honest gauntlet. Related:
[[project-mym-precision-cs-parity-gap]], [[feedback-backtest-his-real-method-not-strawman]].
