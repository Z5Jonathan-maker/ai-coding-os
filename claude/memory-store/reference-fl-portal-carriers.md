---
name: reference-fl-portal-carriers
description: "Which FL carriers are portal-first (thin email, need manual/portal entry) vs normal email — for Eden/ClaimPilot claim enrichment"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

For the Eden/ClaimPilot claim-enrichment pipeline, "portal-first" carriers route everything through their own portal (submit LOR/W9/estimate there), so almost nothing reaches the connected Gmail — those claims stay thin and need manual entry. The intake/enrich pipeline can't bridge them from email.

**Confirmed portal-first (manual / no email to mine):** Universal. Line is moving in that direction. Possibly one or two others (unconfirmed).

**NOT portal — email normally, fully mineable:** Slide, Tower Hill. (I wrongly assumed these were portal-only on 2026-06; user corrected. They have coverage letters / denial letters / LOR acks in email like any other carrier, and DOL/claim# extract cleanly.)

**How to apply:** Don't skip Slide/Tower Hill (or any carrier) in enrichment by assumption. Only treat Universal (and Line) as structurally manual. For everything else, mine the docs — the corroboration + conflict gate in `~/code/ClaimPilot-scraper/focused_dol.py` guards correctness. Relates to [[project-scales-xactimate-compare]] (same CRM ecosystem) and the carrier-email duplicate-shell intake bug.
