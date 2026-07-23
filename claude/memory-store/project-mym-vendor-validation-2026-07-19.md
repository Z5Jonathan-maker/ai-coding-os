---
name: project-mym-vendor-validation-2026-07-19
description: "The 2026-07-19 vendor-strategy validation cycle — cracked nexusalgos/Nebula, gauntleted its strategies on honest fills; the methodology + verdicts + the sealed line"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
  modified: 2026-07-20T03:23:48.742Z
---

2026-07-19: Jonathan surfaced **nexusalgos** (nexusalgos.netlify.app) — a vendor selling **Nebula GP-factory winners as compiled NinjaTrader add-ons on Whop** ($40–99/mo), and a slick "stack 3 strategies, Sharpe 3.73" micro-sizing dashboard. This is the platform-mining vein ([[project-mym-platform-mining-pipeline]]). The cycle established a reusable **vendor-validation methodology** and killed most of it.

**The methodology (reusable):** crack the public page → extract the exact ECONOMIC signature per strategy (win% + payoff R = PF×L/W + archetype + cadence) from the page's JS, NOT the marketing curve → reconstruct as a testable generator from the cracked Nebula grammar → run through OUR honest-fill gauntlet on OUR tape → the entry/direction placebos decide it, credential-blind. Their curves are self-disclosed "calibrated approximations" (CFTC 4.41 hypothetical); distrust them, re-validate on honest fills.

**The five strategies + verdicts:**
- **Streak fade** (79% win / PF 1.32 / R 0.35 claimed) → **DIES** (commit dcc4a9fc, `STREAK-FADE-SPEC-2026-07-19.md`). Honest WR 72% < the 74.1% break-even R=0.35 demands; PF 0.86; DSR≈0. Killed by the **ENTRY placebo** — random entries with the same 0.35R bracket match it, so the streak carries NO information; the 79% is pure bracket-geometry on noise. Unreproducible under ANY fill (TP-first + zero cost tops at PF 1.022). Two blind impls (Fable5 + Codex) agreed 100% on 72,181 signals → not an impl bug.
- **VWAP trend pullback** (41% / PF 1.57 / R 2.22) → **DIES** (commit 9512e70a, `NEXUS-VWAP-ORB-SPEC-2026-07-19.md`). The HONEST NUANCE and the most interesting corpse: unlike the streak fade, its best corner genuinely BEATS both placebos in-sample (PF 1.230, entry-p=0.0) — a real touch-and-resume signal, NOT noise. But DSR@liveK 0.0017 (needs 0.5, 3 orders short) and EVERY headline cell is OOS-NEGATIVE → overfit / non-persistent, clears no multiple-testing floor. 180/180 QUARANTINE. The vendor's own primary cell is dead outright (PF 0.944, WR 31.4% at the 31.1% break-even).
- **5-sec ORB v1/v2/v3** → **1-min approximation DIES; 5-sec original UNTESTABLE.** His OR is 5-SECOND; the NQ base tape is 1-MINUTE (no sub-minute NQ data). The 1-min approximation: all 9 cells PF<1 (0.820-0.964), entry-placebo bracket-geometry, worse than the founder's own 5-min ORB. Neither confirms nor falsifies the real 5-sec version. The ONLY way to test the actual 5-sec is buy + install his compiled add-on on the NT8 demo and record trades (black-box; paid = founder decides).

**FULL SWEEP: 5/5 vendor strategies DIE on honest fills** (streak=noise, VWAP=overfit-but-real-in-sample, ORB-1min=approx; the 5-sec ORB is the lone untestable one). The Sharpe-3.73 stacking chart rests entirely on dead legs. All three killed generators (streak_fade, orb1min, vwap_pullback) are kept RUNNABLE_ONLY so the machine can never search-mint variants of a killed family.

**The sealed line (do NOT cross):** the vendor's EXACT locked params live behind `nebula-genome-bank.rosshaze.workers.dev` (Ross Haze's authed Cloudflare backend). The founder's OWN canonical doc [[reference-nebula-harvest]] / NEBULA-ENGINE-CRACK-2026-07-17 marks this "not crossed, correctly" — an authed third-party backend is off-limits even though Ross is family. We have the engine GRAMMAR (owned app, unobfuscated) + economic signatures; we do NOT fetch sealed winners. "Forward test his exact configs" is therefore only possible by buying + installing his compiled add-ons on the demo (a paid action = founder decides).

**Also killed same day (proxy vessels, same honest-fill filter):** [[project-mym-proxy-vs-tradeable]] us30-open-lane PF 1.44 (Dow-cash CFD) → PF 0.815 −$3,312 on real YM futures, all 5 gauntlet legs fail, role≥3 cliff INVERTS → **cash-CFD artifact, vessel DEAD** (`US30-OPEN-LANE-FUTURES-RECOMPUTE-2026-07-19.md`, commit a6d37b50). Padding sleeves (MYM/MES TP25) lose money by construction.

**Standing lesson:** every slick number that met honest fills this session died (streak, padding, us30). That's the filter working — the vendor "does this for a living" but his living is Whop subscriptions, not the edge surviving live. Credential ≠ edge; the gauntlet is credential-blind. Reframe used with the founder: he already owns 4/5 archetypes in open source with real fills; the vendor has a landing page.

Related: [[feedback-forward-outweighs-backtest]], [[reference-what-the-research-points-to]], [[project-mym-fade-doctrine-verdict]], [[reference-nebula-harvest]], [[project-mym-nebula-pool-cracked]]
