---
name: feedback-coach-belongs-to-dosecraft
description: "Ownership boundary between Coach (chat AI), Dosecraft (platform/LLC owner), and Aurex (preferred vendor that surfaces Coach as a feature)"
metadata:
  type: feedback
  originSessionId: 7ca6b78d-a40a-41a5-85df-7ca126a674d3
---
Coach (a.k.a. "Coach by Dosecraft", peptide-research chat AI at coach.dosecraftapp.com) is a **Dosecraft product**. Aurex **leverages** Coach as a feature (PDP cross-links, social bio, partner placements) but does NOT own it.

**Why:** Three-entity structure must stay clean for trademark, FTC disclosure, and partner positioning:
  - Dosecraft LLC owns dosecraftapp.com, Coach product IP, the editorial corpus, and the multi-vendor rubric.
  - Aurex is one of three vendors (preferred per rubric, not exclusive). Aurex surfaces Coach as a value-add for buyers but Coach must remain vendor-neutral on the public side.
  - Conflating them would (a) muddy Aurex's "preferred vendor" framing into "captive store," (b) blow the FTC disclosure posture, (c) create trademark confusion when filing Class 9+42 for "Coach by Dosecraft."

**How to apply:**
  - Always describe Coach as "a Dosecraft product" or "Coach by Dosecraft" — never "Aurex's chat" or "Aurex Coach."
  - In Aurex code/copy, refer to it as a partner / cross-link / external feature, never an internal one.
  - In Dosecraft Companion code/copy, treat Aurex as one vendor among three; never hardcode Aurex preference into Coach output (the rubric does that publicly).
  - Repo ownership: dosecraft-companion repo is the source of truth for Coach. Aurex repo only contains cross-link components (e.g. PdpDosecraftLink), never Coach logic.
  - When the user says "Coach" — always Dosecraft-owned. When the user says "Aurex's Coach feature" — that's the surfaced cross-link, not ownership.

**CRITICAL: The Aurex Telegram bot at @Aurex33bot is NOT Coach.** That bot is the Aurex catalog/order desk — pricing, COA lookup, payment rails, order placement. It is NOT a dosing/peptide-education brain. Coach (Dosecraft) handles dosing/education and lives in the Dosecraft app.

Surface labels that Aurex code MUST use for the Telegram bot (not Coach-attribution):
  - "Ask Aurex" / "Ask Aurex on Telegram"
  - "Aurex catalog and ordering desk"
  - "Aurex on Telegram — catalog · COA · ordering"

Never label the Telegram link as "Coach", "Aurex Coach", or "Coach by Dosecraft". Per Jonathan (2026-05-10): "where it says coach chat by Dosecraft and you click it, [it] links to the Telegram chat, which is something totally different. That's an RX spot to place orders and to answer questions about our catalogue. The coach chat is built into Dosecraft as a master brain all in one stop for questions on dosing." He prefers minimal cross-links to Coach from Aurex — keep traffic on Aurex where the research is sold.
