const user = require("./UserSeed");
const category = require("./CategorySeed");
const course = require("./CourseSeed");

async function dbSeed() {
  try {
    await user();
    await category();
    await course();
    console.log("OK");
  } catch (err) {
    console.log("[SEED INDEX]" + err);
  }
}
dbSeed();
