# Scam / Grey-Zone Vendor Corpus — Forensic Exemplars

- **Kind:** Anti-pattern reference corpus — canonical, dissected examples of trading-product funnels
  and grey-zone signal vendors, kept for fast-vetting future pitches. Not a mentor brain (no
  methodology to mine, that's the point) and not a strategy source — **these are forensic keeps,
  never gauntlet candidates.**
- **Docs:** `_README.md` + `_manifest.json` + `tradeorithms.md` + `algoriam.md` = 4 files.
- **Companion memory file:** `~/.claude/projects/-Users-leonardofibonacci/memory/
  reference-ig-trading-ad-vetting.md` — the founder's running fast-vet log of IG/FB-advertised
  trading products (Sentivue, Nova Quant, WhiteGlove, Alpha Capital, The Algo Institute, Crypto
  Arsenal). That file lives in the auto-memory layer (per-fact, user-scoped) and is **not edited by
  this corpus** — this directory is the wiki-side counterpart: longer-form, dossier-grade exemplars
  with full structural-scam-marker tallies, built from actual site-mining sessions rather than
  ad-screenshot triage. Cross-reference both when vetting a new pitch.

## What's in here

Two canonical exemplars mined 2026-07-12 as part of the 5-source research-mine wave (see
`~/code/projects/mym-autotrader/forensics/research-mine/SYNTHESIS.md`), both verdicted
**SKIP-AS-FUNNEL / SKIP** for research purposes — zero mechanics to extract, but each illustrates a
distinct, recurring scam/grey-zone pattern worth keeping as a reference signature:

| Exemplar | Pattern illustrated | File |
|---|---|---|
| **Tradeorithms** | Simulated-demo laundered through a legitimate-sounding third-party tracker (MyFXTracker) + MLM referral ladder + self-contradicting disclaimer, wearing a "transparent research desk" costume. 6/6 canonical structural-scam markers present + 5 aggravating. | `tradeorithms.md` |
| **Algoriam** | Garden-of-forking-paths degrees-of-freedom: one black-box model reported as three separate "best_return / best_sharpe / best_winrate" configs, each the argmax of a TP/SL grid search for a different metric, with no DSR/PBO/CSCV deflation applied to any of them. Legit incorporated entity, honest disclaimers — but the DoF pattern itself is exactly what a gauntlet must reject. | `algoriam.md` |

Both files preserve the full structural-scam-marker tally table from their source dossiers (matching
the same marker vocabulary as `reference-ig-trading-ad-vetting.md`: income claims w/o audited track
record, countdown/scarcity, testimonials without identity, black-box "AI" language, lead-gen funnel
structure, absence of methodology) plus source-specific aggravating markers unique to each.

## Why these two, not the other three research-mine sources

The same wave mined three more sources: `algorithmic.io` (real research desk — DEEP-MINE-YES, now
`../mentor-algorithmic-io/`), `academic-sweep` (peer-reviewed — DEEP-MINE-YES, now
`../quant-methodology-canon/`), and `algomatic` (legit-but-shallow education blog, one-pass skim,
three mechanics extracted per the SYNTHESIS but not scam-corpus material). Only tradeorithms and
algoriam verdicted as funnel/grey-zone with **zero** extractable mechanics — everything they contain
is presentation, not substance, which is exactly why they belong here instead of in a mentor brain.

## When to consult this corpus

- **Before spending research budget on a newly-surfaced trading product/signal vendor/course** —
  fast-vet against the marker tables in `tradeorithms.md` and `algoriam.md` first, alongside
  `reference-ig-trading-ad-vetting.md`'s existing marker list.
- **Illustrating the garden-of-forking-paths DoF failure mode in gauntlet docs** — `algoriam.md`'s
  `model_5` three-config structure is a clean, concrete "here is what NOT to do" example: one model,
  three metric-optimized exits, reported undeflated. Cite it directly when explaining why MYM's
  8-category DoF ledger penalizes exactly this pattern.
- **Illustrating the simulated-demo-as-proof funnel signature** — `tradeorithms.md`'s MyFXTracker
  mechanic (a real third-party tracker verifying a demo account produces numbers, which reads
  identically to a live-verified curve) is the clean example of why "third-party verified" is not
  itself evidence of anything beyond "the connected account produced these numbers."
- **NOT for strategy ideas.** Neither file contains a signal, formula, or mechanic worth porting.
  D-WEB (ideas-only) applies as everywhere else in this mega-brain layer, but here it resolves to
  zero candidates by design — the corpus exists to sharpen vetting, not to seed strategies.

## Recall pattern

```bash
rg -i 'PATTERN' ~/.claude/wiki/learnings/scam-corpus/
rg -i 'PATTERN' ~/.claude/projects/-Users-leonardofibonacci/memory/reference-ig-trading-ad-vetting.md
rg -i 'PATTERN' ~/code/projects/mym-autotrader/forensics/research-mine/{tradeorithms,algoriam}/dossier.md
```

**Mempalace semantic ingestion: not yet run** — same status as every other brain in this mega-brain
layer this session.

## Provenance

Built from the `tradeorithms/dossier.md` and `algoriam/dossier.md` files inside the founder-authorized
research-mine wave (2026-07-12). No credential/config/money-path contact; both dossiers were built
via public, unauthenticated reads (Tradeorithms: public Next.js site + Telegram public channel;
Algoriam: public landing SPA + two public unauthenticated JSON API endpoints — a single forensic read
each, no automated crawling given both sites' ToS restrict scraping).

**D-WEB applies**: everything here is ideas-only, and here the ideas are entirely negative
(anti-patterns to recognize, not mechanics to adopt).
