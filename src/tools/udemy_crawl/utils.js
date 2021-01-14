const fs = require("fs");
const path = require("path");

function writeFile(file, data) {
  fs.writeFile(file, data, function (err, data) {
    if (err) {
      console.log(err);
    }
    //console.log(data);
  });
}
async function readFile(file) {
  const fsPromises = require("fs").promises;
  const data = await fsPromises
    .readFile(file)
    .catch((err) => console.error("Failed to read file", err));

  return JSON.parse(data.toString());
}

let getPairs = (obj, keys = []) =>
  Object.entries(obj).reduce((pairs, [key, value]) => {
    if (typeof value === "object")
      pairs.push(...getPairs(value, [...keys, key]));
    else pairs.push([[...keys, key], value]);
    return pairs;
  }, []);
function convertToParams(obj) {
  let x = getPairs(obj)
    .map(
      ([[key0, ...keysRest], value]) =>
        `${key0}${keysRest.map((a) => `[${a}]`).join("")}=${value}`
    )
    .join("&");
  return x;
}

module.exports = {
  writeFile,
  readFile,
  convertToParams,
};
