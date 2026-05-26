'use strict';

const path = require('path');
const { spawnSync } = require('child_process');
const { artifactPath, extractJson, now, writeJson } = require('./core');

function createRunner(root) {
  return function run(cmd, cmdArgs, options = {}) {
    return spawnSync(cmd, cmdArgs, {
      cwd: options.cwd || root,
      encoding: 'utf8',
      timeout: options.timeout || 30000,
      maxBuffer: options.maxBuffer || 1024 * 1024 * 4,
      env: { ...process.env, DOTFILES: root, ...(options.env || {}) },
    });
  };
}

function createRuntime({ root, has }) {
  const run = createRunner(root);

  function createPhaseCheckpoint(repo, handoff, phase, label) {
    if (has('no-checkpoint') || process.env.CC_DESIGN_HANDOFF_NO_CHECKPOINT === '1') return null;
    const res = run(path.join(root, 'bin', 'cc-phase-checkpoint'), [
      'create',
      '--repo',
      repo,
      '--mission',
      handoff.mission_id,
      '--phase',
      phase.id,
      '--label',
      label,
      '--json',
    ], { timeout: 60000, maxBuffer: 1024 * 1024 * 4 });
    const raw = `${res.stdout || ''}${res.stderr || ''}`.trim();
    if (res.status !== 0) {
      return {
        schema: 'ai-coding-os.phase-checkpoint.v1',
        repo: path.resolve(repo),
        mission: handoff.mission_id,
        phase: phase.id,
        label,
        status: 'failed',
        error: raw || `cc-phase-checkpoint exited ${res.status}`,
        created_at: now(),
      };
    }
    const parsed = extractJson(raw) || {};
    return {
      schema: 'ai-coding-os.phase-checkpoint.v1',
      ...parsed,
      repo: parsed.repo || path.resolve(repo),
      mission: parsed.mission || handoff.mission_id,
      phase: parsed.phase || phase.id,
      label: parsed.label || label,
      status: 'created',
      created_at: now(),
    };
  }

  function recordMissionGit(repo, dir, handoff, phase, artifact) {
    if (has('no-mission-git') || process.env.CC_DESIGN_HANDOFF_NO_MISSION_GIT === '1') return null;
    const args = [
      'record',
      '--repo',
      repo,
      '--mission',
      handoff.mission_id,
      '--phase',
      phase.id,
      '--dir',
      dir,
      '--json',
    ];
    if (artifact) args.push('--artifact', artifactPath(dir, artifact));
    const res = run(path.join(root, 'bin', 'cc-mission-git'), args, { timeout: 60000, maxBuffer: 1024 * 1024 * 4 });
    const raw = `${res.stdout || ''}${res.stderr || ''}`.trim();
    if (res.status !== 0) {
      return {
        schema: 'ai-coding-os.mission-git-record.v1',
        repo: path.resolve(repo),
        mission_id: handoff.mission_id,
        phase: phase.id,
        status: 'failed',
        error: raw || `cc-mission-git exited ${res.status}`,
        recorded_at: now(),
      };
    }
    return {
      schema: 'ai-coding-os.mission-git-record.v1',
      ...(extractJson(raw) || {}),
      repo: path.resolve(repo),
      mission_id: handoff.mission_id,
      phase: phase.id,
      status: 'recorded',
      recorded_at: now(),
    };
  }

  function updateContextSummary(dir, proof) {
    if (has('no-condense') || process.env.CC_DESIGN_HANDOFF_NO_CONDENSE === '1') return null;
    const args = ['--dir', dir, '--json'];
    if (has('live-condense')) args.push('--live');
    const res = run(path.join(root, 'bin', 'cc-mission-condenser'), args, { timeout: 120000, maxBuffer: 1024 * 1024 * 4 });
    const raw = `${res.stdout || ''}${res.stderr || ''}`.trim();
    if (res.status !== 0) {
      proof.context_summary = {
        artifact: null,
        status: 'failed',
        error: raw || `cc-mission-condenser exited ${res.status}`,
        updated_at: now(),
      };
      return proof.context_summary;
    }
    const parsed = extractJson(raw) || {};
    proof.context_summary = {
      artifact: 'mission.context-summary.json',
      source: parsed.source || '',
      event_count: parsed.event_count || 0,
      condensed: Boolean(parsed.condensed),
      updated_at: now(),
    };
    return proof.context_summary;
  }

  function updateCostLedger(dir, handoff, proof) {
    const res = run(path.join(root, 'bin', 'cc-token-ledger'), ['--json'], { timeout: 30000, maxBuffer: 1024 * 1024 * 4 });
    const raw = `${res.stdout || ''}${res.stderr || ''}`.trim();
    if (res.status !== 0) {
      proof.cost_ledger = {
        artifact: null,
        status: 'unavailable',
        error: raw || `cc-token-ledger exited ${res.status}`,
        updated_at: now(),
      };
      return proof.cost_ledger;
    }
    const parsed = extractJson(raw) || {};
    const ledger = {
      schema: 'ai-coding-os.mission-cost-ledger.v1',
      mission_id: handoff.mission_id,
      generated_at: now(),
      source: parsed.source || '',
      fixture: Boolean(parsed.fixture),
      window: parsed.window || 0,
      totals: parsed.totals || {},
      by_lane: parsed.by_lane || {},
      by_platform: parsed.by_platform || {},
    };
    writeJson(path.join(dir, 'cost.ledger.json'), ledger);
    proof.cost_ledger = {
      artifact: 'cost.ledger.json',
      source: ledger.source,
      estimated_cost_usd: ledger.totals.cost ?? null,
      tokens: ledger.totals.tokens ?? null,
      updated_at: ledger.generated_at,
    };
    return proof.cost_ledger;
  }

  function triggeredMicroagents(handoff, phase, promptText) {
    if (has('no-microagents') || process.env.CC_DESIGN_HANDOFF_NO_MICROAGENTS === '1') return [];
    const res = run(path.join(root, 'bin', 'cc-triggered-microagents'), [
      '--json',
      '--phase',
      phase?.id || '',
      '--text',
      `${handoff.request || ''}\n${promptText || ''}`,
    ], { timeout: 30000, maxBuffer: 1024 * 1024 * 2 });
    if (res.status !== 0) return [];
    return (extractJson(res.stdout || '')?.selected || []).slice(0, 5);
  }

  function route(prompt, purpose) {
    const res = run(path.join(root, 'bin', 'cc-route'), ['--json', '--purpose', purpose, prompt]);
    if (res.status !== 0) {
      return {
        schema: 'ai-coding-os.route-receipt.v1',
        final_class: purpose,
        platform: 'unavailable',
        source: 'cc-route-error',
        error: `${res.stdout || ''}${res.stderr || ''}`.trim(),
      };
    }
    return JSON.parse(res.stdout);
  }

  return {
    createPhaseCheckpoint,
    recordMissionGit,
    route,
    run,
    triggeredMicroagents,
    updateContextSummary,
    updateCostLedger,
  };
}

function addCheckpointRecord(phase, record) {
  if (!record) return;
  phase.checkpoints = Array.isArray(phase.checkpoints) ? phase.checkpoints : [];
  phase.checkpoints.push(record);
}

function addMissionGitRecord(phase, proof, record) {
  if (!record) return;
  phase.git_ledger = Array.isArray(phase.git_ledger) ? phase.git_ledger : [];
  phase.git_ledger.push(record);
  proof.git_ledger = Array.isArray(proof.git_ledger) ? proof.git_ledger : [];
  proof.git_ledger.push({
    phase: phase.id,
    repo: record.repo,
    ref: record.ref || '',
    commit: record.commit || '',
    status: record.status,
  });
}

module.exports = {
  addCheckpointRecord,
  addMissionGitRecord,
  createRuntime,
};
