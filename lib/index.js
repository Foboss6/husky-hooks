"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const { execSync } = require("child_process");
const log = (msg) => console.log(`husky-hooks: ${msg}`);
function install() {
  const path = __dirname.split("node_modules")[0];
  log(path);
  try {
    execSync(`cp -R ${path}node_modules/husky-git-hooks/.husky ${path}.husky`);
  } catch (error) {
    console.error(error);
  }
  log("Git hooks installed");
}
exports.install = install;
