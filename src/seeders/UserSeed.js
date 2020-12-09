const env = require("dotenv").config();

const mongoClient = require("mongoose");

mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch((err) => console.error("Error mongodb:", err));

const faker = require("faker");
const User = require("../models/user");

const { series } = require("gulp");
const list_default = [
  {
    username: "admin",
    password: "matkhauadmin",
    email: "admin@wifosoft.com",
    fullname: "Trần Minh Đức",
    avatar:
      "https://avatars0.githubusercontent.com/u/26925860?s=460&u=06af4e5d2369adbd8468ae843e5d6be3dfd9f70f&v=4",
    role: 0,
    phone: faker.phone.phoneNumber("84(123) 456 789 '"),
    verified: true,
  },

  {
    username: "chauvu",
    password: "matkhauadmin",
    email: "mod@wifosoft.com",
    fullname: "Vũ Minh Châu",
    avatar:
      "https://scontent.fsgn4-1.fna.fbcdn.net/v/t1.0-9/107566490_753563212082043_7893256089881654921_o.jpg?_nc_cat=103&ccb=2&_nc_sid=a4a2d7&_nc_ohc=5ZSalFYTu90AX8OU_Q5&_nc_oc=AQnXayAAPuxCiRl6n4XSVTigR8AyZtHqd8e19JeNzRKOSpqk4xW0qCu2Ba0utv4Ag4E&_nc_ht=scontent.fsgn4-1.fna&oh=c4d4ad7a7365d110523ebcd0d9621e83&oe=5FF39A9D",
    role: 1,
    phone: faker.phone.phoneNumber("84(123) 456 789 '"),
    verified: true,
  },
];
let default_seed = (list_default) => {
  for (let item of list_default) {
    const init_user = User(item);
    init_user
      .save()
      .then((user) => console.log("User inserted", user))
      .catch((err) => console.log("Erorr"));
  }
};
let seed = function () {
  for (let i = 0; i < 10; i++) {
    let fake_user = {
      username: faker.internet.userName(),
      password: "matkhau123",
      email: faker.internet.email(),
      fullname: faker.name.findName(),
      avatar: faker.image.avatar(),
      role: 2,
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

async function up() {
  default_seed(list_default);
  seed();
}
async function down() {
  const data = await User.collection.drop();
}
const execute = async () => {
  try {
    await down();
  } catch (err) {
    console.log("error" + err);
  }

  try {
    await up();
  } catch (err) {
    console.log("error" + err);
  }
};
//execute();
module.exports = execute;
