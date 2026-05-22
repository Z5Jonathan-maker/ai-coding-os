import assert from 'node:assert/strict';
import { quoteTotal } from './math.js';

assert.equal(quoteTotal([{ price: 10, qty: 2 }]), 20);
assert.equal(quoteTotal([{ price: 10, qty: 2 }, { price: 4.5, qty: 1 }], 0.07), 26.22);
console.log('demo fixture tests passed');
