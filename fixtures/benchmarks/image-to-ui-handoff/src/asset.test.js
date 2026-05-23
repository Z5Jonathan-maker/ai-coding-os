import assert from 'node:assert/strict';
import { canonicalAsset } from './asset.js';

assert.equal(canonicalAsset('Hero Reference'), '/assets/canonical/hero-reference.png');
assert.equal(canonicalAsset('pricing-card@v2'), '/assets/canonical/pricing-card-v2.png');
console.log('image to ui handoff fixture passed');
