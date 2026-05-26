'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { phaseLabel, readLatestDesignHandoffState } = require('../lib/design-handoff-state');
const { writeVisualAnnotationReceipt } = require('../lib/visual-annotations');

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ai-cockpit-handoff-'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

test('empty design handoff state is explicit and safe', () => {
  const repo = tempRepo();
  const state = readLatestDesignHandoffState(repo);

  assert.equal(state.status, 'empty');
  assert.equal(state.progress, 0);
  assert.equal(state.activePhase, null);
  assert.deepEqual(state.phases, []);
});

test('latest design handoff state shapes phases, artifacts, events, and annotations', () => {
  const repo = tempRepo();
  const older = path.join(repo, '.ai', 'design-handoffs', 'old');
  const latest = path.join(repo, '.ai', 'design-handoffs', 'latest');
  fs.mkdirSync(older, { recursive: true });
  writeJson(path.join(older, 'design-handoff.json'), { title: 'Old mission', phases: [] });
  writeJson(path.join(latest, 'design-handoff.json'), {
    status: 'active',
    title: 'Premium landing page',
    request: 'Build a premium hero.',
    mission_id: 'mission-latest',
    current_gate: 'Approve design DNA.',
    phases: [
      { id: 'creative_reference', status: 'approved', owner_lane: 'image', output: 'visual.target.png' },
      { id: 'design_dna', status: 'blocked_approval', owner_lane: 'codex', output: 'design.dna.json' },
    ],
  });
  writeJson(path.join(latest, 'agent.timeline.json'), {
    events: [
      { ts: '1', stage: 'first', message: 'First event', agent: 'codex', proof: ['a'] },
      { ts: '2', stage: 'second', message: 'Second event', agent: 'kimi', proof: ['b'] },
    ],
  });
  writeJson(path.join(latest, 'proof.bundle.json'), { summary: 'Proof summary' });
  fs.writeFileSync(path.join(latest, 'visual.target.png'), 'png');
  writeVisualAnnotationReceipt(repo, {
    note: 'Move CTA up',
    url: 'http://localhost:3000',
    rect: { width: 20, height: 20 },
    missionDir: latest,
  });

  fs.utimesSync(path.join(older, 'design-handoff.json'), new Date(1), new Date(1));
  fs.utimesSync(path.join(latest, 'design-handoff.json'), new Date(2), new Date(2));

  const state = readLatestDesignHandoffState(repo, {
    imagePreviewUri: (file) => `preview://${path.basename(file)}`,
  });

  assert.equal(state.title, 'Premium landing page');
  assert.equal(state.missionId, 'mission-latest');
  assert.equal(state.activePhase, 'design_dna');
  assert.equal(state.progress, 50);
  assert.equal(state.phases[0].label, 'Creative reference');
  assert.equal(state.phases[0].artifactExists, true);
  assert.equal(state.artifacts.find((artifact) => artifact.name === 'visual.target.png').previewUri, 'preview://visual.target.png');
  assert.equal(state.events[0].stage, 'second');
  assert.equal(state.visualAnnotations.length, 1);
});

test('phase labels fall back to readable stage names', () => {
  assert.equal(phaseLabel('tel_deploy'), 'TEL deploy');
  assert.equal(phaseLabel('custom_phase'), 'custom phase');
});
