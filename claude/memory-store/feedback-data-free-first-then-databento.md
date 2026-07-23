---
name: feedback-data-free-first-then-databento
description: "Founder standing rule — when a strategy test is blocked on missing data, exhaust FREE quality sources first (CBOE, CME settlements, Stooq, FRED, exchange sites, Nasdaq/Yahoo, academic repos), then fall back to databento (paid) only if free is inadequate. Never let a data gap kill a promising archetype."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

Founder directive (2026-07-09): "if we are ever missing data, exhaust all resources to find quality data free first or use databento." A data gap is NOT a reason to grave a promising strategy — it's a data-acquisition task.

**Why:** carry/term-structure (one of the most-triangulated edges in the literature — MOP, Erb/Harvey, Koijen/Moskowitz/Pedersen) was BLOCKED because our databento files are front-month-continuous only (no 2nd contract month). That's fixable, not fatal.

**How to apply:** on any "blocked-pending-data" verdict — (1) FIRST exhaust free quality sources: CBOE (free VIX9D/VIX3M/term data), CME/exchange settlement pages, Stooq, FRED, Nasdaq Data Link free tiers, Yahoo, academic/quant repos; verify quality (real settlements, correct units, adequate history). (2) ONLY if free is inadequate, pull from databento (key in Keychain: `security find-generic-password -s databento -a api -w`; cost-gate the pull like `scripts/pull_gc_virgin.py` — the founder pre-approved reasonable pulls, but estimate/bound cost and report it, don't blank-check). (3) Then run the test. Related: [[feedback-never-claim-exhausted-keep-hunting]], [[reference-tradovate-api-access]].
