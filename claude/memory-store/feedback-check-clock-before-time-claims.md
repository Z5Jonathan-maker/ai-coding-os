---
name: feedback-check-clock-before-time-claims
description: "Jonathan is US Eastern Time; always run `date` before stating times/countdowns — repeated drift from inferring time off stale context annoyed him"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

Jonathan's timezone is **US Eastern (ET)** — his machine and all trading schedules run on it.

**Why:** 2026-07-05 he called out "it's 8:32 a.m. my time, idk why you always can't keep context of
time" after I said "market opens in ~4 hours" when the CME open (Sun 18:00 ET) was ~9.5 hours away.
I had been inferring the time from stale tool timestamps instead of checking.

**How to apply:** before ANY statement involving current time, countdowns ("opens in N hours"),
or "today/tonight" framing in long sessions: run `date` (or `TZ=America/New_York date`). Long
sessions span hours-to-days — context timestamps go stale; the clock doesn't. Key anchors:
CME equity session Sun 18:00 ET open, Fri 17:00 ET close, 17:00–18:00 ET daily break;
trading window for the book 09:45–10:30 ET; payout windows per firm docs.
