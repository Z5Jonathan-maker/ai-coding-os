'use strict';

const path = require('path');

function parseJson(text, fallback = {}) {
  try {
    return JSON.parse(text || '');
  } catch (_) {
    return fallback;
  }
}

function compact(value, max = 120) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function buildMissionState(payload, options = {}) {
  const currentCwd = options.cwd || process.cwd();
  const diff = parseJson(payload.diffSummary, {});
  const context = parseJson(payload.contextMeterJson, {});
  const sessions = parseJson(payload.sessions, {});
  const repoPath = diff.repo || context.repo || currentCwd;
  const repo = path.basename(repoPath || currentCwd);
  const branch = diff.branch || context.branch || '';
  const diffKnown = Object.prototype.hasOwnProperty.call(diff, 'clean');
  const clean = diff.clean === true;
  const fileCount = Number(diff.fileCount || 0);
  const added = Number(diff.totalAdded || 0);
  const removed = Number(diff.totalRemoved || 0);
  const resolvedRepo = path.resolve(repoPath || currentCwd);
  const latestSession = Array.isArray(sessions.sessions)
    ? sessions.sessions.find((session) => {
      if (session.stale || typeof session.cwd !== 'string' || !session.cwd) return false;
      return path.resolve(session.cwd) === resolvedRepo;
    }) || null
    : null;
  const routeLine = String(payload.route || '').split('\n').find(line => line.startsWith('Latest:')) || '';
  const route = routeLine.replace(/^Latest:\s*/, '').split('|')[0].trim() || 'Auto';
  const capacity = String(payload.providerCapacity || '');
  const kimi = String(payload.kimi || '');
  const contextStatus = context.statusText || 'Context pressure unavailable.';
  const capacityDegraded = /quota_exhausted|status=degraded|warn/i.test(capacity);
  const browserReady = /official-extension/i.test(kimi);
  const title = `${repo} workspace`;
  const summary = [
    branch ? `Branch ${branch}` : 'Current repository',
    diffKnown ? clean ? 'working tree clean' : `${fileCount} changed file${fileCount === 1 ? '' : 's'}` : 'diff unavailable',
    browserReady ? 'browser bridge ready' : 'browser bridge unchecked',
  ].join(' - ');
  const lastSession = latestSession && latestSession.last_prompt
    ? `Last routed task: ${compact(latestSession.last_prompt, 150)}`
    : !diffKnown
      ? 'Diff state is unavailable. Refresh cockpit diagnostics before continuing.'
      : clean
        ? 'No active diff. The workspace is ready for the next focused task.'
        : `Uncommitted work detected: ${fileCount} file${fileCount === 1 ? '' : 's'}, +${added} -${removed}.`;
  const nextStep = !diffKnown
    ? 'Run cockpit refresh or cc-diff-hunks, then continue only after the workspace state is known.'
    : clean
      ? 'Choose the next mission, or ask the cockpit to inspect the repo and propose the safest useful action.'
      : 'Review the current diff, run the relevant verification, then continue the smallest safe change.';
  const changes = !diffKnown ? 'Diff unavailable' : clean ? 'Working tree clean' : `${fileCount} file${fileCount === 1 ? '' : 's'} changed`;
  const tests = !diffKnown ? 'Check diagnostics' : clean ? 'Gates on demand' : 'Verify before ship';
  const safety = capacityDegraded ? 'Provider degraded' : !diffKnown ? 'Review state' : clean ? 'Safe to continue' : 'Review diff first';
  const progress = !diffKnown ? 36 : clean ? 64 : 42;
  const status = !diffKnown ? 'Needs review' : clean ? 'Ready' : 'In progress';
  const prompt = !diffKnown
    ? `Continue ${title}. First recover the live diff state, then inspect route history and choose the smallest safe next action.`
    : clean
      ? `Continue ${title}. Inspect the current repo state, recent route history, and docs. Propose or execute the safest next useful action, then verify.`
      : `Continue ${title}. Review the current ${fileCount}-file diff, identify the smallest safe next step, run relevant verification, and report blockers.`;

  return {
    title,
    summary,
    status,
    branch,
    lastSession,
    nextStep,
    changes,
    tests,
    safety,
    route,
    progress,
    prompt,
    started: latestSession && latestSession.last_ts ? latestSession.last_ts : 'Now',
    feed: [
      {
        icon: 'R',
        state: 'active',
        title: !diffKnown ? 'Workspace diff state is unavailable.' : clean ? 'Workspace tree is clean.' : 'Workspace has uncommitted changes.',
        body: !diffKnown ? 'Refresh diagnostics before treating the workspace as safe.' : clean ? 'No local diff is waiting.' : `${fileCount} files, +${added} -${removed}.`,
        time: 'now',
      },
      {
        icon: 'C',
        state: '',
        title: contextStatus,
        body: `${Number(context.availableTokens || 0).toLocaleString()} tokens available.`,
        time: 'now',
      },
      {
        icon: 'B',
        state: browserReady ? 'done' : '',
        title: browserReady ? 'Browser bridge is official-extension ready.' : 'Browser bridge needs attention.',
        body: browserReady ? 'Authenticated browser work can use the real Chrome extension.' : 'Check Kimi WebBridge before browser tasks.',
        time: 'now',
      },
      {
        icon: capacityDegraded ? '!' : 'G',
        state: capacityDegraded ? '' : 'done',
        title: capacityDegraded ? 'Provider capacity is degraded.' : 'Provider capacity is ready.',
        body: capacityDegraded ? compact(capacity.replace(/\s+/g, ' '), 150) : 'Primary lanes are available.',
        time: 'now',
      },
    ],
  };
}

module.exports = { buildMissionState };
