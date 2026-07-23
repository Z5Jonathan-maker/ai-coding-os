---
name: project-payout-vault-closed
description: "Payout Vault course ($87, fMSS/CSD SMC model) fully extracted and CLOSED 2026-07-10 — do not reopen mechanized tests; only his live trade breakdowns (tier-2, pending) remain of value"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

The Payout Vault arc (mym-autotrader H35-H37 + H43, all committed 2026-07-10) is **closed, fully
extracted**. Final ledger of what the $87 bought:

1. **Third confirmation of the Area61 law** — the written rules of a real discretionary trader test
   coin-flip-or-worse when mechanized (corrected engine at the author's true cadence: win 18.7-23.1%
   vs ~28% cost-adjusted 3R line, placebo P 0.35-0.85). The author later CONFIRMED this himself in
   Telegram: "will always fail a fully automated backtest by design... the real edge is in execution
   and filtering."
2. **A tested fake-MSS/CSD state machine** (`scratchpad/h37_corrected.py`, reproduces his worked
   examples) — reusable toolbox code.
3. **H43 A/B verdict:** our displacement trigger DOMINATES his CSD trigger inside the certified SMC
   CONF sleeve (OOS PF 2.81 vs 1.96, +0.747R vs +0.505R) — and CSD-50% is **strictly implied by
   displacement (100% trade overlap)**: his trigger is a coarser subset condition, not a sharper
   signal. Displacement stays the sleeve trigger; +4 looks carried into CONF v2's pending CPCV/DSR.

**How to apply:** never re-test PV mechanics as bots — everything deployable was tested and lost.
The ONLY remaining PV value: his live trade breakdowns = discretionary study material (journal-style).

**UPDATE 2026-07-13 (H-payoutvault re-crack, new site payoutvault.one, founder re-purchased "The Vault"
tier + gave engine code 7314).** Full re-extraction committed to `forensics/payoutvault/`:
- **The Model** re-pulled clean = The Vault.rar (public Vercel blob, unsigned) -> 34 md + 23 images.
  Same ICT/SMC method (DOL->inducement sweep->CSD body-close-through-50%->target DOL, 3R). CONFIRMS the
  H43 finding: CSD = displacement subset, our trigger dominates. Nothing new to mechanize.
- **The tier-2 "tool" is now RELEASED = the "Vault Engine"** — and it's a **thin gemini-2.5-flash wrapper**
  (raw Gemini API response leaks: modelVersion, usageMetadata) over FREE public macro data (Yahoo/CFTC-COT/
  FRED-netliq/CME-ratepath/FINRA-shortvol/breadth/seasonality/correlation + news). `POST /api/engine?
  action=bias` {email,code} -> LLM bias/score/confidence/drivers/flip per NQ/ES/GC, **1 scan/day/email**.
  Supporting data actions are OPEN GET (no auth). Code 7314 is hardcoded CLIENT-SIDE. Zero moat — we can
  clone it with our own router+Gemini in an afternoon. It's CONTEXT ("a lean, not a signal") =
  [[feedback-live-trading-canon-only-relay]] NOT-a-signal; do NOT trade mechanically, cannot be honest-fill
  backtested. Spec: forensics/payoutvault/ENGINE-CRACKED.md + MODEL-DIGEST.md.
Related: [[feedback-backtest-measures-robot-not-trader]], [[project-mym-smc-reversal-7th-sleeve]],
[[project-tradex-orb-digest]].
