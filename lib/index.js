'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.install = exports.update = void 0;

const fs = require('fs');
const { execSync } = require('child_process');
const { updatePackgeJsonFile } = require('./src/update-package-json');
const { addLintStagedToPackage } = require('./src/add-lint-staged');

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
    execSync(
      `cp -R ${path}node_modules/git-hooks-husky/lib/config-files/.githookshuskyrc ${path}.husky/.githookshuskyrc`
    );
    for (const file of filesList) {
      execSync(`cp -R ${path}node_modules/git-hooks-husky/lib/hooks/${file} ${path}.husky/${file}`);
    }
  } catch (error) {
    console.error(error);
  }
  //check arguments
  if (args.includes('-lint-staged') || args.includes('-ls')) {
    try {
      addLintStagedToPackage(path);
      execSync(
        `cp -R ${path}node_modules/git-hooks-husky/lib/config-files/.lintstagedrc.json ${path}.lintstagedrc.json`
      );
      execSync(`cp -R ${path}node_modules/git-hooks-husky/lib/hooks/pre-commit ${path}.husky/pre-commit`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    }
  }
  if (args.includes('-breaking-change') || args.includes('-br')) {
    try {
      addLintStagedToPackage(path);
      execSync(`cp -R ${path}node_modules/git-hooks-husky/lib/config-files/.breakingsrc ${path}.breakingsrc`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    }
  }
  console.log('\x1b[32m%s\x1b[0m', 'git-hooks-husky: Git hooks updated');
}
exports.install = install;

function update(curr_version) {
  const config = JSON.parse(fs.readFileSync(`${__dirname.split('node_modules')[0]}.husky/.githookshuskyrc`).toString());
  if (curr_version.includes(config.version)) {
    console.log('\x1b[32m%s\x1b[0m', 'git-hooks-husky: Git hooks already uptodate');
    return;
  }
  install();
}
exports.update = update;
