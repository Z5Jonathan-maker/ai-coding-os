'use strict';

const fs = require('fs');

function quote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function routerAskCommand(purpose, routeTask, runTask) {
  if (purpose) return `router-ask --purpose ${quote(purpose)} ${quote(runTask)}`;
  return `router-ask ${quote(runTask)}`;
}

function parseRouterJson(text) {
  try {
    return JSON.parse(text || '{}');
  } catch (_) {
    return { result: text || '', meta: {} };
  }
}

function readJsonFile(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return fallback;
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

function executionInstruction(mode) {
  const modes = {
    plan: 'Cockpit workflow mode: Plan. Produce a concise implementation plan and required checks before mutating files.',
    execute: 'Cockpit workflow mode: Execute. Make the smallest correct change, then run the relevant verification.',
    review: 'Cockpit workflow mode: Review. Inspect diffs, risks, missing tests, and regressions before proposing changes.',
    debug: 'Cockpit workflow mode: Debug. Reproduce first, isolate root cause, then patch and verify.',
  };
  return modes[mode] || modes.execute;
}

function normalizeTrustGate(text) {
  try {
    const gate = JSON.parse(text);
    const hits = (gate.hits || []).map((hit) => `- ${hit.id}: ${hit.reason}`).join('\n');
    return [
      `Decision: ${String(gate.decision || 'unknown').toUpperCase()}`,
      `Mode: ${gate.mode || 'review'}`,
      gate.message || '',
      hits,
    ].filter(Boolean).join('\n');
  } catch (_) {
    return text || 'Trust gate blocked this task.';
  }
}

function summarizeReadiness(text) {
  const failed = /FAIL/.test(text);
  const lines = String(text || '').split('\n').filter(Boolean);
  return {
    ok: !failed,
    title: failed ? 'Attention needed' : 'System ready',
    body: lines.slice(5, 14).join('\n') || text,
  };
}

module.exports = {
  executionInstruction,
  normalizeTrustGate,
  parseRouterJson,
  permissionInstruction,
  quote,
  readJsonFile,
  routerAskCommand,
  summarizeReadiness,
};
