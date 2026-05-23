import assert from 'node:assert/strict';
import { redactToken } from './session.js';

assert.equal(redactToken('token=sample_id_123'), 'token=[redacted]');
assert.equal(redactToken('safe'), 'safe');
console.log('security review fixture passed');
