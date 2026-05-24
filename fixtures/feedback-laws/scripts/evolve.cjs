#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.AI_SYSTEM_ROOT || path.resolve(__dirname, '..');
const desc = process.argv.slice(2).join(' ').trim();
const lawPath = 'memory/feedback-laws.md';

if (!desc) {
  console.error('Usage: ai evolve "recurring pattern"');
  process.exit(2);
}
if (/secret|credential|api key|delete project|rm -rf|destructive/i.test(desc)) {
  console.error('Hard stop: evolve request touches secrets, credentials, deletion, or destructive operations.');
  process.exit(3);
}

const cap = path.join(root, 'memory', 'capabilities.jsonl');
fs.mkdirSync(path.dirname(cap), { recursive: true });
fs.appendFileSync(cap, `${JSON.stringify({ capability: 'fixture-feedback-law', trigger: desc })}\n`);
fs.appendFileSync(path.join(root, lawPath), `\n\n## Fixture Evolved Law\n\n${desc}\n`);
console.log('Evolved: fixture-feedback-law');
console.log(`Capability log: ${cap}`);
