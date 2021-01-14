const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const CourseModel = require("../models/Course");
const FeedbackModel = require("../models/Feedback");
const SubCategoryModel = require("../models/SubCategory");

const getHomePage = async (req, res, next) => {
  const limTop10 = 10;
  const limTop5 = 5;
  const top10Courses = await CourseModel.find().lean().limit(limTop10);
  const top5Courses = await CourseModel.find()
    .lean()
    .limit(limTop5)
    .skip(limTop10);
  const top10NewCourses = await CourseModel.find()
    .lean()
    .limit(limTop10)
    .skip(limTop10 + limTop5);
  res.render("pages/home", {
    title: "Home",
    top10Courses,
    top5Courses,
    top10NewCourses,
    top5cate
  });
};

const courseDetail = async (req, res, next) => {
  const query = CourseModel.where({ _id: req.params.id });
  const course = await query.findOne().lean();
  const limit = 5;
  const top5 = await CourseModel.find({ sub_category: course.sub_category })
    .lean()
    .limit(limit);
  const teacher = await UserModel.findOne({ _id: course.teacher }).lean();
  var d = new Date(course.updatedAt);
  course.updatedAt = d.toLocaleString();
  for (i = 0; i < 5; i++) {
    var temp = new Date(top5[i].updatedAt);
    top5[i].updatedAt = temp.toLocaleString();
  }
  for (i = 0;i < course.chapters.length; i++){
    chapters[i] = await chapterModel.findOne({_id: course.chapters[i]}).lean()
    for(j = 0; j < chapters[i].lessons.length; j++){
      chapters[i].lessons[j] = await lessonModel.findOne({_id: chapters[i].lessons[j]}).lean()
    }

  }

  const fb = await fbModel.find({courseID: course._id}).lean()
  for(i=0;i<fb.length;i++){
    const t = await userModel.findOne({_id: fb[i].studentID}).lean()
    fb[i].studentID = t.fullname
    fb[i].ava = t.avatar
  }
  console.log(fb)

  res.render("pages/courses/details", {
    course,
    top5,
    title: "Detail",
    teacher,
  });
};

const courseSearch = async (req, res, next) => {
  let average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
  let courses = await CourseModel.find().lean();
  let all_sub_cate = await SubCategoryModel.find().lean();
  for (x of courses) {
    let nFeedback = await FeedbackModel.find({ courseID: x._id }).lean();
    var ave = nFeedback.length > 0 ? average(nFeedback.map((c) => c.rate)) : 0;

    let teacher = await UserModel.findOne({ _id: x.author_id }).lean();
    let SubCategory = await SubCategoryModel.findOne({
      _id: x.sub_category,
    }).lean();
    x.SubCategory = SubCategory.name;
    x.author = teacher;
    x.rating = ave;
    x.allRates = nFeedback.length;
  }
  res.render("pages/web/search", {
    layout: "lmain-course",
    courses,
    all_sub_cate,
  });
};

module.exports = {
  getHomePage,
  courseDetail,
  courseSearch,
};
