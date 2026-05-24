import assert from 'node:assert/strict';
import { buildRouteReceipt } from '../src/route-intent.js';

const prompts = [
  'create elite visual direction for a hero using Image 2.0',
  'open the logged-in browser and capture a pricing screenshot',
  'debug this distributed auth race condition',
  'extract this package metadata as compact JSON',
  'fix this failing test in the repo'
];

const receipts = prompts.map(buildRouteReceipt);

assert(receipts.every((receipt) => receipt.prompt && receipt.intentClass && receipt.platform));
assert(receipts.every((receipt) => Array.isArray(receipt.fallbackChain)));
assert(receipts.every((receipt) => receipt.fallbackChain.length >= 2));
assert(receipts.every((receipt) => receipt.fallbackChain[0] === receipt.platform));
assert(receipts.some((receipt) => receipt.intentClass === 'image' && receipt.platform === 'chatgpt'));
assert(receipts.some((receipt) => receipt.intentClass === 'design' && receipt.platform === 'kimi'));
assert(receipts.some((receipt) => receipt.intentClass === 'precision' && receipt.platform === 'claude'));

console.log('review score passed');
