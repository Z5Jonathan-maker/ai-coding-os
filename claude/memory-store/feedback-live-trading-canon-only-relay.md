---
name: feedback-live-trading-canon-only-relay
description: "During live trading sessions, relay ONLY canon journal signals — never raw scans, non-canon lanes, or directional narrative near execution time (2026-06-12 wrong-direction incident)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

2026-06-12, first live canon trade morning: Claude streamed a SHORT narrative for
2 hours (news read), then relayed a NON-canon ES BREAK SHORT from a raw monitor
scan, then a stale-data YM SHORT, minutes before the canon signal fired LONG.
Jonathan, executing on a $140 real-money account, took/nearly took the wrong
direction. His verdict: "We don't have room for errors like this. Unacceptable."

**Why:** mixed-trust channels during execution = direction confusion with real
money. Raw scans lack the watchers' gates (bar-age, canon lanes, vol/macro
gates); narrative bias primes the wrong direction; the human acts on the last
thing heard, not the official card.

**How to apply:**
1. During live sessions, the ONLY signal relay = the official trade journal
   (trade-journal.jsonl), which is canon-gated upstream. Never relay raw
   scan_lanes output as if tradeable.
2. Context/analysis is allowed but must be labeled "context (NOT a signal)"
   and never carry an entry/stop/target.
3. Market-bias narrative (news reads, chart leans) stops when a position is
   being placed — the card is the card.
4. Monitor scripts for live mornings: journal-tail architecture (see
   /tmp/morning_watch.py v2 pattern; rebuild from this spec if lost).
Related: [[project-textbook-open-lane]], [[reference-bcfx-strategy]].
