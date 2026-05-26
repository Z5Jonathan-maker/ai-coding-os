'use strict';

const vscode = require('vscode');

function renderCockpitHtml(webview, extensionUri, variant = 'sidebar') {
  const nonce = String(Date.now());
  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'style.css'));
  const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data: http://localhost:* http://127.0.0.1:*; frame-src http://localhost:* http://127.0.0.1:*; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="${cssUri}">
<title>AI Cockpit</title>
</head>
<body class="${variant}-mode">
<aside class="workspace-rail" aria-label="Cockpit navigation">
  <div class="rail-brand">
    <img src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'cockpit.svg'))}" alt="" class="rail-mark">
    <div>
      <strong>cc-cockpit</strong>
      <span>Local mode</span>
    </div>
  </div>
  <nav class="rail-nav">
    <button class="active" aria-label="Home"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"/></svg><span>Home</span></button>
    <button aria-label="Workspaces"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 4v16"/></svg><span>Workspaces</span></button>
    <button aria-label="Agents"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6l5-3-5-3Z"/><path d="M6 21v-6l-5 3 5 3Z"/><path d="M18 21v-6l5 3-5 3Z"/><path d="M12 9v3M8 16l4-4 4 4"/></svg><span>Agents</span></button>
    <button aria-label="Browser"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 10h16"/></svg><span>Browser</span></button>
    <button aria-label="Code"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 4-4 16"/></svg><span>Code</span></button>
    <button aria-label="Assets"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="m8 15 2.5-3 2 2.4L15 11l1 4"/></svg><span>Assets</span></button>
    <button aria-label="Knowledge"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/></svg><span>Knowledge</span></button>
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
    <img src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'cockpit.svg'))}" alt="" class="brand-mark">
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
    <h2>Current workspace</h2>
    <p>Loading live repo state, recent route history, browser readiness, and next action.</p>
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
    <span>Continue current work</span>
    <h3 id="continueTitle">Current workspace</h3>
    <div class="continuation-memory" aria-label="Mission memory">
      <div>
        <span>Last session</span>
        <p id="continueLast">Loading the last known workspace state.</p>
      </div>
      <div>
        <span>Next best step</span>
        <p id="continueBody">Loading the next best step.</p>
      </div>
    </div>
  </div>
  <div class="continuation-signals" aria-label="Continuation signals">
    <span id="continueChanges">Checking changes</span>
    <span id="continueTests">Checking gates</span>
    <span id="continueSafety">Checking safety</span>
  </div>
  <textarea id="prompt" rows="5" placeholder="Add a detail, or just Continue."></textarea>
  <div class="chips" id="chips"></div>
  <div class="composer-pills" aria-label="Primary context controls">
    <button class="pill active" data-mode="autoRun" aria-pressed="true"><span>Auto</span><small>Intelligent</small></button>
    <button class="pill" data-mode="designHandoff" aria-pressed="false"><span>Creative</span><small>Handoff</small></button>
    <button class="pill" data-command="pickFile"><span>Attach</span><small>Files</small></button>
    <button class="pill" data-command="attachDiff"><span>Context</span><small>Diff + file</small></button>
  </div>
  <div class="runrow">
    <button class="primary command-button" data-run-selected="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg><span>Continue</span></button>
    <button class="secondary command-button" data-run="explainRoute"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h5l2 3h9"/><path d="M4 17h5l2-3h9"/><path d="M17 7l3 3-3 3"/><path d="M17 11l3 3-3 3"/></svg><span>Preview Route</span></button>
  </div>
  <details class="context-drawer">
    <summary>Context and controls</summary>
    <section class="control-deck" aria-label="Cockpit controls">
      <div class="control-group">
        <div class="control-label" id="modeSummary">Mode: Auto</div>
        <div class="modebar" role="group" aria-label="Mode">
          <button class="mode active" data-mode="autoRun" aria-pressed="true">Auto</button>
          <button class="mode" data-mode="buildFix" aria-pressed="false">Code</button>
          <button class="mode" data-mode="designBrowser" aria-pressed="false">Browser</button>
          <button class="mode" data-mode="designHandoff" aria-pressed="false">Creative</button>
          <button class="mode" data-mode="researchExtract" aria-pressed="false">Extract</button>
          <button class="mode" data-mode="explainRoute" aria-pressed="false">Route</button>
        </div>
      </div>
      <div class="control-group permission-control">
        <div class="control-label" id="executionSummary">Workflow: Execute</div>
        <div class="modebar workflowbar" role="group" aria-label="Workflow mode">
          <button class="mode" data-execution-mode="plan" aria-pressed="false">Plan</button>
          <button class="mode active" data-execution-mode="execute" aria-pressed="true">Execute</button>
          <button class="mode" data-execution-mode="review" aria-pressed="false">Review</button>
          <button class="mode" data-execution-mode="debug" aria-pressed="false">Debug</button>
        </div>
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
      <button class="tool-button" data-command="designHandoffContinue"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg><span>Handoff</span></button>
      <button class="tool-button" data-command="designHandoffApprove"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><span>Approve</span></button>
      <button class="tool-button" data-command="designHandoffExecute"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h9"/><path d="m11 5 7 7-7 7"/></svg><span>Execute</span></button>
    </div>
    <label class="check">
      <input id="includeContext" type="checkbox" checked>
      Include active file
    </label>
  </details>
</section>

<section class="creative-surface" aria-label="Creative handoff">
  <div class="section-head">
    <div>
      <span class="detail-kicker">Creative Mode</span>
      <h2 id="handoffTitle">No creative handoff mission</h2>
    </div>
    <button class="ghost-button" data-command="designHandoffContinue">Continue handoff</button>
  </div>
  <p id="handoffSummary">Create a handoff to see reference approval, design DNA, implementation, review, proof, and deploy stages here.</p>
  <div class="handoff-progress" aria-label="Creative handoff progress">
    <span id="handoffGate">Create a creative handoff mission.</span>
    <strong id="handoffProgress">0%</strong>
  </div>
  <div class="progress-track handoff-track"><span id="handoffProgressBar"></span></div>
  <div class="visual-edit-surface" aria-label="Visual edit spine">
    <div class="visual-edit-toolbar">
      <label for="visualPreviewUrl">Preview</label>
      <input id="visualPreviewUrl" class="visual-preview-url" type="url" value="http://localhost:3000" spellcheck="false">
      <button type="button" class="ghost-button" id="visualPreviewLoad">Load</button>
      <button type="button" class="ghost-button" id="visualAnnotateToggle" aria-pressed="false">Annotate</button>
    </div>
    <div class="visual-preview-shell">
      <iframe id="visualPreview" title="Visual preview" src="about:blank" sandbox="allow-scripts allow-forms"></iframe>
      <div id="visualAnnotationLayer" class="visual-annotation-layer" hidden></div>
    </div>
    <div class="visual-annotation-list" id="visualAnnotations"></div>
  </div>
  <div class="handoff-stages" id="handoffStages"></div>
  <div class="handoff-artifacts" id="handoffArtifacts"></div>
  <div class="handoff-events" id="handoffEvents"></div>
</section>

<section class="workstreams-panel">
  <div class="section-head">
    <h2>Mission threads</h2>
    <button class="ghost-button">New workspace</button>
  </div>
  <article class="workstream active" data-workstream="Current workspace" data-summary="Live repo state is loading." data-last-session="Loading recent workspace state." data-focus="Continue the current mission" data-focus-body="Inspect live repo state and continue the next best step." data-progress="50" data-route="Auto" data-started="Now">
    <div class="stream-icon dose"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 1.5 5.4 4.2 5.7 8.2l2.3 2.3-3.2 1.1-1.1 3.2-2.3-2.3C9.4 15.2 6.7 13.3 5.2 9.8L12 3Z"/><path d="M9 15l-3 3M14.5 8.5h.01"/></svg></div>
    <div class="stream-main">
      <div class="stream-title"><strong>Current workspace</strong><span>Loading live state</span></div>
      <p>Next up: inspect repo state and continue the safest useful action.</p>
    </div>
    <div class="stream-status in-progress">Ready</div>
    <div class="avatar-stack"><span>J</span><span>K</span><span>I</span><span>+2</span></div>
    <div class="stream-meta"><span>Changes</span><strong>Checking</strong></div>
    <div class="stream-meta"><span>Tests</span><strong class="warn">On demand</strong></div>
    <div class="stream-meta"><span>Route</span><strong>Auto</strong></div>
    <button class="stream-action" data-workstream-prompt="Continue the current workspace. Inspect live repo state, identify the next best step, and verify before reporting done.">Continue</button>
  </article>
</section>

<aside class="workspace-detail" aria-label="Active workspace">
  <div class="detail-card">
    <div class="detail-head">
      <div>
        <span class="detail-kicker">Mission state</span>
        <h2 id="detailTitle">Current workspace</h2>
      </div>
      <button class="mini-button">...</button>
    </div>
    <p id="detailDescription">Live mission state is loading from the current repo.</p>
    <div class="progress-row"><span>Overall readiness</span><strong id="detailProgress">50%</strong></div>
    <div class="progress"><span id="detailProgressBar" style="width:50%"></span></div>
  </div>
  <div class="detail-card">
    <span class="detail-kicker">Next best move</span>
    <h3 id="detailFocus">Continue the current mission</h3>
    <p id="detailFocusBody">Inspect live repo state and continue the next best step.</p>
  </div>
  <div class="detail-card activity-card mission-feed">
    <div class="section-head">
      <h3>Live mission feed</h3>
      <button class="ghost-button">View all</button>
    </div>
    <div class="mission-agent active"><span class="agent-orb codex">R</span><div><strong>Reading live workspace state.</strong><small>Repo, route, context, and browser readiness.</small></div><em>now</em></div>
    <div class="mission-agent"><span class="agent-orb kimi">C</span><div><strong>Checking context pressure.</strong><small>Token room and diff size are being measured.</small></div><em>now</em></div>
    <div class="activity-preview live-stage"><span>Workspace preview</span><strong>Live state loading</strong><small>No static project claims are used.</small></div>
    <div class="mission-agent done"><span class="agent-orb image">B</span><div><strong>Checking browser bridge.</strong><small>Official extension status will appear here.</small></div><em>now</em></div>
    <div class="mission-agent done"><span class="agent-orb test">G</span><div><strong>Gates available on demand.</strong><small>Run release/product checks before shipping.</small></div><em>now</em></div>
  </div>
  <div class="detail-card route-card">
    <span>Route</span><strong id="detailRoute">Auto</strong>
    <span>Models used</span><strong class="model-stack"><i>C</i><i>K</i><i>D</i></strong>
    <span>Started</span><strong id="detailStarted">Now</strong>
  </div>
</aside>

<section class="result-panel">
  <div class="panel-head">
    <h2 id="resultTitle">${variant === 'panel' ? 'Momentum' : 'Result'}</h2>
    <div class="result-actions" aria-label="Momentum actions">
      <button class="mini-button" data-result-action="copy" title="Copy momentum" aria-label="Copy momentum">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h10v12H8z"/><path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <button class="mini-button" data-result-action="clear" title="Clear momentum" aria-label="Clear momentum">
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

module.exports = { renderCockpitHtml };
