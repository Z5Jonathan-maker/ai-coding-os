---
name: project-dosecraft-apple-typography
description: "Apple has rejected DoseCraft mobile twice for hard-to-read type; v1.0.4 takes the aggressive pass with HIG-aligned sizes + iPad render-time multiplier"
metadata:
  type: project
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
DoseCraft mobile (`apps/mobile`) has been rejected twice by Apple under Guideline 4 (Design) for "hard to read type or typography":
- **v1.0.2**: rejected on iPad Air 11" — bumped text-xs 12→13, text-sm 14→15
- **v1.0.3**: STILL rejected on iPad Pro 11" M4 (review date 2026-05-06)
- **v1.0.4** (shipped 2026-05-06, commits `3ffc6d55` + `309b9783`): aggressive HIG pass

**Why:** Apple reviewers test on iPad first. The iPad renders text at higher physical size than iPhone but doesn't auto-scale up — small fonts that look fine on iPhone are tiny on iPad Pro. iOS HIG body minimum is 17pt; we were at 12-13.

**How to apply:**
- **Tailwind scale** (`apps/mobile/tailwind.config.js`): xs=14/20, sm=16/24, base=17/26. `2xs` removed entirely (was 11px, footgun for iPad reviewers).
- **iPad multiplier** in `apps/mobile/app/_layout.tsx`: monkey-patches RNText + RNTextInput render to scale fontSize by 1.15× on iPad-class devices (`Platform.OS === 'ios' && Platform.isPad`). Applies to BOTH inline `fontSize: N` AND NativeWind classes. iPhone unchanged.
- **Avoid these patterns on iPad-visible screens**:
  - `text-xs` + `text-dc-text-faint`/`text-dc-text-muted` together (small + dim = double-flag)
  - `uppercase tracking-widest` with anything below `text-sm` — wide tracking visually shrinks letters
  - inline `fontSize: 10` or below for any text reviewer might read (especially on auth screens — they sign-in/sign-up first)
  - `fontSize: 9` was used in 3 chart components (SkiaLineChart, SkiaAreaChart) — left alone in v1.0.4 because chart density tradeoff; flag if Apple rejects axis labels too.
- **Auth eyebrow caption** (`(auth)/sign-in.tsx` + `(auth)/sign-up.tsx`): was 10pt + letterSpacing 2 + uppercase — fixed to 13pt + letterSpacing 1. Most-visible-to-reviewer screens; do NOT regress.
- **Resubmit checklist**: after any typography change, re-run TesterArmy "Apple App Store Launch Readiness - Core App Flow Verification" test (in the `dose craft llc` project, see `project_dosecraft_testerarmy.md`) before submitting to App Review. The test takes screenshots that mirror what the reviewer sees.
