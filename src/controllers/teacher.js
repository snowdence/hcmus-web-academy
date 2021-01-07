const UserModel = require("../models/User")
const CourseModel = require("../models/Course")
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const SubCategoryModel = require("../models/SubCategory")

const mongoose = require("mongoose");
const multer = require('multer');
//const Progress = require("../models/Progress")


// [GET] /teacher
const getIndex =  (req, res, next) => {
    res.render("pages/teacher/home")
}

// [GET] /teacher/course
const viewCourse =  (req, res, next) => {
console.log("aaa")
    var curPage = req.query.page
    if(curPage == undefined) curPage = 1
    CourseModel.countDocuments({})
    .then((num) => {
        CourseModel.find({"author_id": req.user._id}).limit(4).skip(4*(curPage-1))
        .lean()
        .then((courses) => {
            var nPage = Math.floor(num / 4)
            if(courses.length % 4) nPage++
            var pages = Array.from({length: nPage}, (_, i) => i + 1)
            console.log("pages: ", pages)

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
    .then(async course => 
    {
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
                // for (var x of lessons)
                // {
                //    // console.log(x._id, req.user._id)
                //     pr = await ProgressModel.findOne({lessonID: x._id, studentID: req.user._id})
                //     //console.log(pr)
                //     if (pr != null)
                //         x.progress = pr.progress
                //     else x.progress = 0
                // }
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,
                })
            }
            
        }
        let teacher = await UserModel.findOne({_id: course.author_id}).lean()
        console.log("teacher: ",SubCategory)
        res.render("pages/teacher/courseDetail", {
            SubCategory: SubCategory.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            author: teacher,
            course: course,
            chapters: newChapters,
        })  
    })
    .catch(next)
}

 // [GET] teacher/course/:slug/edit
 const courseEdit = async(req, res, next) => {
    let SubCategory = await SubCategoryModel.find({}).lean()
    console.log(SubCategory)
        CourseModel.findOne({slug: req.params.slug})
        .lean()
        .then(async course => 
        {
            let sub = await SubCategoryModel.findOne({_id: course.sub_category}).lean()
            ChapterModel.find({_id: {$in: course.chapters}})
            .lean()
            .then(async(chapters) => 
            {
                var newChapters =[]
                for (let chap of chapters){

                    var lessons = await LessonModel.find({_id:{$in: chap.lessons}}).lean()
                    console.log("test: ", chap.lessons)
                    console.log("test result: ", lessons)

                    newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,
                })
            }
            res.render("pages/teacher/editCourse", {
                course: course,
                chapters: newChapters,
                SubCategorys: SubCategory,
                sub: sub,
                })
            })
        }
        )
    .catch(next)
} 

 //[POST] teacher/course/:slug/edit
const editCourse = (req, res, next) => {
    var storage = multer.diskStorage({

        destination: function (req, file, cb) {
          cb(null, './src/public/img')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now()+'.png')
        }
      })
      
       
    var upload = multer({ storage: storage })
    upload.single('thumbnail')(req,res, async function(err){
        
        res.json(req.body) 
        
        chaps_id = []
        var newData = JSON.parse(JSON.stringify(req.body))
        if(typeof req.file != 'undefined')
        {
            newData.thumbnail = req.file.filename
            console.log("change")
        }
        else
            delete newData.thumbnail
        await CourseModel.findOne({_id: req.body.id})
            .lean()
            .then(async course =>{
                if(!newData.hasOwnProperty('chapters'))
                newData.chapters=[]
        
                for(chapter of newData.chapters)
                {
                    var lessons_id = [], lessons_deleted = []
                    if(!chapter.hasOwnProperty('lessons'))
                        chapter.lessons = []
                    for(lesson of chapter.lessons ){
                        if (lesson.id == "new") 
                        {
                            lesson.id = new mongoose.Types.ObjectId()
                        }
                        console.log("update lesson:", lesson)
                        await LessonModel.updateOne({_id: lesson.id}, lesson, {upsert: true})
                        .then(num =>{
                            console.log(num)
                        })  
                    }
                    lessons_id = chapter.lessons.map(a => a.id)
                    
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
                chaps_id = newData.chapters.map(a => a.id);
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

                await CourseModel.updateOne({_id: newData.id}, newCourse, {upsert: true})
                .then(num => console.log(num))
        })
    })

   // res.redirect('/teacher/course/Python')

 }

 
 // [GET] teacher/course/create

const createCourse = async(req, res, next) =>{
    SubCategoryModel.find({})
        .lean()
        .then(SubCategorys => {
            console.log(SubCategorys)
            res.render("pages/teacher/createCourse", {SubCategorys: SubCategorys}) 
        })

 }

   // [POST] teacher/course/create
const courseCreated = async (req, res, next) =>{
    var storage = multer.diskStorage({

        destination: function (req, file, cb) {
          cb(null, '/src/public/img')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now()+'.png')
        }
      })
       
    var upload = multer({ storage: storage })
    upload.single('thumbnail')(req,res, async function(err){
        res.json(req.body)
        var course = JSON.parse(JSON.stringify(req.body))
        if(typeof req.file != 'undefined')
        {
            course.thumbnail = req.file.filename
            console.log("change")
        }
        else
            delete course.thumbnail

        var chapsId = []
        if(course.hasOwnProperty('chapters'))
        {
            for(chap of course.chapters)
            {
                var lessonsId = []
                if(chap.hasOwnProperty('lessons'))
                {
                    for(lesson of chap.lessons ){
                        const newLesson = new LessonModel(lesson)
                        let new_lesson = await newLesson.save()
                            lessonsId.push(new_lesson.id);
                    }
                    chap.lessons = lessonsId
                }
                l = 0
                const newChap = new ChapterModel(chap)
                let new_chapter = await newChap.save()
                chapsId.push(new_chapter.id);
            }
            course.chapters = chapsId
        }
            
        course.author_id = req.user._id
        const newCourse = new CourseModel(course)
        console.log("newCourse: ", newCourse)
        await newCourse.save()
        .then()
        .catch()
    })
    
   // res.redirect('/teacher/course/Python')

}
// [POST] teacher/upload
const upload = async (req, res, next) =>{
    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/video')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.mp4')
    }
})
    var upload = multer({ storage: storage })
    upload.single('myFile')(req,res, async function(err){
        //res.send(req.body)

        if(req.file==undefined) res.redirect(req.header('Referer') || '/')
        else {
            LessonModel.updateOne({_id: req.body.idLessonUpdate},{video: req.file.filename})
                .then(r => console.log(r))
            //res.send(req.file)
            res.redirect(req.header('Referer') || '/')
        }

}
    )
}

module.exports = {
    viewCourse: viewCourse,
    courseDetail: courseDetail,
    courseEdit: courseEdit,
    editCourse: editCourse,
    createCourse: createCourse,
    courseCreated: courseCreated,
    getIndex: getIndex,
    upload: upload,
}