const fs = require("fs");
try {
  //prepare path to package.json
  let path = __dirname;
  if (path.includes("/src")) path = path.split("/src")[0];
  path += "/package.json";

  //check file existing
  if (!fs.existsSync(path)) throw new Error("File 'package.json' not found!");

  // read JSON object from file
  const readedData = fs.readFileSync(path);
  const jsonObj = JSON.parse(readedData);

  //check and update 'prepare' script
  if (jsonObj.scripts?.prepare) {
    if (!jsonObj.scripts.prepare.includes("husky install")) {
      jsonObj.scripts.prepare += " && husky install";
    }
  } else {
    if (!jsonObj.scripts) jsonObj.scripts = {};
    jsonObj.scripts.prepare = "husky install";
  }

  // convert JSON object to string
  const dataToWrite = JSON.stringify(jsonObj, null, 2);

  // write JSON string to a file
  fs.writeFileSync(path, dataToWrite);
  console.log("The script 'prepare' in 'package.json' was updated.");
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", error);
}
