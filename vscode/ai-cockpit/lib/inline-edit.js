'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const vscode = require('vscode');
const { askPrompt, shellExec } = require('./shell');

function selectedEditRange(editor) {
  if (editor.selection && !editor.selection.isEmpty) return editor.selection;
  const line = editor.document.lineAt(editor.selection?.active?.line || 0);
  return line.rangeIncludingLineBreak;
}

function surroundingContext(doc, range, radius = 8) {
  const start = Math.max(0, range.start.line - radius);
  const end = Math.min(doc.lineCount - 1, range.end.line + radius);
  const lines = [];
  for (let i = start; i <= end; i++) lines.push(`${i + 1}: ${doc.lineAt(i).text}`);
  return lines.join('\n');
}

function parseRouterJson(text) {
  try {
    return JSON.parse(text || '{}');
  } catch (_) {
    return { result: text || '', meta: {} };
  }
}

function stripCodeFences(text) {
  const value = String(text || '').trim();
  const fenced = value.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  return fenced ? fenced[1] : value;
}

function receiptSummary(meta = {}) {
  const receipt = meta.route_receipt || {};
  const platform = receipt.served_platform || meta.model || 'codex';
  const model = receipt.served_model || meta.model || 'codex';
  const fallback = receipt.fallback_used ? ` fallback_attempts=${receipt.fallback_attempts || 0}` : ' direct';
  const cost = typeof receipt.cost_usd === 'number' ? ` cost=$${receipt.cost_usd.toFixed(4)}` : '';
  const tokens = receipt.tokens_in || receipt.tokens_out ? ` tokens=${receipt.tokens_in || 0}/${receipt.tokens_out || 0}` : '';
  return `${platform}/${model}${fallback}${cost}${tokens}`;
}

function quote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

async function runInlineEdit(output) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Open a file before running AI Cockpit inline edit.');
    return;
  }
  const instruction = await askPrompt('Describe the inline edit to make to the current selection or line');
  if (!instruction) return;
  const doc = editor.document;
  const range = selectedEditRange(editor);
  const original = doc.getText(range);
  const file = vscode.workspace.asRelativePath(doc.uri, false);
  const prompt = [
    'You are editing one code selection. Return only the replacement text. No markdown, no explanation.',
    `File: ${file}`,
    `Language: ${doc.languageId}`,
    `Instruction: ${instruction}`,
    '',
    'Nearby context with line numbers:',
    surroundingContext(doc, range),
    '',
    'Selected text to replace:',
    original,
  ].join('\n');

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'AI Cockpit inline edit',
    cancellable: false,
  }, async () => {
    const result = await shellExec(`router-ask --purpose codex --json ${quote(prompt)}`, {
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 8,
    });
    if (!result.ok) {
      output.appendLine(result.text || 'Inline edit failed.');
      vscode.window.showWarningMessage(`Inline edit failed with code ${result.code}`);
      return;
    }
    const parsed = parseRouterJson(result.stdout || result.text);
    const replacement = stripCodeFences(parsed.result || parsed.text || '');
    if (!replacement) {
      vscode.window.showWarningMessage('Inline edit returned no replacement text.');
      return;
    }
    const proposed = doc.getText().slice(0, doc.offsetAt(range.start)) + replacement + doc.getText().slice(doc.offsetAt(range.end));
    const temp = path.join(os.tmpdir(), `ai-cockpit-${Date.now()}-${path.basename(file || 'inline-edit')}`);
    fs.writeFileSync(temp, proposed);
    await vscode.commands.executeCommand('vscode.diff', doc.uri, vscode.Uri.file(temp), `AI Inline Edit: ${file}`);
    output.appendLine(`Inline edit receipt: ${receiptSummary(parsed.meta)}`);
    const apply = await vscode.window.showInformationMessage('Apply AI inline edit?', { modal: true }, 'Apply');
    if (apply !== 'Apply') return;
    const edit = new vscode.WorkspaceEdit();
    edit.replace(doc.uri, range, replacement);
    const ok = await vscode.workspace.applyEdit(edit);
    if (ok) {
      await doc.save();
      vscode.window.showInformationMessage(`AI inline edit applied. ${receiptSummary(parsed.meta)}`);
    } else {
      vscode.window.showWarningMessage('VS Code rejected the inline edit.');
    }
  });
}

module.exports = { runInlineEdit };
