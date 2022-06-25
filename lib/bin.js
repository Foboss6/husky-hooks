#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const p = require('path');
const funcs = require('./');

function help(exitCode) {
  console.log(`Usage:
  'husky-git-hooks install' or 'husky-git-hooks i' for configure package,
    flags:
    -lint-staged - adds the lint-staged package to your project, will be used before each commit;
  '-h' or 'help' to see help,
  -v - shows husky-git-hooks package's version`);
  process.exit(exitCode);
}

const [, , cmd, ...args] = process.argv;
const commands = {
  i: () => funcs.install(args),
  install: () => funcs.install(args),
  help: () => help(0),
  ['-h']: () => help(0),
  ['-v']: () => console.log(require(p.join(__dirname, '../package.json')).version),
};

try {
  commands[cmd] ? commands[cmd]() : help(0);
} catch (err) {
  console.error('\x1b[31m%s\x1b[0m', err instanceof Error ? `husky-git-hooks: ${err.message}` : err);
  process.exit(1);
}
