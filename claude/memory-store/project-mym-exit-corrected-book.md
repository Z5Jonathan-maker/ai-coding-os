---
name: project-mym-exit-corrected-book
description: "Exit glitches stole ~$7,220; recorded book = FLOOR; 0 revive; ship .cs fix not re-enable"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-20T21:34:55.518Z
---

# MYM exit-corrected book (2026-07-17)

Book: `mym-autotrader/vault/02-strategies/EXIT-CORRECTED-BOOK-2026-07-17.md`

Founder's point, in numbers: the 3 live exit bugs — EXIT-1 pre-TP1 lock-trail (arms leg stops at
entry±LockTo once favExt≥LockTrig<Tp1 → normal retrace scratches before TP1), EXIT-2 dead-BE after
TP1 (guillotines B/C runners on a routine post-TP1 pullback), EXIT-3 Ramp 09:30 flatten (kills a
pre-open ramp before its ladder fills) — **stole ≈ $7,220 of realized edge** from winners the bots
fired correctly. Recorded book is a FLOOR.

Verdict across 11 re-judged cells: **0 REVIVED · 4 STILL-THIN · 7 GENUINELY-DEAD**. Skeptic both
ways held (each reproduced buggy net to the dollar; 0 fabricated winners). No cell revives: positive
cells still fail DSR@familyK (≪0.5) and/or the direction placebo; dead cells lose on ENTRY (bad-entry
fades, MAE≈StopPts) where correcting exits recovers pennies or makes it WORSE (HE:s12 −$3,443).

Biggest give-backs: Ramp MNQ +$2,879 (→+$4,789, closest to a revival but DSR 0.386<0.5), Ramp MES
+$2,137, Ramp MGC +$966, LE:s12 +$637, M2K:s12 +$579. The $7,220 is a FIDELITY LIABILITY (forward
guillotine exposure the fixed .cs removes), not a resurrection.

F5 punch list (exact .cs fixes): EXIT-1 lock off-ladder-or-post-TP1 (Prec 351-373 / Ramp 44-50);
EXIT-2 remove dead-BE (Prec 374-388); EXIT-3 Ramp 930→1600 cap; EXIT-6 wrong-side stop guard (Ramp
47-49). Ship as fidelity fix, NOT a re-enable — no cell sized up on the give-back. Fixing live IS
fixing the record. 0 new K; decision-support only, F5 for any live change.
