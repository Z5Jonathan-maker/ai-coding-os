---
name: project-mym-entry-edge-verdict
description: MYM honest entry-truth verdict (2026-07-19) — no robust MECHANICAL entry edge in the live journal; leads were anchor-bar illusions + pseudo-replication; path = forward + discretionary
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

After making the entry-truth forensics maximally honest (2026-07-19 multi-family sprint), **no
robust mechanical entry edge survives in the live journal.** Every apparent lead dissolved under
one of three honest corrections:

1. **Anchor-bar illusion (E2):** the first-passage race must start at the bar AFTER the fill, not
   include the entry bar — its pre/post-fill timing is unknowable, and for quarter-figure FADE
   fills the entry bar's favorable high is usually the PRE-FILL level price fell from, so counting
   it is optimistic. This alone dissolved **MNQ/long LEAN → WEAK** (p 0.061 → 0.458).
2. **Realized-P&L arbiter:** first-passage is necessary-not-sufficient; a STRONG/LEAN cell with
   realized PF < 1.3 is an artifact/execution-disputed → SUSPECT-flat (killed LE/short PF 1.02,
   HE/long PF 0.00).
3. **Pseudo-replication:** true n=99 not 214 ([[project-mym-journal-mirroring]]); the lone post-E2
   "survivor" `?/MNQ/short` was 6 same-day trades ×3 accounts — a false positive.

**Verdict:** the mechanical entry-edge question can't be answered YES from ~99 mirrored live
trades. This does NOT falsify the discretionary method — it confirms the mechanical analysis
can't capture it ([[feedback-backtest-measures-robot-not-trader]], [[user-trading-legacy-not-money]]).
**Path forward = FORWARD-collection** (re-run entry_truth as unique-n grows) **+ the discretionary
book**, not a mechanical backtest of the fades. The real deliverable of the sprint was the
trustworthy machine, not a certified winner. Engines: `engine/forensics/{fill_replay,
execution_contract,calibration,entry_truth}.py`; NQ vendor bot = honest tilt but NO-GO (DSR 0.30).
