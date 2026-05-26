'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadUtils() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'media', 'utils.js'), 'utf8');
  const sandbox = { URL, Date, JSON, Math, Number, Object, String, window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'utils.js' });
  return sandbox.window.CockpitUtils;
}

test('cockpit media utilities expose the expected contract', () => {
  const utils = loadUtils();
  assert.deepEqual(Object.keys(utils).sort(), [
    'clamp',
    'cleanOutput',
    'compact',
    'modeLabel',
    'normalizePreviewUrl',
    'parseJson',
    'relativeTime',
    'round',
    'topKey',
  ]);
});

test('preview URLs are limited to local http targets', () => {
  const { normalizePreviewUrl } = loadUtils();
  assert.equal(normalizePreviewUrl('http://localhost:3000/a'), 'http://localhost:3000/a');
  assert.equal(normalizePreviewUrl('http://127.0.0.1:5173'), 'http://127.0.0.1:5173/');
  assert.equal(normalizePreviewUrl('about:blank'), 'about:blank');
  assert.equal(normalizePreviewUrl('https://example.com'), '');
  assert.equal(normalizePreviewUrl('file:///etc/passwd'), '');
});

test('router noise is hidden from normal transcript output but retained for diagnostics', () => {
  const { cleanOutput } = loadUtils();
  const alert = JSON.stringify({
    type: 'circuit_breaker_open',
    data: { tierId: 'tier3' },
  });
  assert.equal(cleanOutput('Auto', `hello\n${alert}\nRoute selected: precision`), 'hello');
  assert.match(cleanOutput('Route Preview', alert), /precision lane \(tier3\) is degraded/);
  assert.equal(cleanOutput('Auto', '{"service":"retry","level":"info"}'), 'Momentum captured. Detailed route mechanics are available in diagnostics.');
});

test('small formatting helpers stay deterministic', () => {
  const { clamp, compact, modeLabel, parseJson, round, topKey } = loadUtils();
  assert.equal(clamp(120, 0, 100), 100);
  assert.equal(round(1.235), 1.24);
  assert.equal(modeLabel('designHandoff'), 'Creative Handoff');
  assert.equal(modeLabel('unknown'), 'AI');
  assert.equal(JSON.stringify(parseJson('{"ok":true}')), '{"ok":true}');
  assert.equal(JSON.stringify(parseJson('{bad')), '{}');
  assert.equal(topKey({ kimi: 2, codex: 5 }), 'codex');
  assert.equal(compact('a\n b\tc'), 'a b c');
});
