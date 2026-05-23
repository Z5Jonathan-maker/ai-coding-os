import assert from 'node:assert/strict';
import { shouldRetry } from './retry.js';

assert.equal(shouldRetry(429), true);
assert.equal(shouldRetry(401), false);
console.log('failing test repair fixture passed');
