---
name: project-mym-journal-mirroring
description: MYM live journal mirrors the same signal across 3 prop accounts — 214 trades = 99 unique (2.16x); always dedup before any significance test
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

The mym-autotrader live trade journal (`forensics/raw/trades-full.json`) executes the SAME
decision simultaneously across multiple prop accounts (Sim101 + TDFYSL150239294520 +
GFTESPRINTJONATHAN), so raw trade counts are **pseudo-replicated**. As of 2026-07-19:
**214 raw trades = 99 UNIQUE signals (2.16x inflation).** Per-instrument raw→unique: MNQ 70→41,
MES 38→17, MYM 37→20, LE 24→**4**, YM 15→9, MBT 12→4, M2K 12→3, HE 6→**1**.

**Rule:** before ANY per-trade statistic or significance test (first-passage binomtest, PF,
DSR), dedup to unique signals — key = (normalized instrument root, side, entryTime-to-minute,
round(entryPrice)). Keep ONE representative per unique signal; for realized P&L use the median
across the mirrored copies (do NOT sum — that inflates P&L by the account count too).

**Why it matters:** every raw p-value is ~2x over-confident, and the small-instrument cells
(LE=4, HE=1, MBT=4, M2K=3) are 1–6 copies of a single decision. Caught when `?/MNQ/short`
faked STRONG p=0.008 n=18 — really 6 trades on one day (2026-07-14) triplicated across 3
accounts. This is the same class of self-deception as the fill fantasy and the anchor illusion
([[project-mym-entry-edge-verdict]]): the sample looks bigger and more significant than it is.
Wired into `engine/forensics/entry_truth.py` dedup 2026-07-19 (`_sig_key` + `_dedup_mirrors`,
median P&L not sum).

**TWO layers of pseudo-replication — account dedup is NOT enough.** After account-mirror dedup
(214→99), the lone "STRONG" cell `?/MNQ/short` (n=10, p=0.021) survived — but all 10 unique
decisions were on ONE day (2026-07-14): same-session serially-correlated fades of one intraday
move. Effective independent-n ≈ the number of DAYS, not trades. Always check same-day/session
clustering too; the honest unit is the distinct intraday move. Follow-up queued: day-level
clustering guard (effective-n in days / block-bootstrap by session).
