#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const p = require('path');
const { install, update } = require('./');

function help(exitCode) {
  console.log(`Usage: after 'git-hooks-husky' write one of commands bellow:
  'install' or 'i' for configure package,
    flags:
    '-lint-staged' (or just '-ls') - adds the lint-staged package to your project, will be used before each commit,
    '-breaking-change' (or just '-br') - for checking changes in files from the list (file: husky/.breakingsrc);
  'update' or 'u' for updating all git hooks;
  'help' or '-h' to see help,
  '-v' - shows git-hooks-husky package version.`);
  process.exit(exitCode);
}

function wrongCMD() {
  console.log('\x1b[31m%s\x1b[0m', 'Wrong command!');
  help(2);
}

function getCurrentVersion() {
  return require(p.join(__dirname, '../package.json')).version;
}

const [, , cmd, ...args] = process.argv;
const commands = {
  i: () => install(args),
  install: () => install(args),
  update: () => update(getCurrentVersion()),
  u: () => update(getCurrentVersion()),
  help: () => help(0),
  ['-h']: () => help(0),
  ['-v']: () => console.log(getCurrentVersion()),
};

try {
  commands[cmd] ? commands[cmd]() : wrongCMD();
} catch (err) {
  console.error('\x1b[31m%s\x1b[0m', err instanceof Error ? `git-hooks-husky: ${err.message}` : err);
  process.exit(1);
}
