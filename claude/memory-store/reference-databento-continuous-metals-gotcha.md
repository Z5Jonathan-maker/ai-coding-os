---
name: reference-databento-continuous-metals-gotcha
description: databento .c.N continuous is calendar-ranked — for CME metals (GC/SI/HG) it selects near-dead serial months; use .v.0 volume-ranked
metadata: 
  node_type: memory
  type: reference
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

Databento continuous symbology `.c.N` ranks by **nearest expiration** (calendar), not liquidity. CME metals
(GC/SI/HG) list serial dead months, so `GC.c.0` etc. resolves to a near-dead contract (median daily volume
17–42 vs CL's ~219k; daily ranges ~0.66× the true front; "open gaps beyond prior range" on ~half of days —
pure thin-print artifacts). `.c.1` is NOT a fix (liquid/dead sawtooth by month). **Use `.v.0`
(volume-ranked) for metals** — verified byte-identical to independent 1-min front-month resamples on 100%
of common days (mym-autotrader H9 audit 2026-07-09). Energy/grains/index `.c.0` are fine (liquid front =
nearest expiry).

**Why:** this artifact manufactured a fake validated trading sleeve (MGC+MHG, "OOS +1.26") that died to
$197/yr on honest data — caught pre-funding by a placebo audit. Any strategy result computed on `.c.N`
metals bars is suspect until re-verified.

**How to apply:** when pulling CME metals from databento, request `stype_in="continuous"` with `.v.0`
symbols; when auditing an existing dataset, check median volume per symbol first — sub-1000 on a major
metal = wrong contract. Related: [[feedback-data-free-first-then-databento]].
