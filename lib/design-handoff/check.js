'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { artifactsFor, readJson } = require('./core');

function phaseById(handoff, id) {
  const phase = (handoff.phases || []).find((item) => item.id === id);
  if (!phase) throw new Error(`missing phase ${id}`);
  return phase;
}

function runDesignHandoffCheck({ root, run }) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cc-design-handoff.'));
  try {
    const res = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'premium peptide landing page with cinematic hero, product trust, and conversion-focused pricing',
      '--out-dir',
      path.join(temp, 'mission'),
      '--title',
      'Premium peptide landing page',
    ], { timeout: 60000 });
    if (res.status !== 0 || !/Status: design-handoff-ready/.test(res.stdout)) {
      console.error(`${res.stdout || ''}${res.stderr || ''}`.trim());
      process.exit(1);
    }
    const dir = path.join(temp, 'mission');
    for (const file of Object.values(artifactsFor(dir))) {
      if (!fs.existsSync(file)) throw new Error(`missing ${path.basename(file)}`);
    }
    const handoff = readJson(path.join(dir, 'design-handoff.json'));
    const ids = new Set(handoff.phases.map((phase) => phase.id));
    for (const id of ['creative_reference', 'asset_decomposition', 'design_dna', 'kimi_implementation', 'claude_review', 'codex_proof', 'tel_deploy']) {
      if (!ids.has(id)) throw new Error(`missing phase ${id}`);
    }
    const timeline = readJson(path.join(dir, 'agent.timeline.json'));
    const stages = timeline.events.map((item) => item.stage);
    for (const stage of ['creative.reference.requested', 'approval.requested']) {
      if (!stages.includes(stage)) throw new Error(`missing event stage ${stage}`);
    }
    const status = run(path.join(root, 'bin', 'cc-design-handoff'), ['status', '--dir', dir], { timeout: 30000 });
    if (status.status !== 0 || !/Status: design-handoff-status-ready/.test(status.stdout)) {
      throw new Error(`status failed: ${status.stdout || status.stderr}`);
    }
    const listed = run(path.join(root, 'bin', 'cc-design-handoff'), ['list', '--json'], { timeout: 30000 });
    if (listed.status !== 0) throw new Error(`list failed: ${listed.stdout || listed.stderr}`);
    const parsedList = JSON.parse(listed.stdout);
    if (!Array.isArray(parsedList.missions)) throw new Error('list did not return missions array');
    const firstContinue = run(path.join(root, 'bin', 'cc-design-handoff'), ['continue', '--dir', dir], { timeout: 30000 });
    if (firstContinue.status !== 0 || !/Status: design-handoff-continue-ready/.test(firstContinue.stdout)) {
      throw new Error(`continue failed: ${firstContinue.stdout || firstContinue.stderr}`);
    }
    const firstPacket = readJson(path.join(dir, 'next-action.json'));
    if (firstPacket.phase !== 'creative_reference') throw new Error(`unexpected first action phase ${firstPacket.phase}`);
    if (firstPacket.owner_lane !== 'chatgpt-image') throw new Error(`unexpected first action lane ${firstPacket.owner_lane}`);
    if (!String(firstPacket.command || '').includes('--generate-image')) throw new Error('creative reference command must generate the subscription packet');
    if (String(firstPacket.command || '').includes('--image-api-ok')) throw new Error('creative reference default command must not opt into paid image API');
    if (!Array.isArray(firstPacket.selected_context)) throw new Error('triggered microagent context missing from action packet');
    const imageExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'creative_reference',
      '--generate-image',
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_IMAGE_OFFLINE: '1' } });
    if (imageExec.status !== 0 || !/Status: design-handoff-execute-blocked/.test(imageExec.stdout)) {
      throw new Error(`image execute failed: ${imageExec.stdout || imageExec.stderr}`);
    }
    const imageManifest = readJson(path.join(dir, 'visual.reference.manifest.json'));
    if (imageManifest.source !== 'offline_fixture' || imageManifest.live_lane_call !== false) throw new Error('offline image fixture not labeled');
    if (!fs.existsSync(path.join(dir, 'visual.target.png'))) throw new Error('offline visual target not written');
    const approval = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'approve',
      '--dir',
      dir,
      '--phase',
      'creative_reference',
      '--artifact',
      'visual.target.png',
      '--note',
      'Reference approved for asset decomposition',
    ], { timeout: 30000 });
    if (approval.status !== 0 || !/Status: design-handoff-approved/.test(approval.stdout)) {
      throw new Error(`approval failed: ${approval.stdout || approval.stderr}`);
    }
    const approved = readJson(path.join(dir, 'design-handoff.json'));
    if (phaseById(approved, 'creative_reference').status !== 'approved') throw new Error('creative_reference not approved');
    if (phaseById(approved, 'asset_decomposition').status !== 'awaiting_work') throw new Error('asset_decomposition not unlocked');
    if (phaseById(approved, 'design_dna').status !== 'awaiting_work') throw new Error('design_dna not unlocked');
    const approvedTimeline = readJson(path.join(dir, 'agent.timeline.json'));
    if (!approvedTimeline.events.some((item) => item.stage === 'creative.reference.approved')) {
      throw new Error('approval event not appended');
    }
    const secondContinue = run(path.join(root, 'bin', 'cc-design-handoff'), ['continue', '--dir', dir, '--json'], { timeout: 30000 });
    if (secondContinue.status !== 0) throw new Error(`second continue failed: ${secondContinue.stdout || secondContinue.stderr}`);
    const secondPacket = JSON.parse(secondContinue.stdout);
    if (secondPacket.phase !== 'asset_decomposition') throw new Error(`unexpected second action phase ${secondPacket.phase}`);
    if (secondPacket.requires_human_approval !== true) throw new Error('asset decomposition must keep approval gate');
    if (!String(secondPacket.command || '').includes('--extract-asset')) throw new Error('asset decomposition default command must extract one subscription packet asset');
    if (String(secondPacket.command || '').includes('--image-api-ok')) throw new Error('asset decomposition default command must not opt into paid image API');
    const assetExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'asset_decomposition',
      '--extract-asset',
      'hero-background',
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_IMAGE_OFFLINE: '1' } });
    if (assetExec.status !== 0 || !/Status: design-handoff-execute-blocked/.test(assetExec.stdout)) {
      throw new Error(`asset execute failed: ${assetExec.stdout || assetExec.stderr}`);
    }
    const kit = readJson(path.join(dir, 'creative.asset-kit.json'));
    if (kit.assets?.[0]?.source !== 'offline_fixture' || kit.assets?.[0]?.live_lane_call !== false) throw new Error('offline asset fixture not labeled');
    const assetApproval = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'approve',
      '--dir',
      dir,
      '--phase',
      'asset_decomposition',
      '--artifact',
      'creative.asset-kit.json',
    ], { timeout: 30000 });
    if (assetApproval.status !== 0 || !/Status: design-handoff-approved/.test(assetApproval.stdout)) {
      throw new Error(`asset approval failed: ${assetApproval.stdout || assetApproval.stderr}`);
    }
    const dnaExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'design_dna',
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_OFFLINE: '1' } });
    if (dnaExec.status !== 0 || !/Status: design-handoff-execute-ready/.test(dnaExec.stdout)) {
      throw new Error(`design dna execute failed: ${dnaExec.stdout || dnaExec.stderr}`);
    }
    if (!fs.existsSync(path.join(dir, 'design.dna.json'))) throw new Error('design.dna.json not written');
    const dna = readJson(path.join(dir, 'design.dna.json'));
    if (dna.source !== 'offline_fixture' || dna.live_lane_call !== false) throw new Error('offline design DNA fixture not labeled');
    const targetRepo = path.join(temp, 'target-repo');
    fs.mkdirSync(path.join(targetRepo, 'app'), { recursive: true });
    fs.writeFileSync(path.join(targetRepo, 'app', 'page.tsx'), 'export default function Page() { return <main>Before</main>; }\n');
    run('git', ['init'], { cwd: targetRepo, timeout: 30000 });
    run('git', ['config', 'user.email', 'test@example.com'], { cwd: targetRepo, timeout: 30000 });
    run('git', ['config', 'user.name', 'Test User'], { cwd: targetRepo, timeout: 30000 });
    run('git', ['add', '.'], { cwd: targetRepo, timeout: 30000 });
    run('git', ['commit', '-m', 'init'], { cwd: targetRepo, timeout: 30000 });
    fs.writeFileSync(path.join(targetRepo, 'app', 'page.tsx'), 'export default function Page() { return <main>After</main>; }\n');
    const implementationExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'kimi_implementation',
      '--target-repo',
      targetRepo,
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_OFFLINE: '1' } });
    if (implementationExec.status !== 0 || !/Status: design-handoff-execute-ready/.test(implementationExec.stdout)) {
      throw new Error(`implementation execute failed: ${implementationExec.stdout || implementationExec.stderr}`);
    }
    const impl = readJson(path.join(dir, 'implementation.result.json'));
    if (impl.source !== 'offline_fixture' || impl.live_lane_call !== false) throw new Error('offline implementation result fixture not labeled');
    if (!impl.changed_files?.some((file) => file.includes('app/page.tsx'))) throw new Error('implementation result did not capture target changes');
    const handoffAfterImpl = readJson(path.join(dir, 'design-handoff.json'));
    const implPhase = phaseById(handoffAfterImpl, 'kimi_implementation');
    if (!implPhase.git_ledger?.length) throw new Error('mission git ledger missing from implementation phase');
    const proofAfterImpl = readJson(path.join(dir, 'proof.bundle.json'));
    if (proofAfterImpl.context_summary?.artifact !== 'mission.context-summary.json') throw new Error('mission condenser summary missing from proof bundle');
    if (proofAfterImpl.cost_ledger?.artifact !== 'cost.ledger.json') throw new Error('mission cost ledger missing from proof bundle');
    const reviewExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'claude_review',
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_OFFLINE: '1' } });
    if (reviewExec.status !== 0 || !/Status: design-handoff-execute-ready/.test(reviewExec.stdout)) {
      throw new Error(`review execute failed: ${reviewExec.stdout || reviewExec.stderr}`);
    }
    const validation = readJson(path.join(dir, 'taste.validation.json'));
    if (validation.source !== 'offline_fixture' || validation.live_lane_call !== false) throw new Error('offline check did not label review fixture');
    const prematureDeploy = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'tel_deploy',
      '--deploy-url',
      'https://example.vercel.app',
      '--provider',
      'vercel',
      '--git-sha',
      '0000000',
    ], { timeout: 30000 });
    if (prematureDeploy.status !== 0 || !/Status: design-handoff-execute-blocked/.test(prematureDeploy.stdout)) {
      throw new Error(`premature deploy was not blocked: ${prematureDeploy.stdout || prematureDeploy.stderr}`);
    }
    const proofExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'codex_proof',
      '--browser-url',
      'data:text/html,<title>handoff proof</title><main>ok</main>',
    ], { timeout: 30000, env: { CC_DESIGN_HANDOFF_OFFLINE: '1' } });
    if (proofExec.status !== 0 || !/Status: design-handoff-execute-ready/.test(proofExec.stdout)) {
      throw new Error(`codex proof execute failed: ${proofExec.stdout || proofExec.stderr}`);
    }
    const codexProof = readJson(path.join(dir, 'codex.proof.json'));
    if (codexProof.live_lane_call !== false) throw new Error('offline codex proof fixture not labeled');
    if (!codexProof.browser_in_loop?.required) throw new Error('browser-in-loop proof was not required');
    if (!codexProof.browser_in_loop?.proofs?.[0]?.ok) throw new Error('browser-in-loop proof did not pass');
    if (!fs.existsSync(path.join(dir, 'browser.proof.1.json'))) throw new Error('browser proof artifact not written');
    const deployExec = run(path.join(root, 'bin', 'cc-design-handoff'), [
      'execute',
      '--dir',
      dir,
      '--phase',
      'tel_deploy',
      '--deploy-url',
      'https://example.vercel.app',
      '--provider',
      'vercel',
      '--git-sha',
      '0000000',
      '--rollback-token',
      'manual-rollback-fixture',
    ], { timeout: 30000 });
    if (deployExec.status !== 0 || !/Status: design-handoff-execute-ready/.test(deployExec.stdout)) {
      throw new Error(`deploy execute failed: ${deployExec.stdout || deployExec.stderr}`);
    }
    const receipt = readJson(path.join(dir, 'deploy.receipt.json'));
    if (receipt.provider !== 'vercel' || receipt.url !== 'https://example.vercel.app') throw new Error('deploy receipt invalid');
  } catch (err) {
    console.error(`cc-design-handoff check failed: ${err.message}`);
    process.exit(1);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
  console.log('Status: design-handoff-check-ready');
}


module.exports = { runDesignHandoffCheck };
