const mongoClient = require("mongoose");
mongoClient
  .connect("mongodb://localhost:27017/hwa", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));
const faker = require("faker");
const User = require("../models/user");
const { series } = require("gulp");

let seed = function () {
  for (let i = 0; i < 10; i++) {
    let fake_user = {
      username: faker.internet.userName(),
      password: "matkhau123",
      email: faker.internet.email(),
      fullname: faker.name.findName(),
      avatar: faker.image.avatar(),
      role: 1,
      phone: faker.phone.phoneNumber("84(###) ### ###'"),
      verified: true,
    };
    const init_user = User(fake_user);
    init_user
      .save()
      .then((user) => {
        console.log("Success to insert user");
        console.log(user);
      })
      .catch((err) => {
        console.log("Error");
      });
  }
};
seed();
