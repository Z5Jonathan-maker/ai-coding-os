'use strict';

function initialPhases() {
  return [
    {
      id: 'creative_reference',
      owner_lane: 'chatgpt-image',
      status: 'awaiting_generation',
      output: 'visual.target.png',
      approval_gate: 'human_approves_reference_before_asset_extraction',
    },
    {
      id: 'asset_decomposition',
      owner_lane: 'chatgpt-image',
      status: 'blocked_until_reference_approved',
      output: 'creative.asset-kit.json',
      approval_gate: 'one_asset_approved_before_next_asset',
    },
    {
      id: 'design_dna',
      owner_lane: 'chatgpt-image',
      status: 'blocked_until_reference_approved',
      output: 'design.dna.json',
    },
    {
      id: 'kimi_implementation',
      owner_lane: 'kimi-webbridge',
      status: 'blocked_until_approved_assets_exist',
      output: 'implementation.plan.json',
    },
    {
      id: 'claude_review',
      owner_lane: 'claude',
      status: 'blocked_until_implementation_exists',
      output: 'taste.validation.json',
    },
    {
      id: 'codex_proof',
      owner_lane: 'codex',
      status: 'blocked_until_review_passes',
      output: 'codex.proof.json',
    },
    {
      id: 'tel_deploy',
      owner_lane: 'tel',
      status: 'blocked_until_codex_proof_and_human_approves',
      output: 'deploy.receipt.json',
      approval_gate: 'human_approves_credentialed_deploy',
    },
  ];
}

module.exports = { initialPhases };
