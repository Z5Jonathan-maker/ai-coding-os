import assert from 'node:assert/strict';
import { viewportMode } from './page.js';

assert.equal(viewportMode(390), 'mobile');
assert.equal(viewportMode(820), 'tablet');
assert.equal(viewportMode(1440), 'desktop');
console.log('browser proof fixture passed');
