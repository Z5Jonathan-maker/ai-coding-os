# Learnings Index — Mega-Brain Catalog

Per-topic knowledge brains. Currently **26 peptide/TRT/health mentor brains (8 original + 18 indexed 2026-07-20) + 3 non-peptide mentor brains
(Karpathy, Aligrithm, Algorithmic.io)** + **2 quant vein corpora (mentor-tradingview-pine,
mentor-mr-vein)** + **1 concept layer (quant-methodology-canon)** + **2 forensic corpora
(scam-corpus, mentor-trader-tapes)** + **1 research corpus** = 2,059 videos, 23,066,473 words
(video-only count; Aligrithm, Algorithmic.io, Karpathy, mentor-tradingview-pine, mentor-mr-vein,
quant-methodology-canon, scam-corpus, and mentor-trader-tapes are text-corpus brains, not
video-transcript brains — see each one's own word count in its section below).

## How to use

1. **Find the right brain** — see Mentor Brains table below or `_COMPOUND_INDEX.md`.
2. **Read the mentor profile** — each `_README.md` says when to consult vs skip.
3. **Recall via mempalace** — semantic search across all mined content (recommended).
4. **Or scan with rg** — direct keyword grep into per-mentor folders.

## Mentor brains (peptide / TRT / biohacking domain)

| Brain | Videos | Words | Specialty |
|---|---|---|---|
| [More Plates More Dates (Derek)](mentor-moreplatesmoredates/_README.md) | 506 | 4,911,434 | Compound breakdowns (mechanism + side effects) |
| [Dr. Trevor Bachmeyer (SmashweRx / The Spartan)](mentor-bachmeyer/_README.md) | 472 | 2,998,329 | Peptide protocols (BPC-157, TB-500, GHK-Cu, retatrutide, MOTS-c) |
| [Nathalie Niddam (Longevity Educator)](mentor-nathalie-niddam/_README.md) | 467 | 10,823,827 | Bioregulator peptides (Khavinson short peptides) |
| [Jay Campbell (TRT/Peptide Author)](mentor-jay-campbell/_README.md) | 214 | 2,312,922 | TRT optimization |
| [Ayubace (Peptide Lifestyle Educator)](mentor-ayubace/_README.md) | 175 | 117,491 | Peptide transformation case studies |
| [Dr. Trevor Bachmeyer — Rumble channel (rumble:thespartan)](mentor-bachmeyer-rumble/_README.md) | 102 | 323,617 | Topics censored on YouTube (off-label, controversial protocols) |
| [Dr. Craig Koniver (Performance Medicine MD)](mentor-dr-craig-koniver/_README.md) | 81 | 1,343,165 | Peptide stacking for performance optimization |
| [Nick Trigili (Biohacking & Performance Specialist)](mentor-nick-trigili/_README.md) | 42 | 219,550 | Retatrutide cycling |

### Additional mentor brains (health / peptide / PED — indexed 2026-07-20)

These serve the **peptide / health project (DoseCraft / Aurex)** — NOT trading (the quant veins are
separately bucketed below + in "Concept & forensic layers", all tagged for `mym-autotrader`). Ingested
via `mega-brain-ingest` but absent from the catalog until the OS CANON guard (`check_canon_os.py`) flagged
the index↔disk drift (18 of 31 mentor dirs were unindexed → recall-by-index silently skipped them).
Doc/word counts are approximations from each `_manifest.json`; two are corpus-scale (Ben Greenfield,
Mark Hyman). Recall via mempalace or `rg` into each folder.

| Brain | Docs | Words | Specialty |
|---|---|---|---|
| [Ben Greenfield](mentor-ben-greenfield/) | 4,998 | 24,232,676 | Biohacking & endurance — sleep, biomarkers, ancestral lifestyle, supplements |
| [Mark Hyman](mentor-mark-hyman/) | 3,069 | 6,334,827 | Functional medicine — detox, anti-inflammatory, metabolic health |
| [Lucas Aoun (Boost Your Biology)](mentor-lucas-aoun/) | 530 | 2,065,300 | Nootropics & ergogenic supplements — dihexa, BDNF, T-boosters |
| [Peter Attia (The Drive)](mentor-attia/) | 433 | 646,654 | Longevity & metabolic-health MD — lipids, TRT, ketosis, disease prevention |
| [Lyle McDonald](mentor-lyle-mcdonald/) | 162 | 501,695 | Body-recomposition & nutrition science — dieting, hunger, hormones |
| [Huberman-adjacent peptide/hormone set](mentor-huberman/) | 100 | 1,097,276 | Peptide & hormone therapeutics, GLP-1 weight-loss, MCAS |
| [Layne Norton (Biolayne)](mentor-layne-norton/) | 26 | 28,886 | Evidence-based nutrition & training — protein, fasting myths |
| [Kyal van der Leest](mentor-kyal-van-der-leest/) | 26 | 611,838 | Oral/needle-free peptides — BPC-157, gut health, biomimetics |
| [TMCycles](mentor-tmcycles/) | 25 | 70,857 | PED cycle vlogs & lifestyle |
| [Hans Amato](mentor-hans-amato/) | 25 | 50,536 | Micronutrient testosterone optimization — magnesium, ALA, thiamine |
| [Greg Doucette](mentor-greg-doucette/) | 25 | 94,527 | Bodybuilding & steroid harm-reduction commentary |
| [Dylan Gemelli](mentor-dylan-gemelli/) | 25 | 170,317 | Peptides & steroids education — legality, protocols, myth-busting |
| [Dr. Kyle Gillett](mentor-kyle-gillett/) | 25 | 93,397 | Preventive & hormonal medicine MD — GLP-1, BPC-157, bioidentical hormones |
| [Vigorous Steve](mentor-vigorous-steve/) | 24 | 412,177 | Enhanced-athlete PED & nootropics — tren case reports, cerebrolysin, sobetirome |
| [Mike Mutzel (High Intensity Health)](mentor-mike-mutzel/) | 24 | 62,100 | Metabolic health — berberine, CRP, creatine, insulin |
| [Broderick Chavez](mentor-broderick-chavez/) | 24 | 50,747 | Elite bodybuilding/PED coaching — PCT, liver enzymes, female PED |
| [The Anabolic Doc](mentor-anabolic-doc/) | 22 | 92,408 | Steroid harm-reduction MD — survey data, cardiac risk |
| [Rhonda Patrick (FoundMyFitness)](mentor-rhonda-patrick/) | 2 | 3,285 | Micronutrient & longevity science (small stub — 2 docs) |

<!-- non-mentor-brains:start -->

## Non-mentor brains

| Brain | Kind | Docs | Words | Use when |
|---|---|---|---|---|
| [Andrej Karpathy — ML/AI Mentor](karpathy/) | ML/AI mentor | 8 | 28,383 | Neural network design intuition, training recipes, RNNs, RL, LLM internals, software 2.0 framing |
| [Ali Askar — Aligrithm Quant Mentor](mentor-aligrithm/_README.md) | Quant-trading mentor | 10 | 18,382 | Backtest/strategy validation methodology (gauntlet cross-check), regime classification (efficiency ratio/noise/Hurst-FDI/variance-ratio), intermarket gating + lead-lag falsification, square-root impact/slippage-at-size, prop-challenge Kelly sizing, DSP/indicator engineering — for `mym-autotrader` strategy work. 232/373 source articles digested (62%, wave 4 2026-07-15); see `_manifest.json` for per-pillar coverage; wave-4 dig-queue cards alg4-01..10 in mym-autotrader `vault/07-opportunity-pipeline/aligrithm-wave4-mine.md`. |
| [TradingView Open-Source Pine — Wild Strategy-Rule Corpus](mentor-tradingview-pine/_README.md) | Quant source-vein (multi-author, rules-only, **D-WEB**) | 3 | ~1,800 | ORB/session/MR rule archetypes + wild-consensus spec parameters (NY OR 09:30–09:45, RSI2 5/95 cross-out, OR-width targets, ADF/ADX regime gates) for `mym-autotrader` test design; vein mechanics for mining pine-facade (733 candidates surfaced, 25 curated 2026-07-15). NEVER for edges or performance — every equity curve discarded; rules must be locally rebuilt + gauntleted (cards: `mym-autotrader/vault/07-opportunity-pipeline/pine-facade-harvest-2026-07-15.md`) |
| [MR Vein — Cross-Source Mean-Reversion Canon](mentor-mr-vein/_README.md) | Quant vein (cross-source: QEdges/RobotWealth/Chan/Alvarez/Aligrithm, **D-WEB**) | 3 | ~3,600 | Exact MR laws for `mym-autotrader` sleeve/gate/exit design: CBI capitulation-breadth level map + falsifiable S&P100 proxy + 23-row spike ledger (breadth beats raw vol — 2020 vol 35% was MR Sharpe +1.2); Kendall-corrected OU half-life gate β_c=β+(1+3β)/n + bootstrap 75th-pct + 0.5×-lookback law + 63d reject; one-persistence-axis law (AR(1)/Hurst/VR/ER = one number, never stack); sector-ETF market-neutral exact recipe (cross-sectional demean, Spearman coupling kill-switch); Gulen-Woeppel path-convexity formula; NO-tight-stop numbers (−2 ATR = −0.55%/trade); CMMA pooled primitive; vessel-dependent execution law. Realized cards: `mym-autotrader/vault/07-opportunity-pipeline/mr-dig-queue-specified.md` (mrq-01..11). Mined 2026-07-15 from `research/mr-vein/2026-07-15/` (37 raw files incl. paid Aligrithm 10.14/10.10/4.70). |
| [Algorithmic.io — ES Range-Level-Fade Validation Desk](mentor-algorithmic-io/_README.md) | Quant-trading mentor (single-source) | 3 | ~2,749 | Independent validation-methodology cross-check for `mym-autotrader`: session-level cluster bootstrap (1.4x SE-widening correction), MAE-at-resolution-bar hygiene rule (~9x bug confirmation), ML-can't-beat-base-rate negative control, MES cost model + 2x-slippage gate, prop-firm DD sizing formulas. 17/28 source posts digested (61%); signals are gated/unneeded, methodology is free. |
| [Peer-reviewed peptide literature](peptide-research/) | Citation-grade research corpus | 396 | 4,373,129 | Aurex copy/compliance backing — anything that needs paper-grade evidence (BPC-157, GHK-Cu, Selank/Semax, TB-500, Epitalon, CJC-1295/Ipamorelin) + FDA 503A bulks list |
| [DoseCraft research dossiers + protocol bible](dosecraft-research/) | Internal research corpus | 87 | 200,462 | Vendor pricing context, creator intelligence, master protocol bible chapters, white-label rankings |
| [G0DM0D3 jailbreak corpus](jailbreak-corpus/_README.md) | Defensive red-team test material | 27 | ~5k | Verifying classifier + cross-tier verifier behavior on jailbreak vectors. Used by router's pre-commit gauntlet and `cc-jailbreak-verify` CLI. NOT runtime prompts. |

_Sources noted in each brain's manifest._

<!-- non-mentor-brains:end -->

## Concept & forensic layers (no single author/mentor)

Unlike the mentor brains above, these aren't organized around one person's publication stream —
a peer-reviewed academic corpus, an anti-pattern reference built from dissected vendor sites
(both born from the 2026-07-12 research-mine wave as `mentor-algorithmic-io/`), and a real
trader-tape forensic corpus (born from the 2026-07-15 H50 harvest).

| Layer | Kind | Docs | Words | Use when |
|---|---|---|---|---|
| [Quant Methodology Canon](quant-methodology-canon/_README.md) | Peer-reviewed academic concept layer | 5 | ~5,300 | Citing the formula/finding source-of-truth behind `mym-autotrader`'s gauntlet (Deflated Sharpe + False Strategy Theorem, PBO/CSCV, CPCV-beats-walk-forward, Harvey-Liu haircut, Gao intraday momentum, Moskowitz TSMOM, Zhang decision-timing leakage, Boyd risk-constrained Kelly). **Osler's round-number order-clustering paper is the flagship citation — the published microfoundation of the QF-fade + failed-retest re-entry canon.** Second wave 2026-07-15 (`academic-harvest-2026-07-15.md`): 16 papers / 5 veins — Bertram/Leung-Li/Holy-Tomanova closed-form OU trio (analytic entry bands + vol floor, no-tight-stop-on-MR proof skeleton, ARMA(1,1) noise-robust half-life), round-number clustering beyond Osler (vol-conditioned, retail buy-side), Pineda ORB-retest + Mesfin MNQ falsification with in-house adjudication status, Avellaneda-Lee volume-clock upgrade; dig-queue cards lit15-01..08 in `mym-autotrader/vault/07-opportunity-pipeline/academic-lit-mine-2026-07-15.md`. See `cross-index-gauntlet-convergence.md` for how this canon, `mentor-aligrithm/`, and MYM's own doctrine independently converge. |
| [Scam / Grey-Zone Vendor Corpus](scam-corpus/_README.md) | Forensic anti-pattern corpus | 4 | ~2,533 | Fast-vetting a newly-surfaced trading product/signal vendor/course before spending research budget. Two dissected exemplars: Tradeorithms (simulated-demo-laundered-through-tracker + MLM referral ladder) and Algoriam (garden-of-forking-paths DoF: one model, three undeflated metric-optimized configs). Companion to the auto-memory file `reference-ig-trading-ad-vetting.md` (IG/FB-ad fast-vet log) — cross-reference both. Zero strategy candidates by design. |
| [Trader-Tape Corpus (H50 vein)](mentor-trader-tapes/_README.md) | Forensic tape corpus (verified/public trader-decision data) | 2 | ~1,100 | Before ANY trader-tape/leaderboard/copy-trading harvest, and when vetting a shown track record. Holds the FXBlue no-auth per-trade API crack, the Darwinex broker-real survivor ceiling (13 tracks 4.5–16yr, median ~4%/yr, best 21.3% — the annualized-return sanity prior), the machine-detectable high-WR/negative-skew grid-martingale signature, the deflation anatomy (seed bias worse than leaderboards, client-side badges, DD-on-balance artifact), and the random-relabel selection-test protocol. Raw tapes: `mym-autotrader/research/tapes/2026-07-15/`; dig-queue cards tape-01..06 in `vault/07-opportunity-pipeline/trader-tape-mine-2026-07-15.md`. |

## Topical indexes

- [_COMPOUND_INDEX.md](_COMPOUND_INDEX.md) — which mentors cover which peptides
- `_compound-index.json` — same data, programmatic

## Other corpora

- [dosecraft-research/](dosecraft-research/) — 87 docs, 198K words (creator dossiers, vendor pricing analyses, master protocol bible chapters)

## Adding a new brain

```bash
# YouTube/video URL list → transcribe + ingest
mega-brain-ingest --topic <new-mentor> --sources sources.txt

# Local files (PDFs, transcripts, articles) → ingest
mega-brain-ingest --topic <new-topic> --url /path/to/dir

# Then re-run this index builder
~/code/projects/scrapling-lab/.venv/bin/python /tmp/build-mentor-index.py
```

## Archive

- `_archive/` — intermediate / superseded brains (kept for traceability)

Generated 2026-05-03 from Neon `transcript_embeddings` (DoseCraft project, 8,826 chunks).