import assert from 'node:assert/strict';
import { humanLabel, slugify, titleCase } from './format.js';

assert.equal(titleCase('router reliability pass'), 'Router Reliability Pass');
assert.equal(titleCase('  ai   cockpit '), 'Ai Cockpit');
assert.equal(slugify(' Router Reliability Pass! '), 'router-reliability-pass');
assert.equal(humanLabel('router_reliability-pass'), 'Router Reliability Pass');
console.log('refactor cleanup fixture passed');
