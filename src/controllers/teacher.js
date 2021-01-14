const UserModel = require("../models/User")
const CourseModel = require("../models/Course")
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const SubCategoryModel = require("../models/SubCategory")
const FeedbackModel = require("../models/Feedback")

const mongoose = require("mongoose");
const multer = require('multer');
//const Progress = require("../models/Progress")


// [GET] /teacher
const getIndex =  (req, res, next) => {
    res.render("pages/teacher/home")
}

// [GET] /teacher/course
const viewCourse = (req, res, next) => {
    let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
    let perPage = 5;
    let page = req.params.page || 1;
    CourseModel.countDocuments({})
    .then((count) => {
        CourseModel.find({"author_id": req.user._id}).skip(perPage * page - perPage)
        .limit(perPage)
        .lean()
        .then( async (courses) => {
            for( x of courses)
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

            res.render("pages/teacher/course", {
                courses : courses,
                currentPage: page, // page hiện tại
                pageCount: count,
                itemPerPage: perPage,
                pages: Math.ceil(count / perPage),
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
        let nFeedback = await FeedbackModel.find({courseID: course._id})
        let average = (array) => array.reduce((a, b) => a + b,0) / array.length;

        var ave = (nFeedback.length>0) ? average(nFeedback.map(x=>x.rate)) : 0;

        console.log('ave: ', ave)
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
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,
                })
            }
            
        }
        let teacher = await UserModel.findOne({_id: course.author_id}).lean()
        //console.log("teacher: ",SubCategory)
        res.render("pages/teacher/courseDetail", {
            SubCategory: SubCategory.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            author: teacher,
            course: course,
            chapters: newChapters,
            rate: ave,
            nRate: nFeedback.length,
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
        console.log('debug: ', req.file)
        chaps_id = []
        var newData = JSON.parse(JSON.stringify(req.body))
        if(typeof req.file != 'undefined')
        {
            newData.thumbnail = '/img/' + req.file.filename
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

                var newCourse = JSON.parse(JSON.stringify(newData))
                newCourse.chapters = chaps_id
                console.log("test: ", newCourse)

                await CourseModel.updateOne({_id: newData.id}, newCourse, {upsert: true})
                .then(num => console.log(num))
                res.redirect('/teacher/course/'+ course.slug)

        })
    })

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
          cb(null, './src/public/img')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now()+'.png')
        }
      })
       
    var upload = multer({ storage: storage })
    upload.single('thumbnail')(req,res, async function(err){

        var course = JSON.parse(JSON.stringify(req.body))
        if(req.file != undefined)
        {
            course.thumbnail = req.file.filename
            //console.log("change: ", req.file.filename)
        }
            //delete course.thumbnail

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
        //console.log("newCourse: ", newCourse)
        await newCourse.save()
        .then()
        .catch()
        res.redirect('/teacher/course/'+newCourse.slug)
    })
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