---
name: project-claimpilot-financial-layer
description: ClaimPilot Financial Intelligence Layer — phases 1-3 + Eve context + projections SHIPPED 2026-06-10; payment ledger is source of truth; review-gate philosophy; what remains
metadata: 
  node_type: memory
  type: project
  originSessionId: a074d906-6a7e-4987-9095-d38d6fc5d1fa
---

ClaimPilot's Financial Intelligence Layer (Jonathan's "CRM is 40% there" push, 2026-06-10).
Spec: `docs/specs/financial-intelligence-layer.md`. ALL SHIPPED same day (commits
ed43199, 202cfc5, 8c22350): **claim_payments ledger** (per-check: type acv/depreciation/
supplement/ordinance_law/mitigation, lifecycle issued→received→deposited→cleared,
per-payment fee math), **claim_events** append-only log (wired into claims domain-event
bus), **email→ledger extraction** (regex + Claude second pass via Eve bridge, PA-nuance
prompt), **backfill endpoint** (idempotent over email_logs history), **carrier/adjuster
intel** (`/api/intel/*` — response latency, escalate-vs-amicable read), **metrics**
(`/api/metrics/cycle-times|financial-summary|projections`), **Eve full-claim-story
injection** (eve_chat appends render_context_for_ai when a claim resolves), UI: Payments
tab in ClaimDetails + /payments-review queue + /financials page.

**Hard rules baked in (don't regress):** fee % NEVER defaults to 20 (unknown ⇒
needs_review, signed-LOR rule); machine-extracted payments NEVER count toward revenue
until human-confirmed (review queue is the gate); commission settlement_amount is now a
PROJECTION of the confirmed ledger (recompute_claim_rollup).

**Why:** PA claims pay in installments with different fee treatment; the old commissions
model had ONE settlement_amount per claim — Jonathan's core complaint.

**How to apply:** new payment-related features go through `services/payment_ledger.py`
(not direct db writes) so events + rollups stay consistent. Eve context comes from
`services/claim_context.get_full_context`. Remaining (user-facing next steps): Jonathan
runs "Backfill from email history" on /payments-review against real prod data, then
tune extraction on what it gets wrong; carrier playbook narratives from intel data into
the Brain; [[user-business-email]] gets the briefings.
