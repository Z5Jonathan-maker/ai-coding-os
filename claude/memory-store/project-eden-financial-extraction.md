---
name: project-eden-financial-extraction
description: "How Eden/ClaimPilot auto-populates accurate settled-claim financials (recovery, fee basis, commission) without manual input"
metadata: 
  node_type: memory
  type: project
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

Permanent solution for accurate CRM financials (built 2026-06, on Jonathan's Claude Max). The whole stack is keyed on the **claim number printed inside each document** — names lie (adjuster-email handles like "Coxadjusting", typos, co-insureds, repeat customers); the claim number is the only source of truth. Per user: "the claim number sorts that simply."

**Nightly pipeline** (`run_doc_sync.sh` → `com.careclaims.doc-sync.plist`, self-healing for old + new claims):
1. Sync new email attachments into each claim's documents.
2. `doc_reattribute.py --write` — reattach any doc to the claim whose carrier claim number is **printed in its text** ("Claim Number: X"). Rule: a doc stays if it carries its own claim's number; it moves only if it carries a *different* claim's number and not its own. Reversible via `reattributed_from`. Excludes CC-20260604-* shells and strict-prefix-collision claim#s. First run fixed 301 misfiled docs across 63 claims (Rutledge's docs were on Gabriel's claim; Augustine's docs stranded under a "Cox" adjuster bucket).
3. `run_settled_v3.py` → `payment_extract.py` — deterministic payment extraction.

**`payment_extract.py` (ATLP-CKD engine), the rules that make it correct:**
- Regex on the PDF text layer = byte-identical every run (no flaky vision for digital pages; vision only for image-only pages).
- ANCHORS = issuance phrases ("Net Cov A Payment", "payment/check in the amount of", "enclosed is a payment", "we are issuing"). Anchor H = bare "(payment|check|draft) in the amount of $X" was the key generalizer.
- **Anchor beats reject-proximity**: a net payment always sits next to estimate math ("Less Amount Over Limit … Net Cov A Payment $10,000"). `_anchored_amount` takes the amount adjacent to the anchor and only rejects true deduction lines (leading `-$`) and limit suffixes ("$10k per occurrence"). The old broad ±60 reject window was silently killing real payments.
- **Per-doc collapse**: same amount hit by multiple anchors in one letter = ONE payment (prefer typed coverage over UNSPEC). Stops Augustine double-counting her $10k Cov A.
- **Fee basis = covered-loss only**. FEE_BEARING = {A_Dwelling, Mold_Water, B, C, OrdLaw} + UNSPEC (bare "partial payment" = the covered settlement). Coverage D (ALE/Loss-of-Use) and interest are recovery but NOT fee-bearing (FL 626.854). `total_recovery` = all payments; `fee_basis_amount` = fee-bearing only; commission = basis × fee%.
- **Contamination guard** (`foreign_claim_doc`): refuse any doc that prints ANOTHER claim's number and not this claim's. Auto-flags residual misfiles → claim writes $0 instead of someone else's money. This blocked 19 wrong writes in rollout (Gabriel=Rutledge's $33,873, Milton=other people's $20,764).
- "sent separately" is boilerplate → advisory note, NOT a blocking flag.
- Auto-writes ONLY when flag-free AND fee_basis>0 AND not a CC-shell. `financials_source="atlp_ckd_deterministic"` makes every write reversible.

**Ground truth (validate engine changes against these):** Augustine 202510033592 = $20,000 basis / $4,000 @20% ($10k Cov A rebuild + $10k Mold; ALE+interest excluded). Rutledge 001-00-612431 = $33,873.15 / $3,387.32 @10% ($19,954.80 + $13,918.35 dwelling). Quinlisk 001-00-535777 = $10,776.34 @20%.

**Image-only payment letters:** fully-scanned letters (empty text layer) are read via `vision_page` (claude-opus-4-8, payment-only prompt). Gated to `doc_is_image and len(pages)<=12`, capped to first 4 image pages at 200 DPI — visioning every transmittal's signature pages or a 200-page photo bundle blew runtime to 1hr+. Vision ALSO returns `claim_number_on_page`; `_foreign_cn_value` drops the doc if it's another claim's number (the contamination guard for image docs, which the text guard can't see — caught 001-005-37395 trying to inherit Hilliker's $11k).

**Incremental:** `extract_claim(..., incremental=True)` skips a claim whose `financials_doc_sig` (md5 of sorted PDF doc-ids) is unchanged — for written AND no-payment claims, so unchanged scans aren't re-OCR'd. Sig stamped on every outcome. `run_settled_v3.py` is incremental by default (`--full` forces). A full run is ~45-60min (GridFS re-download + vision); incremental nightly runs finish in seconds once sigs are stamped. After 2026-06 session, 120 claims stamped.

**Rollout result (2026-06, final):** 47 settled claims written, **$632k recovered / $73.4k commission**, 10+ verified by provenance, 0 contaminated written. Anchor "I" ("payment being made to you is $X") added 1. NOTE the runner's printed commission total under-reports when claims are skipped unless the skip-return computes earned = basis×fee% (fixed). Revert tags: clear stale financials on BOTH `reverted_needs_review` (old) and `atlp_reverted_needs_review` (current) — Gabriel's two claims carried a stale $33,873.15 (Rutledge's) under the old tag until cleared. Honest remaining gaps: ~60 no-payment (settled-but-only-estimates / no letter in system — correctly $0), ~14 flagged review queue, ~10 text phrasings not yet anchored ("payment being made to you is $X", table "Payment $X"), 5 CC-shell duplicate claims (claim-dedup not built), a few image-only misfiles (e.g. Hilliker's stranded doc) needing vision-based reattribution. NOTE: full rollout ~45-60min — GridFS re-downloads ~1.6GB of PDFs + vision API latency; fine for nightly, slow to iterate.

Related: [[project-claimpilot-ci-lint-gate]] (run `uvx ruff check --select=E9,F63,F7,F82` before backend pushes), [[reference-fl-pa-law-verified-2026-06]], [[project-scales-xactimate-compare]]. Keychain service "claimpilot-scraper" holds MONGO_URL + CLAUDE_CODE_OAUTH_TOKEN. Atlas SRV needs `dns.resolver.default_resolver` = 8.8.8.8/1.1.1.1 before pymongo import.
