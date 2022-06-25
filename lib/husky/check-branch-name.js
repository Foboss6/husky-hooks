const { exec } = require('child_process');

exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
  if (
    !/(feature|feat|docs|bugfix|fix|refactor|perf|style|test)\/(DMP|dmp)-([0-9]*)-.*/gim.test(
      stdout
    )
  ) {
    throw new Error(
      'The branch is not in the acceptable format! Please rename the branch following branch naming convention.'
    );
  }
});
