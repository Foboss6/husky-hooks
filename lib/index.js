'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.install = exports.update = void 0;

const fs = require('fs');
const p = require('path');
const { execSync } = require('child_process');
const { updatePackgeJsonFile } = require('./src/update-package-json');
const { addLintStagedToPackage } = require('./src/add-lint-staged');

/**
 * Function copies needed files and makes configurations
 * @param {Array<string>} args An array of all flags or additional comands from command line
 */
function install(args) {
  const path = __dirname.split('node_modules')[0];
  const filesList = [
    'config-files/.huskygithooksrc',
    'check-branch-name.js',
    'check-commit-msg.js',
    'check-last-commit.js',
    'commit-msg',
    'pre-push',
  ];
  //update script 'prepare' in package.json
  try {
    updatePackgeJsonFile(path);
  } catch (error) {
    console.error(error);
  }
  try {
    //check husky has been installed
    if (!fs.existsSync(`${path}.husky`)) execSync('npx husky install');
    //copy needed files into working directory
    for (const file of filesList) {
      execSync(`cp -R ${path}node_modules/husky-git-hooks/lib/husky/${file} ${path}.husky/${file}`);
    }
  } catch (error) {
    console.error(error);
  }
  //check arguments
  if (args.includes('-lint-staged') || args.includes('-ls')) {
    try {
      addLintStagedToPackage(path);
      execSync(
        `cp -R ${path}node_modules/husky-git-hooks/lib/config-files/.lintstagedrc.json ${path}.lintstagedrc.json`
      );
      execSync(`cp -R ${path}node_modules/husky-git-hooks/lib/husky/pre-commit ${path}.husky/pre-commit`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    }
  }
  if (args.includes('-breaking-change') || args.includes('-br')) {
    try {
      addLintStagedToPackage(path);
      execSync(`cp -R ${path}node_modules/husky-git-hooks/lib/config-files/.breakingsrc ${path}.husky/.breakingsrc`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    }
  }
  console.log('\x1b[32m%s\x1b[0m', 'husky-git-hooks: Git hooks updated');
}
exports.install = install;

function update() {
  const curr_version = require(p.join(__dirname, '../package.json')).version;
  const prev_version = require(p.join(__dirname.split('node_modules')[0] + 'husky', '/.huskygithooksrc')).prev_version;
  console.log('Prev_version: ', prev_version);
  console.log('Curr_version: ', curr_version);
  if (curr_version.includes(prev_version)) {
    console.log('\x1b[32m%s\x1b[0m', 'husky-git-hooks: Git hooks already uptodate');
    return;
  }
  install();
}
exports.update = update;
