---
name: reference-lor-fee-extraction
description: Where the PA fee% lives (the signed LOR) and how to read it — the authoritative fee source for Eden/ClaimPilot commissions
metadata: 
  node_type: memory
  type: reference
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

The PA fee% for a claim is **ALWAYS on the signed LOR** (the Care Claims representation contract) — do NOT infer it from peril/hurricane/emergency heuristics. Heuristics fail on real exceptions: compromise agreements with homeowners, and **referral-partner fee cuts** (e.g. a 20% claim dropped to 10% as a courtesy). The LOR is the only authority.

**Where on the LOR:** the last/signature page, as a filled blank — "____10____% percent of the amount of any new claim payments after entering into this agreement." It is flattened to an IMAGE, so the PDF text layer has NO `%` tokens — **vision is required** (point Opus vision at the last 1-2 pages of the `Care_Claims_Contract*.pdf`). Verified: Sue Keyes' LOR p6 reads "__10__%" = her real 10%.

**The exceptions (fee% NOT readable from our system):**
- **Portal-only carriers — Frontline and Universal (+Line)** submit the LOR via the carrier's own portal, so the signed LOR is NOT in our Gmail/doc store. These need manual fee entry. (Slide & Tower Hill email normally and ARE mineable — see [[reference-fl-portal-carriers]].)
- **Off-doc discounts:** if a referral discount was agreed but the discounted/signed LOR copy wasn't synced, our system may only hold the standard-rate contract (e.g. Sherri Dunkelberger's synced contract shows 20% but her real fee is 10% — the discounted LOR isn't in the system). Reader returns the contract rate; the PA overrides + it locks.

**Design:** vision-read the LOR fee blank (incl. handwritten overrides) → set fee%. Where the LOR is absent (portal carrier) or the read is uncertain → FLAG for manual, never silently default to 20%. User overrides set `financials_locked=True` and are never overwritten by re-extraction. Relates to [[project-eden-financial-extraction]].

**Stop re-asking the user about this — it's settled.**
