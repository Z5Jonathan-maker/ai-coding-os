'use strict';
/**
 * ChatGPT Image Bridge — generates images via ChatGPT web UI using the user's
 * subscription allowance instead of the OpenAI API (which bills separately).
 *
 * Uses Playwright to automate chat.openai.com. First run requires manual login
 * (headed mode). Session state is persisted to disk for subsequent headless runs.
 *
 * NOTE: This is an unofficial integration. OpenAI may change their web UI at
 * any time, which can break this bridge. A circuit breaker + API fallback is
 * recommended for production use.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = path.join(os.homedir(), '.claude', 'chatgpt-bridge');
const SESSION_STATE = path.join(SESSION_DIR, 'session-state.json');
const IMAGE_DIR = path.join(SESSION_DIR, 'images');
const PROFILE_DIR = path.join(SESSION_DIR, 'profile');
const PROFILE_READY = path.join(SESSION_DIR, 'profile-ready');

// Ensure dirs exist
fs.mkdirSync(SESSION_DIR, { recursive: true });
fs.mkdirSync(IMAGE_DIR, { recursive: true });
fs.mkdirSync(PROFILE_DIR, { recursive: true });

const CHATGPT_URL = 'https://chatgpt.com/';
const TIMEOUT = 120000; // 2min — image gen can be slow
const BRIDGE_ALERTS_LOG = path.join(os.homedir(), '.claude', 'bridge-alerts.log');

function countRecentAlerts(windowMs) {
  try {
    if (!fs.existsSync(BRIDGE_ALERTS_LOG)) return 0;
    const cutoff = Date.now() - windowMs;
    const lines = fs.readFileSync(BRIDGE_ALERTS_LOG, 'utf8').split('\n');
    let count = 0;
    for (const line of lines) {
      if (!line.includes('ChatGPT bridge')) continue;
      const ts = line.split(' ')[0];
      if (!ts) continue;
      const t = Date.parse(ts);
      if (Number.isFinite(t) && t >= cutoff) count++;
    }
    return count;
  } catch {
    return 0;
  }
}

async function ensureSessionState() {
  if (fs.existsSync(PROFILE_READY)) return true;
  try {
    return fs.readdirSync(PROFILE_DIR).length > 0;
  } catch {
    return false;
  }
}

async function launchContext(opts = {}) {
  return chromium.launchPersistentContext(PROFILE_DIR, {
    headless: opts.headless ?? false,
    viewport: { width: 1440, height: 960 },
    args: [
      '--window-size=1440,960',
      '--disable-features=BlockThirdPartyCookies,TrackingProtection3pcd,ThirdPartyStoragePartitioning',
      '--disable-popup-blocking',
    ],
  });
}

async function openChatGPT(page, opts = {}) {
  const timeout = opts.timeout ?? 30000;
  await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout });
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    // ChatGPT frequently streams or keeps long-lived connections open.
  }
}

async function detectChallenge(page) {
  const title = (await page.title()).trim().toLowerCase();
  if (title === 'just a moment...') return true;
  if (page.url().includes('/cdn-cgi/challenge-platform/')) return true;
  const bodyText = ((await page.locator('body').textContent()) || '').toLowerCase();
  return bodyText.includes('checking your browser') || bodyText.includes('just a moment');
}

/**
 * Run an interactive setup where the user logs into ChatGPT manually.
 * Saves session state for future headless runs.
 */
async function setupSession() {
  console.log('🔐 ChatGPT Image Bridge Setup');
  console.log('A browser window will open. Please log into ChatGPT manually.');
  console.log('Once you see the chat interface, close the browser to save the session.\n');

  const context = await launchContext({ headless: false });
  const page = context.pages()[0] || await context.newPage();

  await openChatGPT(page, { timeout: TIMEOUT });
  console.log('Waiting for you to log in and reach the chat interface...');

  // Wait for the user to close the browser
  await new Promise(resolve => {
    context.browser().on('disconnected', resolve);
  });

  fs.writeFileSync(PROFILE_READY, `${Date.now()}\n`);
  try {
    const browser = context.browser();
    if (browser?.isConnected()) {
      await context.storageState({ path: SESSION_STATE });
    }
  } catch {}
  console.log(`✅ Session saved to ${SESSION_STATE}`);
}

/**
 * Generate an image via ChatGPT web UI.
 * @param {string} prompt - The image generation prompt
 * @param {object} opts - Options
 * @returns {Promise<{imagePath: string, model: string}>}
 */
async function generateImage(prompt, opts = {}) {
  const hasSession = await ensureSessionState();
  if (!hasSession) {
    const err = new Error('No ChatGPT session found. Run setup first: node lib/chatgpt-image-bridge.cjs setup');
    err.code = 'CHATGPT_NO_SESSION';
    throw err;
  }

  let context;
  try {
    context = await launchContext({ headless: opts.headless ?? false });
    const page = context.pages()[0] || await context.newPage();

    await openChatGPT(page, { timeout: TIMEOUT });

    if (await detectChallenge(page)) {
      throw new Error('ChatGPT is behind a browser challenge right now; open the site in a real browser and refresh the saved session');
    }

    // Wait for the chat input to be available
    // OpenAI uses data-testid attributes which are relatively stable
    const inputSelector = 'div[contenteditable="true"], textarea[placeholder*="Message"], #prompt-textarea';
    await page.waitForSelector(inputSelector, { timeout: 30000 });

    // Type the prompt
    await page.fill(inputSelector, prompt);
    await page.press(inputSelector, 'Enter');

    // Wait for the response to complete
    // Strategy: wait for the stop button to disappear, then look for images
    const stopButton = 'button[aria-label*="Stop"], button[data-testid*="stop"]';
    try {
      await page.waitForSelector(stopButton, { timeout: 5000 });
      await page.waitForSelector(stopButton, { state: 'hidden', timeout: TIMEOUT });
    } catch {
      // Stop button may not appear for fast responses
    }

    // Wait a bit more for images to render
    await page.waitForTimeout(3000);

    // Look for generated images in the last assistant message
    const imageSelector = 'img[src*="oaiusercontent.com"], img[src*="chatgpt.com"], .image-gen img, [data-testid*="image"] img';
    const images = await page.locator(imageSelector).all();

    if (images.length === 0) {
      // Sometimes images are in a different format — try broader selector
      const allImages = await page.locator('img').evaluateAll(imgs =>
        imgs.filter(img => img.naturalWidth > 256 && img.src && !img.src.includes('avatar') && !img.src.includes('icon'))
      );
      if (allImages.length === 0) {
        throw new Error('No generated image found in ChatGPT response');
      }
      // Use the last (most recent) image
      const lastImg = allImages[allImages.length - 1];
      const imageUrl = lastImg.src;
      const imagePath = await downloadImage(imageUrl, prompt);
      return { imagePath, model: 'gpt-image-2.0' };
    }

    // Download the most recent image
    const lastImage = images[images.length - 1];
    const imageUrl = await lastImage.getAttribute('src');
    const imagePath = await downloadImage(imageUrl, prompt);

    return { imagePath, model: 'gpt-image-2.0' };
  } finally {
    await context?.close();
  }
}

async function downloadImage(url, prompt) {
  const ext = path.extname(new URL(url).pathname) || '.png';
  const safeName = prompt.slice(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${Date.now()}_${safeName}${ext}`;
  const imagePath = path.join(IMAGE_DIR, filename);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(imagePath, buffer);

  return imagePath;
}

async function probeHealth() {
  const hasSession = await ensureSessionState();
  if (!hasSession) {
    return { ok: false, reason: 'No saved session. Run: node lib/chatgpt-image-bridge.cjs setup' };
  }

  let context;
  try {
    context = await launchContext({ headless: true });
    const page = context.pages()[0] || await context.newPage();
    await openChatGPT(page, { timeout: 20000 });

    if (await detectChallenge(page)) {
      await context.close();
      // Cross-check the keeper's alerts log. If the keeper has logged failures
      // in the last 15 minutes, the bridge is genuinely down — don't paper
      // over it with an optimistic "verified manually" note (2026-05-14: that
      // assumption was masking continuous bridge-down alerts).
      const recentFailures = countRecentAlerts(15 * 60 * 1000);
      if (recentFailures > 0) {
        return {
          ok: false,
          reason: `Bridge keeper logged ${recentFailures} failures in last 15min — challenge detected, runtime likely broken`,
        };
      }
      return {
        ok: 'unknown',
        reason: 'Challenge detected — cannot verify headless. Headed runtime may still work.',
        note: 'Run `node lib/chatgpt-image-bridge.cjs test` to confirm with an actual tiny generation.',
      };
    }

    // Check if we're still logged in by looking for the chat input
    const inputSelector = 'div[contenteditable="true"], textarea[placeholder*="Message"], #prompt-textarea';
    const isLoggedIn = await page.locator(inputSelector).count() > 0;

    await context.close();
    return {
      ok: isLoggedIn,
      reason: isLoggedIn ? null : 'Session expired — run setup again',
    };
  } catch (e) {
    await context?.close();
    return { ok: false, reason: e.message };
  }
}

module.exports = { generateImage, setupSession, probeHealth };

// CLI
if (require.main === module) {
  const [, , cmd] = process.argv;
  if (cmd === 'setup') {
    setupSession().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
  } else if (cmd === 'test') {
    generateImage('A minimal logo for a peptide tracking app called DoseCraft, flat design, teal and white').then(r => {
      console.log('✅ Image generated:', r.imagePath);
      process.exit(0);
    }).catch(e => { console.error('❌', e.message); process.exit(1); });
  } else if (cmd === 'ping') {
    probeHealth().then(r => { console.log(JSON.stringify(r, null, 2)); process.exit(0); });
  } else {
    console.log('Usage: node lib/chatgpt-image-bridge.cjs <setup|test|ping>');
    process.exit(1);
  }
}
