import assert from 'node:assert/strict';
import { highestSeverity, summarizeRisks, topRisk } from './risks.js';

assert.equal(highestSeverity([{ severity: 'low' }, { severity: 'high' }]), 'high');
assert.equal(highestSeverity([]), 'low');
const files = [
  { path: 'lib/auth/session.js', risks: [{ id: 'AUTH-1', severity: 'critical', summary: 'token is logged' }] },
  { path: 'app/api/export.js', risks: [{ id: 'EXP-1', severity: 'medium', summary: 'large response' }] },
];
assert.deepEqual(summarizeRisks(files).map((risk) => risk.citation), ['lib/auth/session.js#AUTH-1', 'app/api/export.js#EXP-1']);
assert.equal(topRisk(files).citation, 'lib/auth/session.js#AUTH-1');
console.log('long context fixture passed');
