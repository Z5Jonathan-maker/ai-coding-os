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

test('matching mission ledger enriches clean current repo continuation state', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: cwd,
      branch: 'main',
      clean: true,
    }),
    contextMeterJson: '{}',
    sessions: '{}',
    missionLedger: JSON.stringify({
      missions: [{
        stale: false,
        repo: cwd,
        title: 'AI cockpit polish',
        summary: 'Reduced dashboard controls and moved toward continuation state.',
        next: 'Refine responsive behavior and verify cockpit tests.',
        lane: 'codex -> kimi',
        progress: 82,
        updated_at: '2026-05-23T12:00:00Z',
      }],
    }),
    route: 'Latest: precision/claude | ok',
    kimi: 'mode=official-extension',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.title, 'AI cockpit polish');
  assert.equal(mission.route, 'codex -> kimi');
  assert.equal(mission.progress, 82);
  assert.equal(mission.started, '2026-05-23T12:00:00Z');
  assert.match(mission.lastSession, /Mission memory/);
  assert.match(mission.nextStep, /Refine responsive behavior/);
  assert.equal(mission.feed[0].title, 'Mission memory loaded.');
});

test('mission ledger ignores other repos and cannot make dirty repo look safe', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: cwd,
      branch: 'main',
      clean: false,
      fileCount: 3,
      totalAdded: 20,
      totalRemoved: 4,
    }),
    contextMeterJson: '{}',
    sessions: '{}',
    missionLedger: JSON.stringify({
      missions: [
        {
          stale: false,
          repo: '/tmp/other-repo',
          title: 'Wrong mission',
          next: 'Ship without checking anything.',
          lane: 'kimi',
          progress: 100,
          updated_at: '2026-05-23T12:00:00Z',
        },
        {
          stale: false,
          repo: cwd,
          title: 'Router reliability pass',
          summary: 'Circuit breaker behavior is under review.',
          next: 'Review fallback tests before continuing.',
          lane: 'codex',
          progress: 90,
          updated_at: '2026-05-23T12:01:00Z',
        },
      ],
    }),
    route: 'Latest: precision/claude | ok',
    kimi: '',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.title, 'Router reliability pass');
  assert.equal(mission.status, 'In progress');
  assert.equal(mission.changes, '3 files changed');
  assert.equal(mission.safety, 'Review diff first');
  assert.equal(mission.progress, 42);
  assert.match(mission.lastSession, /Uncommitted work detected: 3 files, \+20 -4/);
  assert.doesNotMatch(mission.prompt, /Ship without checking/);
});
