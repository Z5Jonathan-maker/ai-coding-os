'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { buildMissionState } = require('../lib/mission-state');

const cwd = '/tmp/current-repo';

test('unknown diff state is not treated as safe or clean', () => {
  const mission = buildMissionState({
    diffSummary: 'not json',
    contextMeterJson: '{}',
    sessions: JSON.stringify({
      sessions: [{
        stale: true,
        cwd,
        last_prompt: 'old unrelated prompt',
      }],
    }),
    route: '',
    kimi: '',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.status, 'Needs review');
  assert.equal(mission.changes, 'Diff unavailable');
  assert.equal(mission.safety, 'Review state');
  assert.match(mission.lastSession, /Diff state is unavailable/);
  assert.doesNotMatch(mission.lastSession, /old unrelated prompt/);
  assert.equal(mission.feed[0].title, 'Workspace diff state is unavailable.');
});

test('stale or global sessions cannot override a dirty repo mission', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: cwd,
      branch: 'main',
      clean: false,
      fileCount: 2,
      totalAdded: 10,
      totalRemoved: 3,
    }),
    contextMeterJson: '{}',
    sessions: JSON.stringify({
      sessions: [
        { stale: true, cwd, last_prompt: 'stale prompt' },
        { stale: false, cwd: null, last_prompt: 'global prompt' },
        { stale: false, cwd: '/tmp/other-repo', last_prompt: 'other repo prompt' },
      ],
    }),
    route: '',
    kimi: '',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.status, 'In progress');
  assert.equal(mission.changes, '2 files changed');
  assert.match(mission.lastSession, /Uncommitted work detected: 2 files, \+10 -3/);
  assert.doesNotMatch(mission.lastSession, /stale prompt|global prompt|other repo prompt/);
});

test('matching fresh sessions are used for the current repo only', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: cwd,
      branch: 'main',
      clean: true,
    }),
    contextMeterJson: '{}',
    sessions: JSON.stringify({
      sessions: [{
        stale: false,
        cwd,
        last_prompt: 'continue cockpit polish',
        last_ts: '2026-05-23T02:30:00Z',
      }],
    }),
    route: 'Latest: design/kimi | ok',
    kimi: 'mode=official-extension',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.status, 'Ready');
  assert.equal(mission.route, 'design/kimi');
  assert.equal(mission.started, '2026-05-23T02:30:00Z');
  assert.match(mission.lastSession, /continue cockpit polish/);
  assert.match(mission.summary, /browser bridge ready/);
});
