---
name: project-mym-mtf-gate-golden-standard
description: "MYM fades now carry the 4H/1H/30M MTF trend gate as golden standard (validated OOS, wired across Pine+detectors+NinjaScript); prop playbooks need re-sorting"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

2026-06-28: Jonathan's "open 3 charts (4H/1H/15M); all green→buys only, all red→sells only, mixed→skip"
rule is now the **golden-standard MTF trend gate on the 4 QF fades** (§12/Sniper/Precision×2) in mym-autotrader.

Key findings (don't re-derive):
- The edge is the **forming-candle** read (price above each period's OPEN = "green right now"), NOT the
  last-completed candle — `request.security(lookahead_off)` gives last-completed and it's a DUD (§12 PF 2.33).
- **4H/1H/30M beats 4H/1H/15M** on every fade AND needs only the 30m bar every layer already has (self-contained,
  no sub-30m data, no request.security — track 4H/1H period opens natively + use the 30m bar's own open).
- OOS (held-out 2024-26, parameter-free gate): §12 PF 11.65 / 82% win / $-per-DD 124; Sniper 8.07 / 75%; P2 3.45
  (weakest OOS but still ≫ base). **Fades ONLY — NOT ORB (gate measured to HURT it, PF→0.93), N/A RangePlay.**

Wired ON by default everywhere (one consistent gate): Pine (`4_visual_YM.pine` mtfGate default ON +
`0_combined_YM_webhook.pine`), Python (`service/mtf_gate.py` MtfGate → the 3 `*_live.py`, default mtf_gate=True;
parity scripts pass mtf_gate=False so ungated base stays byte-faithful), NinjaScript (`MtfGate` [NinjaScriptProperty]
default true on QfVwapReentry_v6 / Area61Sniper_v2 / Area61Precision_v2, sandbox-compiled clean).

OPEN: (1) NinjaScript is STAGED in repo only — rollout = Write→F5→redeploy MtfGate=true→Sim101 forward-test→live.
(2) The gate changes the fades' economics (far fewer trades, much higher PF/win) → the **prop-firm playbooks need
re-sorting** (per-account ramp + account counts + monthly-rev shift); flagged in vault/04-playbooks/_INDEX.md, do
after the Sim101 forward-test. Canon: mym-autotrader/docs/ai-memory/decisions.md (2026-06-28) + STRATEGY-ATLAS.md.
Relates to [[project-mym-30min-migration]], [[project-mym-live-config]], [[project-mym-best-playbook]].
