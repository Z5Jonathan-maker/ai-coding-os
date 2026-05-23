import fs from 'node:fs';

const source = fs.readFileSync(new URL('./format.js', import.meta.url), 'utf8');
const duplicateSplits = (source.match(/\.split\(' '\)/g) || []).length;
const duplicateStringNormalizers = (source.match(/String\(value \|\| ''\)/g) || []).length;

console.log(`duplicate_splits=${duplicateSplits}`);
console.log(`duplicate_string_normalizers=${duplicateStringNormalizers}`);

if (duplicateSplits > 1 || duplicateStringNormalizers > 1) process.exit(1);
