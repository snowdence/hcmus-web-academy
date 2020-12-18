const UserModel = require("../models/User")
const CourseModel = require("../models/Course")
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const mongoose = require("mongoose");

// [GET] /teacher
const getIndex =  (req, res, next) => {
    res.render("pages/teacher/home")
}

// [GET] /teacher/course
const viewCourse =  (req, res, next) => {
console.log("aaa")
    var curPage = req.query.page
    if(curPage == undefined) curPage = 1
    CourseModel.count({})
    .then((num) => {
        CourseModel.find({"author_id": req.user._id}).limit(4).skip(4*(curPage-1))
        .lean()
        .then((courses) => {
            var nPage = Math.floor(num / 6)
            if(courses.length % 6) nPage++
            var pages = Array.from({length: nPage}, (_, i) => i + 1)
            res.render("pages/teacher/course", {
                courses : courses,
                curPage: curPage,
                pages: pages,
            });
        })
    })
    .catch((err) => next(err));

};

  // [GET] teacher/course/:slug 
const courseDetail = async(req, res, next) => {
    var a =  CourseModel.findOne({slug: req.params.slug})
    a.lean()
    .then(course => 
    {
        ChapterModel.find({_id: {$in: course.chapter}})
        .lean()
        .then(async(chapters) => 
            {
            var newChapters =[]
            for (let chap of chapters){
                var lessons = await LessonModel.find({_id:{$in: chap.lesson}}).lean()
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lesson: lessons,

                })
            }
            res.render("pages/teacher/courseDetail", {
                course: course,
                chapters: newChapters,
         

            })
            }
        )
    .catch(next)
        }

    );
}


    module.exports = {
    viewCourse: viewCourse,
    courseDetail: courseDetail,
    getIndex: getIndex
    }