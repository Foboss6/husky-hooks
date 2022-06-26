#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const p = require('path');
const { install } = require('./');

function help(exitCode) {
  console.log(`Usage:
  'husky-git-hooks install' or 'husky-git-hooks i' for configure package,
    flags:
    -lint-staged (or just '-ls') - adds the lint-staged package to your project, will be used before each commit;
  '-h' or 'help' to see help,
  '-v' - shows husky-git-hooks package's version`);
  process.exit(exitCode);
}

function wrongCMD() {
  console.log('\x1b[31m%s\x1b[0m', 'Wrong command!');
  help(2);
}

const [, , cmd, ...args] = process.argv;
const commands = {
  i: () => install(args),
  install: () => install(args),
  help: () => help(0),
  ['-h']: () => help(0),
  ['-v']: () => console.log(require(p.join(__dirname, '../package.json')).version),
};

try {
  commands[cmd] ? commands[cmd]() : wrongCMD();
} catch (err) {
  console.error('\x1b[31m%s\x1b[0m', err instanceof Error ? `husky-git-hooks: ${err.message}` : err);
  process.exit(1);
}
