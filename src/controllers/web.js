const courseModel = require("../models/Course");
const userModel = require("../models/User")
const chapterModel = require("../models/Chapter")
const fbModel = require("../models/Feedback")
const lessonModel = require("../models/Lesson");
const subModel = require("../models/SubCategory");

const getHomePage = async (req, res, next) => {
  const limTop10 = 10;
  const limTop5 = 5;
  const top10Courses = await courseModel.find().lean().limit(limTop10);
  const top5Courses = await courseModel.find().lean().limit(limTop5).skip(limTop10);
  const top10NewCourses = await courseModel.find().lean().limit(limTop10).skip(limTop10+limTop5);
  const top5cate = await subModel.find().lean().limit(limTop5)
  res.render("pages/home", {
    title: "Home",
    top10Courses,
    top5Courses,
    top10NewCourses,
    top5cate
  });
};

const courseDetail = async (req, res, next) => {
  const query = courseModel.where({ _id: req.params.id });
  const course = await query.findOne().lean();
  const limit = 5
  const top5 = await courseModel.find({sub_category: course.sub_category}).lean().limit(limit)
  const teacher = await userModel.findOne({_id: course.author_id}).lean()
  let chapters = []
  let l = []
  var d = new Date(course.updatedAt)
  course.updatedAt = d.toLocaleString()
  for(i = 0; i<5;i++) {
    var temp = new Date(top5[i].updatedAt)
    top5[i].updatedAt =temp.toLocaleString()
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
    chapters,
    fb
  });
};

module.exports = {
  getHomePage,
  courseDetail,
};
