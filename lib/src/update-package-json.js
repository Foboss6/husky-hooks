'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.updatePackgeJsonFile = void 0;
const fs = require('fs');
function updatePackgeJsonFile(path) {
  try {
    //prepare path to package.json
    path += 'package.json';
    //check file existing
    if (!fs.existsSync(path)) throw new Error();

    // read JSON object from file
    const readedData = fs.readFileSync(path);
    const jsonObj = JSON.parse(readedData);
    let script = jsonObj.scripts?.prepare;

    //check and update 'prepare' script
    if (script?.length) {
      if (!/git-hooks-husky update/g.test(script)) {
        script += ' && git-hooks-husky update';
      }
    } else {
      script = 'git-hooks-husky update';
    }

    //check if update needed
    if (jsonObj.scripts?.prepare === script) return;

    if (!jsonObj.scripts) jsonObj.scripts = {};
    jsonObj.scripts.prepare = script;

    // convert JSON object to string
    const dataToWrite = JSON.stringify(jsonObj, null, 4);

    // write JSON string to a file
    fs.writeFileSync(path, dataToWrite);
    console.log('\x1b[30m%s\x1b[0m', "The script 'prepare' in 'package.json' was updated.");
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', "File 'package.json' was not updated!");
  }
}

exports.updatePackgeJsonFile = updatePackgeJsonFile;
