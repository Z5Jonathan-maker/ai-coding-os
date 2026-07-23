---
name: project-mym-fidelity-certificate-2026-07-16
description: "4-axis fidelity certificate 2026-07-16 — bot FAIL (v2 faithless BOTH ways incl. over-fire), backtest/entry/exit GAP; v2 cert PFs invalid until deploy-state reconciled; F5 queue + permanent gauntlet stage"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

2026-07-16 Fidelity Certificate (workflow wf_061cc689-651, 60 agents, 49 findings → 41 survived adversarial verify, 0 critical):
**bot=FAIL, backtest=GAP, entry=GAP, exit=GAP. "NOT secure" headline.**

- **Bot FAIL:** deployed `Area61Precision_v2.cs` (100% of live money: 6 Tradeify + 2 Goat) is a faithless port — 13.3–43.8% day-match vs certifier (H119). Missing **day-commit latch** → **OVER-fires** on MTF-reject/multi-bar-retry, booking trades OUTSIDE the validated set. **SUPERSEDES the "net conservative / under-fires" read in [[project-mym-precision-cs-parity-gap]] — v2 diverges BOTH directions; treat all v2 cert PFs as INVALID until the deployed NT8 binary hash is reconciled with certified source.** Parity-clean v3 exists but is NOT compiled/deployed.
- **Backtest GAP:** law-#3 randomized-direction placebo (engine/gauntlet/placebo.py) defined + unit-tested but **never called by the live gauntlet path** — only hand-run forensics invoked it. Count-matched placebo under-counts (unsorted picks). CSCV/PBO offline.
- **Entry GAP:** certifier MTF gate defaults `realizable=False` → reads just-started bucket + ~60s-future close = look-ahead the closed-bar .cs cannot reproduce → certified edge inflated. ORB scan bleeds past 16:00 ET.
- **Exit GAP:** lock-trail (LockTrig≈0.6·step, LockTo≈0.04·step) LIVE on all 6 funded lanes scratches full 3-unit position ~+3pts before ladder pays (bug #8). Second independent confirmation of the Ramp/LE exit-law defect. Certifier also fills stops exactly at st (no gap-through) understating losses.

**F5 queue (founder):** 1) VPS binary-hash vs certified source, v3 Sim101 forward-diff then swap; 2) day-commit latch; 3) H115 break→continue revert; 4) exit lock arms only after TP1.
**No-F5 engine fixes (agent may do):** wire direction placebo into gauntlet path, realizable=True default, pin faithful-cert flags per funded cell, stop gap-through realism, RTH-bound ORB scan.

Artifacts: `vault/03-failed-research/fidelity-certificate-2026-07-16.md`, permanent stage `vault/FIDELITY-GAUNTLET.md`, decisions.md L7494. Restack (real P(pass)) is gated on backtest axis re-certifying clean after the no-F5 fixes.
