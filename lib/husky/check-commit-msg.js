const fs = require('fs');
const { exec } = require('child_process');
const { execSync } = require('child_process');

let commitMsg = fs.readFileSync('.git/COMMIT_EDITMSG').toString();
if (commitMsg[commitMsg.length - 1] === '\n') commitMsg = commitMsg.slice(0, -1);
exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
  const rx = /(feat|docs|fix|refactor|perf|style|test)\/.*/gim;
  let res = rx.exec(stdout);
  if (!res) {
    console.warn('The branch is not in the acceptable format! Trying to rename it.');
    //try to rename the branch
    const newBranchName = renameBranch(stdout);
    res = rx.exec(newBranchName);
  }
  //configure prefix for commit message
  const [, branchType] = res;
  const prefix = `${branchType}:`;

  console.log('\x1b[30m%s\x1b[0m', 'Adjusting the commit msg...');

  //check for braking changes
  const breakingChanges = [];
  if (fs.existsSync('husky/.breakingsrc')) {
    try {
      const criticalFiles = fs.readFileSync(`husky/.breakingsrc`).toString().split('\n');
      const checkoutedFiles = execSync('git diff --cached --name-only --diff-filter=ACM').toString();
      for (const file of criticalFiles) {
        if (file && checkoutedFiles.includes(file)) breakingChanges.push(file);
      }
    } catch (error) {
      console.warn(`It's impossible to check for breaking changes. Error: ${JSON.stringify(error)}`);
    }
  }

  if (commitMsg.indexOf(prefix) === -1) {
    commitMsg = `${prefix} ${commitMsg}`;
  }
  if (breakingChanges.length) {
    commitMsg = `BREAKING CHANGE: ${commitMsg}. Changed: ${breakingChanges.join(', ')}`;
  }

  fs.writeFileSync('.git/COMMIT_EDITMSG', commitMsg);
});

/** Renames branch according to branch naming convention.
 * @param {string} oldName Branch's old name.
 * @returns Branch's new name if renaming succes, or throws an error if renaming is impossible.
 * */
function renameBranch(oldName) {
  const splittedName = oldName.split('/');
  let newName = '';
  switch (true) {
    case /feta|faet|fat|fet/.test(splittedName[0].toLowerCase()): {
      newName = 'feat';
      break;
    }
    case /fix|fxi|bug/.test(splittedName[0]): {
      newName = 'fix';
      break;
    }
    case /doc/.test(splittedName[0]): {
      newName = 'docs';
      break;
    }
    default:
      newName = 'feat';
  }

  newName += `/${splittedName[1] ? splittedName[1] : splittedName[0]}`;

  // execute script for renaming the branch
  try {
    execSync(`git branch -m ${newName}`);
  } catch (er) {
    throw new Error('Cannot rename the branch. Please, rename it manually, according to branch naming convention.');
  }
  console.log(`Branch successfully renamed to '${newName}'`);
  return newName;
}
