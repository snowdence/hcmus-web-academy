const env = require("dotenv").config();
const fs = require("fs");
const faker = require("faker");
const web_data_file = "docs/data_udemy/web_course.json";
const Course = require("../models/Course");
const mongoClient = require("mongoose");

mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));

const read_json_data = (data_file) => {
  let rawdata = fs.readFileSync(data_file);
  let json_parsed = JSON.parse(rawdata);
  return json_parsed;
};
let success = 0;
let error = 0;
let dataset = read_json_data(web_data_file);
const up = () => {
  //
  let tasks = [];
  for (let item of dataset) {
    console.log("name is : " + item.name);
    const dbCourse = Course(item);
    // const dbCourse = Course({
    //   name: item.name,
    //   overview: item.overview,
    //   thumbnail: item.thumbnail,
    //   description: item.description,
    //   price: item.price,
    //   price_discount: item.price_discount,
    // });
    tasks.push(
      dbCourse
        .save()
        .then((record) => {
          success++;
        })
        .catch((err) => {
          error++;
          console.log(err);
        })
    );
  }
  return Promise.all(tasks);
};
const down = async () => {
  try {
    const cr = await Course.collection.drop();
  } catch (err) {
    console.log("error :" + err);
  }
};
const execute = async () => {
  // try {
  //   await down();
  // } catch (err) {
  //   console.log("[category seed up()]:", err);
  // }
  await down();
  try {
    await up();
  } catch (err) {
    console.log("[category seed up()]:", err);
  }
  console.log(
    `[CategorySeed] Completed!!! Success  ${success} Error: ${error}`
  );
};
//execute();
module.exports = execute;
