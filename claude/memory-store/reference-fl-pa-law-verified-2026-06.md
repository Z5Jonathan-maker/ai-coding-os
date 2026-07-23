---
name: reference-fl-pa-law-verified-2026-06
description: Verified current FL public-adjuster statutory deadlines (as of 2026-06-02) for the Eden/ClaimPilot CRM — use before touching any deadline/compliance/Brain content
metadata: 
  node_type: memory
  type: reference
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

Verified 2026-06-02 against official sources (leg.state.fl.us, flsenate.gov) for the Eden CRM (see [[project-claimpilot-deploy-reality]]). Post SB 2-A (eff. 12/16/2022) + HB 837 (eff. 3/24/2023). **Dual regime:** these apply to policies effective on/after the reform dates; pre-reform policies keep the OLD values.

| Rule | Current | Statute | Pre-reform |
|---|---|---|---|
| Acknowledge claim | 7 days | 627.70131(1)(a) | 14 |
| Begin investigation | 7 days (after proof of loss) | 627.70131(3)(a) | 14 |
| Physical inspection | 30 days (after proof of loss) | 627.70131(3)(b) | — |
| Pay or deny | **60 days from NOTICE OF CLAIM** (not date-of-loss/proof) | 627.70131(7)(a) | 90 |
| Notice — initial/reopened | 1 yr from loss | 627.70132 | 2 yr |
| Notice — supplemental | 18 mo from loss (hard bar) | 627.70132 | 3 yr |
| One-way attorney fees | **REPEALED for property** (HB 837) → 768.79 offer-of-judgment + 624.155 bad faith; NOT retroactive (5th DCA) | 627.428 (repealed); 86.121 excludes property | automatic |
| AOB | void, residential policies issued ≥ 1/1/2023 | 627.7152(13) | permitted |
| PA contract rescission | 10 calendar days (30 in declared emergency) | 626.854(7) | "3 business days" = pre-2021 stale |
| Breach-of-contract SOL | 5 yr from loss (UNCHANGED — HB 837's 2yr was negligence 95.11(3)(c), not contract) | 95.11(2)(e) | 5 yr |

Corrected in code (engines compliance_service.py, routes/compliance.py, routes/claims.py, claimpilot/agents/statute_matcher.py) on branch feat/email-intelligence-ui (cc5e526) and in the Brain. Curated `data/eve_knowledge_gaps.json` was already correct.

**Whole-brain QC done (b991590):** all 897 `eve_knowledge_base` chunks now carry `currency_status` (was 0). LLM-reviewed the 275 highest-risk (FL-legal cats + Merlin + carrier_playbook): 255 active, 17 informational_non_fl, 6 corrected total (superseded_law_corrected/annotated — non-destructive, `content_original` preserved, dated note prepended for RAG), 619 unreviewed low-risk (Zalma national / Xactimate technique). Brain is overwhelmingly current; only ~6 stale chunks across 897. The corpus is mostly Barry Zalma (52%, national insurance law, not FL-PA-specific).

**New-scraping freshness floor:** `services/brain_ingestion.ingest_document(..., published_date=)` rejects sources older than env `BRAIN_MIN_PUBLISH_DATE` (default 2025-01-01); undated accepted but tagged `freshness='undated'`; URL route auto-extracts publish date from page meta. Closes the 0/897-dated provenance gap going forward.

**Accuracy guards (added 2026-06-03) — these facts are now enforced, update them WITH this table if the law changes:** (1) `backend/tests/test_eve_legal_accuracy.py` runs in CI on every push — locks the authoritative-law crib in `EVE_SYSTEM_PROMPT` (and that the model default is opus-4-8); fails the build if any core fact regresses. (2) `backend/scripts/eve_accuracy_eval.py` is a live end-to-end eval (real opus + brain) — 10 golden Q&As scored against the running service, exit-nonzero on miss; run on demand before/after any prompt/brain/model change (`EDEN_TOKEN=<admin bearer> python scripts/eve_accuracy_eval.py`). Verified 2026-06-03: CI 11/11, live 10/10 on prod Eve.

STILL TODO: per-policy-date dual-regime branching (engines default to current values = stricter/safer for old policies); estimating $0 pricing bug; claim stage-event progression past inspection; LLM-review the 619 low-risk chunks if desired.
