const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const CourseModel = require("../models/Course");
const SubCategoryModel = require("../models/SubCategory");
const ChapterModel = require("../models/Chapter");
const FeedbackModel = require("../models/Feedback");
const LessonModel = require("../models/Lesson");
const getHomePage = async (req, res, next) => {
  const limTop10 = 10;
  const limTop5 = 5;
  const top10Courses = await CourseModel.find().lean().limit(limTop10);
  const top5cate = await SubCategoryModel.find().lean().limit(limTop5);
  const top5Courses = await CourseModel.find()
    .lean()
    .limit(limTop5)
    .skip(limTop10);
  const top10NewCourses = await CourseModel.find()
    .lean()
    .limit(limTop10)
    .skip(limTop10 + limTop5);
  res.render("pages/home", {
    cate: __statics.categories,
    title: "Home",
    top10Courses,
    top5Courses,
    top10NewCourses,
    top5cate,
    cate: __statics.categories,

  });
};

const courseDetail = async(req, res, next) => {
  CourseModel.findOne({_id: req.params.id})
  .lean()
  .then(async course => 
  {
      let nFeedback = await FeedbackModel.find({courseID: course._id}).lean()
      let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
      var ave_ = (nFeedback.length>0) ? average(nFeedback.map(x=>x.rate)) : 0;

      for(x of nFeedback)
      {
          x.student = await UserModel.findOne({_id: x.studentID}).lean()
      }
      let sameCate = await CourseModel.find({sub_category: course.sub_category})
      .sort({count_enroll: -1})
      .limit(5)
      .lean()
      for( x of sameCate)
          {
              let nFeedback = await FeedbackModel.find({courseID: x._id}).lean()
              var ave = (nFeedback.length>0) ? average(nFeedback.map(c=>c.rate)) : 0;

              let teacher = await UserModel.findOne({_id: x.author_id}).lean()
              let SubCategory = await SubCategoryModel.findOne({_id: x.sub_category}).lean()
              x.SubCategory = SubCategory.name
              x.author = teacher
              x.rating = ave
              x.allRates = nFeedback.length
          }

      CourseModel.findOneAndUpdate({slug :req.params.slug}, {$inc : {'count_view' : 1}}).exec();


      let SubCategory = await SubCategoryModel.findOne({_id: course.sub_category}).lean()
      var d = new Date(course.updatedAt); 
      updatedAt = d.toLocaleString()
      d = new Date(course.createdAt); 
      createdAt = d.toLocaleString()

      var newChapters =[]
      if(course.chapters.length > 0)
      {
          let chapters = await ChapterModel.find({_id: {$in: course.chapters}})
  
          for (let chap of chapters){
              let lessons = []
              if (chap.lessons.length > 0)
              {
                  lessons = await LessonModel.find({_id:{$in: chap.lessons}}).lean()
              }
              for (var x of lessons)
              {
                 // console.log(x._id, req.user._id)
                  pr = await ProgressModel.findOne({lessonID: x._id, studentID: req.user._id})

                  if (pr != null)
                      x.prog = pr.progress
                  else x.prog = 0
              }
              newChapters.push({
                  _id: chap._id,
                  name: chap.name,
                  lessons: lessons,
              })
          }
          
      }
      let teacher = await UserModel.findOne({_id: course.author_id}).lean()
      res.render("pages/courses/details", {
          SubCategory: SubCategory.name,
          createdAt: createdAt,
          updatedAt: updatedAt,
          author: teacher,
          course: course,
          chapters: newChapters,
          rate: ave_,
          nRate: nFeedback.length,
          sameCate: sameCate,
          nFeedback: nFeedback,
          cate: __statics.categories,

      })  
  })
  .catch(next)
}


const courseSearch = async (req, res, next) => {
  const { key, cate_sub_id } = req.query;
  let find_condition = { deleted: false };

  if (cate_sub_id) {
    find_condition["sub_category"] = cate_sub_id;
  }
  if (key) {
    find_condition = { ...find_condition, ...{ $text: { $search: key } } };
  }

  console.log(find_condition);

  let average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
  let courses = await CourseModel.find(find_condition).lean();
  let all_sub_cate = await SubCategoryModel.find().lean();
  let all_cate = await CategoryModel.find().lean();
  for (x of all_cate) {
    let SubCategory = await SubCategoryModel.find({
      parent_category: x._id,
    }).lean();
    x.sub_categories = SubCategory;
  }

  for (x of courses) {
    let nFeedback = await FeedbackModel.find({ courseID: x._id }).lean();
    var ave = nFeedback.length > 0 ? average(nFeedback.map((c) => c.rate)) : 0;

    let teacher = await UserModel.findOne({ _id: x.author_id }).lean();
    let SubCategory = await SubCategoryModel.findOne({
      _id: x.sub_category,
    }).lean();

    let ParentCategory = await CategoryModel.findOne({
      _id: SubCategory.parent_category,
    }).lean();

    x.SubCategory = SubCategory.name;
    x.ParentCategory = ParentCategory.name;
    x.author = teacher;
    x.rating = ave;
    x.allRates = nFeedback.length;
  }
  res.render("pages/web/search", {
    layout: "lmain-course",
    courses,
    all_sub_cate,
    all_cate,
    current_key: key,
    current_cate_sub_id: cate_sub_id,
    cate: __statics.categories,

  });
};

const myCourse = async (req, res, next) => {
  if(req.user.role == 0)
  {
    res.redirect('/admin/course-management')
  }
  else if (req.user.role == 1)
  {
    res.redirect('/teacher/courses/1')
  }
  else if (req.user.role == 2)
  {
    res.redirect('/student/myCourse/1')
  }
}
module.exports = {
  getHomePage,
  courseDetail,
  courseSearch,
  myCourse
};
