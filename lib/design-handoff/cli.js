'use strict';

const COMMANDS = new Set(['create', 'list', 'status', 'continue', 'approve', 'execute']);

function createCli(rawArgs) {
  const args = Array.from(rawArgs || []);
  const subcommand = args[0] && !args[0].startsWith('--') && COMMANDS.has(args[0]) ? args[0] : 'create';

  function has(name) {
    return args.includes(`--${name}`);
  }

  function value(name, fallback = '') {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
  }

  function values(name) {
    const out = [];
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] === `--${name}` && args[i + 1] && !args[i + 1].startsWith('--')) {
        out.push(args[i + 1]);
        i += 1;
      }
    }
    return out;
  }

  function promptArgs() {
    const skip = new Set(['--out-dir', '--title']);
    const out = [];
    for (let i = subcommand === 'create' && args[0] === 'create' ? 1 : 0; i < args.length; i += 1) {
      if (skip.has(args[i])) i += 1;
      else if (!args[i].startsWith('--')) out.push(args[i]);
    }
    return out.join(' ').trim();
  }

  return { args, has, promptArgs, subcommand, value, values };
}

module.exports = { createCli };
