import assert from 'node:assert/strict';
import { scriptNames } from './extract.js';

assert.deepEqual(scriptNames({ scripts: { test: 'node test.js', lint: 'eslint .' } }), ['lint', 'test']);
console.log('deepseek extract fixture passed');
