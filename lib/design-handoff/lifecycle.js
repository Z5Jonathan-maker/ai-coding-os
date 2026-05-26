'use strict';

const fs = require('fs');
const path = require('path');
const {
  activePhase,
  artifactsFor,
  event,
  nextActionFor,
  now,
  readJson,
  refreshProof,
  requestStageFor,
  slug,
  unlockNext,
  writeJson,
} = require('./core');
const { buildActionPacket } = require('./actions');
const { initialPhases } = require('./phases');

function createLifecycle(ctx) {
  function missionDir() {
    const dir = ctx.value('dir', ctx.value('out-dir', ''));
    if (!dir) {
      console.error('cc-design-handoff: --dir required');
      process.exit(2);
    }
    return path.resolve(dir);
  }

  function loadMission(dir) {
    const files = artifactsFor(dir);
    for (const file of [files.handoff, files.timeline, files.proofBundle]) {
      if (!fs.existsSync(file)) {
        console.error(`cc-design-handoff: missing ${path.basename(file)} in ${dir}`);
        process.exit(1);
      }
    }
    return {
      files,
      handoff: readJson(files.handoff),
      timeline: readJson(files.timeline),
      proof: readJson(files.proofBundle),
    };
  }

  function phaseById(handoff, id) {
    const phase = (handoff.phases || []).find((item) => item.id === id);
    if (!phase) {
      console.error(`cc-design-handoff: unknown phase ${id}`);
      process.exit(2);
    }
    return phase;
  }

  function appendTimeline(files, timeline, entry) {
    timeline.events.push(entry);
    writeJson(files.timeline, timeline);
    const validate = ctx.run(path.join(ctx.root, 'bin', 'cc-mission-events'), ['validate', '--file', files.timeline]);
    if (validate.status !== 0) {
      console.error(`${validate.stdout || ''}${validate.stderr || ''}`.trim());
      process.exit(1);
    }
  }

  function actionPacket(handoff, phase) {
    return buildActionPacket(handoff, phase, (prompt) => ctx.triggeredMicroagents(handoff, phase, prompt));
  }

  function markComplete(dir, files, handoff, proof, phase, artifact, note, status = 'completed') {
    phase.status = status;
    if (artifact) phase.completed_artifact = artifact;
    phase.completed_at = now();
    phase.completion_note = note;
    unlockNext(handoff, phase.id);
    refreshProof(handoff, proof);
    writeJson(files.handoff, handoff);
    writeJson(files.proofBundle, proof);
  }

  function createHandoff() {
    const request = ctx.promptArgs();
    if (!request) {
      console.error('Usage: cc-design-handoff "premium landing page brief" [--out-dir DIR] [--title TITLE]');
      process.exit(2);
    }

    const title = ctx.value('title', request.slice(0, 96));
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z');
    const dir = path.resolve(ctx.value('out-dir', path.join(ctx.root, '.ai', 'design-handoffs', `${stamp}-${slug(title)}`)));
    const missionId = path.basename(dir);
    const files = artifactsFor(dir);
    const routeReceipt = ctx.route(request, 'creative_direction');
    const phases = initialPhases();

    writeJson(files.creativeBrief, {
      schema: 'ai-coding-os.creative-brief.v1',
      mission_id: missionId,
      title,
      request,
      product_wedge: 'taste-driven frontend generation',
      dominant_user_action: 'describe the desired business outcome',
      success_outcome: 'approved visual direction survives implementation and deploy proof',
      anti_goals: [
        'do not expose provider routing as the main UX',
        'do not let implementation lanes reinvent approved visual direction',
        'do not deploy without explicit approval',
      ],
    });

    writeJson(files.routeReceipt, routeReceipt);
    writeJson(files.handoff, {
      schema: 'ai-coding-os.design-handoff.v1',
      mission_id: missionId,
      title,
      request,
      status: 'awaiting_creative_reference',
      current_gate: 'generate_or_attach_visual.target.png_and_approve_it',
      phases,
      required_artifacts: [
        'creative.brief.json',
        'visual.target.png',
        'creative.asset-kit.json',
        'design.dna.json',
        'implementation.plan.json',
        'implementation.result.json',
        'taste.validation.json',
        'codex.proof.json',
        'deploy.receipt.json',
        'proof.bundle.json',
      ],
      hidden_from_primary_ui: [
        'provider selection',
        'token balancing',
        'fallback mechanics',
        'raw model logs',
      ],
    });

    writeJson(files.timeline, {
      schema: 'ai-coding-os.agent-timeline.v1',
      mission_id: missionId,
      events: [
        event(missionId, 'preflight.started', 'Design handoff mission initialized.', { title }, ['creative.brief.json'], 'codex'),
        event(missionId, 'creative.reference.requested', 'Image 2.0 creative reference is required before implementation.', {
          owner_lane: 'chatgpt-image',
          output: 'visual.target.png',
        }, ['route.receipt.json'], 'chatgpt-image'),
        event(missionId, 'approval.requested', 'Human approval gate is open for the visual reference.', {
          gate: 'approve_visual_target',
        }, ['design-handoff.json'], 'human'),
      ],
    });

    writeJson(files.proofBundle, {
      schema: 'ai-coding-os.design-handoff-proof.v1',
      mission_id: missionId,
      status: 'initialized',
      verdict: 'not_shippable_until_reference_approved_and_implementation_verified',
      files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, path.relative(dir, file)])),
      next_required_action: 'Generate or attach visual.target.png, then mark the creative_reference phase approved.',
    });

    const validate = ctx.run(path.join(ctx.root, 'bin', 'cc-mission-events'), ['validate', '--file', files.timeline]);
    if (validate.status !== 0) {
      console.error(`${validate.stdout || ''}${validate.stderr || ''}`.trim());
      process.exit(1);
    }

    if (ctx.has('json')) {
      console.log(JSON.stringify({ schema: 'ai-coding-os.design-handoff-result.v1', mission_id: missionId, dir }, null, 2));
    } else {
      console.log('# Design Handoff Mission\n');
      console.log(`Mission: ${missionId}`);
      console.log(`Directory: ${dir}`);
      console.log(`Route: ${routeReceipt.final_class || 'unknown'} -> ${routeReceipt.platform || 'unknown'}`);
      console.log('Status: awaiting creative reference approval');
      console.log('Next: generate or attach visual.target.png, approve it, then pass approved artifacts to Kimi implementation.');
      console.log('\nStatus: design-handoff-ready');
    }
  }

  function listMissions() {
    const base = path.join(ctx.root, '.ai', 'design-handoffs');
    const missions = fs.existsSync(base)
      ? fs.readdirSync(base, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
          const dir = path.join(base, entry.name);
          const file = path.join(dir, 'design-handoff.json');
          if (!fs.existsSync(file)) return null;
          const handoff = readJson(file);
          return {
            mission_id: handoff.mission_id || entry.name,
            title: handoff.title || entry.name,
            status: handoff.status || 'unknown',
            current_gate: handoff.current_gate || '',
            dir,
            updated_at: new Date(fs.statSync(file).mtimeMs).toISOString(),
          };
        })
        .filter(Boolean)
        .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
      : [];

    if (ctx.has('json')) {
      console.log(JSON.stringify({ schema: 'ai-coding-os.design-handoff-list.v1', missions }, null, 2));
      return;
    }
    console.log('# Design Handoff Missions\n');
    for (const mission of missions) {
      console.log(`- ${mission.title} :: ${mission.status}`);
      console.log(`  ${mission.dir}`);
    }
    if (!missions.length) console.log('(none)');
    console.log('\nStatus: design-handoff-list-ready');
  }

  function showStatus() {
    const dir = missionDir();
    const { handoff, timeline, proof } = loadMission(dir);
    if (ctx.has('json')) {
      console.log(JSON.stringify({ handoff, event_count: timeline.events.length, proof }, null, 2));
      return;
    }
    console.log('# Design Handoff Status\n');
    console.log(`Mission: ${handoff.mission_id}`);
    console.log(`Title: ${handoff.title}`);
    console.log(`Status: ${handoff.status}`);
    console.log(`Current gate: ${handoff.current_gate}`);
    console.log('\n## Phases\n');
    for (const phase of handoff.phases || []) {
      console.log(`- ${phase.id}: ${phase.status} (${phase.owner_lane})`);
    }
    console.log(`\nEvents: ${timeline.events.length}`);
    console.log(`Next: ${proof.next_required_action || nextActionFor(handoff)}`);
    console.log('\nStatus: design-handoff-status-ready');
  }

  function approvePhase() {
    const dir = missionDir();
    const phaseId = ctx.value('phase', 'creative_reference');
    const artifact = ctx.value('artifact', '');
    const note = ctx.value('note', `${phaseId} approved`);
    const { files, handoff, timeline, proof } = loadMission(dir);
    const phase = phaseById(handoff, phaseId);
    phase.status = 'approved';
    if (artifact) phase.approved_artifact = artifact;
    phase.approved_at = now();
    phase.approval_note = note;

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
      if (next.status.startsWith('blocked_')) next.status = 'awaiting_work';
    }

    const pending = (handoff.phases || []).find((item) => !['approved', 'completed'].includes(item.status));
    handoff.status = pending ? `awaiting_${pending.id}` : 'complete';
    handoff.current_gate = pending?.approval_gate || nextActionFor(handoff);

    proof.status = handoff.status;
    proof.verdict = handoff.status === 'complete' ? 'ready_for_final_release_review' : 'not_shippable_until_remaining_phases_complete';
    proof.next_required_action = handoff.current_gate;

    const actionFile = path.join(dir, 'next-action.json');
    if (fs.existsSync(actionFile)) {
      try {
        const action = readJson(actionFile);
        if (action.phase === phaseId) {
          fs.unlinkSync(actionFile);
          delete proof.next_action_packet;
        }
      } catch (_) {
        fs.unlinkSync(actionFile);
        delete proof.next_action_packet;
      }
    }

    writeJson(files.handoff, handoff);
    writeJson(files.proofBundle, proof);
    const stage = {
      creative_reference: 'creative.reference.approved',
      asset_decomposition: 'asset.approved',
      design_dna: 'design.dna.extracted',
      kimi_implementation: 'implementation.completed',
      claude_review: 'taste.validated',
      codex_proof: 'proof.completed',
      tel_deploy: 'deploy.completed',
    }[phaseId] || 'approval.granted';
    appendTimeline(files, timeline, event(handoff.mission_id, stage, note, {
      phase: phaseId,
      artifact: artifact || null,
    }, artifact ? [artifact] : ['design-handoff.json'], phase.owner_lane));

    if (ctx.has('json')) {
      console.log(JSON.stringify({ schema: 'ai-coding-os.design-handoff-approval.v1', mission_id: handoff.mission_id, phase: phaseId, status: handoff.status }, null, 2));
    } else {
      console.log(`# Approved ${phaseId}\n`);
      console.log(`Mission: ${handoff.mission_id}`);
      console.log(`Status: ${handoff.status}`);
      console.log(`Next: ${proof.next_required_action}`);
      console.log('\nStatus: design-handoff-approved');
    }
  }

  function continueMission() {
    const dir = missionDir();
    const { files, handoff, timeline, proof } = loadMission(dir);
    const phase = activePhase(handoff);
    const packet = actionPacket(handoff, phase);
    const packetFile = path.join(dir, 'next-action.json');
    writeJson(packetFile, packet);
    proof.next_action_packet = path.relative(dir, packetFile);
    proof.next_required_action = packet.prompt.split('\n')[0] || nextActionFor(handoff);
    writeJson(files.proofBundle, proof);
    appendTimeline(files, timeline, event(handoff.mission_id, requestStageFor(packet.phase), `Next handoff action prepared for ${packet.phase}.`, {
      phase: packet.phase,
      owner_lane: packet.owner_lane,
      expected_artifact: packet.expected_artifact,
      requires_human_approval: packet.requires_human_approval,
    }, ['next-action.json'], packet.owner_lane));

    if (ctx.has('json')) {
      console.log(JSON.stringify(packet, null, 2));
      return;
    }
    console.log('# Design Handoff Continue\n');
    console.log(`Mission: ${handoff.mission_id}`);
    console.log(`Phase: ${packet.phase}`);
    console.log(`Lane: ${packet.owner_lane}`);
    console.log(`Expected artifact: ${packet.expected_artifact || '(none)'}`);
    if (packet.command) console.log(`Command: ${packet.command}`);
    if (packet.requires_human_approval) console.log('Approval: required');
    console.log('\n## Prompt / Action\n');
    console.log(packet.prompt);
    console.log('\nStatus: design-handoff-continue-ready');
  }

  return {
    actionPacket,
    appendTimeline,
    approvePhase,
    continueMission,
    createHandoff,
    listMissions,
    loadMission,
    markComplete,
    missionDir,
    phaseById,
    showStatus,
  };
}

module.exports = { createLifecycle };
