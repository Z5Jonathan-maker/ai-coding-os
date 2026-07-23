---
name: project-mym-mbo-lane
description: "MBO/crypto L3 lane — multi-venue recorder LIVE since 2026-07-12 (Bitstamp+Bitfinex+Bybit), Coinbase auth-gated, reconstruction gate proven, research rules + fee floors"
metadata: 
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**Founder-directed lane (2026-07-12): free MBO data via crypto venues.** State:

- **Recorder LIVE:** `scripts/mbo_collector.py` (mym-autotrader), plain background process —
  launchd plist STAGED UNLOADED at `~/Library/LaunchAgents/com.jonathan.coinbase-l3.plist`
  (permission gate: founder must `launchctl load` it for reboot survival). Streams: Bitstamp
  live_orders+trades (~150/s, true full-depth MBO, no auth), Bitfinex R0 raw book (per-order,
  top-250 window), Bybit perp tape (for lead-lag sync; needs op:ping every 20s), Bitstamp REST
  order-level snapshots q15m (its stream has no subscribe snapshot). Data:
  `data/mbo/<venue>/<sym>/YYYYMMDD-HH.pNNNN.ndjson.gz` (per-start suffix = crash isolation;
  data/mbo gitignored). Disk guard 6 GiB floor (machine has ~13 GiB free — storage decision
  open). ~300-400 MB/day total.
- **Coinbase full/level3 = AUTH-GATED since ~2023** (live probe error: "level2, level3, and
  full channels now require authentication") — docs claiming public are stale. Data free with
  an Exchange API key; collector auto-enables on COINBASE_EXCHANGE_KEY/_SECRET/_PASSPHRASE.
- **Key research facts (brief at vault/07-opportunity-pipeline/mbo-l3-research-brief.md):**
  Bybit has NO public L3 → L3-unique families (queue MM, icebergs, spoof-fade) are
  research-only; deployable set = L2-reducible (coarse OFI, microprice, imbalance, VPIN) at
  Bybit 4-11bps RT floor; Coinbase spot retail 80-120bps = dead for execution. Hyperliquid =
  freest true order-level alternative (public S3 L2 archive; L4 via own node).
- **Reconstruction gate PROVEN day-0** (`backtest/mbo/{readers,book,validate}.py`, 12 tests):
  Bitfinex PASS, Bitstamp 0.023% order-err (bootstrap one-off), cross-venue mids within 7bps,
  Bybit exact-match pending a natural reconnect. **Standing rule: research code re-anchors
  every window and DISCARDS is_crossed() readings** — one ghost order poisoned 62% of an
  un-anchored replay.
- **Gates before claims:** ≥2-4 weeks clean capture; lead-lag check (recorded venues vs Bybit)
  EARLY; fee-floor falsifiers per family. Honest prior: YM order-flow proxies null — bar
  proxies though, not true MBO.

**How to apply:** check the collector is alive (`ps aux | grep mbo_collector`, log
`logs/mbo_collector.log`) before promising data continuity. Related:
[[project-mym-research-blitz-2026-07-12]], [[project-mym-live-config]].

---
**2026-07-21 addition — a LIGHTER footprint recorder + NT8/YM source (partial overlap, be honest).**
A separate `engine/data/orderflow_recorder.py` was built this session: Coinbase **`matches` (public trades)
channel** → footprint/delta/POC/cum-delta bars → rotating zstd parquet (`data/orderflow/`), + a feature
layer (`orderflow_features.py`: absorption, CVD-divergence, delta-mom) + a live dashboard panel + an
**NT8/Tradovate YM source** (`normalize_nt8`/`nt8_file_source` + `engine/data/nt8/MymOrderFlowRecorder.cs`,
staged to the VPS NT8). Live as launchd `com.jonathan.mym-orderflow-btc` (pid varies).
- **Correction to the record:** the Coinbase `full`/`level3` channel is AUTH-GATED (as this memory notes),
  but the `matches` trade channel IS public/free — that is what this recorder uses (proven live, 579
  trades/10s). "Free L3 via full channel" is wrong; free TRADE-PRINT flow via matches is right.
- **Overlap:** this duplicates crypto trade-capture that `scripts/mbo_collector.py` already does more
  richly (true L3 book from Bitstamp/Bitfinex/Bybit). The NEW value is (a) the NT8/**YM** source (mbo_collector
  is crypto-only), (b) the footprint/feature/dashboard layer, (c) a simpler trade-print path. TODO: reconcile —
  the recorder should ideally consume mbo_collector's crypto capture rather than its own Coinbase stream.
- **Honesty tie-in:** per [[project-mym-confluence-order-flow-null]], order flow does NOT systematize on YM as
  an auto-gate; so this recorder + panel are a MONITORED/discretionary readout, not an auto-signal.
