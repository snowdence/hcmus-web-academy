const userSeed = require("./UserSeed");
const categorySeed = require("./CategorySeed");
const courseSeed = require("./CourseSeed");

async function dbSeed() {
  try {
    await userSeed();
    await categorySeed();
    await courseSeed();
    console.log("OK");
  } catch (err) {
    console.log("[SEED INDEX]" + err);
  }
}
dbSeed();
