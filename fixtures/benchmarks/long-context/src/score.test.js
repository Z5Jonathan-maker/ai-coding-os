import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repoPacket } from './repo-packet.js';
import { summarizeRisks, topRisk } from './risks.js';

const expected = JSON.parse(fs.readFileSync(new URL('../expected-answer.json', import.meta.url), 'utf8'));
const risks = summarizeRisks(repoPacket);
const top = topRisk(repoPacket);

assert.equal(top.severity, expected.topSeverity);
assert.equal(top.id, expected.topRiskId);
assert.deepEqual(new Set(risks.map((risk) => risk.file)), new Set(expected.files));
assert.deepEqual(new Set(risks.map((risk) => risk.citation)), new Set(expected.requiredCitations));

console.log(`top=${top.id}`);
console.log(`citations=${risks.map((risk) => risk.citation).join(',')}`);
