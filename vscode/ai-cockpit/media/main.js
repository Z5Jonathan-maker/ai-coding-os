(function () {
  const vscode = acquireVsCodeApi();
  const $ = (id) => document.getElementById(id);
  let selectedMode = 'autoRun';
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

  document.addEventListener('click', (event) => {
    const modeButton = event.target.closest('button[data-mode]');
    if (modeButton) {
      selectedMode = modeButton.dataset.mode;
      document.querySelectorAll('button[data-mode]').forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === selectedMode);
      });
      const summary = document.querySelector('.mode-drawer summary');
      if (summary) summary.textContent = `Mode: ${modeButton.textContent}`;
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
      startTranscript(runButton.dataset.run, $('prompt').value);
      vscode.postMessage({
        command: 'runPrompt',
        mode: runButton.dataset.run,
        prompt: $('prompt').value,
        includeContext: $('includeContext').checked,
        contextBlock: fullContext(),
      });
      return;
    }

    const selectedRun = event.target.closest('button[data-run-selected]');
    if (selectedRun) {
      startTranscript(selectedMode, $('prompt').value);
      vscode.postMessage({
        command: 'runPrompt',
        mode: selectedMode,
        prompt: $('prompt').value,
        includeContext: $('includeContext').checked,
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
      startTranscript(selectedMode, $('prompt').value);
      vscode.postMessage({
        command: 'runPrompt',
        mode: selectedMode,
        prompt: $('prompt').value,
        includeContext: $('includeContext').checked,
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

    const { readiness, context, route, metrics, permissions, checkpoints, disk, product, firstRun, contextMeter, contextMeterJson, contextSnapshot, diffSummary, sessions, pulse, nativeApps, kimi, repoMap } = message.payload;
    const health = deriveHealth(readiness, product, firstRun, kimi, route);
    contextBlock = context && context.block ? context.block : '';
    $('readinessTitle').textContent = health.title;
    $('readinessBody').textContent = health.body;
    $('context').textContent = context && context.label ? context.label : 'No active editor';
    $('statusDot').classList.toggle('warn', health.level === 'blocked');
    $('statusDot').classList.toggle('degraded', health.level === 'degraded');
    $('route').textContent = route || 'No route receipt available.';
    $('metrics').textContent = metrics || 'No router metrics available.';
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
    renderStatusGrid(route, parseJson(diffSummary), parseJson(contextMeterJson), kimi);
    renderRepoMap(parseJson(repoMap));
    $('jobs').textContent = message.payload.jobs || 'No jobs available.';
    $('lanes').textContent = message.payload.lanes || 'No lane registry available.';
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type !== 'result') return;
    $('resultTitle').textContent = message.payload.title || 'Last Result';
    $('result').textContent = formatTranscript(message.payload.title, message.payload.body);
  });

  function startTranscript(mode, prompt) {
    activePrompt = String(prompt || '').trim();
    if (!activePrompt) return;
    $('resultTitle').textContent = 'Working';
    $('result').textContent = formatTranscript(modeLabel(mode), 'Running...');
  }

  function clearTranscriptPrompt() {
    activePrompt = '';
  }

  function formatTranscript(title, body) {
    const prompt = activePrompt ? `You\n${activePrompt}\n\n` : '';
    return `${prompt}${title || 'AI'}\n${cleanOutput(title, body)}`;
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
    return text
      .split('\n')
      .map(line => formatRouterNotice(title, line))
      .filter(Boolean)
      .join('\n');
  }

  function formatRouterNotice(title, line) {
    const trimmed = line.trim();
    if (/^Receipt:\s*\{/.test(trimmed)) return 'Receipt: recorded internally';
    if (!trimmed.startsWith('{')) return line;
    try {
      const event = JSON.parse(trimmed);
      if (event.type === 'circuit_breaker_open') {
        if (!/route|receipt|health|status/i.test(String(title || ''))) return '';
        const tier = event.data && event.data.tierId ? ` (${event.data.tierId})` : '';
        return `Router notice: precision lane${tier} is degraded. Auto will continue through the available fallback chain.`;
      }
      if (event.level === 'warn' && event.message) {
        if (!/route|receipt|health|status/i.test(String(title || ''))) return '';
        return `Router notice: ${event.message}`;
      }
    } catch (_) {
      return line;
    }
    return line;
  }

  function deriveHealth(readiness, product, firstRun, kimi, route) {
    const productKnown = /Status:\s*product-ready|Status:\s*not product-ready|Blockers:/i.test(product || '');
    const productReady = /Status:\s*product-ready/.test(product || '');
    const firstRunReady = /Status:\s*first-run-ready/.test(firstRun || '');
    const browserMode = (kimi || '').match(/mode=([^\s]+)/)?.[1] || 'unknown';
    const precisionOpen = /tier3:open|precision.*open/i.test(route || '');
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

  function renderStatusGrid(route, diff, context, kimi) {
    const routeMatch = String(route || '').match(/Latest:\s*([^\n|]+)/);
    $('routePill').textContent = routeMatch ? routeMatch[1].trim().slice(0, 18) : 'Auto';
    const files = Number(diff.fileCount || 0);
    $('diffPill').textContent = diff.clean ? 'Clean' : `${files} file${files === 1 ? '' : 's'}`;
    const used = clamp(Number(context.usedPercent || 0), 0, 100);
    $('contextPill').textContent = `${used}%`;
    const browserMode = (kimi || '').match(/mode=([^\s]+)/)?.[1] || '';
    $('browserPill').textContent = browserMode === 'official-extension'
      ? 'Ready'
      : browserMode === 'shim'
        ? 'Shim'
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
