import assert from 'node:assert/strict';
import { buildRouteReceipt, classifyIntent } from '../src/route-intent.js';

const cases = [
  ['create elite visual direction for a hero using Image 2.0', 'image', 'chatgpt'],
  ['open the logged-in browser and capture a pricing screenshot', 'design', 'kimi'],
  ['debug this distributed auth race condition', 'precision', 'claude'],
  ['extract this package metadata as compact JSON', 'cheap', 'deepseek'],
  ['fix this failing test in the repo', 'codex', 'codex']
];

for (const [prompt, expectedClass, expectedPlatform] of cases) {
  assert.equal(classifyIntent(prompt), expectedClass, prompt);
  const receipt = buildRouteReceipt(prompt);
  assert.equal(receipt.intentClass, expectedClass, prompt);
  assert.equal(receipt.platform, expectedPlatform, prompt);
  assert.equal(receipt.fallbackChain[0], expectedPlatform, prompt);
}

console.log('routing fixture tests passed');
