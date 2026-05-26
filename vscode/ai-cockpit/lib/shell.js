'use strict';

const cp = require('child_process');
const os = require('os');
const vscode = require('vscode');

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

function shellExecSync(cmd, options = {}) {
  const res = cp.spawnSync('/bin/zsh', ['-lc', cmd], {
    cwd: options.cwd || cwd(),
    timeout: options.timeout || 30000,
    maxBuffer: options.maxBuffer || 1024 * 1024 * 4,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
  });
  return {
    ok: res.status === 0,
    status: res.status || 0,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    text: `${res.stdout || ''}${res.stderr || ''}`.trim(),
  };
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

module.exports = {
  askPrompt,
  cwd,
  runTerminal,
  shellExec,
  shellExecSync,
  showOutput,
};
