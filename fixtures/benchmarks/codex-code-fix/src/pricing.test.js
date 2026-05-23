import assert from 'node:assert/strict';
import { total } from './pricing.js';

assert.equal(total([{ price: 12, qty: 2 }]), 24);
assert.equal(total([{ price: 19.99, qty: 1 }, { price: 5, qty: 3 }], 0.08), 37.79);
console.log('codex code-fix fixture passed');
