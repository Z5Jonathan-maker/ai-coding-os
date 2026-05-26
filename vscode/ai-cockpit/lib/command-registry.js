'use strict';

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
  missionKernel: 'cc-mission-kernel current --json',
  missionLedger: 'cc-mission-ledger list 10 --json',
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
  designHandoff: 'cc-design-handoff create',
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

const OUTPUT_COMMANDS = [
  ['status', 'Status', COMMANDS.status],
  ['systemDemo', 'System Demo', COMMANDS.systemDemo],
  ['routeReceipt', 'Route Receipt', COMMANDS.routeReceipt],
  ['routerMetrics', 'Router Metrics', COMMANDS.routerMetrics],
  ['providerCapacity', 'Provider Capacity', COMMANDS.providerCapacity],
  ['permissionMatrix', 'Permission Matrix', COMMANDS.permissionMatrix],
  ['checkpoints', 'Checkpoints', COMMANDS.checkpoints],
  ['loopQuality', 'Loop Quality', COMMANDS.loopQuality],
  ['diskReadiness', 'Disk Readiness', COMMANDS.diskReadiness],
  ['productReadiness', 'Product Readiness', COMMANDS.productReadiness],
  ['firstRun', 'First Run Doctor', COMMANDS.firstRun],
  ['contextMeter', 'Context Meter', COMMANDS.contextMeter],
  ['contextSnapshot', 'Context Snapshot', COMMANDS.contextSnapshot],
  ['sessionLedger', 'Session Ledger', COMMANDS.sessionLedger],
  ['pulseStatus', 'Pulse Status', COMMANDS.pulseStatus],
  ['nativeAppStatus', 'Native App Status', COMMANDS.nativeAppStatus],
  ['kimiStatus', 'Kimi Status', COMMANDS.kimiStatus],
  ['repoMap', 'Repo Map', 'cc-repo-map 30'],
  ['repoIndex', 'Repo Index', COMMANDS.repoIndex],
  ['semanticIndex', 'Semantic Index', COMMANDS.semanticIndex],
  ['diffHunks', 'Diff Hunks', COMMANDS.diffHunks],
  ['workflowProof', 'Workflow Proof', COMMANDS.workflowProof],
  ['browserProof', 'Browser Proof', COMMANDS.browserProof],
  ['jobs', 'Jobs', COMMANDS.jobs],
];

const HANDOFF_COMMANDS = [
  ['designHandoff', 'promptDesignHandoff'],
  ['designHandoffStatus', 'designHandoffStatus'],
  ['designHandoffContinue', 'designHandoffContinue'],
  ['designHandoffApprove', 'designHandoffApprove'],
  ['designHandoffExecute', 'designHandoffExecute'],
];

module.exports = {
  ACTIONS,
  COMMANDS,
  HANDOFF_COMMANDS,
  OUTPUT_COMMANDS,
};
