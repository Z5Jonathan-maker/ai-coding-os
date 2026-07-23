---
name: feedback-winner-needs-programmable-spec
description: Every discovered/certified winning strategy MUST auto-ship its exact programmable automation spec — no spec = only half the job
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3b289b3d-0c88-4130-961c-1a57c5d0da66
  modified: 2026-07-23T13:48:42.470Z
---

Founder directive 2026-07-23: whenever the machine mines/certifies a WINNER (any lane — CWAP
receipt-mining, the gauntlet's own generated cells, C2/STC/fxblue/myfxbook harvests), it MUST
automatically produce the EXACT spec sheet needed to program it for full automation. Identifying a
reproducible track record is only HALF the job; the codeable counterpart (exact entry trigger, exit/
stop/target rules, gate, session, sizing) is what makes it an adoptable, tradeable winner. "That's why
it's a winner" — a winner without its automation spec is incomplete.

**Why:** the whole point of certifying an edge is to DEPLOY it. A catalogue of admiration (net$, parity
R², win-rate) without the "here's the if-then logic to code" spec cannot reach the bot. We were doing
half the job.

**FIDELITY IS THE WHOLE POINT (founder 2026-07-23, second directive):** ANY deviation between the found
winning strategy and its automated counterpart means it is NOT the same strategy — and a different
strategy flying the winner's name is how the account BLEEDS. So the spec is not "done" when written; it
is done when the CODED spec, replayed on the winner's own tape, REPRODUCES THE WINNER'S ACTUAL TRADES
(same entries, same exits, same P&L) at parity. This is CWAP parity extended from P&L-reproduction to
DECISION-reproduction: fx_pnl.py already reproduces the $ at R²~0.997; the spec must additionally
reproduce the entry/exit DECISION SEQUENCE. If the coded version's trades diverge from the receipts, the
reconstruction is wrong (incomplete) -> iterate the spec until it matches, or reject it. No trade-level
fidelity = not a winner, do not deploy.

**How to apply:**
- Wire spec-emission into the certification pipeline so it runs on EVERY new certified winner, not
  manually. (`engine/knowledge/adopt_specs.py` is the seam — was MANUAL_TOOL; must auto-run with the
  funnel/catalogue refresh.)
- The spec must be MECHANICAL/codeable, not just a profile (desk/session/bias/RR is not enough). From
  receipts, decompose: entry-relative-to-reference-level, stop distance (loss-move distribution),
  target distance (win-move distribution), hold, direction, session, per-trade R.
- Then CODE it and run a FIDELITY GATE: replay the coded spec on the winner's tape, assert it reproduces
  the receipts' trade sequence (entry/exit timestamps + prices + per-trade P&L) within tolerance. A
  passing fidelity gate is the definition of "adoptable." Same discipline as the live-bot fidelity gate
  (`scripts/fidelity_gate.py`) that already guards OFF-BOOK/NAKED/drift on the funded seats.
- HONESTY: for RECEIPT-mined winners the spec is a REVERSE-ENGINEERED reconstruction (we infer the rule
  from their trades) -> the fidelity gate + Sim101 FORWARD-TEST confirm it. For the gauntlet's OWN
  winners the spec IS the generating code (fidelity inherent). Never present a reconstruction as the
  trader's actual code, and never deploy one that fails trade-level fidelity.
- The gauntlet's certified cells also carry exact specs -> keep an authoritative bot-spec sheet
  (vault/02-strategies/BOT-SPEC-SHEET). Links: [[project-mym-winner-catalogue-cwap]]
  [[project-image2code-pipeline]] [[feedback-parity-confirms-winner]] [[feedback-forward-outweighs-backtest]]
