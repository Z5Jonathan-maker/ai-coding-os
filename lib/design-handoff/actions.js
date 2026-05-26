'use strict';

const { nextActionFor } = require('./core');

function buildActionPacket(handoff, phase, selectContext = () => []) {
  const base = {
    schema: 'ai-coding-os.design-handoff-action.v1',
    mission_id: handoff.mission_id,
    phase: phase?.id || 'complete',
    owner_lane: phase?.owner_lane || 'codex',
    status: phase?.status || 'complete',
    blocks_execution: false,
    requires_human_approval: false,
    command: null,
    prompt: '',
    expected_artifact: phase?.output || null,
  };
  if (!phase) {
    return { ...base, prompt: 'All phases are complete. Run final product/release review before shipping.' };
  }
  const packets = {
    creative_reference: {
      blocks_execution: true,
      requires_human_approval: true,
      command: 'cc-design-handoff execute --phase creative_reference --generate-image',
      prompt: [
        `Create a premium visual reference for: ${handoff.request}`,
        'Treat this as creative direction, not implementation.',
        'Output one strong full reference image first. Do not extract assets yet.',
        'After approval, keep the same image thread for sequential asset extraction.',
      ].join('\n'),
      expected_artifact: 'visual.target.png',
    },
    asset_decomposition: {
      blocks_execution: true,
      requires_human_approval: true,
      command: 'cc-design-handoff execute --phase asset_decomposition --extract-asset hero-background',
      prompt: [
        'Using the approved visual.target.png in the same Image 2.0 thread, extract exactly one implementation asset at a time.',
        'Start with the hero background only. Wait for approval before extracting button, divider, banner, surface, or texture assets.',
        'Update creative.asset-kit.json with sequence, prompt, usage, and approval gate for each asset.',
      ].join('\n'),
      expected_artifact: 'creative.asset-kit.json',
    },
    design_dna: {
      blocks_execution: true,
      command: 'cc-design-handoff execute --phase design_dna',
      prompt: [
        'Analyze the approved visual reference and asset kit.',
        'Extract design DNA: visual density, section pacing, typography rhythm, surface language, shadow language, motion energy, emotional frame, and visual noise budget.',
      ].join('\n'),
      expected_artifact: 'design.dna.json',
    },
    kimi_implementation: {
      command: 'cc-design-handoff execute --phase kimi_implementation --target-repo <repo>',
      prompt: [
        'Implement the approved visual reference and asset kit as production UI.',
        'Use native text/buttons/forms in code. Do not reinvent the visual direction.',
        'Preserve responsive composition, accessibility, and browser-verifiable layout.',
      ].join('\n'),
      expected_artifact: 'implementation.result.json',
    },
    claude_review: {
      command: 'cc-design-handoff execute --phase claude_review',
      prompt: [
        'Review implementation against visual.target.png, creative.asset-kit.json, and design.dna.json.',
        'Score creative fidelity, hierarchy, rhythm, material quality, motion, responsiveness, accessibility, and implementation realism.',
      ].join('\n'),
      expected_artifact: 'taste.validation.json',
    },
    codex_proof: {
      command: 'cc-design-handoff execute --phase codex_proof --browser-url <url>',
      prompt: [
        'Run local integration proof after Claude review.',
        'Record git state, changed files, required gates, browser-in-loop proof when a URL is supplied, and final shippability verdict before any TEL deploy.',
      ].join('\n'),
      expected_artifact: 'codex.proof.json',
    },
    tel_deploy: {
      blocks_execution: true,
      requires_human_approval: true,
      command: 'cc-design-handoff execute --phase tel_deploy --live-tel --deployment <vercel-url-or-id>',
      prompt: [
        'Deploy only after human approval and passing review.',
        'Verify the deployment through TEL, then record URL, provider, git SHA, rollback token/undo instructions, and verification result.',
      ].join('\n'),
      expected_artifact: 'deploy.receipt.json',
    },
  };
  const packet = { ...base, ...(packets[phase.id] || { prompt: nextActionFor(handoff) }) };
  packet.selected_context = selectContext(packet.prompt);
  return packet;
}

module.exports = { buildActionPacket };
