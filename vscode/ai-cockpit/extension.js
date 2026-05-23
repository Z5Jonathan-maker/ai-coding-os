'use strict';

const vscode = require('vscode');
const cp = require('child_process');
const os = require('os');
const path = require('path');

const COMMANDS = {
  status: 'cc-cockpit-status',
  systemDemo: 'cc-system-demo',
  routeReceipt: 'cc-router-receipt',
  routerMetrics: 'cc-router-metrics',
  providerCapacity: 'cc-provider-capacity',
  permissionMatrix: 'cc-permission-matrix',
  checkpoints: 'cc-checkpoints',
  loopQuality: 'cc-loop-quality',
  diskReadiness: 'cc-disk-readiness',
  productReadiness: 'cc-product-readiness',
  firstRun: 'cc-first-run',
  contextMeter: 'cc-context-meter --include-diff',
  contextMeterJson: 'cc-context-meter --json --include-diff',
  contextSnapshot: 'cc-context-snapshot --json',
  sessionLedger: 'cc-session-ledger list 10 --json',
  pulseStatus: 'cc-pulse-status',
  nativeAppStatus: 'cc-native-app-status',
  kimiStatus: 'cc-kimi-status',
  repoMap: 'cc-repo-map --json 12',
  repoIndex: 'cc-repo-index',
  semanticIndex: 'cc-semantic-index',
  diffHunks: 'cc-diff-hunks',
  diffHunksJson: 'cc-diff-hunks --json',
  workflowProof: 'cc-workflow-proof',
  browserProof: 'cc-browser-proof',
  fiveMinuteDemo: 'cc-demo-five-minute --browser-url "data:text/html,%3Ctitle%3EAI%20Cockpit%20Demo%3C/title%3E%3Cbody%3Ecockpit%20demo%20mode%20proof%3C/body%3E" --max-chars 1200',
  reviewDiff: 'cc-review-diff',
  jobs: 'cc-jobs',
};

const ACTIONS = [
  ['autoRun', 'Auto', null],
  ['buildFix', 'Code', null],
  ['designBrowser', 'Design / Browser', 'design'],
  ['researchExtract', 'Research / Extract', 'cheap'],
];

function activate(context) {
  const output = vscode.window.createOutputChannel('AI Cockpit');
  const provider = new CockpitProvider(context.extensionUri, output);
  const panel = new CockpitPanel(context.extensionUri, output);
  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 92);

  context.subscriptions.push(
    output,
    statusItem,
    vscode.window.registerWebviewViewProvider('aiSystemCockpit.dashboard', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    command('aiSystemCockpit.open', () => panel.open()),
    command('aiSystemCockpit.refresh', () => provider.refresh()),
    command('aiSystemCockpit.status', () => showOutput(output, 'Status', COMMANDS.status)),
    command('aiSystemCockpit.systemDemo', () => showOutput(output, 'System Demo', COMMANDS.systemDemo)),
    command('aiSystemCockpit.routeReceipt', () => showOutput(output, 'Route Receipt', COMMANDS.routeReceipt)),
    command('aiSystemCockpit.routerMetrics', () => showOutput(output, 'Router Metrics', COMMANDS.routerMetrics)),
    command('aiSystemCockpit.providerCapacity', () => showOutput(output, 'Provider Capacity', COMMANDS.providerCapacity)),
    command('aiSystemCockpit.permissionMatrix', () => showOutput(output, 'Permission Matrix', COMMANDS.permissionMatrix)),
    command('aiSystemCockpit.checkpoints', () => showOutput(output, 'Checkpoints', COMMANDS.checkpoints)),
    command('aiSystemCockpit.loopQuality', () => showOutput(output, 'Loop Quality', COMMANDS.loopQuality)),
    command('aiSystemCockpit.diskReadiness', () => showOutput(output, 'Disk Readiness', COMMANDS.diskReadiness)),
    command('aiSystemCockpit.productReadiness', () => showOutput(output, 'Product Readiness', COMMANDS.productReadiness)),
    command('aiSystemCockpit.firstRun', () => showOutput(output, 'First Run Doctor', COMMANDS.firstRun)),
    command('aiSystemCockpit.contextMeter', () => showOutput(output, 'Context Meter', COMMANDS.contextMeter)),
    command('aiSystemCockpit.contextSnapshot', () => showOutput(output, 'Context Snapshot', COMMANDS.contextSnapshot)),
    command('aiSystemCockpit.sessionLedger', () => showOutput(output, 'Session Ledger', COMMANDS.sessionLedger)),
    command('aiSystemCockpit.pulseStatus', () => showOutput(output, 'Pulse Status', COMMANDS.pulseStatus)),
    command('aiSystemCockpit.nativeAppStatus', () => showOutput(output, 'Native App Status', COMMANDS.nativeAppStatus)),
    command('aiSystemCockpit.kimiStatus', () => showOutput(output, 'Kimi Status', COMMANDS.kimiStatus)),
    command('aiSystemCockpit.repoMap', () => showOutput(output, 'Repo Map', 'cc-repo-map 30')),
    command('aiSystemCockpit.repoIndex', () => showOutput(output, 'Repo Index', COMMANDS.repoIndex)),
    command('aiSystemCockpit.semanticIndex', () => showOutput(output, 'Semantic Index', COMMANDS.semanticIndex)),
    command('aiSystemCockpit.diffHunks', () => showOutput(output, 'Diff Hunks', COMMANDS.diffHunks)),
    command('aiSystemCockpit.workflowProof', () => showOutput(output, 'Workflow Proof', COMMANDS.workflowProof)),
    command('aiSystemCockpit.browserProof', () => showOutput(output, 'Browser Proof', COMMANDS.browserProof)),
    command('aiSystemCockpit.fiveMinuteDemo', () => provider.runInlineStream('Five-Minute Demo', COMMANDS.fiveMinuteDemo)),
    command('aiSystemCockpit.jobs', () => showOutput(output, 'Jobs', COMMANDS.jobs)),
    command('aiSystemCockpit.reviewDiff', () => provider.runInlineStream('Review Diff', COMMANDS.reviewDiff)),
    command('aiSystemCockpit.openSettings', () => vscode.commands.executeCommand('workbench.action.openSettings', 'aiSystemCockpit')),
    command('aiSystemCockpit.explainRoute', explainRoute),
    command('aiSystemCockpit.savePlan', savePlan),
    ...ACTIONS.map(([id, label, purpose]) => command(`aiSystemCockpit.${id}`, () => routerAsk(label, purpose))),
    vscode.window.onDidChangeActiveTextEditor(() => {
      provider.refreshContext();
      panel.refreshContext();
    }),
    vscode.window.onDidChangeTextEditorSelection(() => {
      provider.refreshContext();
      panel.refreshContext();
    })
  );

  if (vscode.workspace.getConfiguration('aiSystemCockpit').get('showStatusBarButton', true)) {
    statusItem.command = 'aiSystemCockpit.open';
    statusItem.text = '$(dashboard) AI Cockpit';
    statusItem.tooltip = 'Open AI System Cockpit';
    statusItem.show();
    context.subscriptions.push(refreshStatus(statusItem));
  }

  if (vscode.workspace.getConfiguration('aiSystemCockpit').get('openOnStartup', false)) {
    setTimeout(() => {
      try {
        panel.open();
      } catch (error) {
        output.appendLine(`startup open failed: ${error?.message || error}`);
      }
    }, 1800);
  }
}

function deactivate() {}

function command(id, fn) {
  return vscode.commands.registerCommand(id, fn);
}

function cwd() {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || os.homedir();
}

function shellExec(cmd, options = {}) {
  return new Promise((resolve) => {
    cp.execFile('/bin/zsh', ['-lc', cmd], {
      cwd: options.cwd || cwd(),
      timeout: options.timeout || 30000,
      maxBuffer: options.maxBuffer || 1024 * 1024 * 4,
      env: { ...process.env, ...options.env },
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code || 0,
        stdout: stdout || '',
        stderr: stderr || '',
        text: `${stdout || ''}${stderr || ''}`.trim(),
      });
    });
  });
}

function runTerminal(name, commandLine) {
  const terminal = vscode.window.createTerminal({ name, cwd: cwd() });
  terminal.show();
  terminal.sendText(commandLine);
}

async function showOutput(output, title, commandLine) {
  output.clear();
  output.show(true);
  output.appendLine(`## ${title}`);
  output.appendLine(`$ ${commandLine}`);
  output.appendLine('');
  const result = await shellExec(commandLine, { timeout: 120000 });
  output.appendLine(result.text || '(no output)');
  if (!result.ok) vscode.window.showWarningMessage(`${title} exited with code ${result.code}`);
}

async function askPrompt(placeHolder) {
  return vscode.window.showInputBox({
    prompt: 'Describe the work request',
    placeHolder,
    ignoreFocusOut: true,
  });
}

async function explainRoute() {
  const prompt = await askPrompt('e.g. debug this auth bug and verify tests');
  if (!prompt) return;
  runTerminal('AI Explain Route', `~/AI-SYSTEM-V2/scripts/intent-route.sh --dry-run ${quote(prompt)}`);
}

async function savePlan() {
  const prompt = await askPrompt('e.g. add a local SEO page and verify sitemap');
  if (!prompt) return;
  runTerminal('AI Save Plan', `cc-plan ${quote(prompt)}`);
}

async function routerAsk(label, purpose) {
  const prompt = await askPrompt(label);
  if (!prompt) return;
  runRouterPrompt(label, purpose, prompt);
}

function runRouterPrompt(label, purpose, prompt) {
  const force = purpose ? `--purpose ${quote(purpose)} ` : '';
  const routedPrompt = purpose ? prompt : `${label.toLowerCase()} task: ${prompt}`;
  runTerminal(`AI ${label}`, `router-ask ${force}${quote(routedPrompt)}`);
}

function quote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function routerAskCommand(purpose, routeTask, runTask) {
  if (purpose) return `router-ask --purpose ${quote(purpose)} ${quote(runTask)}`;
  const parseReceipt = [
    'try {',
    'const r = JSON.parse(process.argv[1] || "{}");',
    'process.stdout.write(r.final_class || "precision");',
    '} catch (_) { process.stdout.write("precision"); }',
  ].join(' ');
  return [
    `ROUTE_RECEIPT=$(router-ask --dry-run ${quote(routeTask)} 2>/dev/null | sed -n 's/^  Receipt:   //p' | tail -1)`,
    `PURPOSE=$(node -e ${quote(parseReceipt)} "$ROUTE_RECEIPT")`,
    `router-ask --purpose "$PURPOSE" ${quote(runTask)}`,
  ].join('\n');
}

function refreshStatus(item) {
  const update = async () => {
    const result = await shellExec('cc-cockpit-status | sed -n "1,14p"', { timeout: 15000 });
    item.text = /FAIL/.test(result.text) ? '$(warning) AI Cockpit' : '$(pass) AI Cockpit';
    item.tooltip = result.text || 'AI Cockpit status unavailable';
  };
  const timer = setInterval(async () => {
    await update();
  }, 60000);
  update();
  return { dispose: () => clearInterval(timer) };
}

class CockpitProvider {
  constructor(extensionUri, output) {
    this.extensionUri = extensionUri;
    this.output = output;
    this.contextTimer = null;
    this.activeRun = null;
    this.refreshNonce = 0;
  }

  resolveWebviewView(view) {
    this.view = view;
    view.webview.options = { enableScripts: true };
    view.webview.html = this.html(view.webview, 'sidebar');
    view.webview.onDidReceiveMessage((message) => this.handle(message));
    this.refresh();
  }

  async refresh() {
    if (!this.view) return;
    const nonce = ++this.refreshNonce;
    this.view.webview.postMessage({ type: 'loading' });
    const deferred = 'Not loaded on startup. Open this report to run the full check.';
    const [status, receipt, firstRun, contextMeter, contextMeterJson, diffSummary, kimi] = await Promise.all([
      shellExec('cc-cockpit-status | sed -n "1,26p"', { timeout: 20000 }),
      shellExec('cc-router-receipt --summary', { timeout: 12000 }),
      shellExec('cc-first-run | sed -n "1,70p"', { timeout: 20000 }),
      shellExec('cc-context-meter --include-diff | sed -n "1,16p"', { timeout: 12000 }),
      shellExec(COMMANDS.contextMeterJson, { timeout: 12000 }),
      shellExec(COMMANDS.diffHunksJson, { timeout: 12000 }),
      shellExec('cc-kimi-status | sed -n "1,22p"', { timeout: 12000 }),
    ]);

    const payload = {
      readiness: summarizeReadiness(status.text),
      context: editorContext(),
      route: receipt.text,
      metrics: deferred,
      providerCapacity: 'Checking live provider capacity...',
      permissions: deferred,
      checkpoints: deferred,
      disk: deferred,
      product: deferred,
      firstRun: firstRun.text,
      contextMeter: contextMeter.text,
      contextMeterJson: contextMeterJson.text,
      contextSnapshot: '{}',
      diffSummary: diffSummary.text,
      sessions: '{}',
      pulse: deferred,
      nativeApps: deferred,
      kimi: kimi.text,
      repoMap: '{}',
      jobs: deferred,
      lanes: deferred,
    };

    this.view.webview.postMessage({
      type: 'state',
      payload,
    });
    shellExec('cc-provider-capacity | sed -n "1,30p"', { timeout: 45000 }).then((providerCapacity) => {
      if (!this.view || nonce !== this.refreshNonce) return;
      this.view.webview.postMessage({
        type: 'state',
        payload: {
          ...payload,
          providerCapacity: providerCapacity.text || 'Provider capacity unavailable.',
        },
      });
    });
  }

  refreshContext() {
    clearTimeout(this.contextTimer);
    this.contextTimer = setTimeout(() => {
      if (!this.view) return;
      this.view.webview.postMessage({
        type: 'context',
        payload: editorContext(),
      });
    }, 80);
  }

  handle(message) {
    const commands = {
      refresh: () => this.refresh(),
      status: () => vscode.commands.executeCommand('aiSystemCockpit.status'),
      systemDemo: () => vscode.commands.executeCommand('aiSystemCockpit.systemDemo'),
      routeReceipt: () => vscode.commands.executeCommand('aiSystemCockpit.routeReceipt'),
      routerMetrics: () => vscode.commands.executeCommand('aiSystemCockpit.routerMetrics'),
      providerCapacity: () => vscode.commands.executeCommand('aiSystemCockpit.providerCapacity'),
      permissionMatrix: () => vscode.commands.executeCommand('aiSystemCockpit.permissionMatrix'),
      checkpoints: () => vscode.commands.executeCommand('aiSystemCockpit.checkpoints'),
      loopQuality: () => vscode.commands.executeCommand('aiSystemCockpit.loopQuality'),
      diskReadiness: () => vscode.commands.executeCommand('aiSystemCockpit.diskReadiness'),
      productReadiness: () => vscode.commands.executeCommand('aiSystemCockpit.productReadiness'),
      firstRun: () => vscode.commands.executeCommand('aiSystemCockpit.firstRun'),
      contextMeter: () => vscode.commands.executeCommand('aiSystemCockpit.contextMeter'),
      contextSnapshot: () => vscode.commands.executeCommand('aiSystemCockpit.contextSnapshot'),
      sessionLedger: () => vscode.commands.executeCommand('aiSystemCockpit.sessionLedger'),
      pulseStatus: () => vscode.commands.executeCommand('aiSystemCockpit.pulseStatus'),
      nativeAppStatus: () => vscode.commands.executeCommand('aiSystemCockpit.nativeAppStatus'),
      kimiStatus: () => vscode.commands.executeCommand('aiSystemCockpit.kimiStatus'),
      repoMap: () => vscode.commands.executeCommand('aiSystemCockpit.repoMap'),
      repoIndex: () => vscode.commands.executeCommand('aiSystemCockpit.repoIndex'),
      semanticIndex: () => vscode.commands.executeCommand('aiSystemCockpit.semanticIndex'),
      diffHunks: () => vscode.commands.executeCommand('aiSystemCockpit.diffHunks'),
      workflowProof: () => vscode.commands.executeCommand('aiSystemCockpit.workflowProof'),
      browserProof: () => vscode.commands.executeCommand('aiSystemCockpit.browserProof'),
      fiveMinuteDemo: () => vscode.commands.executeCommand('aiSystemCockpit.fiveMinuteDemo'),
      jobs: () => vscode.commands.executeCommand('aiSystemCockpit.jobs'),
      openSettings: () => vscode.commands.executeCommand('aiSystemCockpit.openSettings'),
      openPanel: () => vscode.commands.executeCommand('aiSystemCockpit.open'),
      explainRoute: () => vscode.commands.executeCommand('aiSystemCockpit.explainRoute'),
      autoRun: () => vscode.commands.executeCommand('aiSystemCockpit.autoRun'),
      buildFix: () => vscode.commands.executeCommand('aiSystemCockpit.buildFix'),
      designBrowser: () => vscode.commands.executeCommand('aiSystemCockpit.designBrowser'),
      researchExtract: () => vscode.commands.executeCommand('aiSystemCockpit.researchExtract'),
      savePlan: () => vscode.commands.executeCommand('aiSystemCockpit.savePlan'),
      reviewDiff: () => vscode.commands.executeCommand('aiSystemCockpit.reviewDiff'),
      stopRun: () => this.stopActiveRun(),
      copyResult: () => vscode.env.clipboard.writeText(String(message.text || '')),
    };
    if (message.command === 'runPrompt') {
      this.runPrompt(
        message.mode,
        message.prompt,
        Boolean(message.includeContext),
        message.contextBlock || '',
        message.permissionMode || 'review'
      );
      return;
    }
    if (message.command === 'inline') {
      this.runInlineStream(message.name, message.commandLine);
      return;
    }
    if (message.command === 'pickFile') {
      this.pickFileContext();
      return;
    }
    if (message.command === 'attachDiff') {
      this.attachDiffContext();
      return;
    }
    commands[message.command]?.();
  }

  async runInline(name, commandLine) {
    if (!this.view) return;
    this.view.webview.postMessage({
      type: 'result',
      payload: { title: name || 'Running', body: 'Running...' },
    });
    const result = await shellExec(commandLine, { timeout: 120000 });
    this.view.webview.postMessage({
      type: 'result',
      payload: {
        title: `${name || 'Result'}${result.ok ? '' : ` (exit ${result.code})`}`,
        body: result.text || '(no output)',
      },
    });
  }

  runInlineStream(name, commandLine) {
    if (!this.view) return;
    this.stopActiveRun(false);
    this.view.webview.postMessage({
      type: 'result',
      payload: { title: name || 'Running', body: 'Running...', running: true },
    });
    const child = cp.spawn('/bin/zsh', ['-lc', commandLine], {
      cwd: cwd(),
      env: process.env,
    });
    const run = {
      child,
      title: name || 'Running',
      body: '',
      stopped: false,
    };
    this.activeRun = run;
    const push = (chunk) => {
      run.body = `${run.body}${chunk}`.slice(-60000);
      if (!this.view) return;
      this.view.webview.postMessage({
        type: 'result',
        payload: { title: run.title, body: run.body || 'Running...', running: true },
      });
    };
    child.stdout.on('data', data => push(data.toString()));
    child.stderr.on('data', data => push(data.toString()));
    child.on('error', error => push(`\n${error.message}`));
    child.on('close', code => {
      if (this.activeRun !== run) return;
      this.activeRun = null;
      const stopped = run.stopped;
      if (!this.view) return;
      this.view.webview.postMessage({
        type: 'result',
        payload: {
          title: stopped ? `${run.title} (stopped)` : `${run.title}${code === 0 ? '' : ` (exit ${code})`}`,
          body: stopped ? `${run.body || '(no output)'}\n\nStopped by user.` : run.body || '(no output)',
          running: false,
        },
      });
    });
  }

  stopActiveRun(showStopped = true) {
    if (!this.activeRun) return;
    const run = this.activeRun;
    run.stopped = true;
    if (showStopped && this.view) {
      this.view.webview.postMessage({
        type: 'result',
        payload: {
          title: `${run.title} (stopping)`,
          body: `${run.body || 'Stopping current run...'}\n\nStopping current run...`,
          running: true,
        },
      });
    }
    run.child.kill('SIGTERM');
  }

  async pickFileContext() {
    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,dist,.next,build,coverage}/**', 600);
    const picked = await vscode.window.showQuickPick(
      files.map(uri => ({ label: vscode.workspace.asRelativePath(uri), uri })),
      { placeHolder: 'Attach a file as cockpit context' }
    );
    if (!picked || !this.view) return;
    const doc = await vscode.workspace.openTextDocument(picked.uri);
    const text = doc.getText().slice(0, 12000);
    this.view.webview.postMessage({
      type: 'appendContext',
      payload: {
        label: picked.label,
        block: `\n\nAttached file ${picked.label}:\n\`\`\`\n${text}\n\`\`\``,
      },
    });
  }

  async attachDiffContext() {
    if (!this.view) return;
    const result = await shellExec('git diff -- . | head -c 12000', { timeout: 20000 });
    this.view.webview.postMessage({
      type: 'appendContext',
      payload: {
        label: 'git diff',
        block: `\n\nAttached git diff:\n\`\`\`diff\n${result.text || '(no diff)'}\n\`\`\``,
      },
    });
  }

  runPrompt(mode, prompt, includeContext = false, contextBlock = '', permissionMode = 'review') {
    const clean = String(prompt || '').trim();
    if (!clean) {
      vscode.window.showInformationMessage('Enter a prompt in the AI Cockpit first.');
      return;
    }
    const permission = permissionInstruction(permissionMode);
    const routeTask = includeContext && contextBlock ? `${clean}${contextBlock}` : clean;
    const runTask = permission
      ? `${routeTask}\n\n---\nCOCKPIT RUN POLICY\n${permission}`
      : routeTask;
    if (mode === 'explainRoute') {
      this.runInlineStream('Explain Route', `~/AI-SYSTEM-V2/scripts/intent-route.sh --dry-run ${quote(routeTask)}`);
      return;
    }
    if (mode === 'savePlan') {
      runTerminal('AI Save Plan', `cc-plan ${quote(runTask)}`);
      return;
    }
    const modes = {
      autoRun: ['Auto', null],
      buildFix: ['Code', null],
      designBrowser: ['Design / Browser', 'design'],
      researchExtract: ['Research / Extract', 'cheap'],
    };
    const [label, purpose] = modes[mode] || modes.buildFix;
    this.runInlineStream(label, routerAskCommand(purpose, routeTask, runTask));
  }

  html(webview, variant = 'sidebar') {
    const nonce = String(Date.now());
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'style.css'));
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'main.js'));
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
  <title>AI Cockpit</title>
</head>
<body class="${variant}-mode">
  <aside class="workspace-rail" aria-label="Cockpit navigation">
    <div class="rail-brand">
      <img src="${webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'cockpit.svg'))}" alt="" class="rail-mark">
      <div>
        <strong>cc-cockpit</strong>
        <span>Local mode</span>
      </div>
    </div>
    <nav class="rail-nav">
      <button class="active"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"/></svg><span>Home</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 4v16"/></svg><span>Workspaces</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6l5-3-5-3Z"/><path d="M6 21v-6l-5 3 5 3Z"/><path d="M18 21v-6l5 3-5 3Z"/><path d="M12 9v3M8 16l4-4 4 4"/></svg><span>Agents</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 10h16"/></svg><span>Browser</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 4-4 16"/></svg><span>Code</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="m8 15 2.5-3 2 2.4L15 11l1 4"/></svg><span>Assets</span></button>
      <button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/></svg><span>Knowledge</span></button>
    </nav>
    <div class="rail-status">
      <span>System status</span>
      <strong><i></i><span id="railStatusLabel">Ready</span></strong>
    </div>
  </aside>

  <section class="topbar" aria-label="Global actions">
    <button class="askbar">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4-4m0 0 4 4M9 8v8"/><path d="M15 8h4v4"/></svg>
      <span>Ask anything...</span>
      <kbd>cmd K</kbd>
    </button>
    <div class="top-actions">
      <button class="focus-button">Focus</button>
      <button class="round-button" data-command="refresh" title="Refresh" aria-label="Refresh cockpit">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3"/><path d="M17.7 3.5v2.8h-2.8M6.3 20.5v-2.8h2.8"/></svg>
      </button>
      <button class="user-orb" aria-label="Profile">J</button>
    </div>
  </section>

  <header>
    <div class="brand-lockup">
      <img src="${webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'cockpit.svg'))}" alt="" class="brand-mark">
      <div>
        <div class="eyebrow">AI-SYSTEM-V2</div>
        <h1>AI Cockpit</h1>
        <p class="brand-subtitle">Router control surface</p>
      </div>
    </div>
    <button class="icon-button" data-command="refresh" title="Refresh" aria-label="Refresh cockpit">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3"/><path d="M17.7 3.5v2.8h-2.8M6.3 20.5v-2.8h2.8"/></svg>
    </button>
  </header>

  <section class="hero">
    <div class="status-dot" id="statusDot"></div>
    <div>
      <strong id="readinessTitle">Checking readiness</strong>
      <p id="readinessBody">Loading routes, setup, provider circuits, and disk gate.</p>
    </div>
  </section>

  <button class="open-panel-button" data-command="openPanel">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M9 5v14"/><path d="M15 11l3 3-3 3"/></svg>
    <span>Open Full Cockpit</span>
  </button>

  <section class="home-intro">
    <div>
      <span class="mission-kicker">Current mission</span>
      <h2>DoseCraft landing page</h2>
      <p>Continue the responsive pricing section. Routing, files, browser context, and design references are already staged.</p>
    </div>
    <div class="home-actions">
      <button class="focus-button">Focus</button>
      <button class="mini-button" data-command="refresh" title="Refresh" aria-label="Refresh cockpit">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3"/><path d="M17.7 3.5v2.8h-2.8M6.3 20.5v-2.8h2.8"/></svg>
      </button>
    </div>
  </section>

  <section class="composer">
    <div class="composer-head">
      <label for="prompt">Command</label>
      <span id="context">No active editor</span>
    </div>
    <div class="continuation-copy">
      <span>Ready to continue</span>
      <h3 id="continueTitle">Build the responsive pricing section.</h3>
      <p id="continueBody">Codex will edit the component, Kimi will verify the browser preview, and the gate will run after changes settle.</p>
    </div>
    <div class="continuation-signals" aria-label="Continuation signals">
      <span id="continueChanges">8 files staged</span>
      <span id="continueTests">Tests passing</span>
      <span id="continueRoute">Codex - Kimi</span>
    </div>
    <textarea id="prompt" rows="5" placeholder="Add a direction, or press Continue mission."></textarea>
    <div class="chips" id="chips"></div>
    <div class="composer-pills" aria-label="Primary context controls">
      <button class="pill active" data-mode="autoRun" aria-pressed="true"><span>Auto</span><small>Intelligent</small></button>
      <button class="pill" data-command="pickFile"><span>Attach</span><small>Files</small></button>
      <button class="pill" data-command="attachDiff"><span>Context</span><small>Diff + file</small></button>
    </div>
    <div class="runrow">
      <button class="primary command-button" data-run-selected="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg><span>Continue mission</span></button>
      <button class="secondary command-button" data-run="explainRoute"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h5l2 3h9"/><path d="M4 17h5l2-3h9"/><path d="M17 7l3 3-3 3"/><path d="M17 11l3 3-3 3"/></svg><span>Preview Route</span></button>
    </div>
    <section class="control-deck" aria-label="Cockpit controls">
      <div class="control-group">
        <div class="control-label" id="modeSummary">Mode: Auto</div>
        <div class="modebar" role="group" aria-label="Mode">
          <button class="mode active" data-mode="autoRun" aria-pressed="true">Auto</button>
          <button class="mode" data-mode="buildFix" aria-pressed="false">Code</button>
          <button class="mode" data-mode="designBrowser" aria-pressed="false">Browser</button>
          <button class="mode" data-mode="researchExtract" aria-pressed="false">Extract</button>
          <button class="mode" data-mode="explainRoute" aria-pressed="false">Route</button>
        </div>
      </div>
      <div class="control-group permission-control">
        <div class="control-label" id="permissionSummary">Authority: Review</div>
        <div class="permissionbar" role="group" aria-label="Permission mode">
          <button class="permission" data-permission="ask" aria-pressed="false"><strong>Ask</strong><span>Confirm writes</span></button>
          <button class="permission active" data-permission="review" aria-pressed="true"><strong>Review</strong><span>Guarded edits</span></button>
          <button class="permission" data-permission="autopilot" aria-pressed="false"><strong>Autopilot</strong><span>Safe loop</span></button>
        </div>
      </div>
    </section>
    <div class="toolrow">
      <button class="tool-button" data-command="pickFile"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/></svg><span>File</span></button>
      <button class="tool-button" data-command="attachDiff"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10M7 12h6M7 17h10"/><path d="M4 4v16M20 4v16"/></svg><span>Diff</span></button>
      <button class="tool-button" data-command="reviewDiff"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H8l-3 3V5Z"/><path d="M9 9h6M9 12h4"/></svg><span>Review</span></button>
    </div>
    <label class="check">
      <input id="includeContext" type="checkbox" checked>
      Include active file
    </label>
  </section>

  <section class="workstreams-panel">
    <div class="section-head">
      <h2>Active workstreams</h2>
      <button class="ghost-button">New workspace</button>
    </div>
    <article class="workstream active" data-workstream="DoseCraft landing page" data-summary="Modern landing page for DoseCraft with pricing, FAQ, and marketing sections." data-focus="Building responsive pricing section" data-focus-body="Implementing UI and connecting it to CMS." data-progress="72" data-route="Codex - Kimi" data-started="Today, 9:41 AM">
      <div class="stream-icon dose"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 1.5 5.4 4.2 5.7 8.2l2.3 2.3-3.2 1.1-1.1 3.2-2.3-2.3C9.4 15.2 6.7 13.3 5.2 9.8L12 3Z"/><path d="M9 15l-3 3M14.5 8.5h.01"/></svg></div>
      <div class="stream-main">
        <div class="stream-title"><strong>DoseCraft landing page</strong><span>Building - Last active 2m ago</span></div>
        <p>Next up: implement responsive pricing section and connect to CMS.</p>
      </div>
      <div class="stream-status in-progress">In progress</div>
      <div class="avatar-stack"><span>J</span><span>K</span><span>I</span><span>+2</span></div>
      <div class="stream-meta"><span>Changes</span><strong>8 files</strong></div>
      <div class="stream-meta"><span>Tests</span><strong class="ok">Passing</strong></div>
      <div class="stream-meta"><span>Route</span><strong>Codex - Kimi</strong></div>
      <button class="stream-action" data-workstream-prompt="Continue DoseCraft landing page. Implement the responsive pricing section and connect it to CMS.">Continue</button>
    </article>
    <article class="workstream" data-workstream="AI cockpit polish" data-summary="Premium VS Code workspace cockpit with routing hidden under one primary Continue action." data-focus="Polish installed panel details" data-focus-body="Tightening animation, empty states, row selection, and responsive behavior." data-progress="81" data-route="Claude - Kimi" data-started="Today, 11:08 AM">
      <div class="stream-icon polish"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/></svg></div>
      <div class="stream-main">
        <div class="stream-title"><strong>AI cockpit polish</strong><span>Reviewing - Last active now</span></div>
        <p>Next up: polish animation, empty states, and installed panel details.</p>
      </div>
      <div class="stream-status review">Review</div>
      <div class="avatar-stack"><span>J</span><span>K</span></div>
      <div class="stream-meta"><span>Changes</span><strong>5 files</strong></div>
      <div class="stream-meta"><span>Tests</span><strong class="warn">Warnings</strong></div>
      <div class="stream-meta"><span>Route</span><strong>Claude - Kimi</strong></div>
      <button class="stream-action" data-workstream-prompt="Continue AI cockpit polish. Convert the cockpit into a persistent workspace home and verify the release gates.">Continue</button>
    </article>
    <article class="workstream" data-workstream="Router reliability pass" data-summary="Regression coverage and fallback hardening for the multimodal routing layer." data-focus="Stabilize creative handoff routes" data-focus-body="Adding examples for Image 2.0 direction and Kimi implementation handoff." data-progress="58" data-route="Claude - Codex" data-started="Yesterday, 7:32 PM">
      <div class="stream-icon router"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h5l2 3h7"/><path d="M5 17h5l2-3h7"/><path d="M17 7l3 3-3 3"/><path d="M17 11l3 3-3 3"/></svg></div>
      <div class="stream-main">
        <div class="stream-title"><strong>Router reliability pass</strong><span>Building - Last active 34m ago</span></div>
        <p>Next up: add regression examples for creative direction and implementation handoff.</p>
      </div>
      <div class="stream-status in-progress">In progress</div>
      <div class="avatar-stack"><span>C</span></div>
      <div class="stream-meta"><span>Changes</span><strong>12 files</strong></div>
      <div class="stream-meta"><span>Tests</span><strong class="bad">Failing (2)</strong></div>
      <div class="stream-meta"><span>Route</span><strong>Claude - Codex</strong></div>
      <button class="stream-action" data-workstream-prompt="Continue the router reliability pass. Add regression coverage for creative direction and implementation handoff.">Continue</button>
    </article>
    <article class="workstream blocked" data-workstream="Review failing tests" data-summary="Failure triage workspace for release and integration gates." data-focus="Isolate integration failure" data-focus-body="Find the smallest broken path, rerun the gate, then patch without broad refactors." data-progress="31" data-route="Codex" data-started="Yesterday, 4:18 PM">
      <div class="stream-icon tests"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V4h8v3"/><path d="M6 11h12"/><path d="M7 7h10v12H7z"/><path d="M4 15h3M17 15h3M9 19l-2 2M15 19l2 2"/></svg></div>
      <div class="stream-main">
        <div class="stream-title"><strong>Review failing tests</strong><span>Investigating - Last active 5h ago</span></div>
        <p>Next up: isolate integration failure and rerun release gate.</p>
      </div>
      <div class="stream-status blocked">Blocked</div>
      <div class="avatar-stack"><span>C</span></div>
      <div class="stream-meta"><span>Changes</span><strong>2 files</strong></div>
      <div class="stream-meta"><span>Tests</span><strong class="bad">Failing</strong></div>
      <div class="stream-meta"><span>Route</span><strong>Codex</strong></div>
      <button class="stream-action" data-workstream-prompt="Review failing tests. Isolate the integration failure, rerun the relevant gate, and report the safest fix.">Continue</button>
    </article>
    <article class="workstream" data-workstream="Browser auth setup" data-summary="Official logged-in Chrome bridge configuration for authenticated browser tasks." data-focus="Complete OAuth session storage" data-focus-body="Verify the extension-backed session before browser-dependent automations run." data-progress="64" data-route="Kimi Web" data-started="May 21, 2:16 PM">
      <div class="stream-icon browser"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 10h16"/><path d="M9 15h6"/></svg></div>
      <div class="stream-main">
        <div class="stream-title"><strong>Browser auth setup</strong><span>Building - Last active 1d ago</span></div>
        <p>Next up: complete Google OAuth flow and session storage.</p>
      </div>
      <div class="stream-status in-progress">In progress</div>
      <div class="avatar-stack"><span>K</span></div>
      <div class="stream-meta"><span>Changes</span><strong>6 files</strong></div>
      <div class="stream-meta"><span>Tests</span><strong class="ok">Passing</strong></div>
      <div class="stream-meta"><span>Route</span><strong>Kimi Web</strong></div>
      <button class="stream-action" data-workstream-prompt="Continue browser auth setup. Verify official Kimi WebBridge extension session before browser tasks.">Continue</button>
    </article>
  </section>

  <aside class="workspace-detail" aria-label="Active workspace">
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="detail-kicker">Mission state</span>
          <h2 id="detailTitle">DoseCraft landing page</h2>
        </div>
        <button class="mini-button">...</button>
      </div>
      <p id="detailDescription">Modern landing page for DoseCraft with pricing, FAQ, and marketing sections.</p>
      <div class="progress-row"><span>Overall progress</span><strong id="detailProgress">72%</strong></div>
      <div class="progress"><span id="detailProgressBar" style="width:72%"></span></div>
    </div>
    <div class="detail-card">
      <span class="detail-kicker">Next best move</span>
      <h3 id="detailFocus">Building responsive pricing section</h3>
      <p id="detailFocusBody">Implementing UI and connecting it to CMS.</p>
    </div>
    <div class="detail-card activity-card mission-feed">
      <div class="section-head">
        <h3>Live mission feed</h3>
        <button class="ghost-button">View all</button>
      </div>
      <div class="mission-agent active"><span class="agent-orb codex">C</span><div><strong>Codex is shaping the pricing component.</strong><small>Editing layout, states, and CMS handoff.</small></div><em>now</em></div>
      <div class="mission-agent"><span class="agent-orb kimi">K</span><div><strong>Kimi checked the responsive preview.</strong><small>Browser pass completed on desktop and mobile.</small></div><em>4m</em></div>
      <div class="activity-preview live-stage"><span>DoseCraft preview</span><strong>Simple, transparent pricing</strong><small>Latest browser render is clean.</small></div>
      <div class="mission-agent done"><span class="agent-orb image">I</span><div><strong>Image 2.0 reference was applied.</strong><small>Creative direction is locked for this section.</small></div><em>12m</em></div>
      <div class="mission-agent done"><span class="agent-orb test">T</span><div><strong>Tests are green.</strong><small>12 checks passed after the last edit.</small></div><em>6m</em></div>
    </div>
    <div class="detail-card route-card">
      <span>Route</span><strong id="detailRoute">Codex - Kimi</strong>
      <span>Models used</span><strong class="model-stack"><i>K</i><i>C</i><i>G</i></strong>
      <span>Started</span><strong id="detailStarted">Today, 9:41 AM</strong>
    </div>
  </aside>

  <section class="result-panel">
    <div class="panel-head">
      <h2 id="resultTitle">${variant === 'panel' ? 'Work Stream' : 'Result'}</h2>
      <div class="result-actions" aria-label="Work stream actions">
        <button class="mini-button" data-result-action="copy" title="Copy work stream" aria-label="Copy work stream">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h10v12H8z"/><path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="mini-button" data-result-action="clear" title="Clear work stream" aria-label="Clear work stream">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>
        </button>
        <button class="mini-button stop-button" id="stopRun" data-result-action="stop" title="Stop current run" aria-label="Stop current run" disabled>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
        </button>
        <button class="mini-button text-mini" data-command="fiveMinuteDemo">Demo</button>
      </div>
    </div>
    <div id="result" class="transcript" aria-live="polite">
      <div class="empty-state">Ready.</div>
    </div>
  </section>

  <details open>
    <summary>Overview</summary>
    <section class="status-grid" aria-label="Live cockpit state">
      <button data-inline-name="Route Receipt" data-inline-command="cc-router-receipt"><span>Route</span><strong id="routePill">Auto</strong></button>
      <button data-inline-name="Diff Hunks" data-inline-command="cc-diff-hunks"><span>Changes</span><strong id="diffPill">--</strong></button>
      <button data-inline-name="Context Meter" data-inline-command="cc-context-meter --include-diff"><span>Context</span><strong id="contextPill">--</strong></button>
      <button data-inline-name="Provider Capacity" data-inline-command="cc-provider-capacity"><span>Capacity</span><strong id="capacityPill">--</strong></button>
    </section>
  </details>

  <details>
    <summary>Context</summary>
    <section class="cards">
      <article><h2>Route</h2><pre id="route">Loading...</pre><button data-inline-name="Route Receipt" data-inline-command="cc-router-receipt">View Receipt</button></article>
      <article><h2>File Changes</h2><div class="statline"><span><strong id="diffFiles">--</strong><small>files</small></span><span><strong id="diffAdded">--</strong><small>added</small></span><span><strong id="diffRemoved">--</strong><small>removed</small></span></div><pre id="diffSummary">Loading...</pre><button data-inline-name="Diff Hunks" data-inline-command="cc-diff-hunks">View Diff</button></article>
      <article class="metric-card">
        <h2>Context Pressure</h2>
        <div class="statline">
          <span><strong id="contextUsed">--</strong><small>used</small></span>
          <span><strong id="contextAvailable">--</strong><small>available</small></span>
          <span><strong id="contextDiff">--</strong><small>diff chars</small></span>
        </div>
        <div class="meter" aria-label="Context usage">
          <span id="contextUsedBar"></span>
          <span id="contextReserveBar"></span>
        </div>
        <p id="contextStatus">Loading context pressure.</p>
        <pre id="contextMeter">Loading...</pre>
        <button data-inline-name="Context Meter" data-inline-command="cc-context-meter --include-diff">View Context</button>
      </article>
      <article><h2>Repo Map</h2><pre id="repoMap">Loading...</pre><button data-inline-name="Repo Map" data-inline-command="cc-repo-map 30">View Repo Map</button></article>
      <article><h2>Sessions</h2><pre id="sessions">Loading...</pre><button data-inline-name="Session Ledger" data-inline-command="cc-session-ledger list 12">View Sessions</button></article>
      <article><h2>Context Providers</h2><pre id="contextSnapshot">Loading...</pre><button data-inline-name="Context Snapshot" data-inline-command="cc-context-snapshot --json">View Snapshot</button></article>
      <article><h2>Repo Index</h2><pre id="repo">Run repo index to inspect workspace shape.</pre><button data-inline-name="Repo Index" data-inline-command="cc-repo-index">View Index</button></article>
    </section>
  </details>

  <details>
    <summary>System</summary>
    <section class="cards">
      <article><h2>Product Readiness</h2><pre id="product">Loading...</pre><button data-inline-name="Product Readiness" data-inline-command="cc-product-readiness">View Gate</button></article>
      <article><h2>Provider Capacity</h2><pre id="providerCapacity">Loading...</pre><button data-inline-name="Provider Capacity" data-inline-command="cc-provider-capacity">View Capacity</button></article>
      <article><h2>First Run</h2><pre id="firstRun">Loading...</pre><button data-inline-name="First Run Doctor" data-inline-command="cc-first-run">View Doctor</button></article>
      <article><h2>Kimi</h2><pre id="kimi">Loading...</pre><button data-inline-name="Kimi Status" data-inline-command="cc-kimi-status">View Kimi Status</button></article>
      <article><h2>Disk</h2><pre id="disk">Loading...</pre><button data-inline-name="Disk Readiness" data-inline-command="cc-disk-readiness">View Disk Report</button></article>
      <article><h2>Permissions</h2><pre id="permissions">Loading...</pre><button data-inline-name="Permission Matrix" data-inline-command="cc-permission-matrix">View Matrix</button></article>
      <article><h2>Checkpoints</h2><pre id="checkpoints">Loading...</pre><button data-inline-name="Checkpoints" data-inline-command="cc-checkpoints">View Timeline</button></article>
    </section>
  </details>

  <details>
    <summary>Advanced</summary>
    <section class="cards">
      <article><h2>Metrics</h2><pre id="metrics">Loading...</pre><button data-inline-name="Router Metrics" data-inline-command="cc-router-metrics">View Metrics</button></article>
      <article><h2>Jobs</h2><pre id="jobs">Loading...</pre><button data-inline-name="Jobs" data-inline-command="cc-jobs">View Jobs</button></article>
      <article><h2>Lanes</h2><pre id="lanes">Loading...</pre><button data-inline-name="Lane Registry" data-inline-command="cc-lane capabilities">View Lanes</button></article>
      <article><h2>Pulse</h2><pre id="pulse">Loading...</pre><button data-inline-name="Pulse Status" data-inline-command="cc-pulse-status">View Pulse Status</button></article>
      <article><h2>Native Apps</h2><pre id="nativeApps">Loading...</pre><button data-inline-name="Native App Status" data-inline-command="cc-native-app-status">View Native Apps</button></article>
      <article><h2>Semantic Index</h2><pre>Symbol map and high-signal definitions.</pre><button data-inline-name="Semantic Index" data-inline-command="cc-semantic-index">View Semantic Index</button></article>
      <article><h2>Browser Proof</h2><pre>WebBridge readiness and bounded page proof output.</pre><button data-inline-name="Browser Proof" data-inline-command="cc-browser-proof">View Proof</button></article>
      <article><h2>Demo Mode</h2><pre>Readiness, route proof, browser proof, and cockpit packaging in one flow.</pre><button data-command="fiveMinuteDemo">Run Demo</button></article>
      <article><h2>Loop Quality</h2><pre>Depth ladder, loop status, and anti-pattern memory readiness.</pre><button data-inline-name="Loop Quality" data-inline-command="cc-loop-quality">View Loop Quality</button></article>
    </section>
  </details>

  <footer>
    <button data-command="status">Full Status</button>
    <button data-command="openSettings">Settings</button>
  </footer>

  <script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
  }
}

class CockpitPanel extends CockpitProvider {
  constructor(extensionUri, output) {
    super(extensionUri, output);
    this.panel = null;
  }

  open() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      this.enterFocusLayout();
      this.refreshContext();
      return;
    }
    this.panel = vscode.window.createWebviewPanel(
      'aiSystemCockpit.panel',
      'AI Cockpit',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    this.view = this.panel;
    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'cockpit.svg');
    this.panel.webview.html = this.html(this.panel.webview, 'panel');
    this.panel.webview.onDidReceiveMessage((message) => this.handle(message), null, []);
    this.panel.onDidDispose(() => {
      this.panel = null;
      this.view = null;
    });
    this.enterFocusLayout();
    this.refresh();
  }

  enterFocusLayout() {
    setTimeout(() => {
      [
        'workbench.action.closeSidebar',
        'workbench.action.closeAuxiliaryBar',
        'workbench.action.joinAllGroups',
        'workbench.action.focusActiveEditorGroup',
      ].forEach((id) => {
        vscode.commands.executeCommand(id).then(undefined, () => undefined);
      });
    }, 150);
  }
}

function permissionInstruction(mode) {
  const modes = {
    ask: 'Cockpit permission mode: Ask. Do not write files or run mutating commands without an explicit approval step.',
    review: 'Cockpit permission mode: Review. Make safe local edits when the task is clear; surface risky or destructive actions before taking them.',
    autopilot: 'Cockpit permission mode: Autopilot. Continue through safe local implementation and verification without extra prompts; still stop for paid, credential, destructive, or cross-user actions.',
  };
  return modes[mode] || modes.review;
}

function summarizeReadiness(text) {
  const failed = /FAIL/.test(text);
  const lines = text.split('\n').filter(Boolean);
  return {
    ok: !failed,
    title: failed ? 'Attention needed' : 'System ready',
    body: lines.slice(5, 14).join('\n') || text,
  };
}

function editorContext() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return { label: 'No active editor', block: '' };
  const doc = editor.document;
  const file = vscode.workspace.asRelativePath(doc.uri, false);
  const selection = editor.selection && !editor.selection.isEmpty
    ? doc.getText(editor.selection)
    : '';
  const line = editor.selection?.active?.line != null ? editor.selection.active.line + 1 : 1;
  const label = selection
    ? `${file}:${line} (${selection.length} chars selected)`
    : `${file}:${line}`;
  const block = selection
    ? `\n\nCurrent selection from ${file}:${line}:\n\`\`\`\n${selection.slice(0, 12000)}\n\`\`\``
    : `\n\nCurrent file ${file}:${line}:\n\`\`\`\n${doc.getText().slice(0, 12000)}\n\`\`\``;
  return { label, block };
}

module.exports = { activate, deactivate };
