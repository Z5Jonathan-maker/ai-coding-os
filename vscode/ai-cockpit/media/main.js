(function () {
  const vscode = acquireVsCodeApi();
  const $ = (id) => document.getElementById(id);
  let selectedMode = 'buildFix';
  let contextBlock = '';
  let attached = [];

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
      return;
    }

    const button = event.target.closest('button[data-command]');
    if (button) {
      vscode.postMessage({ command: button.dataset.command });
      return;
    }

    const runButton = event.target.closest('button[data-run]');
    if (runButton) {
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
    vscode.postMessage({
      command: 'inline',
      name: inlineButton.dataset.inlineName,
      commandLine: inlineButton.dataset.inlineCommand,
    });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
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
      $('readinessBody').textContent = 'Checking live routes, permissions, checkpoints, and disk gate.';
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

    const { readiness, context, route, metrics, permissions, checkpoints, disk, product, firstRun, contextMeter, contextMeterJson, diffSummary, sessions, pulse, nativeApps, kimi } = message.payload;
    const health = deriveHealth(readiness, product, firstRun, kimi);
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
    renderDiffSummary(parseJson(diffSummary));
    $('sessions').textContent = sessions || 'No session ledger available.';
    $('pulse').textContent = pulse || 'No Pulse status available.';
    $('nativeApps').textContent = nativeApps || 'No native app status available.';
    $('kimi').textContent = kimi || 'No Kimi status available.';
    $('jobs').textContent = message.payload.jobs || 'No jobs available.';
    $('lanes').textContent = message.payload.lanes || 'No lane registry available.';
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type !== 'result') return;
    $('resultTitle').textContent = message.payload.title || 'Last Result';
    $('result').textContent = message.payload.body || '(no output)';
  });

  function deriveHealth(readiness, product, firstRun, kimi) {
    const productReady = /Status:\s*product-ready/.test(product || '');
    const firstRunReady = /Status:\s*first-run-ready/.test(firstRun || '');
    const browserMode = (kimi || '').match(/mode=([^\s]+)/)?.[1] || 'unknown';
    if (!productReady) {
      const blocker = (product || '').match(/Blockers:\n([\s\S]+)/)?.[1]?.split('\n').find(Boolean);
      return {
        level: 'blocked',
        title: 'Product gate blocked',
        body: blocker ? `Fix first: ${blocker.replace(/^- /, '')}` : (readiness.body || 'Run Product Readiness for details.'),
      };
    }
    if (!firstRunReady) {
      return {
        level: 'blocked',
        title: 'First-run setup blocked',
        body: 'Run First Run to see missing required tools before installing.',
      };
    }
    if (browserMode === 'shim') {
      return {
        level: 'degraded',
        title: 'Ready with browser shim',
        body: 'Product gate is green. Browser automation is using the shim profile, not the official logged-in Chrome extension.',
      };
    }
    return {
      level: 'ready',
      title: browserMode === 'official-extension' ? 'System ready' : readiness.title,
      body: browserMode === 'official-extension'
        ? 'Product gate, first-run doctor, and official browser bridge are ready.'
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}());
