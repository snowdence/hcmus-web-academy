const courseModel = require("../models/Course");
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const SubCategoryModel = require("../models/SubCategory")
const UserModel = require("../models/User")
const ProgressModel = require("../models/Progress")


const wishlist = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/wishlist", {
        title: "Wishlist",
        top10Courses,
    })
    
}
const courseDetail = async(req, res, next) => {
    courseModel.findOne({slug: req.params.slug})
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
                for (var x of lessons)
                {
                   // console.log(x._id, req.user._id)
                    pr = await ProgressModel.findOne({lessonID: x._id, studentID: req.user._id})
                    //console.log(pr)
                    if (pr != null)
                        x.progress = pr.progress
                    else x.progress = 0
                }
                newChapters.push({
                    _id: chap._id,
                    name: chap.name,
                    lessons: lessons,
                })
            }
            
        }
        let teacher = await UserModel.findOne({_id: course.author_id}).lean()
        console.log("teacher: ",SubCategory)
        res.render("pages/student/courseDetail", {
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

// [POST] teacher/update-progress
const updateProgress = async (req, res, next) =>{
    ProgressModel.updateOne({studentID: req.user._id, lessonID: req.body.lessonID}, req.body, {upsert: true})
    .then(num => console.log(num))
    //console.log(req.body)
}
module.exports = {
    wishlist,
    courseDetail,
    updateProgress,
}