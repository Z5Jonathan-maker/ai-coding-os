import assert from 'node:assert/strict';
import {
  classifyError,
  isIdempotentRequest,
  nextDelayMs,
  normalizeMethod,
  normalizeStatus,
  shouldRetry,
} from './retry.js';

assert.equal(normalizeStatus('429'), 429);
assert.equal(normalizeStatus('nope'), 0);
assert.equal(normalizeMethod(' post '), 'POST');

assert.equal(classifyError({ status: 429 }), 'rate-limit');
assert.equal(classifyError({ status: 503 }), 'server');
assert.equal(classifyError({ status: 401 }), 'client');
assert.equal(classifyError({}), 'network');

assert.equal(isIdempotentRequest({ method: 'GET' }), true);
assert.equal(isIdempotentRequest({ method: 'DELETE' }), true);
assert.equal(isIdempotentRequest({ method: 'POST' }), false);
assert.equal(isIdempotentRequest({ method: 'POST', headers: { 'Idempotency-Key': 'safe' } }), true);

assert.equal(shouldRetry({ status: 429 }, { method: 'GET' }), true);
assert.equal(shouldRetry({ status: 503 }, { method: 'DELETE' }), true);
assert.equal(shouldRetry({ status: 503 }, { method: 'POST' }), false);
assert.equal(shouldRetry({ status: 503 }, { method: 'POST', headers: { 'idempotency-key': 'safe' } }), true);
assert.equal(shouldRetry({ status: 401 }, { method: 'GET' }), false);

assert.equal(nextDelayMs(0), 250);
assert.equal(nextDelayMs(2), 1000);
assert.equal(nextDelayMs(99), 4000);
console.log('failing test repair fixture passed');
