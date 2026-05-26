'use strict';

const fs = require('fs');
const path = require('path');
const { readVisualAnnotationReceipts } = require('./visual-annotations');

function readJsonFile(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function readLatestDesignHandoffState(repoRoot, options = {}) {
  const imagePreviewUri = options.imagePreviewUri || (() => '');
  const base = path.join(repoRoot, '.ai', 'design-handoffs');
  const empty = {
    status: 'empty',
    title: 'No creative handoff mission',
    summary: 'Create a handoff to see reference approval, design DNA, implementation, review, proof, and deploy stages here.',
    dir: '',
    progress: 0,
    currentGate: 'Create a creative handoff mission.',
    activePhase: null,
    phases: [],
    artifacts: [],
    events: [],
    visualAnnotations: readVisualAnnotationReceipts(repoRoot, 8),
  };
  if (!fs.existsSync(base)) return empty;

  const dirs = fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(base, entry.name);
      const file = path.join(dir, 'design-handoff.json');
      if (!fs.existsSync(file)) return null;
      return { dir, mtime: fs.statSync(file).mtimeMs };
    })
    .filter(Boolean)
    .sort((a, b) => b.mtime - a.mtime);

  if (!dirs.length) return empty;

  const dir = dirs[0].dir;
  const handoff = readJsonFile(path.join(dir, 'design-handoff.json'));
  const timeline = readJsonFile(path.join(dir, 'agent.timeline.json'), { events: [] });
  const proof = readJsonFile(path.join(dir, 'proof.bundle.json'));
  const phases = Array.isArray(handoff.phases) ? handoff.phases : [];
  const done = phases.filter((phase) => ['approved', 'completed'].includes(phase.status)).length;
  const active = phases.find((phase) => !['approved', 'completed'].includes(phase.status) && !String(phase.status || '').startsWith('blocked_'))
    || phases.find((phase) => String(phase.status || '').startsWith('blocked_'))
    || null;

  const artifactNames = Array.from(new Set([
    'creative.brief.json',
    'visual.target.png',
    'creative.asset-kit.json',
    'design.dna.json',
    'implementation.result.json',
    'taste.validation.json',
    'codex.proof.json',
    'deploy.receipt.json',
    'proof.bundle.json',
    ...phases.map((phase) => phase.completed_artifact || phase.output).filter(Boolean),
    ...(timeline.events || []).flatMap((event) => event.proof || []),
  ]));

  return {
    status: handoff.status || 'active',
    title: handoff.title || handoff.request || path.basename(dir),
    summary: handoff.request || proof.summary || 'Creative handoff mission loaded.',
    missionId: handoff.mission_id || path.basename(dir),
    dir,
    relativeDir: path.relative(repoRoot, dir),
    progress: phases.length ? Math.round((done / phases.length) * 100) : 0,
    currentGate: handoff.current_gate || (active ? active.approval_gate : 'All phases complete.'),
    activePhase: active ? active.id : null,
    phases: phases.map((phase) => {
      const artifact = phase.completed_artifact || phase.output || '';
      const artifactFile = artifact ? path.join(dir, artifact) : '';
      return {
        id: phase.id,
        label: phaseLabel(phase.id),
        owner: phase.owner_lane || 'codex',
        status: phase.status || 'pending',
        output: phase.output || '',
        artifact,
        artifactExists: Boolean(artifactFile && fs.existsSync(artifactFile)),
        approvalGate: phase.approval_gate || '',
      };
    }),
    artifacts: artifactNames.map((name) => {
      const file = path.isAbsolute(name) ? name : path.join(dir, name);
      const exists = fs.existsSync(file);
      const isImage = /\.(png|jpe?g|webp|gif)$/i.test(name);
      return {
        name: path.basename(name),
        path: name,
        exists,
        kind: isImage ? 'image' : 'json',
        previewUri: exists && isImage ? String(imagePreviewUri(file) || '') : '',
      };
    }),
    events: (timeline.events || []).slice(-6).reverse().map((event) => ({
      stage: event.stage || event.kind || 'event',
      message: event.message || '',
      agent: event.agent || event.kind || '',
      time: event.ts || '',
      proof: event.proof || [],
    })),
    visualAnnotations: readVisualAnnotationReceipts(repoRoot, 8, dir),
  };
}

function phaseLabel(id) {
  return ({
    creative_reference: 'Creative reference',
    asset_decomposition: 'Asset kit',
    design_dna: 'Design DNA',
    kimi_implementation: 'Kimi implementation',
    claude_review: 'Claude review',
    codex_proof: 'Codex proof',
    tel_deploy: 'TEL deploy',
  })[id] || String(id || 'Stage').replace(/[_-]+/g, ' ');
}

module.exports = {
  phaseLabel,
  readLatestDesignHandoffState,
};
