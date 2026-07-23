---
name: project-mym-hq-command-center
description: "Area61 HQ — Nebula-skinned mission-control dashboard at :8770/hq/; live cockpit (bias/accounts/engine-heartbeat/books/forward/intel), 4 surfaces (browser/PWA/menu-bar/TV-wall), macOS celebration on new gauntlet winners"
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

Built 2026-07-16. Unified visual command center for the whole MYM operation — founder wanted to SEE
the 24/7 engine + accounts + mined intel, not just read chat verdicts. Commits `468eb52` (Phase 1) +
`13ef5d7` (Phase 2/3) in mym-autotrader.

**Where it lives:** `mym-autotrader/docs/hq/` (self-contained SPA: index.html/tokens.css/hq.css/hq.js,
served by the existing `mym-dashserve` launchd on **http://127.0.0.1:8770/hq/**) + `hq/` (Python:
`build_hq_state.py` aggregator → `docs/data/hq-state.json`; `bias_writer.py` → `bias-today.json`;
`celebrate.py` watcher; `menubar/render.py` + `hq.5s.sh`; `refresh.sh`).

**Visual language = Nebula, extracted via code** (founder DETESTS the old dashboards — zero visual
reuse). Lifted from `/Applications/Nebula.app` → `app.asar` → `out/renderer/assets/*.css` (owned-
licensed, UI-only, no backend/keys). Distilled to `docs/hq/tokens.css`: dark institutional terminal —
slate-blue `#5E93C0`, gold `#CDAA52`, near-black `#08090D`/`#13161C`, IBM Plex Sans/Mono (bundled
woff2 in `docs/hq/fonts/`), sharp 4px corners. Provenance doc: `hq/NEBULA-UI-TOKENS.md`. Extract at
`hq/extract/` (gitignored).

**Panels:** hero = Today's-Bias cockpit (bias/levels/QF-grid) + governor gates + live positions;
accounts strip (equity/day-P&L/win-rate/drawdown-to-limit gauge/payout progress); engine-heartbeat
orb (winners-this-week counter, K-odometer, alpha-wealth, pass-rate, discovery feed); season-books
health grid; forward-test (backtest vs live, holding/fading/pending); mined-intel (genomes/hypotheses).

**4 surfaces:** browser tab; `Area61 HQ.app` (Chrome `--app` PWA in `~/Applications`); **SwiftBar
menu-bar** heartbeat (`🏆winners  +$P&L`, plugin dir = `hq/menubar/`, SwiftBar installed via brew);
TV-wall `?wall=1`; responsive/phone (bodyOverflowX=0 verified).

**Celebration:** `hq/celebrate.py` (launchd KeepAlive) polls `engine/state/shadow_book.jsonl` → macOS
notification + sound on each new gauntlet survivor + rebuilds hq-state; UI orb flares + gold toast.
Baselined at 13 (won't spam history).

**launchd:** `com.jonathan.mym-hq-state` (refresh 5 min via `hq/refresh.sh`) +
`com.jonathan.mym-hq-celebrate` (KeepAlive).

**Data gap filled:** today's bias was never persisted; `bias_writer.py` computes it fresh via
yfinance `YM=F` → `service/bias_engine.compute_bias`. Read-only of all trading/engine state; writes
only `docs/hq/`, `docs/data/*.json`, `hq/` — no trading code touched. Also this session: fixed the
engine fuel gap (added `com.jonathan.mym-corpus-intake` launchd, 6-hourly). Related:
[[project-mym-autotrader-assistant]], [[project-mym-fundability-2026-07-16]].
