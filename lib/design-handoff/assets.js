'use strict';

const fs = require('fs');
const path = require('path');
const { extractJson, now, readJson, slug, writeJson } = require('./core');

function writeTinyPng(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/azl3H0AAAAASUVORK5CYII=',
    'base64'
  ));
}

function subscriptionAssist(ctx, prompt) {
  const result = {};
  if (ctx.has('copy-prompt')) {
    const copy = ctx.run('pbcopy', [], { input: prompt, timeout: 5000 });
    result.prompt_copied_to_clipboard = copy.status === 0;
    if (copy.status !== 0) result.copy_error = `${copy.stderr || copy.stdout || 'pbcopy failed'}`.trim();
  }
  if (ctx.has('open-chatgpt')) {
    const opener = process.platform === 'darwin' ? 'open' : 'xdg-open';
    const opened = ctx.run(opener, ['https://chatgpt.com/'], { timeout: 5000 });
    result.chatgpt_opened = opened.status === 0;
    if (opened.status !== 0) result.open_error = `${opened.stderr || opened.stdout || `${opener} failed`}`.trim();
  }
  return result;
}

function createAssetHandlers(ctx) {
  function generateCreativeReference(dir, handoff) {
    const out = path.join(dir, 'visual.target.png');
    const prompt = [
      `Create one premium frontend creative-direction reference image for: ${handoff.request}`,
      'This is a visual target for implementation, not a finished website screenshot.',
      'Prioritize cinematic composition, premium spacing, strong hierarchy, native-code-friendly text zones, and one clear continuation/action surface.',
      'Avoid dense dashboards, generic SaaS cards, visible routing/model mechanics, and baked-in body copy that should be native HTML.',
    ].join('\n');

    if (process.env.CC_DESIGN_HANDOFF_IMAGE_OFFLINE === '1') {
      writeTinyPng(out);
      writeJson(path.join(dir, 'visual.reference.manifest.json'), {
        schema: 'ai-coding-os.visual-reference-manifest.v1',
        mission_id: handoff.mission_id,
        generated_at: now(),
        source: 'offline_fixture',
        live_lane_call: false,
        output: 'visual.target.png',
        prompt,
      });
      return 'visual.target.png';
    }

    if (!ctx.has('image-api-ok')) {
      const packet = ctx.actionPacket(handoff, ctx.phaseById(handoff, 'creative_reference'));
      writeJson(path.join(dir, 'visual.reference.request.json'), {
        ...packet,
        source: 'chatgpt_subscription_manual',
        live_lane_call: false,
        billing: 'chatgpt_subscription_or_manual_upload',
        ...subscriptionAssist(ctx, prompt),
        instructions: [
          'Open ChatGPT Desktop or logged-in ChatGPT web.',
          'Paste the prompt below into the existing/new Image 2.0 thread.',
          'Save the approved output as visual.target.png in this mission directory.',
          'Then run cc-design-handoff approve --phase creative_reference --artifact visual.target.png.',
        ],
        prompt,
      });
      return '';
    }

    const res = ctx.run(path.join(ctx.root, 'bin', 'cc-image'), [
      '--json',
      '--no-open',
      '-p',
      ctx.value('image-preset', 'hero_banner'),
      '-s',
      ctx.value('image-size', '1536x1024'),
      '-o',
      out,
      prompt,
    ], { timeout: 300000, maxBuffer: 1024 * 1024 * 8 });
    const output = `${res.stdout || ''}${res.stderr || ''}`.trim();
    fs.writeFileSync(path.join(dir, 'visual.reference.raw.json'), `${output}\n`);
    if (res.status !== 0) throw new Error(output || `cc-image exited ${res.status}`);
    const parsed = extractJson(output);
    writeJson(path.join(dir, 'visual.reference.manifest.json'), {
      schema: 'ai-coding-os.visual-reference-manifest.v1',
      mission_id: handoff.mission_id,
      generated_at: now(),
      source: 'cc-image-api',
      billing: 'openai_platform_api',
      live_lane_call: true,
      model: parsed?.model || 'gpt-image-2',
      output: 'visual.target.png',
      run_dir: parsed?.runDir || '',
      manifest_path: parsed?.manifestPath || '',
      prompt,
    });
    return 'visual.target.png';
  }

  function assetExtractionPrompt(assetId, handoff) {
    const prompts = {
      'hero-background': 'Extract only the hero background from the approved reference. Remove all text, UI labels, buttons, and icons. Preserve lighting, atmosphere, depth, and composition-safe negative space for native HTML overlay.',
      'primary-button-style': 'Extract only the primary button visual primitive from the approved reference. Preserve material, glow, radius, shadow, and interaction feel. No surrounding layout.',
      'section-divider': 'Extract only the section divider or transition texture from the approved reference. Preserve rhythm and atmosphere. No text.',
      'feature-banner-background': 'Extract only the banner background/surface from the approved reference. Preserve premium lighting and hierarchy-safe empty space. No text.',
    };
    return [
      prompts[assetId] || `Extract only the ${assetId} implementation asset from the approved reference. No text. Preserve the approved visual direction.`,
      `Mission request: ${handoff.request}`,
      'Return a clean implementation asset that Kimi can place behind native text and controls.',
    ].join('\n');
  }

  function upsertAssetKit(dir, handoff, asset) {
    const file = path.join(dir, 'creative.asset-kit.json');
    const kit = fs.existsSync(file) ? readJson(file) : {
      schema: 'ai-coding-os.creative-asset-kit.v1',
      mission_id: handoff.mission_id,
      phase: 'asset_decomposition',
      request: handoff.request,
      generated_at: now(),
      source: 'cc-design-handoff asset extractor',
      mode: 'sequential_approved_extraction',
      owner_lane: 'chatgpt-image',
      canonical_reference: { path: 'visual.target.png', owner_lane: 'chatgpt-image' },
      rules: {
        extract_one_asset_at_a_time: true,
        approval_required_before_next_asset: true,
        use_same_image_thread_after_reference_approval: true,
        implementation_model_must_not_reinvent_visual_direction: true,
        native_text_and_interactions_stay_in_code: true,
        do_not_parallelize_extraction_requests: true,
      },
      assets: [],
      handoff_to_kimi: {
        include: ['canonical_reference', 'approved_assets', 'design.dna.json', 'implementation.plan.json'],
      },
    };
    const assets = Array.isArray(kit.assets) ? kit.assets : [];
    const next = { sequence: assets.find((item) => item.id === asset.id)?.sequence || assets.length + 1, ...asset };
    const index = assets.findIndex((item) => item.id === asset.id);
    if (index >= 0) assets[index] = next;
    else assets.push(next);
    kit.assets = assets.sort((a, b) => Number(a.sequence) - Number(b.sequence));
    kit.updated_at = now();
    writeJson(file, kit);
    return 'creative.asset-kit.json';
  }

  function extractAsset(dir, handoff) {
    const assetId = slug(ctx.value('extract-asset', ctx.value('asset', 'hero-background')));
    const assetPath = path.join('assets', `${assetId}.png`);
    const output = path.join(dir, assetPath);
    const prompt = assetExtractionPrompt(assetId, handoff);

    if (process.env.CC_DESIGN_HANDOFF_IMAGE_OFFLINE === '1') {
      writeTinyPng(output);
      return upsertAssetKit(dir, handoff, {
        id: assetId,
        role: assetId.replace(/-/g, ' '),
        asset_type: 'image',
        path: assetPath,
        extraction_prompt: prompt,
        implementation_usage: 'Use as an approved visual primitive in the Kimi implementation pass.',
        approval_gate: 'human_approves_asset_before_next_extraction',
        source: 'offline_fixture',
        live_lane_call: false,
      });
    }

    if (!ctx.has('image-api-ok')) {
      writeJson(path.join(dir, 'asset.extraction.request.json'), {
        ...ctx.actionPacket(handoff, ctx.phaseById(handoff, 'asset_decomposition')),
        source: 'chatgpt_subscription_manual',
        live_lane_call: false,
        billing: 'chatgpt_subscription_or_manual_upload',
        asset_id: assetId,
        prompt,
        ...subscriptionAssist(ctx, prompt),
        instructions: [
          'Use the same ChatGPT/Image 2.0 thread as the approved visual reference.',
          'Paste the extraction prompt below.',
          `Save the approved output as assets/${assetId}.png in this mission directory.`,
          'Then approve creative.asset-kit.json or rerun extraction with --image-api-ok if you intentionally want API billing.',
        ],
        note: 'No API billing used. This is a ChatGPT subscription/manual generation packet.',
      });
      return '';
    }

    const res = ctx.run(path.join(ctx.root, 'bin', 'cc-image'), [
      '--json',
      '--no-open',
      '-r',
      path.join(dir, 'visual.target.png'),
      '-s',
      ctx.value('image-size', '1536x1024'),
      '-o',
      output,
      prompt,
    ], { timeout: 300000, maxBuffer: 1024 * 1024 * 8 });
    const raw = `${res.stdout || ''}${res.stderr || ''}`.trim();
    fs.writeFileSync(path.join(dir, `asset.${assetId}.raw.json`), `${raw}\n`);
    if (res.status !== 0) throw new Error(raw || `cc-image exited ${res.status}`);
    const parsed = extractJson(raw);
    return upsertAssetKit(dir, handoff, {
      id: assetId,
      role: assetId.replace(/-/g, ' '),
      asset_type: 'image',
      path: assetPath,
      extraction_prompt: prompt,
      implementation_usage: 'Use as an approved visual primitive in the Kimi implementation pass.',
      approval_gate: 'human_approves_asset_before_next_extraction',
      source: 'cc-image-api',
      billing: 'openai_platform_api',
      live_lane_call: true,
      raw_output_artifact: `asset.${assetId}.raw.json`,
      run_dir: parsed?.runDir || '',
      manifest_path: parsed?.manifestPath || '',
    });
  }

  return { extractAsset, generateCreativeReference };
}

module.exports = { createAssetHandlers, writeTinyPng };
