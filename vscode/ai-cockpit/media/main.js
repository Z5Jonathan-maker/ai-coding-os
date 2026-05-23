(function () {
  const vscode = acquireVsCodeApi();
  const $ = (id) => document.getElementById(id);
  let selectedMode = 'autoRun';
  let permissionMode = 'review';
  let contextBlock = '';
  let attached = [];
  let activePrompt = '';

  function renderChips() {
    $('chips').innerHTML = '';
    attached.forEach((item, index) => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.type = 'button';
      chip.textContent = `${item.label} ×`;
      chip.addEventListener('click', () => {
        attached.splice(index, 1);
        renderChips();
      });
      $('chips').appendChild(chip);
    });
  }

  function fullContext() {
    return [contextBlock].concat(attached.map(item => item.block)).filter(Boolean).join('');
  }

  function activeMissionPrompt() {
    const active = document.querySelector('.workstream.active[data-workstream]');
    if (!active) return '';
    const promptButton = active.querySelector('button[data-workstream-prompt]');
    if (promptButton?.dataset.workstreamPrompt) return promptButton.dataset.workstreamPrompt;
    const title = active.dataset.workstream || $('continueTitle')?.textContent || 'current mission';
    const focus = active.dataset.focusBody || active.dataset.focus || $('continueBody')?.textContent || 'continue the next best step';
    return `Continue ${title}. ${focus}`;
  }

  function promptForRun() {
    const typed = String($('prompt')?.value || '').trim();
    const prompt = typed || activeMissionPrompt();
    if (prompt && !typed && $('prompt')) $('prompt').value = prompt;
    return prompt;
  }

  function includeContextChecked() {
    return Boolean($('includeContext')?.checked);
  }

  document.addEventListener('click', (event) => {
    const modeButton = event.target.closest('button[data-mode]');
    if (modeButton) {
      selectedMode = modeButton.dataset.mode;
      document.querySelectorAll('button[data-mode]').forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === selectedMode);
        button.setAttribute('aria-pressed', String(button.dataset.mode === selectedMode));
      });
      $('modeSummary').textContent = `Mode: ${modeButton.textContent}`;
      return;
    }

    const permissionButton = event.target.closest('button[data-permission]');
    if (permissionButton) {
      permissionMode = permissionButton.dataset.permission;
      document.querySelectorAll('button[data-permission]').forEach((button) => {
        button.classList.toggle('active', button.dataset.permission === permissionMode);
        button.setAttribute('aria-pressed', String(button.dataset.permission === permissionMode));
      });
      const label = permissionButton.querySelector('strong')?.textContent || permissionButton.textContent;
      $('permissionSummary').textContent = `Authority: ${label.trim()}`;
      return;
    }

    const resultAction = event.target.closest('button[data-result-action]');
    if (resultAction) {
      const action = resultAction.dataset.resultAction;
      if (action === 'copy') {
        vscode.postMessage({ command: 'copyResult', text: $('result').textContent || '' });
      } else if (action === 'clear') {
        activePrompt = '';
        setRunning(false);
        $('resultTitle').textContent = document.body.classList.contains('panel-mode') ? 'Momentum' : 'Result';
        renderTranscript('Ready', '');
      } else if (action === 'stop') {
        vscode.postMessage({ command: 'stopRun' });
      }
      return;
    }

    const workstreamButton = event.target.closest('button[data-workstream-prompt]');
    if (workstreamButton) {
      const article = workstreamButton.closest('.workstream');
      if (article) selectWorkstream(article);
      const prompt = workstreamButton.dataset.workstreamPrompt || '';
      $('prompt').value = prompt;
      startTranscript(selectedMode, prompt);
      vscode.postMessage({
        command: 'runPrompt',
        mode: selectedMode,
        prompt,
        permissionMode,
        includeContext: $('includeContext').checked,
        contextBlock: fullContext(),
      });
      return;
    }

    const workstream = event.target.closest('.workstream[data-workstream]');
    if (workstream) {
      selectWorkstream(workstream);
      return;
    }

    const button = event.target.closest('button[data-command]');
    if (button) {
      clearTranscriptPrompt();
      vscode.postMessage({ command: button.dataset.command });
      return;
    }

    const runButton = event.target.closest('button[data-run]');
    if (runButton) {
      const prompt = promptForRun();
      startTranscript(runButton.dataset.run, prompt);
      vscode.postMessage({
        command: 'runPrompt',
        mode: runButton.dataset.run,
        prompt,
        permissionMode,
        includeContext: includeContextChecked(),
        contextBlock: fullContext(),
      });
      return;
    }

    const selectedRun = event.target.closest('button[data-run-selected]');
    if (selectedRun) {
      const prompt = promptForRun();
      startTranscript(selectedMode, prompt);
      vscode.postMessage({
        command: 'runPrompt',
        mode: selectedMode,
        prompt,
        permissionMode,
        includeContext: includeContextChecked(),
        contextBlock: fullContext(),
      });
      return;
    }

    const inlineButton = event.target.closest('button[data-inline-command]');
    if (!inlineButton) return;
    clearTranscriptPrompt();
    vscode.postMessage({
      command: 'inline',
      name: inlineButton.dataset.inlineName,
      commandLine: inlineButton.dataset.inlineCommand,
    });
  });

  window.addEventListener('load', () => {
    setTimeout(() => $('prompt')?.focus(), 0);
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      const prompt = promptForRun();
      startTranscript(selectedMode, prompt);
      vscode.postMessage({
        command: 'runPrompt',
        mode: selectedMode,
        prompt,
        permissionMode,
        includeContext: includeContextChecked(),
        contextBlock: fullContext(),
      });
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      $('prompt').focus();
      $('prompt').select();
    }
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'loading') {
      $('readinessTitle').textContent = 'Refreshing cockpit';
      $('readinessBody').textContent = 'Checking live routes, required setup, provider circuits, and disk gate.';
      return;
    }
    if (message.type === 'context') {
      contextBlock = message.payload && message.payload.block ? message.payload.block : '';
      $('context').textContent = message.payload && message.payload.label ? message.payload.label : 'No active editor';
      return;
    }
    if (message.type === 'appendContext') {
      attached.push(message.payload);
      renderChips();
      return;
    }
    if (message.type !== 'state') return;

    const { readiness, context, route, metrics, providerCapacity, permissions, checkpoints, disk, product, firstRun, contextMeter, contextMeterJson, contextSnapshot, diffSummary, sessions, pulse, nativeApps, kimi, repoMap, mission } = message.payload;
    const health = deriveHealth(readiness, product, firstRun, kimi, route, providerCapacity);
    contextBlock = context && context.block ? context.block : '';
    renderMissionState(mission);
    $('readinessTitle').textContent = health.title;
    $('readinessBody').textContent = health.body;
    const railLabel = $('railStatusLabel');
    if (railLabel) railLabel.textContent = health.level === 'ready' ? 'Ready' : health.level === 'blocked' ? 'Blocked' : 'Degraded';
    $('context').textContent = context && context.label ? context.label : 'No active editor';
    $('statusDot').classList.toggle('warn', health.level === 'blocked');
    $('statusDot').classList.toggle('degraded', health.level === 'degraded');
    $('route').textContent = route || 'No route receipt available.';
    $('metrics').textContent = metrics || 'No router metrics available.';
    $('providerCapacity').textContent = providerCapacity || 'No provider capacity report available.';
    $('permissions').textContent = permissions || 'No permission matrix available.';
    $('checkpoints').textContent = checkpoints || 'No checkpoints available.';
    $('disk').textContent = disk || 'No disk readiness report available.';
    $('product').textContent = product || 'No product readiness report available.';
    $('firstRun').textContent = firstRun || 'No first-run doctor available.';
    $('contextMeter').textContent = contextMeter || 'No context meter available.';
    renderContextMeter(parseJson(contextMeterJson));
    renderContextSnapshot(parseJson(contextSnapshot));
    renderDiffSummary(parseJson(diffSummary));
    renderSessions(parseJson(sessions));
    $('pulse').textContent = pulse || 'No Pulse status available.';
    $('nativeApps').textContent = nativeApps || 'No native app status available.';
    $('kimi').textContent = kimi || 'No Kimi status available.';
    renderStatusGrid(route, parseJson(diffSummary), parseJson(contextMeterJson), providerCapacity);
    renderRepoMap(parseJson(repoMap));
    $('jobs').textContent = message.payload.jobs || 'No jobs available.';
    $('lanes').textContent = message.payload.lanes || 'No lane registry available.';
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type !== 'result') return;
    $('resultTitle').textContent = document.body.classList.contains('panel-mode') ? 'Momentum' : message.payload.title || 'Last Result';
    renderTranscript(message.payload.title, message.payload.body);
    setRunning(Boolean(message.payload.running));
  });

  function startTranscript(mode, prompt) {
    activePrompt = String(prompt || '').trim();
    if (!activePrompt) return;
    setRunning(true);
    $('resultTitle').textContent = document.body.classList.contains('panel-mode') ? 'In motion' : 'Working';
    renderTranscript(modeLabel(mode), 'Running...');
  }

  function setRunning(running) {
    document.body.classList.toggle('is-running', running);
    const stop = $('stopRun');
    if (stop) stop.disabled = !running;
    document.querySelectorAll('button[data-run-selected], button[data-workstream-prompt]').forEach((button) => {
      button.disabled = running;
      button.setAttribute('aria-busy', String(running));
    });
    const activeWorkstream = document.querySelector('.workstream.active');
    const focus = activeWorkstream?.dataset.focus || 'current mission';
    const focusBody = activeWorkstream?.dataset.focusBody || 'Routing context, files, and next action.';
    const activeAgent = document.querySelector('.mission-agent.active strong');
    const activeAgentNote = document.querySelector('.mission-agent.active small');
    if (activeAgent) activeAgent.textContent = running ? 'Workspace is continuing this mission.' : `Workspace is handling ${focus.toLowerCase()}.`;
    if (activeAgentNote) activeAgentNote.textContent = running ? 'Routing context, files, and next action now.' : focusBody;
  }

  function renderMissionState(mission) {
    if (!mission || typeof mission !== 'object') return;
    setText('continueTitle', mission.title);
    setText('continueLast', mission.lastSession);
    setText('continueBody', mission.nextStep);
    setText('continueChanges', mission.changes);
    setText('continueTests', mission.tests);
    setText('continueSafety', mission.safety);
    setText('detailTitle', mission.title);
    setText('detailDescription', mission.summary);
    setText('detailFocus', mission.status === 'Ready' ? 'Ready to continue' : 'Active work in progress');
    setText('detailFocusBody', mission.nextStep);
    setText('detailRoute', mission.route);
    setText('detailStarted', mission.started);
    setText('detailProgress', `${Number(mission.progress || 0)}%`);

    const progressBar = $('detailProgressBar');
    if (progressBar) progressBar.style.width = `${clamp(Number(mission.progress || 0), 0, 100)}%`;

    document.querySelectorAll('.home-intro h2, .workstream.active .stream-title strong').forEach((node) => {
      node.textContent = mission.title || 'Current workspace';
    });
    document.querySelectorAll('.home-intro p, .workstream.active .stream-main p').forEach((node) => {
      node.textContent = mission.nextStep || mission.summary || 'Continue the current workspace.';
    });

    const active = document.querySelector('.workstream.active[data-workstream]');
    if (active) {
      active.dataset.workstream = mission.title || 'Current workspace';
      active.dataset.summary = mission.summary || '';
      active.dataset.lastSession = mission.lastSession || '';
      active.dataset.focus = mission.status || 'Ready';
      active.dataset.focusBody = mission.nextStep || '';
      active.dataset.progress = String(mission.progress || 0);
      active.dataset.route = mission.route || 'Auto';
      active.dataset.started = mission.started || 'Now';
      const status = active.querySelector('.stream-status');
      if (status) {
        status.textContent = mission.status || 'Ready';
        status.className = `stream-status ${mission.status === 'Ready' ? 'in-progress' : 'review'}`;
      }
      const promptButton = active.querySelector('button[data-workstream-prompt]');
      if (promptButton) promptButton.dataset.workstreamPrompt = mission.prompt || '';
      const meta = active.querySelectorAll('.stream-meta strong');
      if (meta[0]) meta[0].textContent = mission.changes || 'Unknown';
      if (meta[1]) {
        meta[1].textContent = mission.tests || 'On demand';
        meta[1].className = /degraded|review|verify/i.test(mission.tests || mission.safety || '') ? 'warn' : 'ok';
      }
      if (meta[2]) meta[2].textContent = mission.route || 'Auto';
    }

    document.querySelectorAll('.workstream:not(.active)').forEach((node) => {
      node.style.display = 'none';
    });

    renderMissionFeed(mission.feed);
  }

  function renderMissionFeed(feed) {
    const container = document.querySelector('.mission-feed');
    if (!container || !Array.isArray(feed) || !feed.length) return;
    container.querySelectorAll('.mission-agent').forEach((node) => node.remove());
    const preview = container.querySelector('.activity-preview');
    feed.slice(0, 5).forEach((event) => {
      const node = document.createElement('div');
      node.className = `mission-agent ${event.state || ''}`.trim();
      const orb = document.createElement('span');
      orb.className = 'agent-orb codex';
      orb.textContent = event.icon || 'W';
      const body = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = event.title || 'Workspace updated.';
      const small = document.createElement('small');
      small.textContent = event.body || '';
      body.append(title, small);
      const time = document.createElement('em');
      time.textContent = event.time || 'now';
      node.append(orb, body, time);
      container.insertBefore(node, preview || null);
    });
    if (preview) {
      const first = feed[0] || {};
      preview.querySelector('span').textContent = 'Workspace state';
      preview.querySelector('strong').textContent = first.title || 'Live state loaded';
      preview.querySelector('small').textContent = first.body || 'Mission state is derived from local signals.';
    }
  }

  function selectWorkstream(workstream) {
    document.querySelectorAll('.workstream').forEach((item) => {
      const active = item === workstream;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    setText('detailTitle', workstream.dataset.workstream);
    setText('detailDescription', workstream.dataset.summary);
    setText('detailFocus', workstream.dataset.focus);
    setText('detailFocusBody', workstream.dataset.focusBody);
    setText('detailRoute', workstream.dataset.route);
    setText('detailStarted', workstream.dataset.started);
    setText('continueTitle', workstream.dataset.workstream);
    setText('continueLast', workstream.dataset.lastSession);
    setText('continueBody', workstream.dataset.focusBody);
    setText('continueChanges', streamMeta(workstream, 'Changes'));
    setText('continueTests', streamMeta(workstream, 'Tests'));
    setText('continueSafety', safetyText(workstream));

    const progress = clamp(Number(workstream.dataset.progress || 0), 0, 100);
    setText('detailProgress', `${progress}%`);
    const progressBar = $('detailProgressBar');
    if (progressBar) progressBar.style.width = `${progress}%`;
  }

  function setText(id, value) {
    const node = $(id);
    if (node && value) node.textContent = value;
  }

  function streamMeta(workstream, label) {
    const meta = Array.from(workstream.querySelectorAll('.stream-meta')).find((item) => {
      return item.querySelector('span')?.textContent.trim() === label;
    });
    return meta?.querySelector('strong')?.textContent.trim() || '';
  }

  function safetyText(workstream) {
    const status = streamMeta(workstream, 'Tests').toLowerCase();
    if (status.includes('fail')) return 'Needs attention';
    if (status.includes('warn')) return 'Review before ship';
    return 'Safe to continue';
  }

  function clearTranscriptPrompt() {
    activePrompt = '';
  }

  function renderTranscript(title, body) {
    const result = $('result');
    result.innerHTML = '';

    if (!activePrompt && !String(body || '').trim()) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Ready.';
      result.appendChild(empty);
      return;
    }

    const panelMode = document.body.classList.contains('panel-mode');
    if (activePrompt) {
      result.appendChild(messageNode(panelMode ? 'Intent' : 'You', activePrompt, 'user'));
    }

    const cleaned = cleanOutput(title, body);
    result.appendChild(messageNode(panelMode ? 'Momentum' : title || 'AI', cleaned, 'assistant'));
    result.scrollTop = result.scrollHeight;
  }

  function messageNode(role, body, kind) {
    const node = document.createElement('article');
    node.className = `message ${kind || 'assistant'}`;

    const roleEl = document.createElement('div');
    roleEl.className = 'message-role';
    roleEl.textContent = role || 'AI';

    const bodyEl = document.createElement('div');
    bodyEl.className = 'message-body';
    bodyEl.textContent = String(body || '').trim() || '(no output)';

    node.append(roleEl, bodyEl);
    return node;
  }

  function modeLabel(mode) {
    return {
      autoRun: 'Auto',
      buildFix: 'Code',
      designBrowser: 'Design / Browser',
      researchExtract: 'Research / Extract',
      explainRoute: 'Route Preview',
    }[mode] || 'AI';
  }

  function cleanOutput(title, body) {
    const text = String(body || '').trim();
    if (!text) return '(no output)';
    const diagnostic = /route|receipt|health|status|capacity|metrics/i.test(String(title || ''));
    const cleaned = text
      .split('\n')
      .map(line => formatRouterNotice(title, line))
      .filter(line => diagnostic || !/^(Route selected|Fallback|Provider capacity|Receipt:)/i.test(line.trim()))
      .filter(Boolean)
      .join('\n');
    return cleaned || 'Momentum captured. Detailed route mechanics are available in diagnostics.';
  }

  function formatRouterNotice(title, line) {
    const trimmed = line.trim();
    if (/^Receipt:\s*\{/.test(trimmed)) return 'Receipt: recorded internally';
    if (!trimmed.startsWith('{')) return line;
    try {
      const event = JSON.parse(trimmed);
      const diagnostic = /route|receipt|health|status/i.test(String(title || ''));
      if (event.type === 'circuit_breaker_open') {
        if (!diagnostic) return '';
        const tier = event.data && event.data.tierId ? ` (${event.data.tierId})` : '';
        return `Router notice: precision lane${tier} is degraded. Auto will continue through the available fallback chain.`;
      }
      if ((event.service || event.level) && !diagnostic) return '';
      if (event.message) {
        return `Router notice: ${event.message}`;
      }
    } catch (_) {
      return line;
    }
    return line;
  }

  function deriveHealth(readiness, product, firstRun, kimi, route, providerCapacity) {
    const productKnown = /Status:\s*product-ready|Status:\s*not product-ready|Blockers:/i.test(product || '');
    const productReady = /Status:\s*product-ready/.test(product || '');
    const firstRunReady = /Status:\s*first-run-ready/.test(firstRun || '');
    const browserMode = (kimi || '').match(/mode=([^\s]+)/)?.[1] || 'unknown';
    const precisionOpen = /tier3:open|precision.*open/i.test(route || '');
    const claudeQuota = /Claude\s+quota_exhausted/i.test(providerCapacity || '');
    const providerDegraded = /status=degraded|warn/i.test(providerCapacity || '');
    if (!firstRunReady) {
      return {
        level: 'blocked',
        title: 'First-run setup blocked',
        body: 'Run First Run to see missing required tools before installing.',
      };
    }
    if (precisionOpen) {
      return {
        level: 'degraded',
        title: 'Ready, code lane degraded',
        body: 'The precision/code lane circuit is open. Use Auto mode so the router can choose a working fallback, or inspect Route Receipt.',
      };
    }
    if (claudeQuota) {
      const reset = String(providerCapacity || '').match(/resets[^\n]+/)?.[0] || 'Claude quota is exhausted.';
      return {
        level: 'degraded',
        title: 'Ready, Claude quota exhausted',
        body: `Auto fallback is working through Kimi and DeepSeek. Precision lane reset: ${reset}`,
      };
    }
    if (providerDegraded) {
      return {
        level: 'degraded',
        title: 'Ready, provider capacity degraded',
        body: 'One provider lane is degraded. Auto mode remains usable through the available fallback chain.',
      };
    }
    if (browserMode === 'shim') {
      return {
        level: 'degraded',
        title: 'Ready with browser shim',
        body: 'Daily routes are usable. Browser automation is using the shim profile, not the official logged-in Chrome extension.',
      };
    }
    if (productKnown && !productReady) {
      const blocker = (product || '').match(/Blockers:\n([\s\S]+)/)?.[1]?.split('\n').find(Boolean);
      return {
        level: 'degraded',
        title: 'Daily ready, release gate pending',
        body: blocker ? `Release cleanup: ${blocker.replace(/^- /, '')}` : 'Daily routes are usable. Run Product Readiness before packaging or release.',
      };
    }
    return {
      level: 'ready',
      title: browserMode === 'official-extension' ? 'System ready' : readiness.title,
      body: browserMode === 'official-extension'
        ? 'Daily routes, required setup, release gate, and official browser bridge are ready.'
        : readiness.body,
    };
  }

  function parseJson(text) {
    try {
      return JSON.parse(text || '{}');
    } catch (_) {
      return {};
    }
  }

  function renderContextMeter(data) {
    const used = clamp(Number(data.usedPercent || 0), 0, 100);
    const reserve = clamp(Number(data.reservedPercent || 0), 0, 100 - used);
    $('contextUsed').textContent = `${used}%`;
    $('contextAvailable').textContent = `${Number(data.availableTokens || 0).toLocaleString()}`;
    $('contextDiff').textContent = `${Number(data.diffChars || 0).toLocaleString()}`;
    $('contextStatus').textContent = data.statusText || 'No structured context data available.';
    $('contextUsedBar').style.width = `${used}%`;
    $('contextReserveBar').style.left = `${used}%`;
    $('contextReserveBar').style.width = `${reserve}%`;
    $('contextUsedBar').className = data.status === 'high' ? 'danger' : data.status === 'medium' ? 'caution' : '';
  }

  function renderStatusGrid(route, diff, context, providerCapacity) {
    const routeMatch = String(route || '').match(/Latest:\s*([^\n|]+)/);
    $('routePill').textContent = routeMatch ? routeMatch[1].trim().slice(0, 18) : 'Auto';
    const files = Number(diff.fileCount || 0);
    $('diffPill').textContent = diff.clean ? 'Clean' : `${files} file${files === 1 ? '' : 's'}`;
    const used = clamp(Number(context.usedPercent || 0), 0, 100);
    $('contextPill').textContent = `${used}%`;
    $('capacityPill').textContent = /status=full-capacity/.test(providerCapacity || '')
      ? 'Full'
      : /status=degraded|quota_exhausted|warn/.test(providerCapacity || '')
        ? 'Degraded'
        : 'Check';
  }

  function renderDiffSummary(data) {
    $('diffFiles').textContent = Number(data.fileCount || 0).toLocaleString();
    $('diffAdded').textContent = `+${Number(data.totalAdded || 0).toLocaleString()}`;
    $('diffRemoved').textContent = `-${Number(data.totalRemoved || 0).toLocaleString()}`;
    if (data.clean) {
      $('diffSummary').textContent = 'No working-tree or staged diff.';
      return;
    }
    const files = Array.isArray(data.files) ? data.files : [];
    const hunks = Array.isArray(data.hunks) ? data.hunks : [];
    const fileLines = files.slice(0, 10).map((file) => (
      `${file.scope.padEnd(8)} +${String(file.added).padStart(4)} -${String(file.removed).padStart(4)}  ${file.path}`
    ));
    const hunkLines = hunks.slice(0, 8).map((hunk) => `${hunk.scope.padEnd(8)} ${hunk.path} ${hunk.header}`);
    $('diffSummary').textContent = [
      fileLines.join('\n') || 'No file stats.',
      hunkLines.length ? `\nHunks:\n${hunkLines.join('\n')}` : '',
    ].filter(Boolean).join('\n');
  }

  function renderContextSnapshot(data) {
    const providers = Array.isArray(data.providers) ? data.providers : [];
    if (!providers.length) {
      $('contextSnapshot').textContent = 'No structured context providers available.';
      return;
    }
    $('contextSnapshot').textContent = providers.map((provider) => {
      const marker = provider.included ? 'yes' : 'no';
      const count = Array.isArray(provider.values)
        ? provider.values.length
        : provider.values && typeof provider.values === 'object'
          ? Object.keys(provider.values).length
          : provider.values ? 1 : 0;
      return `${provider.id.padEnd(12)} included=${marker.padEnd(3)} items=${String(count).padStart(3)} source=${provider.source || '-'}`;
    }).join('\n');
  }

  function renderSessions(data) {
    const sessions = Array.isArray(data.sessions) ? data.sessions : [];
    if (!sessions.length) {
      $('sessions').textContent = 'No routed sessions for this project yet.';
      return;
    }
    $('sessions').textContent = sessions.slice(0, 8).map((session) => {
      const state = session.stale ? 'stale' : 'active';
      const lane = topKey(session.classes);
      const model = topKey(session.models);
      const cwd = session.cwd ? `\n  cwd=${session.cwd}` : '';
      const transcript = session.transcript_path ? '\n  transcript=linked' : '';
      const prompt = compact(session.last_prompt || '');
      const response = compact(session.last_response || '');
      return [
        `${session.session_id} (${state})`,
        `  turns=${session.turns || 0} lane=${lane} model=${model} fallbacks=${session.fallbacks || 0} sticky=${session.sticky || 0}`,
        cwd,
        transcript,
        prompt ? `\n  Q: ${prompt}` : '',
        response ? `\n  A: ${response}` : '',
      ].join('');
    }).join('\n\n');
  }

  function renderRepoMap(data) {
    const top = Array.isArray(data.top) ? data.top : [];
    if (!top.length) {
      $('repoMap').textContent = 'No repo map available.';
      return;
    }
    const head = `files=${data.mapped_count || 0} clean=${data.clean ? 'yes' : 'no'} branch=${data.branch || '-'}`;
    const lines = top.slice(0, 12).map((file) => {
      const symbols = Array.isArray(file.symbols) && file.symbols.length
        ? ` :: ${file.symbols.slice(0, 5).join(', ')}`
        : '';
      return `${String(file.score || 0).padStart(3)} ${file.dirty ? '*' : ' '} ${String(file.lines || 0).padStart(5)} ${file.path}${symbols}`;
    });
    $('repoMap').textContent = [head, ...lines].join('\n');
  }

  function topKey(obj) {
    const entries = Object.entries(obj || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
    return entries[0] ? entries[0][0] : '-';
  }

  function compact(value) {
    return String(value).replace(/\s+/g, ' ').slice(0, 120);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}());
