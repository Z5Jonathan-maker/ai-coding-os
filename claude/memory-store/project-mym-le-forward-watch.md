---
name: project-mym-le-forward-watch
description: "LE (§12 livestock) is on a forward-watch (week of 2026-07-13): the faithful fill model says LE DIES, but real live fills are 2/2 wins. Track real LE fills vs the model's benchmark to adjudicate edge vs variance."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The question:** the H123-verified faithful fill model calls **§12 LE a DIES cell** (37% win rate,
avg **-$84/trade**, net -$16,850 over 200 backtest trades). But the LIVE bot keeps winning LE on
real fills. Founder decision 2026-07-13: **do NOT touch LE — watch it forward this week** and let
real fills adjudicate whether LE has a real edge or is a 37%-win cell on a lucky streak.

**Real LE fills so far (both GFTESPRINT Goat accounts, 3-leg §12):**
- **Fri 2026-07-10** — LONG @234.9, A-leg full TP1 235.825, B/C ~breakeven → **+$730 combined** (WIN).
- **Mon 2026-07-13** — SHORT @235.85, lock-stop exit 235.65 (+0.2pt, small lock-protected win, not a
  full TP) → **+$480 combined** (WIN).
- Running: **2/2 wins, +$1,210 combined** over 2 trade-days.

**The honest read:** winning in BOTH directions is notable, but n=2. A 37%-win cell throws 2 wins in a
row ~1 in 7 times — so this does NOT yet refute "LE loses on average." Need ~10-15 more LE fills before
realized avg/trade and win-rate can distinguish real edge from variance.

**Benchmark to beat (the model's prediction for the coming fills):** win rate should regress toward
**~37%** and realized **avg/trade toward -$84** if the model is right. If LE holds a materially positive
avg/trade and >50% win rate as n grows, the model is too harsh on LE (consistent with the resting-limit
hypothesis — the chase mis-models LE's fills). Track weekly.

**How to apply:** each session this week, pull LE fills via crosstrade GetJournalTrades (both Goat accts,
today), append to this ledger, update running win%/avg-trade vs the -$84 benchmark. The parallel
**resting-limit fade test** (forensics/h124/) gives the systematic backtest answer; this forward-watch is
the live-fills answer — they should converge. Related: [[project-mym-precision-cs-parity-gap]] (the fill
model), [[project-mym-p2-recert-deflated-corpus]], [[feedback-backtest-measures-robot-not-trader]].

**UPDATE 2026-07-15 (wf wf_16eb81c9-783, full adjudication after founder pushed hard that LE is never wrong live):**
- **Live record now 3/3, +$1,340 (add Wed 07-15 SHORT @231.40, lock/BE-cut at +2t/+$130; price then reached TP1 230.44).** Forensically airtight: 172-count journal, no pagination gap, include_deleted verified, LE only in the 2 GFTESPRINT accts, ZERO smoke-tests in the record (founder's early enter-and-flatten plumbing tests predate the add-on recording start 2026-06-23 / ran non-journaled — nothing to exclude). Only negative fill = the -$10 BE leg INSIDE the +$730 07-10 winner. **LE is NOT a "loser/stand-down"; tape has primacy on that. I was wrong to call it one (owned to founder).**
- **BUT the backtest kill is SIGNAL-LEVEL, not a fill artifact.** H157 ran the founder's OWN resting-limit hypothesis (limit resting AT zone from prior 30m close, first-1m-touch fill) = fills 367/378 armed days (97.1%) and STILL nets **-$23,561, 12.5% win, OOS PF 0.832, boot p 0.995 — WORSE than the re-touch model.** Dies long+short, IS+OOS. Mechanism: **live cattle TRENDS THROUGH quarter-figure levels instead of reverting** → the fade is run over. So for LE, correcting the fill does NOT rescue it (unlike §12 MNQ). Fill-fidelity is NOT LE's problem.
- **Fair to the founder (my own skeptic undercounted):** run-to-TP the live 3 is **2/3 confirmed at target** (07-10 A-leg TP + 07-15 price hit 230.40 < TP 230.44; 07-13 unknown) — BETTER than the model's 37%, not equal. Tape is genuinely encouraging; the only real problem is **n=3 vs n=367**.
- **THE LOCK KNOT (unresolved, load-bearing):** the lock/BE trail (Area61Precision_v2.cs:349-368) may be the ONLY reason LE shows green — it converts the many failed fades into BE scratches. 07-15 it demonstrably COST money (cut a winner price then reached); most days it may SAVE money. Net effect depends on the true win rate = the unresolved thing. **Do NOT rip the lock out autonomously — F5, and it's a hypothesis to TEST first, because if the model is right, unlocking exposes the stop-outs, not upside.**
- **ADJUDICATION PLAN (the tape decides, founder's principle):** (1) instrument every future locked LE exit — did price reach TP (lock costs money, founder right) or reverse to a stop (lock saves money, model right), scored run-to-TP; ~10-15 fills settles it. (2) Close the seam: H122's 100% parity was vs Precision **v3**, live LE runs **v2** — verify entry-mechanism equivalence. (3) Trade LE at MINIMAL size, lock ON, forward-collect.
- **STATUS LINE:** LE = LIVE FORWARD-WATCH; tape LEADS, model DENTED not broken (3/3 is ~1-in-20 under 37% = surprising not rare; 98% posterior is a small-n prior artifact). NOT stand-down, NOT validated-edge. See [[project-mym-fill-fidelity-verdict]].

**CORRECTION (2026-07-15 signal-reconcile, wf_7376cb56-233): event 3's exit was NOT the lock.** "StopCancelClose" = NT8 strategy-TERMINATION close (lock exits print "Stop loss", like
event 2's). Both GOAT LE instances were **WIPED at ~10:10:02 ET** — 62s into the winning trade — force-closing all 6 legs at +2t and cancelling the real bracket (stop 231.70 / TP1 ~230.55);
the fleet healer re-armed them 10:10:31 ("Auto-healed 2 wiped... 40/40"). **Infrastructure killed a live winning position** = the worst fidelity bug of the session; root-cause underway.
So the lock's record is 1 save (Mon +$941) / 0 robberies (today's robbery belongs to the wipe). ALSO: ntfy pushes print §12 bracket params for ANY root-match fill (the 10:10 "MNQ §12" push
was actually ORB5_v1 MNQ, no TP, rides to 15:55) — push-mislabel bug; founder was reasoning from wrong telemetry. Day's big MNQ winner = ORB5, not §12.

**EVENT 4 (2026-07-15 11:08 ET, same day, second LE fire):** SHORT @231.45 (PA/PB/PC ×2 Goat), all 6 legs stopped 231.70 = **-$600. First real LE bracket loss.** Journal shape: MFE=0,
MAE=10t=EXACTLY the stop distance → tapped at the extreme high, then IMMEDIATELY reversed (231.125 within ~15min, falling toward the 230.40 TP band). Direction was CORRECT; the stop
geometry died at the top tick. **Ledger now: 4 events, 4/4 direction-correct, 3W–1L, +$740 net.** Both-ways read: bracket scoring = model's point (fade stopped before reverting); the
instant reversal after = founder's point (stop-placement failure on a correct call, NOT the model's "runs-over-and-keeps-going" shape). NOTE bracket divergence: event-4 stop 0.25pt vs
event-3 stop 0.192pt — different sleeve/params (identify which LE cell fired). Founder hypothesis under live test: "stopped by a tick or two on correct calls → widen the SL a few ticks."
Being tested honestly BOTH ways (wf_7376cb56-233: stop-width grid on H157 resting-limit fills + top-tick-vs-run-over loss-shape distribution + today's counterfactual). Founder's standing
claim: ntfy signals executed faithfully = winners; today 4-of-6 events support (2 robbed winners, 1 clean winner, 1 top-tick stop), 2 don't (ORB5 MES, MES 10:32 ladder). Standing
signal-fidelity ledger being seeded at forensics/signal-fidelity-ledger/LEDGER.md.
