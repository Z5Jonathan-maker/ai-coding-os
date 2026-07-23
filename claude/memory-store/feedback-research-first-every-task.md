---
name: feedback-research-first-every-task
description: "Before ANY task (image gen, interactive feature, library choice, technique), research the current SOTA method first — never use dated defaults"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30d30640-e9d6-47cc-9733-84ca2af078f8
---

Before conducting ANY non-trivial task — generating a photo, implementing an interactive feature, picking a library, choosing a technique — FIRST perform research to find the highest-quality, most up-to-date method **as of the current date**. Never reach for a dated/default approach just because it's familiar.

**Why:** The user demands SOTA quality on everything and explicitly does not want stale methods. Tools, models, and best practices move fast; the training cutoff and routing docs go stale.

**How to apply:** For each task, do a quick web-research pass (research-scout agent or WebSearch/WebFetch) on the current best tool/model/approach + verify versions/availability, then execute with that. Applies even when an existing routing-table entry exists — confirm it's still the best as of today. Established during the UniFi/uunifi.com marketing revamp. Related: [[project-unifi-monarch-clone]].
