# Feedback Laws

Public fixture for `cc-feedback-law-check`. The live source is
`~/AI-SYSTEM-V2/memory/feedback-laws.md`; this file preserves the public
contract when the local control plane is absent.

| Law | Trigger | Required Behavior |
|---|---|---|
| Action Law | Audit finds broken/stale/missing thing | Fix one concrete instance or log the blocker |
| Diagnostic First | Cause is uncertain | Build/read a surfacing check before remediation |
| Diagnose Before Remediate | System degraded | Trace root cause before restart/reset |
| Dump Keys | Structured state surprises you | Inspect keys before destructuring |
| Silent Skip Counter | Code drops candidates | Count rejection reasons |
| Incremental Save | Batch mutates state | Persist after each mutation |
| Speculative Write Ban | Writing URL/path/email/asset | Verify resource before writing it as truth |
| Atomic Shared State | Multiple writers touch JSON | Write temp file, then rename atomically |
| Failure Cache Tiering | Caching provider failures | TTL by failure class |
| Pressure Gate | Long autonomous task | Check machine pressure first |
| Exit-Code Discipline | Scheduled audit/check script | Nonzero only on crash; log issue count |
| No Held Cycles | No fresh user task | Pick soft failure, drift, docs, tests, or memory |
| Depth Compounds | Loop keeps cycling | Prefer root-cause/structural work over micro-edits |
| Stop Asking | Operational task underspecified | Pick safest sensible default unless hard stop applies |
