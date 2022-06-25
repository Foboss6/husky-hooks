'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.addLintStagedToPackage = void 0;
const fs = require('fs');
function addLintStagedToPackage(path) {
  try {
    //prepare path to package.json
    path += 'package.json';
    //check file existing
    if (!fs.existsSync(path)) throw new Error();

    // read JSON object from file
    const readedData = fs.readFileSync(path);
    const jsonObj = JSON.parse(readedData);
    let script = jsonObj.scripts?.['pre-commit'];

    //check and update 'prepare' script
    if (script?.length) {
      if (!/lint-staged/g.test(script)) {
        script += ' && lint-staged --allow-empty';
      }
    } else {
      script = 'lint-staged --allow-empty';
    }

    //check if update needed
    if (jsonObj.scripts?.['pre-commit'] === script) return;

    if (!jsonObj.scripts) jsonObj.scripts = {};
    jsonObj.scripts['pre-commit'] = script;

    // convert JSON object to string
    const dataToWrite = JSON.stringify(jsonObj, null, 4);

    // write JSON string to a file
    fs.writeFileSync(path, dataToWrite);
    console.log("The script 'pre-commit' in 'package.json' was updated.");
  } catch (error) {
    throw new Error("File 'package.json' was not updated!");
  }
}

exports.addLintStagedToPackage = addLintStagedToPackage;
