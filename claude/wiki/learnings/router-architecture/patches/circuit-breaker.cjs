/**
 * Circuit Breaker — SQLite-backed, cross-process safe.
 *
 * Replaces the prior in-memory Map + JSON+rename design that raced across
 * processes (`cc-tasks`, `router-ping`, parallel `ask()` callers each
 * maintained their own Map and last-writer-wins on the JSON file).
 *
 * Key correctness properties:
 *   - State changes happen in IMMEDIATE-mode transactions (write lock from
 *     the start). Multiple processes calling `isCircuitOpen()` for the same
 *     open-tier-just-past-cooldown serialize: exactly one wins the probe slot.
 *   - probe_owner_pid + probe_started_ms expose probe ownership to other
 *     processes. A crashed probe owner doesn't deadlock the tier — stale
 *     probes (older than PROBE_MAX_MS) are treated as released on read.
 *   - Public surface is API-compatible with the prior in-process module
 *     (getCB, isCircuitOpen, recordTierSuccess, recordTierFailure,
 *     _resetCircuitForTest).
 *
 * Migration: on first connect, if the legacy JSON file exists at
 * memory/router-circuits.json AND the SQLite table is empty, rows are
 * back-filled and the legacy file is renamed to .migrated (paranoid; not
 * deleted) so the migration is idempotent and reversible by hand.
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const CB_THRESHOLD = parseInt(process.env.CC_CB_THRESHOLD || '3', 10);
const CB_COOLDOWN_MS = parseInt(process.env.CC_CB_COOLDOWN_MS || '30000', 10);
const PROBE_MAX_MS = parseInt(process.env.CC_CB_PROBE_MAX_MS || '60000', 10);

// Per-tier threshold adjustment is clamped — a runaway autotuner can't make
// the breaker pathological (zero/negative threshold = always-open) or make
// it useless (huge threshold = never-trip).
const CB_ADJUSTMENT_CAP = parseInt(process.env.CC_CB_ADJUSTMENT_CAP || '3', 10);
const CB_THRESHOLD_FLOOR = parseInt(process.env.CC_CB_THRESHOLD_FLOOR || '1', 10);

// Default DB lives next to the rest of the router state. Tests override via
// CC_CB_DB to keep the production breaker untouched.
const DB_PATH = process.env.CC_CB_DB
  || path.join(__dirname, '..', 'memory', 'router-circuits.db');
const LEGACY_JSON = path.join(__dirname, '..', 'memory', 'router-circuits.json');
const TUNING_PATH = process.env.CC_TUNING_FILE
  || path.join(__dirname, '..', 'memory', 'classifier-tuning.json');

// In-memory cache of the autotuner's per-tier adjustments. Reloaded only when
// the source file's mtime changes — that keeps the hot path (recordTierFailure)
// allocation-free and avoids a stat() per call.
let _tuning = null;
let _tuningMtime = 0;
function loadTuning() {
  try {
    const stat = fs.statSync(TUNING_PATH);
    if (stat.mtimeMs === _tuningMtime) return _tuning;
    _tuning = JSON.parse(fs.readFileSync(TUNING_PATH, 'utf8'));
    _tuningMtime = stat.mtimeMs;
    return _tuning;
  } catch {
    // No file, malformed, or first-run — fall back to base threshold.
    return null;
  }
}

/**
 * Returns the effective CB trip threshold for a tier, applying the autotuner's
 * cbAdjustment (from memory/classifier-tuning.json) as a clamped offset.
 *   adj > 0 → tier is degraded; raise threshold so we don't break it permanently
 *   adj < 0 → tier is reliable; lower threshold so we surface new regressions fast
 * Clamped to ±CB_ADJUSTMENT_CAP; floor at CB_THRESHOLD_FLOOR (>= 1).
 */
function getTierThreshold(tierId) {
  const t = loadTuning();
  const adj = t?.adjustments?.[tierId]?.cbAdjustment;
  if (typeof adj !== 'number' || Number.isNaN(adj)) return CB_THRESHOLD;
  const clamped = Math.max(-CB_ADJUSTMENT_CAP, Math.min(CB_ADJUSTMENT_CAP, adj));
  return Math.max(CB_THRESHOLD_FLOOR, CB_THRESHOLD + clamped);
}

let _db = null;
function db() {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('synchronous = NORMAL');
  _db.pragma('busy_timeout = 5000');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS circuits (
      tier_id TEXT PRIMARY KEY,
      failures INTEGER NOT NULL DEFAULT 0,
      last_failure_ms INTEGER,
      open INTEGER NOT NULL DEFAULT 0,
      half_open INTEGER NOT NULL DEFAULT 0,
      probe_owner_pid INTEGER,
      probe_started_ms INTEGER,
      successes INTEGER NOT NULL DEFAULT 0,
      updated_ms INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_circuits_open ON circuits(open);
  `);
  migrateFromJsonIfPresent();
  return _db;
}

function migrateFromJsonIfPresent() {
  // Only fire when (a) legacy JSON exists AND (b) the new table is empty
  if (!fs.existsSync(LEGACY_JSON)) return;
  const haveRows = _db.prepare('SELECT COUNT(*) AS n FROM circuits').get().n;
  if (haveRows > 0) return;
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(LEGACY_JSON, 'utf8'));
  } catch (_) {
    return; // malformed legacy file → start fresh
  }
  const ins = _db.prepare(`INSERT OR REPLACE INTO circuits
    (tier_id, failures, last_failure_ms, open, half_open, probe_owner_pid, probe_started_ms, successes, updated_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const tx = _db.transaction((rows) => {
    for (const [k, v] of Object.entries(rows)) {
      // Legacy key 'tierD' was renamed to 'design' to match TIER_DEFS
      const tierId = k === 'tierD' ? 'design' : k;
      ins.run(
        tierId,
        v.failures || 0,
        v.lastFailure || null,
        v.open ? 1 : 0,
        v.halfOpen ? 1 : 0,
        v.probeInFlight ? -1 : null,        // pid unknown — flag with -1 so isCircuitOpen treats it as foreign
        v.probeInFlight ? Date.now() : null,
        v.successes || 0,
        Date.now()
      );
    }
  });
  try {
    tx(raw);
    // Rename, don't delete — keep an audit trail
    fs.renameSync(LEGACY_JSON, LEGACY_JSON + '.migrated');
  } catch (_) {
    // Best-effort migration; on error, leave legacy file in place
  }
}

function rowToCB(row) {
  if (!row) {
    return { failures: 0, lastFailure: 0, open: false, halfOpen: false, probeInFlight: false, successes: 0, probeOwnerPid: null };
  }
  // A probe is "stale" if the owning process likely crashed before completing.
  // Treating it as released (rather than blocking forever) is the safe default;
  // worst case a second probe runs against a still-broken tier and re-trips
  // the breaker, which is what the breaker is for.
  const probeStale = row.probe_started_ms && (Date.now() - row.probe_started_ms) > PROBE_MAX_MS;
  return {
    failures: row.failures,
    lastFailure: row.last_failure_ms || 0,
    open: !!row.open,
    halfOpen: !!row.half_open && !probeStale,
    probeInFlight: !!row.probe_owner_pid && !probeStale,
    successes: row.successes,
    probeOwnerPid: row.probe_owner_pid,
  };
}

function getCB(tierId) {
  const row = db().prepare('SELECT * FROM circuits WHERE tier_id=?').get(tierId);
  return rowToCB(row);
}

/**
 * Returns true if the tier should NOT be called.
 * Side effect: when the breaker is open AND cooldown has elapsed, atomically
 * transitions to half-open and claims the probe slot for the calling process.
 * Concurrent callers from other processes serialize on the IMMEDIATE-mode
 * transaction; only one wins the probe.
 */
function isCircuitOpen(tierId) {
  const d = db();
  const tx = d.transaction(() => {
    const row = d.prepare('SELECT * FROM circuits WHERE tier_id=?').get(tierId);
    if (!row) return { open: false };
    const cb = rowToCB(row);
    if (!cb.open) {
      // Closed but half-open with someone else probing → block
      if (cb.halfOpen && cb.probeInFlight && cb.probeOwnerPid !== process.pid) {
        return { open: true, reason: 'probe-in-flight' };
      }
      return { open: false };
    }
    // Open. Check cooldown.
    if (Date.now() - cb.lastFailure > CB_COOLDOWN_MS) {
      // Claim the probe slot — this UPDATE is what makes the half-open
      // transition cross-process atomic.
      d.prepare(`UPDATE circuits
                 SET open = 0,
                     half_open = 1,
                     probe_owner_pid = ?,
                     probe_started_ms = ?,
                     updated_ms = ?
                 WHERE tier_id = ?`)
       .run(process.pid, Date.now(), Date.now(), tierId);
      return { open: false, reason: 'half-open-claim' };
    }
    return { open: true, reason: 'cooldown' };
  });
  const result = tx.immediate();
  return result.open;
}

function recordTierSuccess(tierId) {
  const d = db();
  const now = Date.now();
  d.prepare(`INSERT INTO circuits (tier_id, failures, last_failure_ms, open, half_open, probe_owner_pid, probe_started_ms, successes, updated_ms)
             VALUES (?, 0, NULL, 0, 0, NULL, NULL, 1, ?)
             ON CONFLICT(tier_id) DO UPDATE SET
               failures = 0,
               last_failure_ms = NULL,
               open = 0,
               half_open = 0,
               probe_owner_pid = NULL,
               probe_started_ms = NULL,
               successes = successes + 1,
               updated_ms = excluded.updated_ms`)
   .run(tierId, now);
}

/**
 * Increments failure count, opens the breaker at threshold.
 * Returns { wasOpen, nowOpen, failures } so the caller can fire telemetry
 * (alerts, metrics) on the closed→open transition exactly once.
 */
function recordTierFailure(tierId) {
  const d = db();
  const now = Date.now();
  const tx = d.transaction(() => {
    const prev = d.prepare('SELECT * FROM circuits WHERE tier_id=?').get(tierId);
    const failures = (prev?.failures || 0) + 1;
    const wasOpen = !!prev?.open;
    const nowOpen = failures >= getTierThreshold(tierId);
    d.prepare(`INSERT INTO circuits (tier_id, failures, last_failure_ms, open, half_open, probe_owner_pid, probe_started_ms, successes, updated_ms)
               VALUES (?, ?, ?, ?, 0, NULL, NULL, ?, ?)
               ON CONFLICT(tier_id) DO UPDATE SET
                 failures = excluded.failures,
                 last_failure_ms = excluded.last_failure_ms,
                 open = excluded.open,
                 half_open = 0,
                 probe_owner_pid = NULL,
                 probe_started_ms = NULL,
                 updated_ms = excluded.updated_ms`)
     .run(tierId, failures, now, nowOpen ? 1 : 0, prev?.successes || 0, now);
    return { wasOpen, nowOpen, failures };
  });
  return tx.immediate();
}

function _resetCircuitForTest(tierId) {
  if (tierId) {
    db().prepare('DELETE FROM circuits WHERE tier_id=?').run(tierId);
  } else {
    db().exec('DELETE FROM circuits');
  }
}

function getAll() {
  return db().prepare('SELECT * FROM circuits').all().map(r => ({ tierId: r.tier_id, ...rowToCB(r) }));
}

function close() {
  if (_db) { _db.close(); _db = null; }
}

module.exports = {
  getCB,
  isCircuitOpen,
  recordTierSuccess,
  recordTierFailure,
  _resetCircuitForTest,
  getAll,
  close,
  CB_THRESHOLD,
  CB_COOLDOWN_MS,
  PROBE_MAX_MS,
  DB_PATH,
};
