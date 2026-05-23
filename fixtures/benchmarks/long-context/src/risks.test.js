import assert from 'node:assert/strict';
import { highestSeverity } from './risks.js';

assert.equal(highestSeverity([{ severity: 'low' }, { severity: 'high' }]), 'high');
assert.equal(highestSeverity([]), 'low');
console.log('long context fixture passed');
