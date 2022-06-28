# git-hooks-husky

Configured husky hooks for using "from the box"

# Install

```sh
npm i git-hooks-husky --save-dev
```

or

```sh
yarn add -D git-hooks-husky
```

# Usage

After installing the package, use commands bellow to configure husky git hooks:

```sh
npx git-hooks-husky install
```

or

```sh
yarn git-hooks-husky install
```

After this you will have already configured git hooks in `./.husky` folder.

Also, you can use the flag `-lint-staged` during installation if you want to use **sint-staged** tool for checking your code with **eslint**. You need to configure **eslint** for your project, and check configurations for **lint-staged** in file `./.lintstagedrc.json`.

# Used packages

| package     | documentation                             |
| ----------- | ----------------------------------------- |
| husky       | https://typicode.github.io/husky          |
| lint-staged | https://codecov.io/gh/okonet/lint-staged/ |
