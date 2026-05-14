'use strict';
/**
 * Tests: circuit-breaker reads classifier-tuning.json cbAdjustment and applies
 * it as a clamped per-tier offset to CB_THRESHOLD.
 *
 * Run via: node tests/circuit-breaker-autotuner.test.cjs
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const TEST_DB = '/tmp/cb-autotuner-test.db';
const TEST_TUNING = '/tmp/cb-autotuner-test-tuning.json';

function freshModule(tuningContent) {
  // Reset state every test — drop the DB, rewrite tuning, clear require cache.
  fs.rmSync(TEST_DB, { force: true });
  fs.rmSync(TEST_DB + '-wal', { force: true });
  fs.rmSync(TEST_DB + '-shm', { force: true });
  if (tuningContent === null) {
    fs.rmSync(TEST_TUNING, { force: true });
  } else {
    fs.writeFileSync(TEST_TUNING, JSON.stringify(tuningContent));
  }
  process.env.CC_CB_DB = TEST_DB;
  process.env.CC_TUNING_FILE = TEST_TUNING;
  delete require.cache[require.resolve('../lib/circuit-breaker.cjs')];
  return require('../lib/circuit-breaker.cjs');
}

function failsUntilOpen(cb, tier, maxAttempts) {
  for (let i = 1; i <= maxAttempts; i++) {
    const r = cb.recordTierFailure(tier);
    if (r.nowOpen) return i;
  }
  return null;
}

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗ ${name}\n    ${e.message}`);
    failed++;
  }
}

console.log('circuit-breaker autotuner integration:');

test('no tuning file → default threshold (3)', () => {
  const cb = freshModule(null);
  assert.strictEqual(failsUntilOpen(cb, 'any', 5), 3);
});

test('tuning entry missing for tier → default threshold (3)', () => {
  const cb = freshModule({ adjustments: { other_tier: { cbAdjustment: 2 } } });
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 5), 3);
});

test('positive adjustment raises threshold (cheap +2 → 5)', () => {
  const cb = freshModule({ adjustments: { cheap: { cbAdjustment: 2 } } });
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 7), 5);
});

test('negative adjustment lowers threshold (codex -1 → 2)', () => {
  const cb = freshModule({ adjustments: { codex: { cbAdjustment: -1 } } });
  assert.strictEqual(failsUntilOpen(cb, 'codex', 4), 2);
});

test('positive runaway clamps at +3 (adj=99 → threshold 6)', () => {
  const cb = freshModule({ adjustments: { weird: { cbAdjustment: 99 } } });
  assert.strictEqual(failsUntilOpen(cb, 'weird', 8), 6);
});

test('negative runaway clamps but floors at 1 (adj=-99 → threshold 1)', () => {
  const cb = freshModule({ adjustments: { brittle: { cbAdjustment: -99 } } });
  assert.strictEqual(failsUntilOpen(cb, 'brittle', 3), 1);
});

test('malformed tuning JSON → default threshold', () => {
  fs.rmSync(TEST_DB, { force: true });
  fs.rmSync(TEST_DB + '-wal', { force: true });
  fs.rmSync(TEST_DB + '-shm', { force: true });
  fs.writeFileSync(TEST_TUNING, '{not valid json}');
  process.env.CC_CB_DB = TEST_DB;
  process.env.CC_TUNING_FILE = TEST_TUNING;
  delete require.cache[require.resolve('../lib/circuit-breaker.cjs')];
  const cb = require('../lib/circuit-breaker.cjs');
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 5), 3);
});

test('non-numeric cbAdjustment → default threshold', () => {
  const cb = freshModule({ adjustments: { cheap: { cbAdjustment: 'bogus' } } });
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 5), 3);
});

test('mtime caching: changing tuning file mid-run picks up new value', () => {
  const cb = freshModule({ adjustments: { cheap: { cbAdjustment: 2 } } });
  // First trip at 5
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 7), 5);
  // Reset CB state for cheap, rewrite tuning to -1 (with new mtime)
  cb._resetCircuitForTest('cheap');
  const newTuning = { adjustments: { cheap: { cbAdjustment: -1 } } };
  fs.writeFileSync(TEST_TUNING, JSON.stringify(newTuning));
  // Bump mtime forward enough to be detected (1s)
  const future = (Date.now() + 1000) / 1000;
  fs.utimesSync(TEST_TUNING, future, future);
  assert.strictEqual(failsUntilOpen(cb, 'cheap', 4), 2);
});

// Cleanup
fs.rmSync(TEST_DB, { force: true });
fs.rmSync(TEST_DB + '-wal', { force: true });
fs.rmSync(TEST_DB + '-shm', { force: true });
fs.rmSync(TEST_TUNING, { force: true });

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
