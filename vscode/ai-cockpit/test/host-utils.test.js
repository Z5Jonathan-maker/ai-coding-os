'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  executionInstruction,
  normalizeTrustGate,
  parseRouterJson,
  permissionInstruction,
  quote,
  readJsonFile,
  routerAskCommand,
  summarizeReadiness,
} = require('../lib/host-utils');

test('shell quoting and router command construction preserve prompt boundaries', () => {
  assert.equal(quote("fix user's bug"), "'fix user'\\''s bug'");
  assert.equal(
    routerAskCommand('design', 'route task', "ship user's UI"),
    "router-ask --purpose 'design' 'ship user'\\''s UI'"
  );
  assert.equal(routerAskCommand('', 'route task', 'plain run'), "router-ask 'plain run'");
});

test('router json parser falls back to raw result payload', () => {
  assert.deepEqual(parseRouterJson('{"missions":[1]}'), { missions: [1] });
  assert.deepEqual(parseRouterJson('not json'), { result: 'not json', meta: {} });
});

test('json file helper returns fallback on missing or invalid files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cockpit-host-utils-'));
  const valid = path.join(dir, 'valid.json');
  fs.writeFileSync(valid, '{"ok":true}\n');
  assert.deepEqual(readJsonFile(valid), { ok: true });
  assert.deepEqual(readJsonFile(path.join(dir, 'missing.json'), { missing: true }), { missing: true });
});

test('permission and execution instructions default safely', () => {
  assert.match(permissionInstruction('ask'), /Do not write files/);
  assert.match(permissionInstruction('unknown'), /Make safe local edits/);
  assert.match(executionInstruction('debug'), /Reproduce first/);
  assert.match(executionInstruction('unknown'), /Make the smallest correct change/);
});

test('trust gate and readiness summaries are stable', () => {
  const gate = normalizeTrustGate(JSON.stringify({
    decision: 'deny',
    mode: 'review',
    message: 'blocked',
    hits: [{ id: 'paid_action', reason: 'requires approval' }],
  }));
  assert.match(gate, /Decision: DENY/);
  assert.match(gate, /paid_action: requires approval/);
  assert.equal(normalizeTrustGate('raw block'), 'raw block');

  assert.equal(summarizeReadiness('ok\nready').title, 'System ready');
  assert.equal(summarizeReadiness('FAIL\nbad').title, 'Attention needed');
});
