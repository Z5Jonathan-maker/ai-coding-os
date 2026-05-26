'use strict';

const fs = require('fs');
const path = require('path');

function slug(text) {
  return String(text || 'design-handoff')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72) || 'design-handoff';
}

function now() {
  return new Date().toISOString();
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function extractJson(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try { return JSON.parse(fenced[1]); } catch (_) {}
    }
    const object = raw.match(/\{[\s\S]*\}/);
    if (object) {
      try { return JSON.parse(object[0]); } catch (_) {}
    }
  }
  return null;
}

function event(missionId, stage, message, data = {}, proof = [], agent = '') {
  return {
    schema: 'ai-coding-os.timeline-event.v1',
    mission_id: missionId,
    ts: now(),
    agent: agent || String(stage).split('.')[0],
    stage,
    kind: String(stage).split('.')[0],
    message,
    proof,
    data,
    severity: 'info',
  };
}

function artifactsFor(dir) {
  return {
    creativeBrief: path.join(dir, 'creative.brief.json'),
    routeReceipt: path.join(dir, 'route.receipt.json'),
    handoff: path.join(dir, 'design-handoff.json'),
    timeline: path.join(dir, 'agent.timeline.json'),
    proofBundle: path.join(dir, 'proof.bundle.json'),
  };
}

function relative(dir, file) {
  return path.relative(dir, file);
}

function artifactPath(dir, artifact) {
  return path.isAbsolute(artifact) ? artifact : path.join(dir, artifact);
}

function readArtifact(dir, artifact, max = 12000) {
  const file = artifactPath(dir, artifact);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8').slice(0, max);
}

function nextActionFor(handoff) {
  const active = (handoff.phases || []).find((phase) => !['approved', 'completed'].includes(phase.status) && !phase.status.startsWith('blocked_'));
  if (active) return `Continue ${active.id} through ${active.owner_lane}.`;
  const blocked = (handoff.phases || []).find((phase) => phase.status.startsWith('blocked_'));
  return blocked ? `Resolve blocker for ${blocked.id}: ${blocked.status}.` : 'All handoff phases are approved or completed.';
}

function activePhase(handoff) {
  return (handoff.phases || []).find((phase) => !['approved', 'completed'].includes(phase.status) && !phase.status.startsWith('blocked_'))
    || (handoff.phases || []).find((phase) => phase.status.startsWith('blocked_'))
    || null;
}

function phaseById(handoff, id) {
  return (handoff.phases || []).find((item) => item.id === id) || null;
}

function requestStageFor(phaseId) {
  return ({
    creative_reference: 'creative.reference.requested',
    asset_decomposition: 'asset.extraction.requested',
    design_dna: 'design.dna.extracted',
    kimi_implementation: 'implementation.requested',
    claude_review: 'taste.requested',
    codex_proof: 'proof.requested',
    tel_deploy: 'deploy.requested',
  })[phaseId] || 'approval.requested';
}

function completionStageFor(phaseId) {
  return ({
    creative_reference: 'creative.reference.approved',
    asset_decomposition: 'asset.approved',
    design_dna: 'design.dna.extracted',
    kimi_implementation: 'implementation.completed',
    claude_review: 'taste.validated',
    codex_proof: 'proof.completed',
    tel_deploy: 'deploy.completed',
  })[phaseId] || 'stage.completed';
}

function unlockNext(handoff, phaseId) {
  const unlocks = {
    creative_reference: ['asset_decomposition', 'design_dna'],
    asset_decomposition: ['kimi_implementation'],
    design_dna: ['kimi_implementation'],
    kimi_implementation: ['claude_review'],
    claude_review: ['codex_proof'],
    codex_proof: ['tel_deploy'],
  };
  for (const id of unlocks[phaseId] || []) {
    const next = phaseById(handoff, id);
    if (next && next.status.startsWith('blocked_')) next.status = 'awaiting_work';
  }
}

function refreshProof(handoff, proof) {
  const pending = (handoff.phases || []).find((item) => !['approved', 'completed'].includes(item.status));
  handoff.status = pending ? `awaiting_${pending.id}` : 'complete';
  handoff.current_gate = pending?.approval_gate || nextActionFor(handoff);
  proof.status = handoff.status;
  proof.verdict = handoff.status === 'complete' ? 'ready_for_final_release_review' : 'not_shippable_until_remaining_phases_complete';
  proof.next_required_action = handoff.current_gate;
}

module.exports = {
  activePhase,
  artifactPath,
  artifactsFor,
  completionStageFor,
  event,
  extractJson,
  nextActionFor,
  now,
  phaseById,
  readArtifact,
  readJson,
  refreshProof,
  relative,
  requestStageFor,
  slug,
  unlockNext,
  writeJson,
};
