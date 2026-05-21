(function () {
  const vscode = acquireVsCodeApi();
  const $ = (id) => document.getElementById(id);
  let selectedMode = 'buildFix';
  let contextBlock = '';

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
        contextBlock,
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
        contextBlock,
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
        contextBlock,
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
    if (message.type !== 'state') return;

    const { readiness, context, route, metrics, permissions, checkpoints, disk, product } = message.payload;
    contextBlock = context && context.block ? context.block : '';
    $('readinessTitle').textContent = readiness.title;
    $('readinessBody').textContent = readiness.body;
    $('context').textContent = context && context.label ? context.label : 'No active editor';
    $('statusDot').classList.toggle('warn', !readiness.ok);
    $('route').textContent = route || 'No route receipt available.';
    $('metrics').textContent = metrics || 'No router metrics available.';
    $('permissions').textContent = permissions || 'No permission matrix available.';
    $('checkpoints').textContent = checkpoints || 'No checkpoints available.';
    $('disk').textContent = disk || 'No disk readiness report available.';
    $('product').textContent = product || 'No product readiness report available.';
    $('jobs').textContent = message.payload.jobs || 'No jobs available.';
    $('lanes').textContent = message.payload.lanes || 'No lane registry available.';
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type !== 'result') return;
    $('resultTitle').textContent = message.payload.title || 'Last Result';
    $('result').textContent = message.payload.body || '(no output)';
  });
}());
