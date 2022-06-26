'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.install = void 0;

const fs = require('fs');
const { execSync } = require('child_process');
const { updatePackgeJsonFile } = require('./update-package-json');
const { addLintStagedToPackage } = require('./add-lint-staged');

/**
 * Function copies needed files and makes configurations
 * @param {Array<string>} args An array of all flags or additional comands from command line
 */
function install(args) {
  const path = __dirname.split('node_modules')[0];
  const filesList = ['check-branch-name.js', 'check-commit-msg.js', 'check-last-commit.js', 'commit-msg', 'pre-push'];
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
      execSync(`cp -R ${path}node_modules/husky-git-hooks/lib/.lintstagedrc.json ${path}.lintstagedrc.json`);
      execSync(`cp -R ${path}node_modules/husky-git-hooks/lib/husky/pre-commit ${path}.husky/pre-commit`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    }
  }
  console.log('\x1b[32m%s\x1b[0m', 'husky-git-hooks: Git hooks updated');
}
exports.install = install;
