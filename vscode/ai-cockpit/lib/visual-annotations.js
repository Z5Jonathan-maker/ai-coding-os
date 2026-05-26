'use strict';

const fs = require('fs');
const path = require('path');

function visualAnnotationBase(repoRoot) {
  return path.join(repoRoot, '.ai', 'visual-annotations');
}

function isInsideVisualAnnotationBase(repoRoot, file) {
  const relative = path.relative(visualAnnotationBase(repoRoot), path.resolve(file));
  return Boolean(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

function readJsonFile(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function readVisualAnnotationReceipts(repoRoot, limit = 12, missionDir = '') {
  const base = visualAnnotationBase(repoRoot);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .reverse()
    .slice(0, Math.max(limit * 4, limit))
    .map((name) => {
      const file = path.join(base, name);
      const receipt = readJsonFile(file, null);
      if (!receipt) return null;
      return {
        ...receipt,
        file,
        relativeFile: path.relative(repoRoot, file),
        mtime: fs.statSync(file).mtimeMs,
      };
    })
    .filter((receipt) => {
      if (!receipt) return false;
      if (!missionDir) return true;
      return !receipt.mission_dir || receipt.mission_dir === missionDir || receipt.mission_dir === path.relative(repoRoot, missionDir);
    })
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)
    .map(({ mtime, ...receipt }) => receipt);
}

function writeVisualAnnotationReceipt(repoRoot, payload = {}) {
  const dir = visualAnnotationBase(repoRoot);
  fs.mkdirSync(dir, { recursive: true });
  const createdAt = new Date().toISOString();
  const id = `visual-annotation-${createdAt.replace(/[:.]/g, '-')}`;
  const note = cleanBoundedText(payload.note, 4000);
  const url = cleanBoundedText(payload.url, 2048);
  const receipt = {
    schema: 'ai-coding-os.visual-annotation.v1',
    id,
    created_at: createdAt,
    repo: repoRoot,
    status: 'captured',
    selection_kind: payload.selection_kind || 'region',
    url,
    note,
    rect: payload.rect || {},
    viewport: payload.viewport || {},
    selector: payload.selector || null,
    route_hint: payload.routeHint || payload.route_hint || 'design/kimi',
    mission_id: payload.missionId || payload.mission_id || '',
    mission_dir: payload.missionDir || payload.mission_dir || '',
    source: 'vscode.ai-cockpit.visual-edit',
  };
  const file = path.join(dir, `${id}.json`);
  fs.writeFileSync(file, `${JSON.stringify(receipt, null, 2)}\n`);
  return { file, receipt };
}

function cleanBoundedText(value, limit) {
  return String(value || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, limit);
}

function validAnnotationPayload(payload = {}) {
  const note = cleanBoundedText(payload.note, 4000).trim();
  const rect = payload.rect && typeof payload.rect === 'object' ? payload.rect : {};
  const hasRect = Number(rect.width) > 0 && Number(rect.height) > 0;
  const url = cleanBoundedText(payload.url, 2048);
  let validUrl = false;
  try {
    const parsed = new URL(url);
    validUrl = ['http:', 'https:', 'about:'].includes(parsed.protocol);
  } catch (_) {
    validUrl = false;
  }
  return { ok: Boolean(note && hasRect && validUrl), note, url, hasRect, validUrl };
}

module.exports = {
  cleanBoundedText,
  isInsideVisualAnnotationBase,
  readVisualAnnotationReceipts,
  validAnnotationPayload,
  writeVisualAnnotationReceipt,
};
