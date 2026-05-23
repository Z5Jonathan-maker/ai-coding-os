import assert from 'node:assert/strict';
import { tokens } from './tokens.js';

assert.equal(tokens.radius, 8);
assert.match(tokens.primary, /^#[0-9a-f]{6}$/i);
assert.match(tokens.surface, /^#[0-9a-f]{6}$/i);
console.log('kimi ui-design fixture passed');
