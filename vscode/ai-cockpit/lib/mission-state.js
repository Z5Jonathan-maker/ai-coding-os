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

function label(value) {
  return String(value || '')
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function kernelProgress(mission) {
  const execution = String(mission.execution_status || '');
  if (execution === 'done') return 100;
  if (execution === 'verifying') return 78;
  if (execution === 'acting') return 58;
  if (execution === 'planning') return 34;
  if (execution === 'waiting_permission') return 30;
  if (execution === 'failed') return 24;
  return ({ planned: 18, running: 48, blocked: 36, verifying: 72, passed: 100, failed: 28 })[mission.status] || 42;
}

function matchingMission(payload, resolvedRepo) {
  const kernel = parseJson(payload.missionKernel, {});
  if (kernel && kernel.mission && kernel.mission.repo && !kernel.mission.stale) {
    if (path.resolve(kernel.mission.repo) === resolvedRepo) {
      const runtime = [kernel.mission.runtime_status, kernel.mission.execution_status, kernel.mission.startup_phase]
        .filter(Boolean)
        .map(label)
        .join(' / ');
      return {
        id: kernel.mission.id,
        repo: kernel.mission.repo,
        title: kernel.mission.title,
        status: kernel.mission.status === 'passed' ? 'ready' : kernel.mission.status || 'ready',
        runtime_status: kernel.mission.runtime_status,
        execution_status: kernel.mission.execution_status,
        startup_phase: kernel.mission.startup_phase,
        next: kernel.mission.next_action,
        summary: kernel.mission.task,
        runtime,
        lane: kernel.mission.route,
        progress: kernelProgress(kernel.mission),
        proof: kernel.proof && Array.isArray(kernel.proof.commands)
          ? kernel.proof.commands.map((cmd) => cmd.command || cmd.name || String(cmd)).filter(Boolean)
          : [],
        updated_at: kernel.mission.updated_at,
        stale: false,
        kernel,
      };
    }
  }
  const ledger = parseJson(payload.missionLedger, {});
  if (!Array.isArray(ledger.missions)) return null;
  return ledger.missions.find((mission) => {
    if (mission.stale || typeof mission.repo !== 'string' || !mission.repo) return false;
    return path.resolve(mission.repo) === resolvedRepo;
  }) || null;
}

function matchingEvents(payload, resolvedRepo) {
  const kernel = parseJson(payload.missionKernel, {});
  if (kernel && kernel.mission && kernel.timeline && Array.isArray(kernel.timeline.events)) {
    if (kernel.mission.repo && path.resolve(kernel.mission.repo) === resolvedRepo) {
      return kernel.timeline.events.slice(-4).reverse().map((event, index) => ({
        type: 'event',
        id: `${kernel.mission.id}:kernel:${index}`,
        repo: kernel.mission.repo,
        mission_id: kernel.mission.id,
        stage: String(event.stage || 'act').toLowerCase(),
        title: event.message || `${event.stage || 'mission'} event`,
        body: Array.isArray(event.proof) && event.proof.length ? event.proof.join(', ') : event.agent || 'mission kernel',
        proof: Array.isArray(event.proof) ? event.proof : [],
        updated_at: event.ts || kernel.mission.updated_at,
        stale: false,
      }));
    }
  }
  const ledger = parseJson(payload.missionLedger, {});
  if (!Array.isArray(ledger.events)) return [];
  return ledger.events.filter((event) => {
    if (event.stale || typeof event.repo !== 'string' || !event.repo) return false;
    return path.resolve(event.repo) === resolvedRepo;
  }).slice(0, 4);
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
  const ledgerMission = matchingMission(payload, resolvedRepo);
  const ledgerEvents = matchingEvents(payload, resolvedRepo);
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
  const missionTitle = ledgerMission && ledgerMission.title ? compact(ledgerMission.title, 90) : title;
  const missionNext = ledgerMission && ledgerMission.next ? compact(ledgerMission.next, 180) : '';
  const missionSummary = ledgerMission && ledgerMission.summary ? compact(ledgerMission.summary, 180) : '';
  const runtimeSummary = ledgerMission && ledgerMission.runtime ? compact(`Runtime ${ledgerMission.runtime}`, 160) : '';
  const missionRoute = ledgerMission && ledgerMission.lane ? ledgerMission.lane : '';
  const summary = [
    branch ? `Branch ${branch}` : 'Current repository',
    diffKnown ? clean ? 'working tree clean' : `${fileCount} changed file${fileCount === 1 ? '' : 's'}` : 'diff unavailable',
    browserReady ? 'browser bridge ready' : 'browser bridge unchecked',
  ].join(' - ');
  let lastSession;
  if (missionSummary && runtimeSummary && !clean && diffKnown) {
    lastSession = `Mission memory: ${missionSummary}. ${runtimeSummary}. Uncommitted work detected: ${fileCount} file${fileCount === 1 ? '' : 's'}, +${added} -${removed}.`;
  } else if (missionSummary && !clean && diffKnown) {
    lastSession = `Mission memory: ${missionSummary}. Uncommitted work detected: ${fileCount} file${fileCount === 1 ? '' : 's'}, +${added} -${removed}.`;
  } else if (missionSummary && runtimeSummary) {
    lastSession = `Mission memory: ${missionSummary}. ${runtimeSummary}.`;
  } else if (missionSummary) {
    lastSession = `Mission memory: ${missionSummary}`;
  } else if (latestSession && latestSession.last_prompt) {
    lastSession = `Last routed task: ${compact(latestSession.last_prompt, 150)}`;
  } else if (!diffKnown) {
    lastSession = 'Diff state is unavailable. Refresh cockpit diagnostics before continuing.';
  } else if (clean) {
    lastSession = 'No active diff. The workspace is ready for the next focused task.';
  } else {
    lastSession = `Uncommitted work detected: ${fileCount} file${fileCount === 1 ? '' : 's'}, +${added} -${removed}.`;
  }
  const nextStep = !diffKnown
    ? 'Run cockpit refresh or cc-diff-hunks, then continue only after the workspace state is known.'
    : missionNext
      ? missionNext
      : clean
      ? 'Choose the next mission, or ask the cockpit to inspect the repo and propose the safest useful action.'
      : 'Review the current diff, run the relevant verification, then continue the smallest safe change.';
  const changes = !diffKnown ? 'Diff unavailable' : clean ? 'Working tree clean' : `${fileCount} file${fileCount === 1 ? '' : 's'} changed`;
  const tests = !diffKnown ? 'Check diagnostics' : clean ? 'Gates on demand' : 'Verify before ship';
  const safety = capacityDegraded ? 'Provider degraded' : !diffKnown ? 'Review state' : clean ? 'Safe to continue' : 'Review diff first';
  const progress = !diffKnown ? 36 : clean && ledgerMission && ledgerMission.progress ? Number(ledgerMission.progress) : clean ? 64 : 42;
  const execution = ledgerMission && ledgerMission.execution_status ? String(ledgerMission.execution_status).toLowerCase() : '';
  const activeKernel = Boolean(ledgerMission && ledgerMission.kernel && !['ready', 'passed'].includes(String(ledgerMission.status || '').toLowerCase()));
  const status = !diffKnown ? 'Needs review' : execution === 'waiting_permission' ? 'Needs review' : activeKernel ? 'In progress' : clean ? 'Ready' : 'In progress';
  const prompt = !diffKnown
    ? `Continue ${missionTitle}. First recover the live diff state, then inspect route history and choose the smallest safe next action.`
    : clean
      ? `Continue ${missionTitle}. ${nextStep} Verify before reporting done.`
      : `Continue ${missionTitle}. Review the current ${fileCount}-file diff, ${nextStep.toLowerCase()}, and report blockers.`;

  return {
    title: missionTitle,
    summary,
    status,
    branch,
    lastSession,
    nextStep,
    changes,
    tests,
    safety,
    route: missionRoute || route,
    progress,
    prompt,
    started: ledgerMission && ledgerMission.updated_at ? ledgerMission.updated_at : latestSession && latestSession.last_ts ? latestSession.last_ts : 'Now',
    feed: [
      ...ledgerEvents.map((event) => ({
        icon: ({ plan: 'P', act: 'A', checkpoint: 'C', resume: 'R' })[event.stage] || 'M',
        state: event.stage === 'checkpoint' ? 'done' : event.stage === 'act' ? 'active' : '',
        title: compact(event.title, 90),
        body: compact(event.body || (event.proof || []).join(', ') || event.stage, 150),
        time: event.updated_at || 'now',
      })),
      ...(ledgerMission ? [{
        icon: 'M',
        state: 'done',
        title: 'Mission memory loaded.',
        body: missionSummary || missionNext || 'Current repo matched the local mission ledger.',
        time: 'now',
      }] : []),
      ...(runtimeSummary ? [{
        icon: 'A',
        state: execution === 'done' ? 'done' : execution === 'failed' ? '' : 'active',
        title: runtimeSummary,
        body: `Startup phase: ${label(ledgerMission.startup_phase) || 'Unknown'}.`,
        time: ledgerMission.updated_at || 'now',
      }] : []),
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
