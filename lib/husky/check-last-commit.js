const fs = require('fs');
const { execSync } = require('child_process');
const { stderr } = require('process');

let commitMsg = execSync('git log -1 --format=%s').toString();
if (!/(feat|docs|fix|refactor|perf|style|test):/gim.test(commitMsg)) {
  throw new Error(
    'The last commit has incorrect message. Please, rename it before pushing.\nYou can use next commnd: git commit --amend -m "New commit message"'
  );
}
