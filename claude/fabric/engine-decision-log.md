# Engine Decision Log (W3 trace-to-ADR autopsy)

Append-only institutional memory of ENGINE changes (code<->behavior correlations),
distinct from strategy results. Written by ~/.claude/fabric/w3_trace_adr.py.
## 2026-07-23 16:57 EDT - autopsy run

- code-change source: codebase-memory-mcp detect_changes [ok (481 files)] + git log -10
- ingest_traces response: {"status": "accepted", "traces_received": 8, "note": "Runtime edge creation from traces not yet implemented"}

### State/report files inspected
- `gauntlet_reconcile_report.json` (mtime 2026-07-23 14:53): {"generated_at": "2026-07-23T18:53:24+00:00", "instruments": 3851, "defects": 0, "catastrophe": [], "too_lenient": [], "clean": true}
- `brain_history.jsonl` (mtime 2026-07-23 16:55): {"date": "2026-07-23", "brain_index": 70.4, "dimensions": {"exploration": 100, "throughput": 67.1, "learning": 98.6, "knowledge": 95.6, "yield": 5.7}, "tested_total": 10255, "winners_total": 29, "K_lifetime": 42232, "ato
- `model_provenance.json` (mtime 2026-07-22 13:58): {"strong_model": "claude-fable-5", "bulk_model": "haiku", "scope": "harvester atom extraction", "cutover": "2026-07-22T01:14:52Z"}
- `k_ledger.json` (mtime 2026-07-23 16:44): {"K_lifetime": 42232, "K_by_family": {"rsi2_mr": 9441, "orb_momentum": 14567, "pairs_mr": 9, "ou_mr": 3767, "cmma_mr": 810, "dd_mr": 182, "ppc_mr": 109, "breakout_retest": 6, "crabel_nr_orb": 6, "smc_reversal": 6, "donch
- `forward_fills.jsonl` (mtime 2026-07-22 18:52): {"candidate_id": "trend_pullback_swing_MES_long_1h_6676992e", "family": "trend_pullback_swing", "vessel": "MES", "fingerprint": "6676992e610dc825", "spec": {"fast_len": 10, "trend_len": 100, "atr_len": 14, "stop_atr": 2.
- `beliefs.jsonl` (mtime 2026-07-23 16:44): {"event": "decay", "half_life_days": 45.0, "now": "2026-07-23T19:38:18+00:00", "ts": "2026-07-23T19:38:18+00:00"}
- `candidates.jsonl` (mtime 2026-07-23 16:44): {"id": "ppc_mr_IWM_long_path_convexity_da8df307", "family": "ppc_mr", "vessel": "IWM", "spec": {"conv_h": 8, "conv_k": 1.0, "atr_len": 14, "recover_frac": 0.5, "time_stop": 12, "vessel": "IWM", "direction": "long", "gate
- `gap_history.jsonl` (mtime 2026-07-23 16:44): {"families": ["academic", "aligrithm", "books-patents", "concepts", "crypto_research", "microstructure-altdata", "mr_blogs", "prediction_markets", "quant_blogs", "reference", "repo_strategies", "repos-tradingview", "work
- `journal_hypotheses.jsonl` (mtime 2026-07-23 16:44): {"kind": "setup", "dims": ["fibonacci-extension"], "n": 70, "win_rate": 0.5, "expR": 0.035, "score": 0.296, "direction_hint": "with-signal"}
- `investigation_docket.jsonl` (mtime 2026-07-23 16:44): {"queued_at": "2026-07-23T02:44:08.853941+00:00", "status": "OPEN", "candidate_id": "harmonic_MNQ_both_range_choppy_6248f2b8", "family": "harmonic", "verdict": "QUARANTINE", "pf": 0, "oos_net": 0, "dsr": 0, "kill_reason"
- `corpus_intake_state.json` (mtime 2026-07-23 16:44): {"cumulative_pulled": 30940, "last_run": "2026-07-23T19:03:16Z", "rotation_cursor": 31, "runs": 31}
- `world_state_history.jsonl` (mtime 2026-07-23 16:55): {"date": "2026-07-22", "written_at": "2026-07-23T20:55:59.569983+00:00", "regime": "mid-vol reverting", "dimensions": {"realized_vol": {"value": 0.1982117760050237, "pct": 0.41085600907029474, "label": "normal"}, "vol_ex

### Commits considered
- `78ab88f8` 07-23 16:44 autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti (1 files)
- `f83875a7` 07-23 16:16 autonomous crank: log cycle 1 (general fidelity lift; per-account overfit rejected) (1 files)
- `3b0f1081` 07-23 16:16 autonomous cycle 1: general exit-fidelity lift (codex) -- per-account overfit REJECTED on  (2 files)
- `b15ec3f1` 07-23 15:19 autonomous crank: durable 24/7 work plan + queue (founder stepped away, zero-input mode) (1 files)
- `5aee3ed6` 07-23 15:14 CERTIFIED CATALOG: 12 null-certified prop winners + first prop-firm playbook (18 files)
- `80f401c3` 07-23 15:09 wire null-certification through factory/autopilot/emit_spec/playbook (4 files)
- `65e34f19` 07-23 15:09 vps: sync state/outbox (2 files)
- `6c27744d` 07-23 15:08 ops(vps): task 002 — deploy Area61 fix #2 (Plan B: Sim+funded simultaneously, post-close,  (1 files)
- `51776f3f` 07-23 15:08 CERTIFICATION: null-margin gate + bars-aware timeframe (codex gpt-5.5, indep-verified) (2 files)
- `4cdd5b29` 07-23 15:06 fix(area61): fix #2 batch — exit-mgmt + parity + robustness (both strategies) (2 files)

### Autopsy correlations
- **gauntlet_reconcile_report.json** -> 1 candidate change(s); best=weak
  - [weak] `4cdd5b29` fix(area61): fix #2 batch — exit-mgmt + parity + robustness (both strategies) | overlap=[] | 0.2h apart
- **brain_history.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.2h apart
- **model_provenance.json** -> no clear cause found
- **k_ledger.json** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **forward_fills.jsonl** -> no clear cause found
- **beliefs.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **candidates.jsonl** -> 2 candidate change(s); best=strong
  - [strong] `80f401c3` wire null-certification through factory/autopilot/emit_spec/playbook | overlap=['factory'] | 1.6h apart
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **gap_history.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **journal_hypotheses.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **investigation_docket.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **corpus_intake_state.json** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.0h apart
- **world_state_history.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `78ab88f8` autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti | overlap=[] | 0.2h apart

**TL;DR:** 12 state files, 10 commits, 1 strong / 10 weak correlation(s).

## 2026-07-23 18:00 EDT - autopsy run

- code-change source: codebase-memory-mcp detect_changes [ok (478 files)] + git log -10
- ingest_traces response: {"status": "accepted", "traces_received": 8, "note": "Runtime edge creation from traces not yet implemented"}

### State/report files inspected
- `gauntlet_reconcile_report.json` (mtime 2026-07-23 17:37): {"generated_at": "2026-07-23T21:37:07+00:00", "instruments": 3869, "defects": 0, "catastrophe": [], "too_lenient": [], "clean": true}
- `brain_history.jsonl` (mtime 2026-07-23 17:57): {"date": "2026-07-23", "brain_index": 70.7, "dimensions": {"exploration": 100, "throughput": 68.5, "learning": 99.3, "knowledge": 95.9, "yield": 6.0}, "tested_total": 10279, "winners_total": 31, "K_lifetime": 42401, "ato
- `model_provenance.json` (mtime 2026-07-22 13:58): {"strong_model": "claude-fable-5", "bulk_model": "haiku", "scope": "harvester atom extraction", "cutover": "2026-07-22T01:14:52Z"}
- `k_ledger.json` (mtime 2026-07-23 17:58): {"K_lifetime": 42564, "K_by_family": {"rsi2_mr": 9526, "orb_momentum": 14567, "pairs_mr": 10, "ou_mr": 3873, "cmma_mr": 908, "dd_mr": 210, "ppc_mr": 123, "breakout_retest": 6, "crabel_nr_orb": 6, "smc_reversal": 6, "donc
- `forward_fills.jsonl` (mtime 2026-07-23 17:57): {"candidate_id": "trend_pullback_swing_MES_long_1h_6676992e", "family": "trend_pullback_swing", "vessel": "MES", "fingerprint": "6676992e610dc825", "spec": {"fast_len": 10, "trend_len": 100, "atr_len": 14, "stop_atr": 2.
- `beliefs.jsonl` (mtime 2026-07-23 17:57): {"event": "decay", "half_life_days": 45.0, "now": "2026-07-23T21:48:37+00:00", "ts": "2026-07-23T21:48:37+00:00"}
- `candidates.jsonl` (mtime 2026-07-23 17:58): {"id": "cmma_mr_QQQ_long_cmma_overshoot_c92fcea3", "family": "cmma_mr", "vessel": "QQQ", "spec": {"sma_n": 20, "cmma_k": 1.5, "time_stop": 10, "vessel": "QQQ", "direction": "long", "gate": "cmma_overshoot", "kill_criteri
- `gap_history.jsonl` (mtime 2026-07-23 17:57): {"families": ["academic", "aligrithm", "books-patents", "concepts", "crypto_research", "microstructure-altdata", "mr_blogs", "prediction_markets", "quant_blogs", "reference", "repo_strategies", "repos-tradingview", "work
- `journal_hypotheses.jsonl` (mtime 2026-07-23 17:57): {"kind": "setup", "dims": ["fibonacci-extension"], "n": 70, "win_rate": 0.5, "expR": 0.035, "score": 0.296, "direction_hint": "with-signal"}
- `investigation_docket.jsonl` (mtime 2026-07-23 17:57): {"queued_at": "2026-07-23T02:44:08.853941+00:00", "status": "OPEN", "candidate_id": "harmonic_MNQ_both_range_choppy_6248f2b8", "family": "harmonic", "verdict": "QUARANTINE", "pf": 0, "oos_net": 0, "dsr": 0, "kill_reason"
- `corpus_intake_state.json` (mtime 2026-07-23 17:57): {"cumulative_pulled": 30940, "last_run": "2026-07-23T19:03:16Z", "rotation_cursor": 31, "runs": 31}
- `reservation_ledger.jsonl` (mtime 2026-07-23 17:58): {"K_adjudication_used": 42564, "detail": {"adj_dsr_at_frozen_K": 0.514708, "frozen_K": 42564, "n_obs": 175, "screen_K": 42401, "screen_dsr": 0.5150447686844871}, "look_id": 519, "seq": 1171, "status": "FINAL_ADJUDICATED"

### Commits considered
- `ef767d49` 07-23 17:57 autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) (1 files)
- `e8378102` 07-23 17:57 harden book optimizer: ISO-date parsing (myfxbook) + drop money-losing winners + tests (3 files)
- `37343ddd` 07-23 17:52 book optimizer: Mean-CVaR allocation over certified winners (cuFOLIO mine) + efficient fro (2 files)
- `669cfd76` 07-23 17:43 autonomous crank queue: add BOOK OPTIMIZER (Mean-CVaR, cuFOLIO method, CPU) -- certified c (1 files)
- `7aca641e` 07-23 17:14 autonomous crank: log cycle 2 result + cycle 3 direction (tape-tree frontier / MAE-MFE re- (1 files)
- `6ccaa613` 07-23 17:14 autonomous cycle 2: receipts-first exit reconstruction (codex, generalizable) + fix emit_s (3 files)
- `78ab88f8` 07-23 16:44 autonomous crank: cycle 2 start (receipts-first fidelity); catalog 12->15 certified; marti (1 files)
- `f83875a7` 07-23 16:16 autonomous crank: log cycle 1 (general fidelity lift; per-account overfit rejected) (1 files)
- `3b0f1081` 07-23 16:16 autonomous cycle 1: general exit-fidelity lift (codex) -- per-account overfit REJECTED on  (2 files)
- `b15ec3f1` 07-23 15:19 autonomous crank: durable 24/7 work plan + queue (founder stepped away, zero-input mode) (1 files)

### Autopsy correlations
- **gauntlet_reconcile_report.json** -> 1 candidate change(s); best=weak
  - [weak] `669cfd76` autonomous crank queue: add BOOK OPTIMIZER (Mean-CVaR, cuFOLIO method, CPU) -- certified c | overlap=[] | 0.1h apart
- **brain_history.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **model_provenance.json** -> no clear cause found
- **k_ledger.json** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **forward_fills.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **beliefs.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **candidates.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **gap_history.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **journal_hypotheses.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **investigation_docket.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **corpus_intake_state.json** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart
- **reservation_ledger.jsonl** -> 1 candidate change(s); best=weak
  - [weak] `ef767d49` autonomous crank: log cycle 3 (book optimizer built + hardened; cuFOLIO mined) | overlap=[] | 0.0h apart

**TL;DR:** 12 state files, 10 commits, 0 strong / 11 weak correlation(s).
