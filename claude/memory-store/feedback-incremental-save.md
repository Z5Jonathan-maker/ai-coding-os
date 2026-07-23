---
name: feedback-incremental-save
description: "Scripts that mutate state files (trackers, queues, DBs) must persist after EACH successful operation, not end-of-batch. SIGTERM/timeout mid-batch causes duplicate-action blasts."
metadata:
  type: feedback
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
Any script that mutates a state file (`outreach-tracker.json`, queue.json, db, etc.) MUST persist after every successful action, not only at the end of the batch.

**Why:** Real production incident — a follow-up email automator processed 50 leads, sent 30 via SMTP successfully, then hit a 480s timeout (SIGTERM, exit 143). Tracker state was held in memory and only flushed via `safeSaveTracker` after the loop completed — SIGTERM killed the process before that line. Recovery required scanning the send-log and reconstructing the diff. Without recovery, the next scheduled run would have RE-SENT to those 30 recipients. Domain reputation hit + spam complaints.

**How to apply:**

- After every `if (result.success)` branch, immediately call your save function. Wrap in try/catch so save errors don't abort the rest of the batch.
- Keep the end-of-batch save as an idempotent safety net (tag as `:final` vs `:incremental` for log distinction).
- ~50ms write cost per success is acceptable — alternative is N-action duplicate blast radius.

**Example (Node.js)**:

```javascript
for (const item of batch) {
  try {
    const result = await sendOrAct(item);
    if (result.success) {
      item.processed = true;
      item.processed_at = new Date().toISOString();
      sent++;
      // SIGTERM-safe: persist after every success, not just end of loop
      try {
        await saveState(stateObj, { caller: 'my-script:incremental' });
      } catch (saveErr) {
        log.warn(`Incremental save failed (continuing): ${saveErr.message}`);
      }
    }
  } catch (e) {
    // log error, continue batch
  }
}

// Final safety-net save (idempotent)
await saveState(stateObj, { caller: 'my-script:final' });
```

**Recovery script:** if you do experience a SIGTERM mid-batch before this pattern was applied, build a one-off script that reads the action-log (send-log, mutation-log, whatever) and reconciles state. Idempotent — re-running is safe.

Apply this pattern to every script that mutates state at scale. Never save-at-end.
