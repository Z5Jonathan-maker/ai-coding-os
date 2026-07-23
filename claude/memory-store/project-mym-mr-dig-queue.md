---
name: project-mym-mr-dig-queue
description: "2026-07-14 mean-reversion dig queue from the MR-universe map + the fully-cracked Aligrithm corpus (376 articles, exposed Ghost API + authed paid). The MR SIGNAL is one bet (all oscillators ~0.9 corr); leverage is in ANCHOR/REGIME-GATE/VESSEL. Prioritized honest-test queue + concrete gauntlet upgrades. Everything still must clear the honest gauntlet."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Founder directive (2026-07-14): mean-reversion is the ONE validated vein — map + drill it exhaustively.** MR-universe
map + the Aligrithm corpus crack (corpus at scratchpad/aligrithm/corpus_full.json — 376 full articles / 823k words incl
15 paid; PERSIST to wiki/learnings/mentor-aligrithm). Core structural fact: the MR **signal** axis is ONE bet in costumes
(RSI2/Bollinger/Keltner/z-score/CCI/%R/MFI all 0.86-0.96 corr — no new indicator decorrelates); real DOF live in **ANCHOR**
(revert to what), **REGIME-GATE** (when it's on), **VESSEL** (where).

**PRIORITIZED MECHANICAL TEST QUEUE (through honest fills + deflation-for-K + placebo-through-regime + true-OOS):**
1. **VOL-LEVEL gate on the existing reversion book (dig #1, CHEAPEST+HIGHEST-EV).** Nagel: short-horizon reversal is
   liquidity-provision compensation that pays MORE in high vol — BUT Aligrithm 3.6 gives concrete params: DISABLE the
   reversal sleeve when 22d annualized realized vol >22%, RE-ENABLE on hysteresis <18% sustained (per-yr Sharpe 7%vol→1.4,
   17%→−0.4). Gates on a DIFFERENT axis than the H153 chop-gate = additive. No new signal — just interact existing sleeves
   with a vol-regime dummy. Also test the **Efficiency-Ratio gate** (ER=|net move|/Σ|moves|; trade MR only ER<0.20, 0.20-0.30
   = no-trade overfit band) and the **Variance-Ratio term-structure** (VR<1=reversion, >1=trend) head-to-head vs raw 22/18.
2. **OU half-life gate (dig #2)** upgrading the heuristic H153 chop-gate to a calibrated reversion-speed stat — BUT de-bias
   the AR(1) β (Kendall small-sample correction) + block-bootstrap the half-life first (raw OLS β biased to 0 → MR re-enters
   too soon). **Hurst/FDI (H<0.5 confirmed across window lengths)** = cheap per-bar cross-check, no OU fit needed.
3. **Sector-ETF market-neutral reversal (dig #3, fully specified by Aligrithm 4.51/4.52).** Fit-weighted index-residual
   reversion on the ~10-11 SPDR sector ETFs: regress log(member) on log(index) 60d, Dev/RMS, cdf-compress, fade toward
   index — ONLY while rolling 60d Spearman ρ stays above its 250d-median baseline (decouple flag kills event-trades).
   HARD RULES: cross-sectional demean across the universe at each date (NEVER time-series z per asset — killed a 12-1 edge
   0.55→0.18), cost-aware net-rank-corr with a no-trade buffer. Market-neutral → decorrelated from the directional book.
4. **Price-Path Convexity cross-sectional reversal (NEW-DISTINCT, top breadth candidate, from PAID 10.14).** Convexity =
   [(P_first+P_last)/2 − mean(closes)]/[(P_first+P_last)/2]; long low-convexity quintile / short high, VW, 1-mo hold. Gross
   0.84%/mo t=6.29, survives FF5+mom+STR+LTR+liq, PROVEN distinct from short-term-reversal (double-sort), pays 1.55%/mo in
   recessions (anti-risk). Genuine new MR vessel to ADD breadth (needs cross-sectional equity data).

**CONCRETE GAUNTLET / BOOK UPGRADES (apply to the reversion book NOW):**
- **NO tight stop on MR sleeves (3.27/3.28):** MR bounceback is HIGHER at −1 to −2 ATR MAE (the deepest-underwater trades
  revert most); a −2 ATR stop turned +0.19%→−0.36%. Use no stop / catastrophe-only (4+ ATR). MR wants LIMIT entries at the
  overshoot, not market. This PROTECTS RSI2/Double-7s from a well-meaning risk overlay.
- **Specific-factor P&L test (NEW gauntlet gate, 6.43/6.44):** dot a sleeve's positions with factor-RESIDUAL returns; flat =
  the "edge" is just re-loading the short-term-reversal factor (which IS the dominant ~1h factor). Gate every reversion
  sleeve on this before it enters the book.
- **U-shape fold check (6.5):** deepest-oversold decile can UNDERperform merely-oversold (distress); fold around the
  return-minimizing point so you don't buy the worst names.
- **CMMA primitive (2.11/2.12):** scale/regime/lookback-invariant price-minus-MA that pools cross-asset on ONE coefficient
  → cleaner shared signal for the equity+TLT+GC+BTC book. **Rolling-rank RSI2** (bottom-decile of trailing 252d, not fixed
  <10) stabilizes trades/regime. **Detrended RSI** (residual of RSI2 on RSI20) isolates the shock.

**Adjacent-but-distinct candidates:** calendar-spread cointegration reversion in the storage-cost band (4.70, paid);
Commercials-at-COT-extreme contrarian (4.46, real hedger cause, leads ~2wk); CGO overhang conditioning gate (10.10). Aligns
with [[project-mym-reversion-book-blueprint]] + [[reference-what-the-research-points-to]]. The API-crack technique is a
reusable capability ([[reference-storms-vagafx-recon]] superseded on Aligrithm — it's a legit aligned research desk).

**HARVEST ENRICHMENT (2026-07-14, 5 cracked sources: Aligrithm + Alvarez + Quantifiable Edges + Ernie Chan + Robot Wealth,
~1,900 articles / ~450 MR, corpora at scratchpad/mr_blogs/ + scratchpad/aligrithm/; PERSIST to wiki/learnings/mentor-mr-quant/).**
FOUR UNANIMOUS CROSS-SOURCE RULES = BOOK LAW (4/4 practitioners + academic, every vessel): (1) NO tight stop on MR sleeves
(stops cut CAR AND Sharpe — Chan "almost inevitably decrease both"); (2) the MR "stop" is TIME not price (exit at 3-4x
half-life / on reversion signal); (3) LIMIT entries on FURTHER weakness (Alvarez limit 1-4% below close: CAR +21%, avg-p/l
doubled); (4) size INTO the divergence (deepest-MAE reverts most; lots ∝ −zscore). **DIG #1 FLIPPED — the raw-vol-off gate is
BACKWARDS for our index/equity vessel: high vol/VIX-spike is the SETUP not the disable (QEdges: biggest bounce payoffs
cluster at extreme selling; Alvarez: 2008 paid but 2020/2022 didn't → the discriminator is CAPITULATION-BREADTH not raw
vol). REPLACE with the CBI capitulation-breadth gate (N1: CBI=0→bounce fails; CBI≥10→1 loser in 20d — dominates price-only
oversold).** DIG #2 (OU half-life): z-lookback = 0.5x half-life not 1x (RobotWealth: 32% vs 22% p.a.); reject half-lives >1
quarter; stat-test GENERATES candidates never certifies (RobotWealth: spreads that FAILED significance made money OOS, those
that PASSED lost). DIG #3: cross-sectional-demean flatten-book is the architecture; ALSO test long-only ETF-MR (Chan:
hedging isn't always better); MANDATORY vol/beta confounder-control before certifying any XS factor. DIG #4 (path-shape):
build a COMPOSITE path-shape score — skip ≥5% gap-DOWN stocks (jump-selloffs keep falling, +28% CAR), require ER10≥20
clean selloff (+15%), IBS<25 close-weak (+21%/+58%), low-volume selloff. NEW book-wide upgrades: FIRST-UP-CLOSE exit
(Larry Williams — exit choice DOMINATED entry-filter choice, Alvarez); ex-index-universe (formerly-R3000 stocks: CAR +121%
but needs OTC fills). DECAY TRUTH: MR alive at the INDEX/PORTFOLIO/GATE level, fading at SINGLE-NAME/RAW-SIGNAL/CALENDAR
(RSI2 edge-per-trade halved 0.89%→0.33% but win-rate held ~65%; index-RSI2 NOT decayed); you CANNOT detect decay with a
significance test in real time (RobotWealth — don't build a kill-switch; size down with skeptical prior + run many
uncorrelated sleeves). **SINGLE SHARPEST NEXT TEST (fully spec'd): RSI2<5 daily on Russell 1000 (>$5, $10M ADV, >200MA +
SPX-126d>0) + CBI-proxy capitulation gate + path-shape gate (IBS<25 AND ER10≥20 AND no 5%-gap-down) + LIMIT entry 0.5xATR10
below close + NO stop + FIRST-UP-CLOSE exit + size-into-divergence; honest fills. Falsification bar: must clear >0.6%
avg-p/l net (vs raw ~0.33%) at ~65% win. Tests the central claim: gates are the durable layer when the raw signal fades.**

**DRILL RESULT (H165, 2026-07-14): the gated RSI2 system does NOT clear the bar — the harvest's "durable stacked-gate" claim
is FALSIFIED, but the underlying MR effect is REAL.** Full-gated +0.388% net/trade, 63.2% win, PF 1.48 (OOS post-2018 +0.201%,
PF 1.20) — fails the >0.6%/65% hurdle (the +0.632% that looked like a pass is the MEDIAN; the no-stop left-skew drags the mean
below). ABLATION KILLS THE STACK: the single PATH gate (IBS<0.25 + ER10≥0.20 + no-gap) BEATS the full stack in-sample (0.617%
vs 0.563%) on 3.5x the trades; the extra gates = search artifact (kept-vs-dropped Welch t=0.63 p=0.53 = random trimming); the
REGIME gate (>200MA + SPX-mom) is ACTIVELY DESTRUCTIVE (OOS -0.085%, PF 0.93, t=-2.03 — removing money); single gates carry
STRONGER OOS significance than the stack (overfit signature). BUT PLACEBO PASSES (random names on same gated dates = +0.082%
vs signal +0.388%, 4.7x) → the per-name RSI2<5 + clean-selloff selection adds genuine ENTRY edge, NOT the ORB gate-vs-entry
trap — the MR effect underneath is REAL. SURVIVORSHIP CEILING: universe = 563 CURRENT constituents (100% survivors) → every
number is an UPPER BOUND; bias ~0.1-0.3%/trade → true forward edge ~0.0-0.15% net (at/below cost noise). Fill model is
CONSERVATIVE (limit needs next-day low≤limit, never the gapped-open — left 0.22%/trade on the table) so the bar-fail is robust,
NOT a rosy-fill artifact. VERDICT: not a deployable standalone; strip to the honest core — (1) DROP the regime gate (OOS-neg),
(2) fall back to the single PATH gate / plain no-stop-limit-first-up-close base, (3) LOAD-BEARING: re-test on a POINT-IN-TIME /
delisting-aware universe (Norgate/CRSP) — resolves 0.2% vs 0.05%, (4) if it survives PIT: own-capital book SLEEVE only (no-stop
incompatible with prop trailing-DD), sized small for diversification not magnitude. The gauntlet worked exactly as designed:
found the real per-name effect, caught our own gate-stack overfit, bounded it by survivorship. Forensics: forensics/h165-gated-rsi2-equity/.

**ACADEMIC HARVEST (2026-07-14, Chen-Zimmermann 331 signals + JKP 153 factors + arXiv 363 + OpenAlex/Fed/NBER; corpora
scratchpad/academic/) — INDEPENDENTLY CONFIRMS the drill.** Central finding: the reversal vein is REAL but the naïve
single-signal version is DEAD post-2000 (every XS-reversal factor t>6 pre-2000 is t<1.3 / often negative post-2000 — JKP
recompute ST-reversal post-2000 t=0.48; Khandani-Lo daily contrarian Sharpe 53.87(1995)→2.79(2007)). What SURVIVES: (a)
reversal GATED ON VOL/STRESS state (Nagel), (b) SEASONALITY (uniquely does NOT decay). "Exactly the shape of the gated-RSI2
bet" — the academics reached our drill's conclusion from a different angle. REPLICATED-ROBUST candidates (ranked next tests):
(1) **Nagel VIX-conditioned reversal (RFS 2012, 559 cites, robust in ALL 4 sources)** — reversal profits SPIKE in VIX
blowouts even in zero-unconditional-edge industry portfolios; the academic SPINE of "liquidity provision pays in high vol."
ACTION: add a VIX/realized-vol CONDITIONING layer to RSI2 SIZING (size UP in high vol), not just gate — this is the honest
UPGRADE to the drill's core. (2) **Seasonality / off-season reversal (Heston-Sadka 2008)** — the ONLY MR-adjacent vein that
does NOT decay (JKP theme t=3.46 full→3.38 post-2000, STRONGER post-2000; lifts tangency Sharpe 0.65→0.74); ORTHOGONAL to
RSI2 (calendar-month structure not oversold-bounce) = the single best NET-NEW add. (3) **Pairs/GGR (2006)** — distinct
convergence mechanism, 11%/yr net, bootstrap-confirmed DISTINCT from reversal, untested by us = NEW-DISTINCT vessel (PIT
hygiene is the whole ballgame). SKIP: liquidity family (HXZ: 93% insignificant under VW/NYSE), long-term reversal
(sign-flipped negative last 20yr), ALL arXiv high-Sharpe stat-arb (leakage/withdrawn — Sharpe>10 = look-ahead bug), low-risk
scored on RAW return (only pays in alpha). REPLICATION META (the trust calibration): HXZ 64% fail t>1.96 (harsh) vs CZ 98%
replicate own-method (rosy) vs JKP tie-breaker 35%→55.6%→82.4% (raw→longer→alpha) — ST-reversal + Seasonality + Low-Risk ALL
survive JKP. McLean-Pontiff decay ~58% post-publication, concentrated in the MOST-liquid names. TAKEAWAY: PIT-universe +
our honest gauntlet are non-negotiable; the next tests = Nagel-vol-conditioning-on-the-stripped-RSI2-base + Seasonality.
Forensics: scratchpad/academic/.

**DECISIVE DRILL RESULT (H166, 2026-07-14, survivorship-FREE ETF vessel — ETFs don't delist, so the number is HONEST not an
upper bound). VERDICT: EXECUTION IS DECISIVE, and under CANONICAL execution there IS a real modest deployable MR sleeve.**
Two agents got OPPOSITE answers on the SAME data purely from execution design: (a) h165-style LIMIT-0.5ATR-below entry +
first-up-close exit → DIES (base +0.046% t=0.8, OOS-negative; adverse selection — fills only when the dip keeps bleeding,
misses the sharp V-bounce, cuts winners short → edge ~0). (b) CANONICAL execution (next-open entry after RSI2<5 close, hold
& exit on RSI2>70, honest zero-lookahead) → REAL-MODEST-SLEEVE: per-trade +0.386% net @ 70% win, placebo-clean 8x, and
OOS-STABLE. I VERIFIED the daily-portfolio P&L from rsi2_sleeve_daily.csv directly: mean +0.0002/day ALL → +0.0002 post-2018
→ +0.0004 post-2021 (positive and does NOT decay; ~5%/yr unlevered on the ETF sleeve). So on a survivorship-free vessel,
canonical RSI2 dip-buy IS a genuine modest OOS-stable own-capital sleeve — the survivorship caveat that made h165 an upper
bound is removed and it survives. NAGEL VOL-CONDITIONING: real + monotonic IN-SAMPLE (top-VIX/rvol quartile +1.0%, t~6) but
DECAYS OOS (VIX t=0.31, rvol t=0.78 — the in-sample edge is dominated by 2008 GFC + Mar-2020 spikes, doesn't persist) → the
vol-conditioning is regime-concentrated, NOT a persistent standalone edge; kill as a standalone. SEASONALITY (Heston-Sadka):
DIES-HONEST on the ETF cross-section — null (momentum -0.23%/mo, random-month placebo p=0.876; reversal a coin flip), flips
OOS (falsifies the non-decay claim on a 28-ETF basket — it needs a single-name cross-section of thousands to exist), corr
~0.08 to RSI2 = orthogonal-but-EMPTY. **HONEST LANDING OF THE MR ARC: the deployable mean-reversion book = CANONICAL RSI2
dip-buy on ETFs (real, modest ~5%/yr, survivorship-free, OOS-stable, next-open-entry/RSI2>70-exit — NOT limit-entry) + the
cross-asset reversion book (H163) as uncorrelated own-capital sleeves. No hero; a real modest book. Execution (next-open +
RSI2>70) is the ballgame — the harvest's "limit entry" book-law is a SINGLE-NAME rule that inverts to adverse-selection on
ETFs.** Caveat: the canonical per-trade magnitude (+0.386%/70%) is from the agent; I verified the portfolio-level OOS
stability directly. NOTE: hit the weekly agent usage limit (resets Jul 17) — winding down heavy workflow-firing.
Forensics: forensics/h166-etf-vol-conditioned-mr/. Still OPEN (founder F5): deploy the book own-capital + close the funded
dead-fade gap ([[project-mym-forward-fidelity-verdict]]) + the discretionary passover.