import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDecimalHours } from '../src/duration-format.js';

test('replays decimal-hour issue reports', () => {
  assert.equal(formatDecimalHours(2.4), '02:24');
  assert.equal(formatDecimalHours(5.3), '05:18');
});

test('keeps whole-hour and exact-half formatting stable', () => {
  assert.equal(formatDecimalHours(2), '02:00');
  assert.equal(formatDecimalHours(1.5), '01:30');
});
