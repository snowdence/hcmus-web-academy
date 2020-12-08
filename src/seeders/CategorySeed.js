const env = require("dotenv").config();

const mongoClient = require("mongoose");
const Category = require("../models/Category");

const SubCategory = require("../models/SubCategory");
mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));

const faker = require("faker");
let error = 0;
let success = 0;
const list_category = [
  {
    name: "IT",
    description: "Lĩnh vực IT",
    sub_category: [
      {
        name: "LậP trình web",
        description: "Lập trình web html, react, vue,etc",
      },
      {
        name: "Lập trình di động",
        description: "Lập trình cho Android/IOS",
      },
    ],
  },
  {
    name: "Business",
    description: "Ngành quản trị kinh doanh",
    sub_category: [],
  },
];

const up = () => {
  console.log("[CategorySeed] up  ");
  let tasks = [];
  for (let category of list_category) {
    const dbCategory = Category({
      name: category.name,
      description: category.description,
    });
    tasks.push(
      dbCategory
        .save()
        .then((res_category) => {
          success++;
          // console.log("Success to insert category", res_category);
          let res_id_category = res_category._id;

          for (let sub_category of category.sub_category) {
            const dbSubCategory = SubCategory({
              name: sub_category.name,
              description: sub_category.description,
              parent_category: res_id_category,
            });
            dbSubCategory
              .save()
              .then((res_sub_category) => {
                // console.log("Success insert sub category", res_sub_category);
              })
              .catch((err) => {
                console.log("[SubCategory Error] ", err);
              });
          }
        })
        .catch((err) => {
          error++;
          console.log("[CategorySeed Error] ", err);
        })
    );
  }
  return Promise.all(tasks);
};
const down = async () => {
  try {
    const scr = await SubCategory.collection.drop();
  } catch (err) {
    console.log("error");
  }
  try {
    const cr = await Category.collection.drop();
  } catch (err) {
    console.log("error");
  }
};

const execute = async () => {
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
execute();
module.exports = execute;
