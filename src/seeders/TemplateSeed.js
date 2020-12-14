const env = require("dotenv").config();
const mongoClient = require("mongoose");

mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch((err) => console.error("Error mongodb ", err));

const faker = require("faker");

const up = () => {};
const down = () => {};
const execute = () => {};
execute();
module.exports = execute;
