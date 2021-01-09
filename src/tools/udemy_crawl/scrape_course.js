const axios = require("axios");
const utils = require("./utils");
const Course = require("../../models/Course");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");

const mongoClient = require("mongoose");
const env = require("dotenv").config();

const { PerformanceObserver, performance } = require("perf_hooks");
const NUMBER_UDEMY_PERPAGE_SCRAPE = 16;
const NUMBER_UDEMY_COURSE_SCRAPE = NUMBER_UDEMY_PERPAGE_SCRAPE * 20;
let success = 0;
let error = 0;
mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));
//demo

const URL_UDEMY_COURSE = `https://www.udemy.com/api-2.0/discovery-units/all_courses?`;
const list_category = [
  {
    name: "IT",
    description: "Lĩnh vực IT",
    sub_category: [
      {
        name: "LậP trình web",
        description: "Lập trình web html, react, vue,etc",
        udemy_catid: 8,
      },
      {
        name: "Lập trình di động",
        description: "Lập trình cho Android/IOS",
        udemy_catid: 10,
      },
    ],
  },
  {
    name: "Business",
    description: "Ngành quản trị kinh doanh",
    sub_category: [],
  },
];

const getRequest = async (url, params) => {
  try {
    var t0 = performance.now();

    const resp = await axios.get(url + utils.convertToParams(params));

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};

//mobile 10 - sub : 8
const getCourseTask = async (sub_catid, local_catid, page = 1) => {
  console.log("Begin get coursee task ");

  const params = {
    p: page,
    page_size: NUMBER_UDEMY_PERPAGE_SCRAPE,
    subcategory_id: sub_catid,
    source_page: "subcategory_page",
    locale: "en_US",
    currency: "usd",
    navigation_locale: "en_US",
    sos: "ps",
    fl: "scat",
    subcategory: "",
    instructional_level: "",
    lang: "",
    closed_captions: "",
    fields: {
      course:
        "id,title,headline,description,published_time,created,published_title,created,published_time,image_480x270,price",
    },
  };

  let data = await getRequest(URL_UDEMY_COURSE, params);
  //utils.writeFile("output.json", JSON.stringify(data));
  const { unit } = data;
  let course_items = unit.items;
  let tasks = [];

  for (let [idx, v] of course_items.entries()) {
    console.log(`IDX: ${idx} ID: ${v.id} ${v.title}`);
    let cdata = {
      name: v.title,
      overview: v.headline,
      thumbnail: v.image_480x270,
      description: v.description,
      //
      sub_category: local_catid,
      count_enroll: 0,
      count_view: 0,
      price: parseFloat(v.price ? v.price.substring(1) : 0),
      price_discount: null,
      rate: 0,
    };
    const dbCourse = Course(cdata);
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
  await Promise.all(tasks);

  console.log("End request");
};
async function excuteScrapeCourse(catid, local_catid, size, per_page = 16) {
  let max_page = Math.ceil(size / per_page);
  let task = [];
  for (let i = 1; i <= max_page; i++) {
    task.push(getCourseTask(catid, local_catid, i));
  }
  var t0 = performance.now();
  await Promise.all(task);
  var t1 = performance.now();
  console.log(
    "Call to excuteScrapeCourse() took " + (t1 - t0) + " milliseconds."
  );
}

const up = async () => {
  let tasks = [];

  for (let category of list_category) {
    const dbCategory = Category({
      name: category.name,
      description: category.description,
    });
    dbCategory
      .save()
      .then((res_category) => {
        let res_id_category = res_category._id;

        for (let sub_category of category.sub_category) {
          let udemy_catid = sub_category.udemy_catid;
          const dbSubCategory = SubCategory({
            name: sub_category.name,
            description: sub_category.description,
            parent_category: res_id_category,
          });

          dbSubCategory
            .save()
            .then((res_sub_category) => {
              excuteScrapeCourse(
                udemy_catid,
                res_sub_category._id,
                NUMBER_UDEMY_COURSE_SCRAPE,
                NUMBER_UDEMY_PERPAGE_SCRAPE
              );
            })
            .catch((err) => {
              console.log("[SubCategory Error] ", err);
            });
        }
      })
      .catch((err) => console.log(err));
  }
};
const down = async () => {
  try {
    const cr1 = await Category.collection.drop();
    const cr2 = await SubCategory.collection.drop();

    const cr3 = await Course.collection.drop();
    console.log("Ok");
  } catch (err) {
    console.log("error :" + err);
  }
};
const executeAll = async () => {
  await down();
  await up();
};
executeAll();
//wrapper();
