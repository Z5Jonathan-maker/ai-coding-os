'use strict';

const fs = require('fs');

function createExecuteStage(ctx) {
  return function executeStage() {
    const dir = ctx.missionDir();
    const phaseId = ctx.value('phase', '');
    const { files, handoff, timeline, proof } = ctx.loadMission(dir);
    const phase = phaseId ? ctx.phaseById(handoff, phaseId) : ctx.activePhase(handoff);
    if (!phase) {
      console.log('# Design Handoff Execute\n\nAll phases are complete.\n\nStatus: design-handoff-execute-ready');
      return;
    }
    if (phase.status.startsWith('blocked_until_') && !ctx.has('force')) {
      const artifact = 'next-action.json';
      ctx.writeJson(ctx.path.join(dir, artifact), ctx.actionPacket(handoff, phase));
      ctx.refreshProof(handoff, proof);
      ctx.writeJson(files.handoff, handoff);
      ctx.writeJson(files.proofBundle, proof);
      ctx.appendTimeline(files, timeline, ctx.event(handoff.mission_id, ctx.requestStageFor(phase.id), `${phase.id} is blocked until its prerequisite phase completes.`, {
        phase: phase.id,
        phase_status: phase.status,
        blocked: true,
      }, [artifact], phase.owner_lane));
      const result = {
        schema: 'ai-coding-os.design-handoff-execute.v1',
        mission_id: handoff.mission_id,
        phase: phase.id,
        artifact,
        blocked: true,
        status: 'blocked',
      };
      if (ctx.has('json')) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      console.log('# Design Handoff Execute\n');
      console.log(`Mission: ${handoff.mission_id}`);
      console.log(`Phase: ${phase.id}`);
      console.log(`Blocked: ${phase.status}`);
      console.log(`Next: ${proof.next_required_action || ctx.nextActionFor(handoff)}`);
      console.log('\nStatus: design-handoff-execute-blocked');
      return;
    }
    const targetRepo = ctx.value('target-repo', '');
    ctx.addCheckpointRecord(phase, ctx.createPhaseCheckpoint(ctx.root, handoff, phase, 'pre'));
    if (phase.id === 'kimi_implementation' && targetRepo) {
      ctx.addCheckpointRecord(phase, ctx.createPhaseCheckpoint(targetRepo, handoff, phase, 'target-pre'));
    }
    const providedArtifact = ctx.value('artifact', '');
    let artifact = providedArtifact;
    let blocked = false;
    let note = ctx.value('note', `${phase.id} completed by stage executor`);

    if (phase.id === 'creative_reference' && ctx.has('generate-image')) {
      artifact = ctx.generateCreativeReference(dir, handoff);
      blocked = true;
      phase.status = artifact ? 'awaiting_human_approval' : 'awaiting_external_artifact';
      note = artifact
        ? 'Image reference generated. Human approval is required before asset extraction.'
        : 'ChatGPT subscription/manual generation packet written. No API billing was used.';
      if (!artifact) artifact = 'visual.reference.request.json';
    } else if (phase.id === 'asset_decomposition' && ctx.has('extract-asset')) {
      artifact = ctx.extractAsset(dir, handoff);
      blocked = true;
      phase.status = artifact ? 'awaiting_asset_approval' : 'awaiting_external_artifact';
      note = artifact
        ? 'One implementation asset was extracted. Human approval is required before the next extraction or implementation handoff.'
        : 'ChatGPT subscription/manual asset extraction packet written. No API billing was used.';
      if (!artifact) artifact = 'asset.extraction.request.json';
    } else if (phase.id === 'creative_reference' && !providedArtifact) {
      blocked = true;
      const packet = ctx.actionPacket(handoff, phase);
      ctx.writeJson(ctx.path.join(dir, 'visual.reference.request.json'), {
        ...packet,
        source: 'chatgpt_subscription_manual',
        live_lane_call: false,
        billing: 'chatgpt_subscription_or_manual_upload',
        instructions: [
          'Open ChatGPT Desktop or logged-in ChatGPT web.',
          'Paste the prompt into Image 2.0.',
          'Save the approved output as visual.target.png in this mission directory.',
          'Then approve the creative_reference phase.',
        ],
      });
      phase.status = 'awaiting_external_artifact';
      note = 'Image 2.0 visual reference must be generated or attached before this phase can complete.';
      artifact = 'visual.reference.request.json';
    } else if (phase.id === 'tel_deploy') {
      artifact = ctx.writeDeployReceipt(dir, handoff);
      if (!artifact) {
        blocked = true;
        artifact = 'deploy.request.json';
        ctx.writeJson(ctx.path.join(dir, artifact), ctx.actionPacket(handoff, phase));
        phase.status = 'awaiting_tel_deploy_receipt';
        note = 'Deploy requires explicit approval plus deploy receipt fields.';
      }
    } else if (!artifact) {
      artifact = ctx.writeStageArtifact(dir, handoff, phase);
    } else if (!fs.existsSync(ctx.artifactPath(dir, artifact))) {
      ctx.writeJson(ctx.artifactPath(dir, artifact), {
        schema: 'ai-coding-os.external-stage-artifact.v1',
        mission_id: handoff.mission_id,
        phase: phase.id,
        artifact,
        recorded_at: ctx.now(),
        note: 'Placeholder record for an externally produced artifact.',
      });
    }
    if (!blocked && phase.id === 'claude_review') {
      const review = ctx.readJson(ctx.artifactPath(dir, artifact));
      if (!ctx.reviewPassed(review)) {
        blocked = true;
        phase.status = 'blocked_review_failed';
        note = 'Claude review completed but did not pass the taste threshold.';
      }
    }
    if (!blocked && phase.id === 'kimi_implementation' && artifact === 'implementation.result.json') {
      const implementation = ctx.readJson(ctx.artifactPath(dir, artifact));
      if (String(implementation.verdict || '').startsWith('blocked_')) {
        blocked = true;
        phase.status = 'blocked_kimi_no_changes';
        note = 'Kimi implementation completed without target repo changes.';
      }
    }
    if (!blocked && phase.id === 'codex_proof') {
      const codexProof = ctx.readJson(ctx.artifactPath(dir, artifact));
      if (String(codexProof.verdict || '').startsWith('blocked_')) {
        blocked = true;
        phase.status = 'blocked_codex_proof_failed';
        note = 'Codex proof completed but local gates did not pass.';
      }
    }

    if (!blocked) {
      ctx.markComplete(dir, files, handoff, proof, phase, artifact, note);
    } else {
      ctx.refreshProof(handoff, proof);
      ctx.writeJson(files.handoff, handoff);
      ctx.writeJson(files.proofBundle, proof);
    }
    ctx.appendTimeline(files, timeline, ctx.event(handoff.mission_id, blocked ? ctx.requestStageFor(phase.id) : ctx.completionStageFor(phase.id), note, {
      phase: phase.id,
      artifact,
      blocked,
    }, [artifact], phase.owner_lane));
    if (phase.id === 'kimi_implementation' && targetRepo) {
      ctx.addCheckpointRecord(phase, ctx.createPhaseCheckpoint(targetRepo, handoff, phase, 'target-post'));
    }
    ctx.addCheckpointRecord(phase, ctx.createPhaseCheckpoint(ctx.root, handoff, phase, 'post'));
    ctx.updateContextSummary(dir, proof);
    ctx.updateCostLedger(dir, handoff, proof);
    ctx.addMissionGitRecord(phase, proof, ctx.recordMissionGit(ctx.root, dir, handoff, phase, artifact));
    if (phase.id === 'kimi_implementation' && targetRepo) {
      ctx.addMissionGitRecord(phase, proof, ctx.recordMissionGit(targetRepo, targetRepo, handoff, phase, ''));
    }
    ctx.writeJson(files.handoff, handoff);
    ctx.writeJson(files.proofBundle, proof);

    const result = {
      schema: 'ai-coding-os.design-handoff-execute.v1',
      mission_id: handoff.mission_id,
      phase: phase.id,
      artifact,
      blocked,
      checkpoints: phase.checkpoints || [],
      git_ledger: phase.git_ledger || [],
      context_summary: proof.context_summary || null,
      cost_ledger: proof.cost_ledger || null,
      status: blocked ? 'blocked' : 'completed',
    };
    if (ctx.has('json')) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    console.log('# Design Handoff Execute\n');
    console.log(`Mission: ${handoff.mission_id}`);
    console.log(`Phase: ${phase.id}`);
    console.log(`Artifact: ${artifact}`);
    console.log(`Result: ${result.status}`);
    console.log(`Next: ${proof.next_required_action || ctx.nextActionFor(handoff)}`);
    console.log(`\nStatus: ${blocked ? 'design-handoff-execute-blocked' : 'design-handoff-execute-ready'}`);
  };
}

module.exports = { createExecuteStage };
