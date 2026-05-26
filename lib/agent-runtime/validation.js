'use strict';

const fs = require('fs');
const path = require('path');

const runtimeStatuses = ['starting', 'running', 'paused', 'error', 'missing'];
const executionStatuses = ['queued', 'planning', 'acting', 'waiting_permission', 'verifying', 'done', 'failed'];
const startupPhases = ['preflight', 'trust_check', 'route', 'context_pack', 'launch', 'ready', 'error'];
const adapterTypes = ['local_process', 'worktree', 'docker'];
const requiredEvents = [
  'preflight.started',
  'trust.decided',
  'route.selected',
  'context.attached',
  'runtime.started',
  'tool.requested',
  'permission.requested',
  'permission.replied',
  'tool.completed',
  'verification.started',
  'verification.completed',
  'proof.bundle.updated',
  'mission.completed',
];

function validateInput(input) {
  const missing = ['mission_id', 'task', 'repo', 'cwd', 'agent', 'lane', 'provider', 'model', 'adapter_type', 'permission_mode', 'budget', 'timeout_ms', 'parent_mission_id']
    .filter((key) => !Object.prototype.hasOwnProperty.call(input, key));
  if (!Array.isArray(input.tools_allowed)) missing.push('tools_allowed');
  if (!Array.isArray(input.tools_denied)) missing.push('tools_denied');
  if (typeof input.requires_browser !== 'boolean') missing.push('requires_browser');
  if (typeof input.requires_visual_proof !== 'boolean') missing.push('requires_visual_proof');
  if (!adapterTypes.includes(input.adapter_type)) missing.push(`adapter_type:${input.adapter_type}`);
  return missing;
}

function validateBundle(dir, readJson) {
  const errors = [];
  for (const file of ['mission.json', 'route.receipt.json', 'trust.decision.json', 'cost.ledger.json', 'proof.bundle.json', 'agent.timeline.json']) {
    if (!fs.existsSync(path.join(dir, file))) errors.push(`missing ${file}`);
  }
  if (errors.length) return errors;

  const mission = readJson(path.join(dir, 'mission.json'));
  const proof = readJson(path.join(dir, 'proof.bundle.json'));
  const timeline = readJson(path.join(dir, 'agent.timeline.json'));
  const result = proof.result || {};
  for (const key of ['runtime_status', 'execution_status', 'startup_phase']) {
    if (mission[key] == null) errors.push(`mission missing ${key}`);
  }
  if (!runtimeStatuses.includes(mission.runtime_status)) errors.push('invalid runtime_status');
  if (!executionStatuses.includes(mission.execution_status)) errors.push('invalid execution_status');
  if (!startupPhases.includes(mission.startup_phase)) errors.push('invalid startup_phase');
  if (!adapterTypes.includes(mission.runtime_adapter || 'local_process')) errors.push('invalid runtime_adapter');
  if (result.schema !== 'ai-coding-os.agent-run-result.v1') errors.push('missing AgentRunResult');
  for (const key of ['mission_id', 'agent', 'lane', 'provider', 'model', 'adapter_type', 'status', 'changed_files', 'commands', 'screenshots', 'artifacts', 'tokens', 'cost', 'permission_requests', 'errors', 'runtime', 'next_action', 'verdict']) {
    if (result[key] == null) errors.push(`result missing ${key}`);
  }
  const stages = new Set(Array.isArray(timeline.events) ? timeline.events.map((event) => event.stage) : []);
  for (const stage of requiredEvents) {
    if (!stages.has(stage)) errors.push(`timeline missing ${stage}`);
  }
  return errors;
}

module.exports = { adapterTypes, validateBundle, validateInput };
