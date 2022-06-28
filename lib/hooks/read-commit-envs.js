const { exec } = require('child_process');

exec('git --no-pager log @@{1}..@@{0} --format=oneline', (err, stdout) => {
  const splittedLines = stdout.toString().split('\n');
  const breakingFiles = new Set();
  const breakingEnvs = new Set();

  splittedLines.forEach((line) => {
    if (!/BREAKING CHANGE/.test(line)) return;

    if (line.includes('env:')) {
      const envs = line.split('env:')?.[1]?.replace(/ |\n+/g, '').split(',');
      envs.forEach(breakingEnvs.add, breakingEnvs);
      line = line.split('env:')[0];
    }

    const files = line.split('Changed:')?.[1]?.replace(/ |\n+/g, '').split(',');
    files.forEach((file) => {
      if (file) breakingFiles.add(file);
    });
  });

  if (!breakingFiles.size) return;
  console.log('\x1b[33m%s', 'There was some BREAKING CHANGES in files:');
  console.log('%s\x1b[0m', ` - ${Array.from(breakingFiles).join('\n - ')}`);

  if (!breakingEnvs.size) return;
  console.log('\x1b[36m%s', 'Next ENVs was changed:');
  console.log('%s\x1b[0m', ` - ${Array.from(breakingEnvs).join('\n - ')}`);
});
