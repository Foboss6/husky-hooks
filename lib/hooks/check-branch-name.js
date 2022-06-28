const { exec } = require('child_process');

exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
  if (!/(feat|docs|fix|refactor|perf|style|test)\/.*/gim.test(stdout)) {
    throw new Error(
      'The branch is not in the acceptable format! Please rename the branch following branch naming convention.'
    );
  }
});
