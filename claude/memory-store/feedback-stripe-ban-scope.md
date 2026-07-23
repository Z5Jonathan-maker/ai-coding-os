---
name: feedback-stripe-ban-scope
description: The Stripe ban applies ONLY to RUO peptide brands — NOT the Eden/ClaimPilot internal CRM
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

The global "Stripe is BANNED" rule (in CLAUDE.md) is scoped to the **RUO peptide vendor brands** (DoseCraft/Aurex/etc.) where Stripe poses RUO-vendor account risk. It does **NOT** apply to the Eden/ClaimPilot CRM, which is an internal tool that does not process customer card payments at all. Stripe being present/mounted in the ClaimPilot backend is fine — do not flag it as a violation or try to rip it out.

**Why:** the ban exists to protect peptide-vendor payment processors, not to forbid Stripe everywhere.

**How to apply:** when auditing ClaimPilot/Eden, treat Stripe as a non-issue. Only enforce the NMI Direct Post / BTCPay requirement on the RUO peptide storefronts. Relates to [[project-claimpilot-deploy-reality]] and [[project-eden-financial-extraction]].
