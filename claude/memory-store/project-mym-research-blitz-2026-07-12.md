---
name: project-mym-research-blitz-2026-07-12
description: "2026-07-12 research blitz outcomes — Fazen ORB certified-fragile (pending founder sim-go), ORB5 prior-day gate armed, livestock gap sweep, GC engine bug, YouTube 20 tested/1 green, K≈13,119+"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**2026-07-12 all-day research blitz (mym-autotrader), founder in full-steam mode.** Durable
outcomes beyond what git/vault record navigationally:

- **Fazen filtered ORB (ES)** = the FIRST external-mined strategy to clear phase-1 AND phase-2
  (H90 dossier → H91 green → H94 CERTIFIED-CANDIDATE **FRAGILE**: volume-threshold knife-edge,
  1/4 neighborhood cells; 4/4 WF years positive; tail ex-top-1 OK). **Awaiting founder "sim
  go"** for .cs port + Sim101 shadow. Kicker: daily-$ correlation with live MNQ ORB ≈ 0.01 —
  genuinely NEW green days for the Lucid book. H98 Design-3 (stoch exit variant) may produce a
  second variant — if so the founder chooses which ports; don't port before that lands.
- **ORB5 prior-day-trendiness gate (H96b)** = REAL on recorded trades (TREND-prior PF 1.53 vs
  RANGE 1.06, placebo P=0.000, monotone 6/6 years) — the FIRST surviving conditioning
  dimension on ORB ever. Rule frozen; PASSIVE forward test: re-run 50-seed placebo at ≥30
  forward Sim101 TREND-prior fires (~Sep 2026). Label computable retroactively from daily
  bars — no logging infra needed. NOT applied to any config until then.
- **YouTube mine cumulative: 20 tested / 1 green** (the Fazen). Independent corroboration:
  Quantreo tested 961 scraped strategies walk-forward+MC → zero survivors. Waves 1-4 done
  (9,220 videos, 344 canon); wave-5 running. **Resurrection trap found+fixed:** consolidation
  rebuilds wipe terminal statuses — `research-db/pipeline/restore_statuses.py` MUST run after
  every consolidate.py (recovers from git HEAD, exits 1 on unmatched).
- **Data bugs:** backtest/phase1 GC FILES was missing the 2023-06+ leg (fixed 981f66f, zero
  registry blast radius). **Bigger, being fixed by H99:** qf_engine_multi INSTR["GC"] pointed
  at the dead calendar-month series since 07-03 — Sniper|GC and Prec2|GC DEFLATED cells never
  clean-verified (H21 audit flagged, unactioned until today).
- **H99 also sweeps the livestock cross-strategy gap**: Sniper|LE/HE + PrecAM|LE/HE were NEVER
  tested (grep-confirmed) despite livestock being the Lucid green-day engine.
- **Kills today (all committed with forensics):** H87 slate-3 0/4 (Double 7's near-miss ≡
  always-long); H88 C2-refine 0/14 (real trigger, gross PF 1.08 too thin at ANY scale — C2
  line CLOSED); H89 23:00 ET lead (real clock-specific drift, friction-eaten); H92 slate-4 0/4;
  H93 OPEX reopen RETIRED-CONFIRMED on 99yr SPX (2020 alone = 104.7% of the century's total;
  −1wk shift beats the anchor). **New asset:** verified 99-year daily SPX at
  data/external/spx_daily_yahoo_gspc_1927_2026.csv (data/ gitignored by design).
- **Global-K ledger** at 13,119 committed (H97/H98/H99 will post more).
- Lucid answer given: 5×$294=$1,470; first $15k round median ~12td from funded (~2.5-3 cal wk,
  eval time in front, forward-discount can double it); livestock live-fill gate first; plan =
  1 scout eval then scale.

**Sunday afternoon additions (H100-H105 + founder approvals):**
- **Founder "I approve it all" (2026-07-12)** over the H101 decision menu. Executed/staged:
  Fazen sim-go (plain variant — H98 proved the stoch-exit variant WORSE, tails −$321 ex-top-3);
  T2 §12|YM re-seat on Tradeify STAGED as ops/T2-SEAT-CHANGE.md, **deferred to Tuesday pre-open**
  (Monday loss-prevention: no change-stacking on first session back); L-OPT = Lucid fleet
  plan-of-record (green 49.8%, 52td median to $75k; GORB5 seat gated ~09/2026); GORB5 Tradeify
  lever NOT armed (contradicts smoothness doctrine — needs separate explicit opt-in).
- **H101 composition truth:** livestock PrecAM cells are portfolio-WORTHLESS on GF7 (61-66%
  same-day overlap with seated §12 livestock); they serve Lucid-class accounts. Of the 4 new
  winners only GATED-ORB5 moved a needle; the benched catalog was the bigger lever.
- **H102: PrecAM|LE/HE placebo certs CLEARED** at the H31 live standard (P=0.00 FULL+OOS).
- **H104 slate-5 0/5**: ADX≠vol-lo gate (definitive); dip-buy beta killed 3rd time. External
  mine cumulative ~27 tested / 1 certified (Fazen). K=13,191.
- **FazenOrb_v1.cs port** built + independently code-reviewed: REQUEST_CHANGES (time-flat one
  bar late = parity blocker; CME-24h session-template requirement — RTH template silently
  no-ops the premkt filter; EntriesPerDirection 2→1) — fixes being applied before compile.
- **Founder reported first real LE fill Friday (winning cattle trade, GF7)** — locally
  UNVERIFIABLE (daily report was Tradeify-only, the confirmed GF7 coverage hole; H105 fixing).
  Bridge-return queue step 1b verifies via GetJournalTrades; if confirmed → H26 gate CLEARED →
  Lucid scout eval ($294) unlocks immediately.
- **ops/WEEK-2026-07-13-RUNBOOK.md** = the week's map (8-step queue + Monday loss-prevention:
  post-compile passover mandatory, flat-check before 18:00 open, MBT disable deadline).
  VPS restart promised ~13:30-14:00 ET Sun; bridge watch armed with the full queue.

**BRIDGE-RETURN EXECUTED Sunday evening (commits 85f7abc, cd68622):** Friday LE fills
journal-CONFIRMED both GF7 accounts (+$730, brackets = validated params — the "wrong SL/TP"
scare was ONLY the deleted Apex-fiction notifications) → **H26 livestock gate CLEARED, Lucid
scout eval UNLOCKED (founder can buy)**. Root cause of outage: 07-11 Windows SYSTEM reboot +
unsaved workspace (stale Goat q5 book resurrected — fixed, redeployed correct book fresh ids
504-509). Whole fleet bounced onto the F5-compiled binary w/ dedup guard (Tradeify fresh ids
520-525 via healer). NEW on Sim101: ramp trio 516-518 + FazenOrb 519 (12wk forward bar) +
BandMomentum 515 (VPS-side). PASSOVER PASS ×2, zero orders, workspace SAVED, VPS Active-Hours
guard set, heal registry synced 40/40. KEY OPS LESSON: add-on CompileNinjaScript = snippet
sandbox ONLY; the real assembly needs editor F5 on the VPS (ghost in-memory assemblies
Terminate deploys). Fleet audit v1: 0 critical/0 drift but matcher join defect (0% match,
mirror misses) — H106b fix in flight. T2 §12|YM re-seat = TUESDAY pre-open.

**How to apply:** vault/07-opportunity-pipeline/_INDEX.md + GLOBAL-K-LEDGER.md are the source
of truth; this memory is the cross-session pointer. Related: [[project-mym-live-config]],
[[project-mym-mbo-lane]], [[project-mym-strategy-search-verdict]],
[[user-prop-accounts-no-apex]].
