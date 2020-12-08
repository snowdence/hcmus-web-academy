const userSeed = require("./UserSeed");

async function dbSeed() {
  await userSeed.execute();
}
dbSeed();
