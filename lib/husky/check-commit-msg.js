const fs = require('fs');
const { exec } = require('child_process');
const { execSync } = require('child_process');

let commitMsg = fs.readFileSync('.git/COMMIT_EDITMSG').toString();
if (commitMsg[commitMsg.length - 1] === '\n') commitMsg = commitMsg.slice(0, -1);
exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
  const rx = /(feature|feat|docs|bugfix|fix|refactor|perf|style|test)\/(DMP|dmp)-([0-9]*)-?.*/gim;
  let res = rx.exec(stdout);
  if (!res) {
    console.warn('The branch is not in the acceptable format! Trying to rename it.');
    //try to rename the branch
    const newBranchName = renameBranch(stdout);
    res = rx.exec(newBranchName);
  }
  //configure prefix for commit message
  if (!res[3]) console.warn(`The branch name doesn't contain the task's number.`);
  const [, branchType, , taskNumber = '0'] = res;
  let prefix = '';
  switch (branchType) {
    case 'feature': {
      prefix = `feat(DMP-${taskNumber}):`;
      break;
    }
    case 'bugfix': {
      prefix = `fix(DMP-${taskNumber}):`;
      break;
    }
    default:
      prefix = `${branchType}(DMP-${taskNumber}):`;
  }
  console.log('Adjusting the commit msg to follow DMP- format...');

  //check for braking changes
  const breakingChanges = [];
  try {
    const criticalFiles = fs.readFileSync(`.breakings.rc`).toString().split('\n');
    const checkoutedFiles = execSync('git diff --cached --name-only --diff-filter=ACM').toString();
    for (const file of criticalFiles) {
      if (file && checkoutedFiles.includes(file)) breakingChanges.push(file);
    }
  } catch (error) {
    console.warn(`It's impossible to check for breaking changes. Error: ${JSON.stringify(error)}`);
  }

  if (commitMsg.indexOf(prefix) === -1) {
    commitMsg = `${prefix} ${commitMsg}`;
  }
  if (breakingChanges.length) {
    commitMsg = `BREAKING CHANGE: ${commitMsg}. Changed: ${breakingChanges.join(', ')}`;
  }
  fs.writeFileSync('.git/COMMIT_EDITMSG', commitMsg);
});

/* Renames branch according to branch naming convention.
 * receives branch's old name
 * returns branch's new name if renaming succes, or throws an error if renaming is impossible
 * */
function renameBranch(oldName) {
  const splittedName = oldName.split('/');
  let newName = '';
  switch (true) {
    case /fea|fae|atu|ure/.test(splittedName[0]): {
      newName = 'feature';
      break;
    }
    case /fix|bug/.test(splittedName[0]): {
      newName = 'fix';
      break;
    }
    case /doc/.test(splittedName[0]): {
      newName = 'docs';
      break;
    }
    default:
      newName = 'feature';
  }
  // check the branch name contains '/' and 'dmp'
  if (splittedName?.length === 1 || !/(DMP|dmp)-*/gim.test(oldName)) {
    const taskNumb = /-(\d+)-/.exec(oldName)?.[1] ?? /\d+/.exec(oldName)?.[0];
    if (!taskNumb)
      throw new Error('Cannot rename the branch. Please, rename it manually, according to branch naming convention.');
    const descrPart = oldName.split(taskNumb)[1];
    newName += `/DMP-${taskNumb}${descrPart?.[0] === '-' ? descrPart : '-' + descrPart}`;
  } else newName += `/${splittedName[1]}`;
  // execute script for renaming the branch
  try {
    execSync(`git branch -m ${newName}`);
  } catch (er) {
    throw new Error('Cannot rename the branch. Please, rename it manually, according to branch naming convention.');
  }
  console.log(`Branch successfully renamed to '${newName}'`);
  return newName;
}
