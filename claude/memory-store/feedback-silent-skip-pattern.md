---
name: feedback-silent-skip-pattern
description: "Every filter/eligibility branch that drops a lead/item must increment a named counter — opaque skipCount totals hide multi-week revenue leaks"
metadata:
  type: feedback
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
Every `filter`, `continue`, or `return false` that drops a candidate from a batch MUST increment a named counter. A single aggregate `skipCount++` is opaque and hides bugs for weeks.

**Why:** Real production incident — an outreach pipeline silently skipped ~70 in-sequence leads with no diagnostic. The script's filter required a `baseDate` field from one of three properties that were all `null`. The lead was dropped at `skipCount++; continue;` with no log line. The scheduled task ran daily, exit code 0 (success), produced 0 actual sends. Hidden for 2-3 weeks. Cost: many cycles of follow-up emails never sent.

**How to apply:**

- When writing any filter chain (eligibility checks, due-date filters, dedup passes, etc.) define a `reasons = { reason_a: 0, reason_b: 0, ... }` object and `reasons.<name>++` at every drop site.
- Print the breakdown at end of run, sorted by count desc.
- Persist to `memory/<script>-skip-reasons.json` for daily monitoring.
- Even if a filter "obviously" rejects something legitimate (e.g. `status_terminal`), the counter still matters — it surfaces when "expected" buckets diverge from baseline (e.g. status_terminal grew 10× overnight = something is mass-marking dead).

**Example (Node.js)**:

```javascript
const skipReasons = {
  cap_reached: 0,
  status_terminal: 0,
  no_email: 0,
  not_due_yet: 0,
  // ... every distinct rejection reason
};

for (const item of items) {
  if (capReached) { skipReasons.cap_reached++; continue; }
  if (terminal.has(item.status)) { skipReasons.status_terminal++; continue; }
  if (!item.email) { skipReasons.no_email++; continue; }
  if (!isDue(item)) { skipReasons.not_due_yet++; continue; }
  // proceed
}

console.log('Skip reasons:');
for (const [reason, count] of Object.entries(skipReasons).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${reason}: ${count}`);
}
```

**Companion watchdog:** schedule a daily script that detects zero-output runs (scheduled task fired but log shows zero entries in the expected window). Catches future silent-skip patterns in <60min instead of weeks.

Apply this pattern to every new filter from now on.
