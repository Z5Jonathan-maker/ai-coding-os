---
name: project-mym-portfolio-reframe
description: "2026-07-13 quant reframe (H135): stop hunting ONE god-strategy — build a BOOK of 20-30 weak honest sleeves at pairwise corr ≤0.10-0.15 (ceiling s/√ρ); frequency from instrument/session BREADTH (MGC/MCL/Globex ORB, corr~0-0.17) not more MNQ variants; TradeX news filters = fresh non-price data lane; prop pass = sizing/firm-fit optimization"
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The reframe (2026-07-13, H135, founder-triggered "think like a quant"):** the fade collapse left one
honest sleeve (ORB5, PF 1.22) that looked "too thin for prop." Wrong lens — 5 research scouts confirmed:
fundable quant books are PORTFOLIOS of many weak uncorrelated edges, not one hero. Full synthesis:
`mym-autotrader/forensics/h135-quant-reframe/SYNTHESIS.md` (commit 7d67013).

**The math that governs everything:** SR_book(N,ρ)=s·√(N/(1+(N-1)ρ)), ceiling **s/√ρ**. PF~1.2 sleeves
(s≈0.3-0.4) NEED avg pairwise ρ≤0.10-0.15 and N≈20-30 to reach fundable Sharpe ~1. So: PF-1.2-honest is a
DRAFT PICK not a reject; and correlation is the binding constraint, not sleeve quality. Measure ENB
(effective number of bets), scale book by Carver IDM (cap 2.5), ERC/vol-target sleeve weights, haircut
every backtest 30-50% before sizing (CFM: in-sample runs ~50% hot vs live, ~80 strategies/15yr).

**Frequency = breadth:** equity micros are ONE bet (ρ 0.82-0.94 intraday); the real diversifiers are
MGC (ρ≈0.17 vs ES) and MCL (ρ≈0.00). Literature GAP verified: no credible published ORB test on
gold/crude or Globex/London opens — our honest test would be first, not crowded. Grid order: MGC RTH →
MCL RTH → MNQ Globex-open → MNQ London-open → MES (shared budget) → MYM/M2K (redundant). Caveat
(Mesfin arXiv 2605.04004): MNQ RTH intraday OHLCV is picked-over — expect thin; metals/energy is the prize.

**Prop-meta is its own optimization:** pass-prob = R-distances to target/trailing-DD barriers (gambler's
ruin), NOT trade count. Size N = floor(DD_limit × f / worstDD_ref), f∈[0.25,0.50] (Chan/Carver ≤quarter-to-
half-Kelly). Consistency rules (one big day > 40-50% cap) are the real threat to a lumpy ORB book —
best-fit archetypes: Tradeify Growth (no eval consistency rule) + Lucid (trailing→STATIC conversion once
buffer cleared). Secondary-sourced — verify in help centers before money.

**How to apply:** build queue in SYNTHESIS.md — B2/B3 first (TradeX news-filter pack + manipulation-trade
sleeve, cheap + fresh calendar data), then B1 breadth sweep, then B4 Book Engine v0 (ρ matrix/ENB/IDM/ERC
+ book-DD vs firm buffers). Execution decision rule: dead limit-setup revivable as stop-entry IFF P&L
survives conditioning on price trading THROUGH the level (Copeland-Galai free-option / DeLise negative
drift). Related: [[feedback-season-doctrine]], [[project-mym-fade-doctrine-verdict]],
[[project-tradex-orb-digest]], [[feedback-goat-evals-speed-first]].

**HUNT RESULT 2026-07-13 (H136+H137, ~19 honest pre-registered tests) — THE BREADTH THESIS FAILED. 0 new
sleeves.** DOT-2 (ORB generalizes across micros/sessions) is EMPIRICALLY DEAD: ORB is a MNQ-09:30-RTH-
specific phenomenon. Breadth 0/7 — GC (both opens, actually MEAN-REVERTS against the OR break — opposite
of NQ), CL, MNQ-Globex, MNQ-London, MES, MYM all DEAD (PF 0.8-1.0). TradeX filters 0/5, manipulation 0/4,
real TradeX ORB variants 0/3 (coin-flips honest). gap-continuation DEAD. Book still = ORB5+BandMom, ENB
1.6, stress-corr 0.84 (→1 bet in DD), DD>buffers. **The book cannot be grown by more ORB — new sleeves
must be a DIFFERENT MECHANISM, uncorrelated by construction.** The one lead — **turn-of-month on GOLD** (H137 tom-gc PF 1.387,
n=122, uncorrelated) — **DIED under power (H138): 57.8yr of gold (n=694) → PF 1.143, placebo p=0.38
(indistinguishable from random); silver 25.9yr (n=311) PF 1.269 p=0.17 also fails.** The H137 p=0.12 was a
small-sample mirage; the discipline worked (we did not deploy it). Turn-of-month is NOT a gold edge. Strategic reality: mechanical hunting is at
steep diminishing returns; highest-value moves now = (a) settle tom-gc [DONE, dead], (b) fund ORB5,
(c) the discretionary edge via journal ([[feedback-backtest-measures-robot-not-trader]]).

**FUNDABILITY CORRECTION 2026-07-13 (H139) — the "ORB5 DD > firm buffer" blocker was a UNITS ERROR.** The
deployable ORB5 champion (or_bars=3 uncapped OR-extreme stop, TREND-gated, n=539) at **1 MNQ contract** has
honest max DD **$2,318** — UNDER both Goat $3,000 and Tradeify $4,500 — with **+$4,324/yr, PF 1.480, placebo
0.016/0.084.** The scary $5-7k DD I kept quoting was the 3-contract book (DD $6,953 = 3×2,318 exactly) or the
UNGATED variant ($5,238) — neither is what we'd deploy. So **ORB5 is ALREADY fundable at 1 contract, no
governor needed.** A per-trade risk cap only HURTS (flips winners via honest tighter-stop, 6/7 caps die the
OOS placebo). The real tension is speed not survival: 1 contract fits the DD but is slow to a $6-9k target
(~103-200 book-days per h128, whose MC used the wrong $5,238-DD book so its pass-odds are pessimistic — being
re-run on the true DD-$2,318 champion). Sweet-spot sizing ≈1 contract (Goat) / ≤2 (Tradeify) on HISTORICAL
DD; bootstrap DD fatter so 1 is the safe deployable size. Play speed via the eval-PORTFOLIO
([[feedback-goat-evals-speed-first]] + why_people_pass.py), keep funded accounts at 1 contract to survive.

**FUND-ORB5 PLAYBOOK (H142, forensics/h142-fund-orb5-playbook/PLAYBOOK.md).** MC on the CORRECT champion
(DD $2,318): at 1 contract **P(pass) = 90.6% Goat / 97.8% Tradeify** (vs h128's wrong-book 65/76%),
12-mo funded survival 89.7% / 98.8%, drawdown-optimal size = 1 for both. The eval-portfolio problem
DISSOLVES at survive-sizing (1 eval clears 90% confidence). **RECOMMENDATION: fund Tradeify Select Flex @
1 contract (best payout mechanics); optionally 2 Goat evals @ size 2 for cheap speed-optionality; NEVER
size funded > 1 contract ($2,318 DD = 77% of Goat's $3k buffer).** THE HONEST ECONOMICS: gross edge
$4,324/yr but **realized withdrawn cash ~$1,700-2,200/yr year-one** (cushion retention + payout gating on a
lumpy ~101-trades/yr book + firm split); Tradeify size-1 median ~17 CALENDAR months to first pass (slow).
So: a REAL, gauntlet-cleared, high-confidence-fundable edge, but **legacy-grade validated automation, not
income replacement** — which is exactly [[user-trading-legacy-not-money]]. This is a PLAN not a deploy;
live book untouched, needs founder go + F5 to run an eval. (Minor: fixed a latent h128 eval_fee bug $99→$140.)

**OHLCV MECHANICAL HUNT EXHAUSTED — CAPSTONE 2026-07-13.** After a full day (H136-H146 + the prior 13k
tests) EVERYTHING mechanical/price-pattern died the calibrated gauntlet: fade book, both paid products
(TradeX + Payout Vault), breadth (0/7), gold TOM, ORB+pivots (0/8), macro-bias combine (redundant),
in-season (regime beta only), AND the academic mine's top leads — Market Intraday Momentum/Gao-Han-Li-Zhou
JFE 2018 (H145: anti-predictive, real sign loses to 93% of coin flips, both legs negative on MNQ+ES),
commodity carry (H132), Treasury auction cycle (H146: ZN alone passes but ZF negative + 73-86% is just
pre-FOMC/CPI drift, not issuance flow). The gauntlet is PROVEN calibrated (H140: 6% FPR, 85% power@PF1.25),
so this is REALITY not a harsh ruler: honest backtestable alpha in liquid index-futures OHLCV is
arbitraged out (matches McLean-Pontiff decay + Harvey-Liu-Zhu + CFM 50% in-sample→live haircut). ONE edge
stands: ORB5 (fundable). **The three honest forward paths (no more OHLCV mining — that's dredging):
(1) DEPLOY ORB5 per the H142 playbook (harvest the validated floor, multi-account); (2) ORDER FLOW / L3
MICROSTRUCTURE — the ONE data type OHLCV backtests can't reach, where futures execution alpha lives;
founder has an MBO recorder ([[project-mym-mbo-lane]], currently crypto-venue; CME MBO pullable via
Databento) — natural fit for his ICT/order-flow discretionary background; (3) SYSTEMATIZE the DISCRETIONARY
edge (his AREA61 read) via journal, not backtest ([[feedback-backtest-measures-robot-not-trader]]).**

**SESSION/TIME-GATE GRID (H156, 2026-07-13, founder-directed "play with the time gates — which strategy on
which pair for NY open / first hour / first 30 / pre-open / London / Asian / power hour").** Comprehensive:
15 (archetype × instrument) grids — momentum-ORB, VWAP+RSI2 mean-reversion, GRAVEYARD fade-revival ×
MNQ/MES/MYM/GC/CL — each swept ALL sessions × trend/chop regime, global K=381. **0 deflated survivors.** Only
4/381 even raw-pass the honest gauntlet, all fail deflation at the true K=381 (Bonferroni α 0.10/381=0.00026,
~14× stricter than per-grid; DSR sr0 ~1.34× higher). THREE durable takeaways, all in the founder's favor: (1)
His session/regime INSTINCT is DIRECTIONALLY CORRECT — every archetype's least-bad cell keys to the NY 09:30
cash open (or power hour) + the regime-congruent gate (momentum→TREND days, fade/reversion→CHOP days), exactly
as the season doctrine predicts. The lens is right. (2) The grid INDEPENDENTLY RE-DERIVED ORB5 from first
principles (09:30 open + full-RTH hold + prior-day-trend gate = the only cell above breakeven, +$12,973/yr raw,
corr +1.000 to orb5_mnq_daily.csv) — finding our one deployable edge twice, blind, is strong confirmation it's
REAL. (3) DEFINITIVE NO on hidden overnight lanes: NO non-NY session (London/Asian/Globex/overlap/pre-open) has
ANY edge in ANY archetype/instrument/regime — uniformly negative. That closes the "is there a secret Asian/London
session edge?" question. Engine validated (reproduces ORB5-NQ exactly, n=1116 corr +1.0 — the DEAD map is real,
not an artifact). CONCLUSION: the two known edges (ORB5 trend/MNQ + RSI2 chop) ARE the edge; session-slicing the
same OHLCV is confirmatory, not generative. The genuinely-new ground is NOT more price-gate permutations — it's
order-flow/L3 ([[project-mym-mbo-lane]]) + systematizing his discretionary read. Forensics: forensics/h156-session-gate-grid/.

**KNOWN-VARIANT + OSCILLATOR SWEEPS (H158-H162, 2026-07-14, founder "test variations of what works" + external study).** ~400 configs
across ORB family (OR-length/Crabel/ACD/retest/exits/transfer, K=292) + the Connors mean-reversion SUITE (Double-7s/R3/TPS/ConnorsRSI/%b/cumulative)
+ the 4 study-highlighted oscillators (Keltner/Zscore/MoneyFlow/Ultimate) + cross-sectional momentum. **0 additive survivors.** Three durable findings:
(1) The 4 oscillators are ONE correlated bucket with RSI2 — co-active corr **0.86-0.96** on a single index (they all buy the same oversold dips on the
same days); the external study's breadth came from **14-20 different ASSETS, not different oscillators on one index**. So the breadth play is RSI2 across
many uncorrelated TICKERS, NOT adding indicators (confirms this file's instrument-breadth thesis; "add tickers, not oscillators"). (2) The prop-legal
JACKPOT died again: intraday flat-by-close index mean-reversion is 0-for-90 net across two independent sweeps — the OVERNIGHT hold in RSI2 appears to BE
the edge, not incidental. (3) Cross-sectional momentum = pure long-beta on our small index-heavy 13-futures universe (0/24 configs beat equal-weight
buy-hold; random-ranking placebo p 0.225) — the study's cross-sectional result needed a 20+ diversified equity universe + the 2010s tech run we don't have.
One breadth lead: Connors reversion transfers to YM/RTY/ES as real placebo-clean edges (YM Double-7s PF 2.41 p 0.003) but overnight + 0.8-0.95 correlated =
capacity not diversification. NET: the known-variant space is exhausted; RSI2 + ORB5 remain the whole mechanized edge; grow via TICKER-breadth on RSI2 +
the discretionary layer. Forensics: forensics/h158..h162/.

**BOOK RESHUFFLE (H163, 2026-07-14) — ORB5 DOWNGRADED, RSI2 UPGRADED. Two load-bearing reclassifications.**
(1) **ORB5 DOWNGRADE (external quant "Tomas/vagafx" challenged "no ORB beats random"; our adversarial re-check says he's substantially RIGHT).**
Against a broad RANDOM-STRATEGY ensemble (not just random-direction), ungated ORB5 sits at only the **88th percentile** (fails the 95th kill-bar on
Sharpe/PF/net); **drop 2025 and it falls to the 66th pctile — BELOW the median of its own momentum family** (2025 = 44.6% of all P&L from ~18% of the tape;
2026 YTD **-$5,030**, underwater). The ONE real thing: the prior-day-TREND gate is NOT generic beta (lifts random strats +21% but ORB5 +102% = a 5x-specific
signal×gate interaction), and gated-full-sample ORB5 clears the 98.7-99.6th pctile — BUT that gated edge is itself 2025-loaded (gated+drop-2025 → 92-95th,
fails the 95th on Sharpe 92.7 / PF 90.6). **RECLASSIFY: ORB5 is NOT a validated standalone momentum edge — it's a regime-beta sleeve with a 2025-concentrated
gate interaction.** Deploy only GATED + SMALL + decay-monitored inside a diversified book, NEVER as a hero/floor. Supersedes the h142 "DEPLOY-READY floor"
framing. Forensics: forensics/h163/ ensemble.py.
(2) **RSI2 UPGRADE — survives the prop daily-flatten friction (reverses the "own-capital-only" tag on P&L grounds).** Flatten-at-daily-close + re-enter-at-
reopen (per founder: overnight works on some firms, just not through the daily close / not multi-day-continuous) costs only ~28% of PF: base $517→$380/yr
(PF 2.92→2.22), H153 chop-gate $536→$471/yr (PF 17.8→10.9, DD only -$467), MES the vessel (MNQ busts a 100K buffer at 1 contract; single-overnight variant
AMPUTATES the edge — the multi-day RSI2>70 exit IS the edge). So a funded/own-capital intraday-compliant seat CAN carry RSI2 as a small decorrelated sleeve.
The Connors YM/RTY/ES transfer likewise survives flatten-reenter (YM Double-7s PF 2.36, p 0.006) = correlated index-reversion CAPACITY (one bucket, not N).
**TWO HARD CAVEATS: (a) FREQUENCY WALL — ~4 trades/yr caps sizing at 1 MES → a fresh 100K Goat Sprint takes ~16yr to pass; RSI2 CANNOT pass an eval, only
harvest on capital already controlled. (b) VENUE-LEGALITY CONFLICT in our OWN docs: vault/01-prop-firms/_INDEX.md says Goat SPRINT allows overnight Mon-Thu,
but goat-funded-futures.md:195 (2026-07-09 firm-support) says NO bot overnight at all (auto-flat 15:55 CT) — UNRESOLVED, needs founder's real-world knowledge
/ a vendor ticket before any Goat deploy.** NET NEW PICTURE: mean-reversion (RSI2 + Connors breadth) is now the CORE deployable edge (own-capital continuous,
or funded-seat flatten-reenter IF venue allows); ORB5 demoted to a small gated regime-beta sleeve; neither passes a fresh eval, so near-term value = own-capital
reversion book + ticker-breadth + the discretionary layer. Forensics: forensics/h163/.
