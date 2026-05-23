import assert from 'node:assert/strict';
import { titleCase } from './format.js';

assert.equal(titleCase('router reliability pass'), 'Router Reliability Pass');
assert.equal(titleCase('  ai   cockpit '), 'Ai Cockpit');
console.log('refactor cleanup fixture passed');
