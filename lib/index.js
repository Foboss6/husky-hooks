'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.install = void 0;

const { execSync } = require('child_process');
const fs = require('fs');
const { updatePackgeJsonFile } = require('./update-package-json');
const log = (msg) => console.log(`husky-git-hooks: ${msg}`);

function install() {
  const path = __dirname.split('node_modules')[0];
  const filesList = [
    'check-branch-name.js',
    'check-commit-msg.js',
    'check-last-commit.js',
    'read-commit-envs.js',
    'commit-msg',
    'post-merge',
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
  log('Git hooks updated');
}
exports.install = install;
