---
name: feedback-speculative-write
description: "Never write a URL/file/email/identifier field that represents a created resource without verifying the resource was actually created — downstream code trusts the field"
metadata:
  type: feedback
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
Never write a field to state (tracker, db, json) that represents a CREATED resource — a URL, file path, email address, deployed-asset reference — unless you've verified the resource was actually created. Downstream code reads the field as a *truth claim* about reality.

**Why:** Real production incident — a backfill script wrote `mockup_url = https://example.com/${slug}.html` for every newly-ingested lead, assuming the static HTML files had been deployed. They hadn't. 3,939 leads ended up with mockup_url fields pointing to URLs that returned 404. A downstream send-batch had a `if (!lead.mockup_url) skip` gate — which failed OPEN because the field was non-empty (just wrong). If outreach had fired, 3,939 cold emails would have linked to broken pages. First-impression disaster + sender reputation hit. Spam complaints likely.

**How to apply:**

1. **Verify-then-write.** If your script generates a URL/file/email, first DEPLOY the resource. THEN write the field only after confirming the resource is reachable (HEAD-check, file-exists check, API status response).

2. **If you must write speculatively**, mark the field as unverified:
   ```javascript
   lead.mockup_url_pending = url;
   lead.mockup_verified = false;
   ```
   Downstream gates check the verified flag, not just presence.

3. **Add a verification sweep** for any speculative-write surface. A daily script that HEAD-checks all URLs in the tracker and nulls 4xx/5xx entries so the existing presence-gate works correctly.

4. **Treat third-party deploy state as canonical.** The local tracker's `field='...'` is an aggregate. The lowest-write signal is the actual deployed asset's HTTP response. Verify against the lowest layer.

**Example (HEAD-check sweep)**:

```javascript
const https = require('https');
function head(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD' }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.setTimeout(5000, () => { req.destroy(); resolve(-1); });
    req.end();
  });
}

for (const item of items) {
  if (!item.url) continue;
  const code = await head(item.url);
  if (code >= 400 && code < 600) {
    item.url = null;
    item.url_stale_cleared_at = new Date().toISOString();
    item.url_stale_reason = `HEAD returned ${code}`;
  }
}
```

Anytime a script writes a "this exists" field, add a verifier in the same PR.
