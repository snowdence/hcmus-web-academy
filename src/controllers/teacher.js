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
    CourseModel.findOne({slug: req.params.slug})
    .lean()
    .then(course => 
    {
        ChapterModel.find({_id: {$in: course.chapters}})
        .lean()
        .then(async(chapters) => 
            {
            var newChapters =[]
            for (let chap of chapters){
                var lessons = await LessonModel.find({_id:{$in: chap.lessons}}).lean()
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,
                })
            }

            res.render("pages/teacher/courseDetail", {
                course: course,
                chapters: newChapters,
            })
            console.log(chapters)

            }
        )
    .catch(next)
        }
    );
}

 // [GET] teacher/course/:slug/edit
 const courseEdit = async(req, res, next) => {
    CourseModel.findOne({slug: req.params.slug})
    .lean()
    .then(course => 
    {
        ChapterModel.find({_id: {$in: course.chapters}})
        .lean()
        .then(async(chapters) => 
            {
            var newChapters =[]
            for (let chap of chapters){
                var lessons = await LessonModel.find({_id:{$in: chap.lessons}}).lean()
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,

                })
            }
            res.render("pages/teacher/editCourse", {
                course: course,
                chapters: newChapters,
            })
            }
        )
    .catch(next)
        }
    );
 }
 const editCourse = async(req, res, next) => {
    res.json(req.body)  
    CourseModel.findOne({_id: req.body.id})
        .lean()
        .then(async course =>{
            var newData = req.body
            for(chapter of newData.chapters)
            {
                for(lesson of chapter.lessons ){
                    if (lesson.id == "new") 
                    {
                        lesson.id = new mongoose.Types.ObjectId()
                    }
                    await LessonModel.updateOne({_id: lesson.id}, lesson, {upsert: true})
                    .then(num =>{
                        console.log(num)
                    })

                }
                var lessons_id = chapter.lessons.map(a => a.id), lessons_deleted
                if(chapter.id == "new")
                {
                    chapter.id = new mongoose.Types.ObjectId()
                } 
                else
                {
                    var chap = await ChapterModel.findOne({_id: chapter.id}).lean()
                    lessons_deleted = chap.lessons.filter( function( el ) {
                        return lessons_id.indexOf( el ) < 0;
                    })
                }
                    //....
                    //...... delete lessons in db
                    //....
                var newChapter = JSON.parse(JSON.stringify(chapter))  
                   
                newChapter.lessons = lessons_id

                await ChapterModel.updateOne({_id: chapter.id}, newChapter, {upsert: true})
                .then(num =>{
                    console.log(num)
                })

            }
            let chaps_id = newData.chapters.map(a => a.id);
            let chaps_deleted = course.chapters.filter( function( el ) {
                return chaps_id.indexOf( el ) < 0;
              });
              //......
              //...... delete chapters in db
              //....       

            //console.log("lessons: ", lessons)

            var newCourse = JSON.parse(JSON.stringify(newData))
            newCourse.chapters = chaps_id
            console.log("test: ", newCourse)

            CourseModel.updateOne({_id: newData.id}, newCourse, {upsert: true})
            .then(num => console.log(num))
        })
   // res.redirect('/teacher/course/Python')

 }

 

module.exports = {
    viewCourse: viewCourse,
    courseDetail: courseDetail,
    courseEdit: courseEdit,
    editCourse: editCourse,

    getIndex: getIndex,
}