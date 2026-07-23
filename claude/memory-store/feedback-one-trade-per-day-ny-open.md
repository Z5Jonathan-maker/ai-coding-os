---
name: feedback-one-trade-per-day-ny-open
description: "Jonathan trades ONE US30 move per day, set at the NY open, then stands down — the system must be one-and-done, not all-day firing"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Jonathan's actual BCFX/Area 61 trading discipline: **he takes ONE trade per day**,
set up in the morning for the **New York open (~9:30 ET)**, and then he's done —
he does NOT keep trading all day. "We catch our one move a day."

**Why:** confirmed live 2026-06-09. The morning short (51,238, off the 51,250 QF)
was the golden one-move-a-day trade (+2.45R win). The afternoon LONG @ 50,500 the
watcher also fired was exactly the kind of extra all-day signal he'd never take —
and it lost (price ran to his called 50,250 zone). Matches Brandon's psychology
lesson: patience, wait for THE setup, don't overtrade. Also: his edge is picking
the RIGHT (high-confluence) zone, which the mechanical "fire at every QF" doesn't —
a lone large quarter (50,500) is weaker than a cluster (50,250 large + 50,125 halfway).

**The rule, refined (2026-06-09):** ONE *move* per day, taken during the **NY open
session**. NOT "one alert ever" — **re-entries on the SAME move are allowed**: if
stopped/whacked out but the move is still valid (level holds, setup re-triggers),
re-enter the same idea (small adjustments). This is Brandon's "if it spikes you
out, you still know what to look for — re-enter; the 4th/5th catches the runner."
**Hard no-no:** once past the open session / once we're in our move, do NOT keep
trading or chase new moves through the day. Different new setups later in the day
= forbidden. The discipline is: work THE open-session move (re-entries ok), then
stand down.

**Precise session timing (confirmed 2026-06-09):**
- **8:30–9:30 ET = SETUP window** — pre-open. Price tests/chops the QF; mark the
  zone, build the read. (This pre-open chop around the QF before the 9:30 pop IS
  the AREA 61 5-min scalp setup.)
- **9:30 ET = NY OPEN** — volatility enters, the move plays out.
- **In by ~10:00 ET or it's too late** — HARD CUTOFF for NEW entries.
- After ~10:00: manage / re-enter the SAME move only; ZERO new-direction alerts;
  no chasing the rest of the day.

**How to apply (system design — for the mym-autotrader / us30-dashboard rebuild,
NOT yet wired):**
- Setup heads-up fires pre-open (existing 8:30 brief + 8:45 scan already do this).
- Watcher fires NEW-entry alerts only **9:30–~10:00 ET**; after 10:00, NO new moves.
- Within the window, allow **re-entry alerts for the SAME move** (same zone +
  direction) if a prior entry was stopped but the contrarian close re-triggers.
- Block any NEW/different move after the open session, and never chase intraday.
- Weight **zone strength / confluence** so it leans toward clusters (stacked
  large+halfway QF + prior S/R), not every lone large quarter.
- Tighten the QF "touch into the bodies" tolerance (US30 ATR-scaled tol was too
  wide → the 50,500/51,068 mislabels). See [[reference-bcfx-strategy]] and
  [[project-mym-autotrader-assistant]]. Don't change strategy logic until the
  full-transcript mastery study is confirmed.
