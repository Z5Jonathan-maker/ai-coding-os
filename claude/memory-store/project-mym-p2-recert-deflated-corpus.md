---
name: project-mym-p2-recert-deflated-corpus
description: "FALSIFIED 2026-07-14 (H157): the 32-cell P2 fade corpus '+$430k re-cert' was an instant-fill LOOK-AHEAD artifact. All 32 cells tested directly under honest fills -> 0/32 survive; corpus +$1.98M inverts to -$32k/-$160k. The +$430k re-cert fixed a direction-gate bug but never questioned the fill. Bury, do not deploy."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**VERDICT (H157, 2026-07-14): the entire P2 corpus is a fill fantasy — FALSIFIED, not frozen.** The founder
asked the crux question ("how did everything pass all prior fill/entry testing then fail?") and challenged that
the kill was an error on our end. A forensic audit + a full 32-cell honest re-cert answered it with receipts:
**0 of 32 cells survive honest fills + the full gauntlet.** Corpus net: **instant-fill +$1,979,127 → honest
stop-through -$32,150 → honest resting-limit-on-touch -$159,994.** The +$430,754 "re-cert gain" inverts to a
LOSS. Independently reproduced from the raw 1-min tape by three separate agents, matched to the dollar.

**Why the original H121-P2 (+$430k, committed bc4de51) was WRONG:** there was NEVER an execution-realism test
before H122. The certified engine books every fade INSTANTLY at the zone `z` at the arm bar's own close
(`qf_engine_multi.py:306`, `through=0.0` default); the honest-fill path (`wait_for_1m_fill`, gated by
`fill_wait_1m=True AND realizable=True`, `:325`) is OFF by default and was never pointed at the fades. The
+$430k re-cert (`recert_p2.py`) fixed a DIRECTION-GATE look-ahead (MTF `dir_at`, `realizable=True`) — a real
bug on a DIFFERENT code path — while leaving the instant-fill fantasy fully intact, so it inflated an
already-fake edge (that's the "buggy engine SUPPRESSED edge / Sniper|HE 1.47->80.1" surprise — a look-ahead
number getting bigger, not a real edge emerging). Every pre-H122 layer (deflation, OOS, placebo, tail, DSR,
PBO) tested "is the signal real GIVEN the fill?" — none tested "could we fill at all?"

**Mechanism, corpus-wide:** on **23-44% of every cell's signalled trades, price never trades back to `z`** after
the arm bar — physically unfillable for a resting limit. The instant model fills them at `z` anyway and rides the
immediate favorable move; those phantom fills ARE the entire edge. §12 LE +$260,792 -> -$16,871. §12 HE
+$240,494 -> -$9,954. Sniper|GC PF 42 -> +$16 (76 trades). PrecAM|NQ PF 69.6 -> PF 1.03/+$192. No honest fade
prints PF > 3; these printed 5-70 because they read the future. Best honest cell = Prec2|SI OOS PF 1.982 (under
the 2.0 floor, fails bootstrap p 0.279) — a statistical coin flip.

**The decisive tiebreaker (why no fill model rescues it):** with fills removed ENTIRELY and direction measured
from the NEXT bar, the fade is a coin flip (hit 0.497 vs random 0.492, MC p 0.39, `direction_real=false`). ORB5
through the identical machinery SURVIVES (PF 1.24, placebo p 0.06, boot p 0.004) — positive control proves the
test detects a real edge and stays dark on the fade. So it's a DEAD DIRECTION, not a harsh fill model. The
founder's specific objection (we conflated a resting LIMIT with a trade-through STOP) was tested head-on and
REFUTED: `forensics/h124/resting_limit_engine.py:227` fills the limit on TOUCH at `z`, no through required, and
even that charitable model kills all 32.

**How to apply:** BURY the P2 fade corpus — archive `results-recert-p2.json` as a confirmed look-ahead artifact,
never re-deploy any cell, stop re-litigating the mechanized fade (3 causally-clean tests now agree). Process fix:
an execution-realism gate + a look-ahead PF-fingerprint alarm (gross PF > 3 OR win% > 70 on a fade = presumptive
look-ahead) must be the FIRST rung of every gauntlet, BEFORE deflation/OOS/placebo (those cannot detect a uniform
fill fantasy). What's UNTOUCHED by this: ORB5, the MTF-gate sleeve, SMC reversal (different engines, no `dir_at`
look-ahead) — and the founder's DISCRETIONARY zone-selection, which a mechanical backtest structurally cannot test
([[feedback-backtest-measures-robot-not-trader]]). Forensics: `forensics/h157-full-corpus-honest-recert/`
(honest_recert.py, results.json, TABLE.md) + `forensics/h124/`. Related: [[project-mym-fade-doctrine-verdict]],
[[project-mym-precision-cs-parity-gap]], [[project-mym-strategy-search-verdict]].
