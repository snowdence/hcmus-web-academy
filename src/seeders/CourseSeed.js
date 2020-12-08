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

const data = [
  {
    name: "The Web Developer Bootcamp 2020",
    overview:
      "JUST COMPLETELY REDONE - The only course you need to learn web development - HTML, CSS, JS, Node, and More!",
    thumbnail:
      "https://img-a.udemycdn.com/course/240x135/625204_436a_3.jpg?jsnAhoyHSwu5dTS_zJXm4tr2u6ScADZXf5Lp1V6dpZMDGOpNPQccqubkX37bIwjCT6KV9JVJ_dr3ybr5LNS-ip4fCBFRgbeLsYFhmtxmd-U7IGux87gRYpTGVtNomO0",
    description: "<b>Mô tả cho khoá</b>",
    price: 180,
    price_discount: 17,
  },
];

const up = () => {};
const down = () => {};
const execute = () => {};
execute();
module.exports = execute;
