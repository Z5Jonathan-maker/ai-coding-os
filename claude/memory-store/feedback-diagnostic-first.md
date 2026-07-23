---
name: feedback-diagnostic-first
description: "When a system silently underperforms, build the diagnostic that exposes WHY before guessing at fixes — the surfacing tool itself often makes the fix obvious"
metadata:
  type: feedback
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
When a metric is bad and the cause is uncertain, do NOT immediately guess at a fix. Build the surfacing tool first — bucket the population, count the rejections by reason, HEAD-check the URLs, whatever exposes the live math. The diagnostic almost always makes the fix self-evident.

**Why:** Real production incident — an outreach pipeline showed "cap 1/300" daily. Three guesses at fixes failed (raised the cap, force-ran the cron, restarted the daemon). Then a 60-line diagnostic script bucketed the in-sequence leads by drip-readiness. Output showed 67 leads DUE_NOW but the send-batch found only 3 eligible — a 64-lead gap. Traced the gap in 10 minutes to a missing-field issue in the filter. 5-line fix landed the same cycle. Cap recovered from 1 → 74 sends that day (73× recovery).

**How to apply:**

1. **When a metric is bad and the cause is uncertain**, do NOT immediately guess at a fix. Build the surfacing tool first.

2. **Persist the diagnostic** as a script + cron, not a one-time query. The named skip-reason counter pattern is the canonical example.

3. **Diagnostics surface things you weren't looking for.** A filter-rejection counter built to investigate one bug often reveals two more — a structural bottleneck, a config drift, an unused index.

4. **A 5-line fix landing in 60s is often the payoff of 1-2 cycles spent building the diagnostic.** Don't skip the diagnostic to save time — the time you "save" is paid back when the silent failure hides for 2-3 more weeks.

**Common diagnostic shapes:**

- **Bucket diagnostic**: classify a population by readiness/eligibility. Shows distribution + edge cases.
- **Named skip-counter**: every rejection path increments a named counter. Shows WHERE the funnel narrows.
- **HEAD-check sweep**: probe every resource URL. Shows what's actually reachable vs assumed.
- **Drift detector**: aggregate vs ground-truth divergence. Shows when supervisor state ≠ recipient state.
- **Health monitor**: track output rate against expected. Catches silent-zero patterns within minutes.

**Pair with anti-pattern memories:** silent-skip + speculative-write + incremental-save are the "don't do this" memories. Diagnostic-first is the constructive complement: "when investigating uncertain root cause, build the surfacing tool first."

Anytime you find yourself about to ship a fix without understanding why the previous code was wrong, stop and build the diagnostic.
