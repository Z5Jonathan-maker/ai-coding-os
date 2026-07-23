---
name: feedback-box-trends-founder-fades
description: The box (auto) and the founder (discretionary) have OPPOSITE complementary edges — trend-following vs fading — do not merge them
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 77be37a0-7ef7-4fbd-abc3-e0a00eb33227
  modified: 2026-07-21T00:55:59.142Z
---

The full-auto box and Jonathan's discretionary calls are **opposite, complementary strategies** — proven at the mechanism level (2026-07-20, leak-free market-state reconstruction from 1m bars via `entry_context.py`).

- **The box is a TREND-FOLLOWER.** MNQ box winners are essentially never counter-trend (mean 0.00); 45% of its entry-failures ARE counter-trend fights. Counter-trend is the box's *failure mode* — skipping counter-trend MNQ entries lifts +$1,466 (60 trades, 0 winners removed, p~0.0001). [[claim-mnq-countertrend-is-box-failure-mode]]
- **Jonathan is a FADER.** All 3 discretionary YM calls (incl. the +$4,875 winner) were counter-trend SHORTS into a daily UPtrend at the range extreme (trend=+1, rangepos~0.92, CT-flagged). His edge is *precisely the trade the box loses on* — matches the BCFX/Area61 QF-fade method ([[reference-bcfx-strategy]], [[project-mym-reversion-book-blueprint]]).

**Why it matters / how to apply:** Do NOT mechanize the fade into the trend-following box, and do NOT let the box fade — that destroys both edges. They are uncorrelated by construction (opposite signals), which is exactly the diversified-book thesis ([[project-mym-diversified-book-verdict]]). Study, size, and improve them SEPARATELY: the box wants a with-trend entry filter; the discretionary book wants more logged fade calls to prove the edge. See [[project-mym-discretionary-track-record]] for the split + daily study pipeline. Claim: [[claim-box-trends-founder-fades]].
