---
name: feedback-kimi-leads-design-and-code
description: "Updates the prior "KIMI generates design → Claude translates to code" rule. For design-first tasks (audits, redesigns, UI/UX work), KIMI now leads end-to-end including the code implementation. Claude orchestrates, reviews against compliance constraints, and ships."
metadata:
  type: feedback
  originSessionId: 7ca6b78d-a40a-41a5-85df-7ca126a674d3
---
**SUPERSEDED 2026-06-11 (founder decision):** design routing to KIMI predated
Fable; Jonathan now routes ALL design-first work to Claude (Fable) directly —
"I think you're more than capable and competent to handle the design route
yourself." CLAUDE.md MULTI-MODEL ROLE SPLIT + routing tables updated same day.
KIMI keeps the browser lane (WebBridge) + bulk fallback only. The text below
is retained for history.

---

For Aurex (and similar design-first work), KIMI now takes the lead end-to-end — INCLUDING the code-implementation step. This supersedes the prior CLAUDE.md rule that said "KIMI generates → Claude translates pixel-accurately".

**Why:** With the 4-modal router live (tierDesign = KIMI K2.6 via kimi-cli), KIMI can be invoked programmatically via `router-ask` / `router-route`. The handoff seam (KIMI design → Claude code) was friction; routing the entire design+code lane through KIMI removes drift and lets KIMI own pixel-accuracy across both spec and execution.

**How to apply:**
- For design audits, redesigns, UI/UX changes, layout composition, brand-fidelity execution involving visual surfaces: dispatch to KIMI via `router-ask` (or `router-route` to force tierDesign). KIMI produces the audit AND the code diffs.
- Claude's role for these tasks: orchestrator (route the request), reviewer (verify KIMI's output against compliance constraints — RUO copy, Stripe ban, lib/env.ts, Janoshik COA, no therapeutic claims), and shipper (git, deploy, post-merge hygiene).
- For backend/system/data tasks: Claude remains primary, no change.
- Source the ecosystem env first: `source ~/code/scripts/ecosystem-env.sh` (sets `ROUTER_ROOT`, exposes `router-*` aliases).
- Verify the router is healthy before dispatching: `router-ping` should show all four tiers green (tier1, tier2, tier3, tierDesign).
