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
  ['buildFix', 'Build / Fix', 'precision'],
  ['designBrowser', 'Design / Browser', 'design'],
  ['researchExtract', 'Research / Extract', 'cheap'],
];

function activate(context) {
  const output = vscode.window.createOutputChannel('AI Cockpit');
  const provider = new CockpitProvider(context.extensionUri, output);
  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 92);

  context.subscriptions.push(
    output,
    statusItem,
    vscode.window.registerWebviewViewProvider('aiSystemCockpit.dashboard', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    command('aiSystemCockpit.open', () => vscode.commands.executeCommand('workbench.view.extension.aiSystemCockpit')),
    command('aiSystemCockpit.refresh', () => provider.refresh()),
    command('aiSystemCockpit.status', () => showOutput(output, 'Status', COMMANDS.status)),
    command('aiSystemCockpit.systemDemo', () => showOutput(output, 'System Demo', COMMANDS.systemDemo)),
    command('aiSystemCockpit.routeReceipt', () => showOutput(output, 'Route Receipt', COMMANDS.routeReceipt)),
    command('aiSystemCockpit.routerMetrics', () => showOutput(output, 'Router Metrics', COMMANDS.routerMetrics)),
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
    vscode.window.onDidChangeActiveTextEditor(() => provider.refreshContext()),
    vscode.window.onDidChangeTextEditorSelection(() => provider.refreshContext())
  );

  if (vscode.workspace.getConfiguration('aiSystemCockpit').get('showStatusBarButton', true)) {
    statusItem.command = 'aiSystemCockpit.open';
    statusItem.text = '$(dashboard) AI Cockpit';
    statusItem.tooltip = 'Open AI System Cockpit';
    statusItem.show();
    context.subscriptions.push(refreshStatus(statusItem));
  }

  if (vscode.workspace.getConfiguration('aiSystemCockpit').get('openOnStartup', true)) {
    setTimeout(() => vscode.commands.executeCommand('workbench.view.extension.aiSystemCockpit'), 1200);
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

async function refreshStatus(item) {
  const timer = setInterval(async () => {
    const result = await shellExec('cc-cockpit-status | sed -n "1,14p"', { timeout: 15000 });
    const failed = /FAIL/.test(result.text);
    item.text = failed ? '$(warning) AI Cockpit' : '$(pass) AI Cockpit';
    item.tooltip = result.text || 'AI Cockpit status unavailable';
  }, 60000);

  const first = await shellExec('cc-cockpit-status | sed -n "1,14p"', { timeout: 15000 });
  item.text = /FAIL/.test(first.text) ? '$(warning) AI Cockpit' : '$(pass) AI Cockpit';
  item.tooltip = first.text || 'AI Cockpit status unavailable';
  return { dispose: () => clearInterval(timer) };
}

class CockpitProvider {
  constructor(extensionUri, output) {
    this.extensionUri = extensionUri;
    this.output = output;
    this.contextTimer = null;
  }

  resolveWebviewView(view) {
    this.view = view;
    view.webview.options = { enableScripts: true };
    view.webview.html = this.html(view.webview);
    view.webview.onDidReceiveMessage((message) => this.handle(message));
    this.refresh();
  }

  async refresh() {
    if (!this.view) return;
    this.view.webview.postMessage({ type: 'loading' });
    const [status, receipt, metrics, permissions, checkpoints, disk, product, firstRun, contextMeter, contextMeterJson, contextSnapshot, diffSummary, sessions, pulse, nativeApps, kimi, repoMap, jobs, lanes] = await Promise.all([
      shellExec('cc-cockpit-status | sed -n "1,26p"', { timeout: 20000 }),
      shellExec('cc-router-receipt --summary', { timeout: 12000 }),
      shellExec('cc-router-metrics 25 | sed -n "1,24p"', { timeout: 12000 }),
      shellExec('cc-permission-matrix --summary', { timeout: 12000 }),
      shellExec('cc-checkpoints summary', { timeout: 12000 }),
      shellExec('cc-disk-readiness | sed -n "1,11p"', { timeout: 20000 }),
      shellExec('cc-product-readiness | sed -n "1,36p"', { timeout: 120000 }),
      shellExec('cc-first-run | sed -n "1,70p"', { timeout: 20000 }),
      shellExec('cc-context-meter --include-diff | sed -n "1,16p"', { timeout: 12000 }),
      shellExec(COMMANDS.contextMeterJson, { timeout: 12000 }),
      shellExec(COMMANDS.contextSnapshot, { timeout: 12000 }),
      shellExec(COMMANDS.diffHunksJson, { timeout: 12000 }),
      shellExec(COMMANDS.sessionLedger, { timeout: 12000 }),
      shellExec('cc-pulse-status | sed -n "1,18p"', { timeout: 12000 }),
      shellExec('cc-native-app-status | sed -n "1,42p"', { timeout: 12000 }),
      shellExec('cc-kimi-status | sed -n "1,22p"', { timeout: 12000 }),
      shellExec(COMMANDS.repoMap, { timeout: 12000 }),
      shellExec('cc-jobs | sed -n "1,10p"', { timeout: 12000 }),
      shellExec('cc-lane capabilities | sed -n "1,14p"', { timeout: 12000 }),
    ]);

    this.view.webview.postMessage({
      type: 'state',
      payload: {
        readiness: summarizeReadiness(status.text),
        context: editorContext(),
        route: receipt.text,
        metrics: metrics.text,
        permissions: permissions.text,
        checkpoints: checkpoints.text,
        disk: disk.text,
        product: product.text,
        firstRun: firstRun.text,
        contextMeter: contextMeter.text,
        contextMeterJson: contextMeterJson.text,
        contextSnapshot: contextSnapshot.text,
        diffSummary: diffSummary.text,
        sessions: sessions.text,
        pulse: pulse.text,
        nativeApps: nativeApps.text,
        kimi: kimi.text,
        repoMap: repoMap.text,
        jobs: jobs.text,
        lanes: lanes.text,
      },
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
      explainRoute: () => vscode.commands.executeCommand('aiSystemCockpit.explainRoute'),
      buildFix: () => vscode.commands.executeCommand('aiSystemCockpit.buildFix'),
      designBrowser: () => vscode.commands.executeCommand('aiSystemCockpit.designBrowser'),
      researchExtract: () => vscode.commands.executeCommand('aiSystemCockpit.researchExtract'),
      savePlan: () => vscode.commands.executeCommand('aiSystemCockpit.savePlan'),
      reviewDiff: () => vscode.commands.executeCommand('aiSystemCockpit.reviewDiff'),
    };
    if (message.command === 'runPrompt') {
      this.runPrompt(message.mode, message.prompt, Boolean(message.includeContext), message.contextBlock || '');
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
    let body = '';
    this.view.webview.postMessage({
      type: 'result',
      payload: { title: name || 'Running', body: 'Running...' },
    });
    const child = cp.spawn('/bin/zsh', ['-lc', commandLine], {
      cwd: cwd(),
      env: process.env,
    });
    const push = (chunk) => {
      body = `${body}${chunk}`.slice(-60000);
      this.view.webview.postMessage({
        type: 'result',
        payload: { title: name || 'Running', body: body || 'Running...' },
      });
    };
    child.stdout.on('data', data => push(data.toString()));
    child.stderr.on('data', data => push(data.toString()));
    child.on('error', error => push(`\n${error.message}`));
    child.on('close', code => {
      this.view.webview.postMessage({
        type: 'result',
        payload: {
          title: `${name || 'Result'}${code === 0 ? '' : ` (exit ${code})`}`,
          body: body || '(no output)',
        },
      });
    });
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

  runPrompt(mode, prompt, includeContext = false, contextBlock = '') {
    const clean = String(prompt || '').trim();
    if (!clean) {
      vscode.window.showInformationMessage('Enter a prompt in the AI Cockpit first.');
      return;
    }
    const enriched = includeContext && contextBlock ? `${clean}${contextBlock}` : clean;
    if (mode === 'explainRoute') {
      this.runInlineStream('Explain Route', `~/AI-SYSTEM-V2/scripts/intent-route.sh --dry-run ${quote(enriched)}`);
      return;
    }
    if (mode === 'savePlan') {
      runTerminal('AI Save Plan', `cc-plan ${quote(enriched)}`);
      return;
    }
    const modes = {
      buildFix: ['Build / Fix', 'precision'],
      designBrowser: ['Design / Browser', 'design'],
      researchExtract: ['Research / Extract', 'cheap'],
    };
    const [label, purpose] = modes[mode] || modes.buildFix;
    const force = purpose ? `--purpose ${quote(purpose)} ` : '';
    this.runInlineStream(label, `router-ask ${force}${quote(enriched)}`);
  }

  html(webview) {
    const nonce = String(Date.now());
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'style.css'));
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'main.js'));
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
  <title>AI Cockpit</title>
</head>
<body>
  <header>
    <div>
      <div class="eyebrow">AI-SYSTEM-V2</div>
      <h1>Cockpit</h1>
    </div>
    <button data-command="refresh" title="Refresh">↻</button>
  </header>

  <section class="hero">
    <div class="status-dot" id="statusDot"></div>
    <div>
      <strong id="readinessTitle">Checking readiness</strong>
      <p id="readinessBody">Loading lane registry, router smoke, disk gate, and live config links.</p>
    </div>
  </section>

  <section class="composer">
    <div class="composer-head">
      <label for="prompt">Prompt</label>
      <span id="context">No active editor</span>
    </div>
    <div class="modebar" role="tablist" aria-label="Mode">
      <button class="mode active" data-mode="buildFix">Build</button>
      <button class="mode" data-mode="designBrowser">Design</button>
      <button class="mode" data-mode="researchExtract">Research</button>
      <button class="mode" data-mode="explainRoute">Route</button>
      <button class="mode" data-mode="savePlan">Plan</button>
    </div>
    <textarea id="prompt" rows="4" placeholder="Describe the task. The cockpit routes it to the right lane."></textarea>
    <div class="chips" id="chips"></div>
    <label class="check">
      <input id="includeContext" type="checkbox" checked>
      Include current file / selection
    </label>
    <div class="runrow">
      <button class="primary" data-run-selected="true">Run Mode</button>
      <button data-run="explainRoute">Preview Route</button>
    </div>
    <div class="toolrow">
      <button data-command="pickFile">Attach File</button>
      <button data-command="attachDiff">Attach Diff</button>
      <button data-command="reviewDiff">Review Diff</button>
    </div>
  </section>

  <section class="grid">
    <button data-command="buildFix">Build / Fix</button>
    <button data-command="designBrowser">Design / Browser</button>
    <button data-command="researchExtract">Research / Extract</button>
    <button data-command="explainRoute">Explain Route</button>
    <button data-command="savePlan">Save Plan</button>
    <button data-command="reviewDiff">Review Diff</button>
    <button data-command="repoIndex">Repo Index</button>
    <button data-command="semanticIndex">Semantic Index</button>
    <button data-command="diffHunks">Diff Hunks</button>
    <button data-command="workflowProof">Workflow Proof</button>
    <button data-command="browserProof">Browser Proof</button>
    <button data-command="fiveMinuteDemo">Demo Mode</button>
    <button data-command="firstRun">First Run</button>
    <button data-command="contextMeter">Context Meter</button>
    <button data-command="contextSnapshot">Context Snapshot</button>
    <button data-command="sessionLedger">Sessions</button>
    <button data-command="loopQuality">Loop Quality</button>
    <button data-command="pulseStatus">Pulse Status</button>
    <button data-command="nativeAppStatus">Native Apps</button>
    <button data-command="repoMap">Repo Map</button>
  </section>

  <section class="cards">
    <article><h2>Route</h2><pre id="route">Loading...</pre><button data-inline-name="Route Receipt" data-inline-command="cc-router-receipt">View Receipt</button></article>
    <article><h2>Metrics</h2><pre id="metrics">Loading...</pre><button data-inline-name="Router Metrics" data-inline-command="cc-router-metrics">View Metrics</button></article>
    <article><h2>Permissions</h2><pre id="permissions">Loading...</pre><button data-inline-name="Permission Matrix" data-inline-command="cc-permission-matrix">View Matrix</button></article>
    <article><h2>Checkpoints</h2><pre id="checkpoints">Loading...</pre><button data-inline-name="Checkpoints" data-inline-command="cc-checkpoints">View Timeline</button></article>
    <article><h2>Loop Quality</h2><pre>Depth ladder, loop status, and anti-pattern memory readiness.</pre><button data-inline-name="Loop Quality" data-inline-command="cc-loop-quality">View Loop Quality</button></article>
    <article><h2>Disk</h2><pre id="disk">Loading...</pre><button data-inline-name="Disk Readiness" data-inline-command="cc-disk-readiness">View Disk Report</button></article>
    <article><h2>Product Readiness</h2><pre id="product">Loading...</pre><button data-inline-name="Product Readiness" data-inline-command="cc-product-readiness">View Gate</button></article>
    <article><h2>First Run</h2><pre id="firstRun">Loading...</pre><button data-inline-name="First Run Doctor" data-inline-command="cc-first-run">View Doctor</button></article>
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
    <article><h2>Context Providers</h2><pre id="contextSnapshot">Loading...</pre><button data-inline-name="Context Snapshot" data-inline-command="cc-context-snapshot --json">View Snapshot</button></article>
    <article><h2>Sessions</h2><pre id="sessions">Loading...</pre><button data-inline-name="Session Ledger" data-inline-command="cc-session-ledger list 12">View Sessions</button></article>
    <article><h2>Pulse</h2><pre id="pulse">Loading...</pre><button data-inline-name="Pulse Status" data-inline-command="cc-pulse-status">View Pulse Status</button></article>
    <article><h2>Native Apps</h2><pre id="nativeApps">Loading...</pre><button data-inline-name="Native App Status" data-inline-command="cc-native-app-status">View Native Apps</button></article>
    <article><h2>Kimi</h2><pre id="kimi">Loading...</pre><button data-inline-name="Kimi Status" data-inline-command="cc-kimi-status">View Kimi Status</button></article>
    <article><h2>Repo Map</h2><pre id="repoMap">Loading...</pre><button data-inline-name="Repo Map" data-inline-command="cc-repo-map 30">View Repo Map</button></article>
    <article><h2>Repo Index</h2><pre id="repo">Run repo index to inspect workspace shape.</pre><button data-inline-name="Repo Index" data-inline-command="cc-repo-index">View Index</button></article>
    <article><h2>Semantic Index</h2><pre>Symbol map and high-signal definitions.</pre><button data-inline-name="Semantic Index" data-inline-command="cc-semantic-index">View Semantic Index</button></article>
    <article class="metric-card">
      <h2>File Changes</h2>
      <div class="statline">
        <span><strong id="diffFiles">--</strong><small>files</small></span>
        <span><strong id="diffAdded">--</strong><small>added</small></span>
        <span><strong id="diffRemoved">--</strong><small>removed</small></span>
      </div>
      <pre id="diffSummary">Loading...</pre>
      <button data-inline-name="Diff Hunks" data-inline-command="cc-diff-hunks">View Hunks</button>
    </article>
    <article><h2>Browser Proof</h2><pre>WebBridge readiness and bounded page proof output.</pre><button data-inline-name="Browser Proof" data-inline-command="cc-browser-proof">View Proof</button></article>
    <article><h2>Demo Mode</h2><pre>Readiness, route proof, browser proof, and cockpit packaging in one flow.</pre><button data-command="fiveMinuteDemo">Run Demo</button></article>
    <article><h2>Jobs</h2><pre id="jobs">Loading...</pre><button data-inline-name="Jobs" data-inline-command="cc-jobs">View Jobs</button></article>
    <article><h2>Lanes</h2><pre id="lanes">Loading...</pre><button data-inline-name="Lane Registry" data-inline-command="cc-lane capabilities">View Lanes</button></article>
    <article class="result"><h2 id="resultTitle">Last Result</h2><pre id="result">Run Explain Route from the prompt composer to see output here.</pre></article>
  </section>

  <footer>
    <button data-command="status">Full Status</button>
    <button data-command="openSettings">Settings</button>
  </footer>

  <script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
  }
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
    : `\n\nCurrent file: ${file}:${line}`;
  return { label, block };
}

module.exports = { activate, deactivate };
