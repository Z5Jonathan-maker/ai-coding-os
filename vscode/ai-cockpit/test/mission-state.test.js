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

test('mission kernel overrides ledger for current repo continuation state', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: '/tmp/project',
      clean: true,
      fileCount: 0,
      totalAdded: 0,
      totalRemoved: 0,
    }),
    contextMeterJson: JSON.stringify({ repo: '/tmp/project', statusText: 'Context healthy', availableTokens: 120000 }),
    missionKernel: JSON.stringify({
      mission: {
        id: 'kernel-1',
        repo: '/tmp/project',
        title: 'Mission Kernel buildout',
        task: 'Create route, trust, cost, proof, and timeline artifacts.',
        status: 'running',
        route: 'codex -> claude',
        next_action: 'Render mission proof in the cockpit.',
        updated_at: '2026-05-23T19:30:00Z',
      },
      proof: { commands: [{ command: 'cc-mission-kernel --check' }] },
      timeline: {
        schema: 'ai-coding-os.agent-timeline.v1',
        events: [{
          ts: '2026-05-23T19:31:00Z',
          agent: 'codex',
          stage: 'act',
          message: 'Mission artifacts created.',
          proof: ['docs/MISSION-KERNEL.md'],
        }],
      },
    }),
    missionLedger: JSON.stringify({
      missions: [{
        repo: '/tmp/project',
        title: 'Old ledger mission',
        updated_at: '2026-05-23T19:00:00Z',
      }],
    }),
    sessions: '{}',
    route: '',
    kimi: '',
    providerCapacity: '',
  }, { cwd: '/tmp/project' });

  assert.equal(mission.title, 'Mission Kernel buildout');
  assert.equal(mission.route, 'codex -> claude');
  assert.equal(mission.status, 'In progress');
  assert.equal(mission.progress, 48);
  assert.match(mission.nextStep, /Render mission proof/);
  assert.equal(mission.feed[0].title, 'Mission artifacts created.');
  assert.doesNotMatch(mission.lastSession, /Old ledger mission/);
});

test('mission kernel runtime state is surfaced before ledger fallback', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: '/tmp/project',
      clean: true,
      fileCount: 0,
      totalAdded: 0,
      totalRemoved: 0,
    }),
    contextMeterJson: '{}',
    missionKernel: JSON.stringify({
      mission: {
        id: 'runtime-1',
        repo: '/tmp/project',
        title: 'Agent Runtime Adapter',
        task: 'Run a mission through typed runtime input and proof output.',
        status: 'running',
        runtime_status: 'running',
        execution_status: 'acting',
        startup_phase: 'launch',
        route: 'codex -> codex',
        next_action: 'Finish the adapter proof bundle.',
        updated_at: '2026-05-23T20:00:00Z',
      },
      proof: { commands: [{ command: 'cc-agent-runtime --check' }] },
      timeline: {
        schema: 'ai-coding-os.agent-timeline.v1',
        events: [{
          ts: '2026-05-23T20:01:00Z',
          agent: 'codex',
          stage: 'runtime.started',
          message: 'Runtime started for codex.',
          proof: ['codex/codex'],
        }],
      },
    }),
    missionLedger: JSON.stringify({
      missions: [{
        repo: '/tmp/project',
        title: 'Old ledger mission',
        progress: 100,
      }],
    }),
    sessions: '{}',
    route: '',
    kimi: '',
    providerCapacity: '',
  }, { cwd: '/tmp/project' });

  assert.equal(mission.title, 'Agent Runtime Adapter');
  assert.equal(mission.progress, 58);
  assert.match(mission.lastSession, /Runtime Running \/ Acting \/ Launch/);
  assert.equal(mission.feed[0].title, 'Runtime started for codex.');
  assert.match(mission.feed.map((item) => item.title).join('\n'), /Runtime Running \/ Acting \/ Launch/);
  assert.doesNotMatch(mission.lastSession, /Old ledger mission/);
});

test('mission kernel timeline must be replayable before it becomes cockpit momentum', () => {
  const mission = buildMissionState({
    diffSummary: JSON.stringify({
      repo: '/tmp/project',
      clean: true,
      fileCount: 0,
      totalAdded: 0,
      totalRemoved: 0,
    }),
    contextMeterJson: '{}',
    missionKernel: JSON.stringify({
      mission: {
        id: 'runtime-replay',
        repo: '/tmp/project',
        title: 'Replayable Runtime',
        task: 'Only render timeline state when timestamps can replay safely.',
        status: 'running',
        runtime_status: 'running',
        execution_status: 'acting',
        startup_phase: 'launch',
        route: 'codex -> codex',
        next_action: 'Keep live state honest.',
        updated_at: '2026-05-23T20:00:00Z',
      },
      proof: { commands: [{ command: 'cc-mission-events replay' }] },
      timeline: {
        schema: 'ai-coding-os.agent-timeline.v1',
        events: [
          {
            ts: '2026-05-23T20:02:00Z',
            agent: 'codex',
            stage: 'tool.completed',
            severity: 'info',
            message: 'Tool completed.',
            proof: ['exit=0'],
          },
          {
            ts: '2026-05-23T20:01:00Z',
            agent: 'codex',
            stage: 'runtime.started',
            severity: 'info',
            message: 'Runtime started.',
            proof: ['codex/codex'],
          },
        ],
      },
    }),
    sessions: '{}',
    route: '',
    kimi: '',
    providerCapacity: '',
  }, { cwd: '/tmp/project' });

  assert.doesNotMatch(JSON.stringify(mission.feed), /Tool completed|Runtime started/);
  assert.match(JSON.stringify(mission.feed), /Runtime Running \/ Acting \/ Launch/);
});

test('mission ledger events become the first live feed items', () => {
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
        next: 'Continue from event trail.',
        updated_at: '2026-05-23T12:00:00Z',
      }],
      events: [
        {
          type: 'event',
          stale: false,
          repo: cwd,
          stage: 'checkpoint',
          title: 'Trust gate shipped.',
          body: 'Policy now blocks denied tasks before routing.',
          updated_at: '2026-05-23T13:00:00Z',
        },
        {
          type: 'event',
          stale: false,
          repo: '/tmp/other-repo',
          stage: 'act',
          title: 'Wrong repo event.',
          updated_at: '2026-05-23T13:01:00Z',
        },
      ],
    }),
    route: '',
    kimi: '',
    providerCapacity: 'ok',
  }, { cwd });

  assert.equal(mission.feed[0].title, 'Trust gate shipped.');
  assert.equal(mission.feed[0].icon, 'C');
  assert.equal(mission.feed[0].state, 'done');
  assert.doesNotMatch(JSON.stringify(mission.feed), /Wrong repo event/);
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
