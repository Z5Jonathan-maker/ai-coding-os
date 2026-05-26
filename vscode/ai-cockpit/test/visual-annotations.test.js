'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  cleanBoundedText,
  isInsideVisualAnnotationBase,
  readVisualAnnotationReceipts,
  validAnnotationPayload,
  writeVisualAnnotationReceipt,
} = require('../lib/visual-annotations');

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ai-cockpit-visual-'));
}

test('visual annotation payload requires note, region, and local preview url', () => {
  assert.equal(validAnnotationPayload({
    note: 'Make headline larger',
    url: 'http://localhost:3000',
    rect: { width: 120, height: 40 },
  }).ok, true);

  assert.equal(validAnnotationPayload({
    note: '',
    url: 'http://localhost:3000',
    rect: { width: 120, height: 40 },
  }).ok, false);

  assert.equal(validAnnotationPayload({
    note: 'Move CTA up',
    url: 'file:///etc/passwd',
    rect: { width: 120, height: 40 },
  }).ok, false);

  assert.equal(validAnnotationPayload({
    note: 'Move CTA up',
    url: 'http://localhost:3000',
    rect: { width: 0, height: 40 },
  }).ok, false);
});

test('visual annotation receipts are stored under the repo annotation root', () => {
  const repo = tempRepo();
  const saved = writeVisualAnnotationReceipt(repo, {
    note: 'Fix\u0000spacing',
    url: 'http://127.0.0.1:3000',
    rect: { x: 10, y: 20, width: 200, height: 80 },
    viewport: { width: 1440, height: 900 },
    missionDir: path.join(repo, '.ai', 'design-handoffs', 'mission-1'),
  });

  assert.equal(isInsideVisualAnnotationBase(repo, saved.file), true);
  assert.equal(saved.receipt.note, 'Fixspacing');
  assert.equal(saved.receipt.repo, repo);

  const receipts = readVisualAnnotationReceipts(repo, 5);
  assert.equal(receipts.length, 1);
  assert.equal(receipts[0].relativeFile, path.relative(repo, saved.file));
  assert.equal(receipts[0].rect.width, 200);
});

test('visual annotation path guard rejects paths outside annotation root', () => {
  const repo = tempRepo();
  const inside = path.join(repo, '.ai', 'visual-annotations', 'receipt.json');
  const outside = path.join(repo, '.ai', 'design-handoffs', 'receipt.json');

  assert.equal(isInsideVisualAnnotationBase(repo, inside), true);
  assert.equal(isInsideVisualAnnotationBase(repo, outside), false);
  assert.equal(isInsideVisualAnnotationBase(repo, '/tmp/receipt.json'), false);
});

test('bounded text strips controls and truncates long annotation input', () => {
  const value = cleanBoundedText(`a\u0000b${'c'.repeat(10)}`, 5);
  assert.equal(value, 'abccc');
});
