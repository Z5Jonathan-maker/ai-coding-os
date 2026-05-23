import assert from 'node:assert/strict';
import { blocksSecretRead } from './policy.js';

assert.equal(blocksSecretRead('printenv OPENAI_API_KEY'), true);
assert.equal(blocksSecretRead('npm test'), false);
console.log('permission denied fixture passed');
