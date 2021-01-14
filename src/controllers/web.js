const courseModel = require("../models/Course");
const userModel = require("../models/User")

const getHomePage = async (req, res, next) => {
  const limTop10 = 10;
  const limTop5 = 5;
  const top10Courses = await courseModel.find().lean().limit(limTop10);
  const top5Courses = await courseModel
    .find()
    .lean()
    .limit(limTop5)
    .skip(limTop10);
  const top10NewCourses = await courseModel.find().lean().limit(limTop10);
  res.render("pages/home", {
    title: "Home",
    top10Courses,
    top5Courses,
    top10NewCourses,
  });
};

const courseDetail = async (req, res, next) => {
  const query = courseModel.where({ _id: req.params.id });
  const course = await query.findOne().lean();
  const limit = 5
  const top5 = await courseModel.find({sub_category: course.sub_category}).lean().limit(limit)
  const teacher = await userModel.findOne({_id: course.teacher}).lean()
  var d = new Date(course.updatedAt)
  course.updatedAt = d.toLocaleString()
  for(i = 0; i<5;i++) {
    var temp = new Date(top5[i].updatedAt)
    top5[i].updatedAt =temp.toLocaleString()
  }
  res.render("pages/courses/details", {
    course,
    top5,
    title: "Detail",
    teacher
  });
};

module.exports = {
  getHomePage,
  courseDetail,
};
