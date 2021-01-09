const courseModel = require("../models/Course");
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const SubCategoryModel = require("../models/SubCategory")
const UserModel = require("../models/User")
const ProgressModel = require("../models/Progress")
const FeedbackModel = require("../models/Feedback")


const wishlist = async (req, res , next) => {
    const lim = 10;
    const page = req.params.page || 1;
    const top10Courses = await courseModel.find().lean().skip((lim * page) - lim).limit(lim)
    const count = await courseModel.countDocuments()
    let listpage = []
    const totalpage = Math.ceil(count / lim)
    for(let i = 0; i < totalpage; i++)
    {
        listpage[i] = ""
    }
    listpage[page]="datatable-pager-link-active"
    res.render("pages/student/watchlist", {
        title: "Watchlist",
        top10Courses,
        listpage,
    })
    
}

const review = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/review-courses", {
        title: "Review",
        top10Courses,
    })
    
}

const archived = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/archived", {
        title: "Archived",
        top10Courses,
    })
    
}
const courseDetail = async(req, res, next) => {
    courseModel.findOne({slug: req.params.slug})
    .lean()
    .then(async course => 
    {
        var rate = []
        ave = 0
        myRate = 0
        myRate = await FeedbackModel.findOne({courseID: course._id, studentID: req.user._id})
        let nFeedback = await FeedbackModel.find({courseID: course._id})
        if (nFeedback.length >0)
        {
            rate = nFeedback.map(x=>x.rate)
            let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
            ave = average(rate)
        }
        if (myRate != null) myRate = myRate.rate

        courseModel.updateOne({slug: req.params.slug}, {count_view: course.count_view + 1})
        .lean()
        .then()

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
        let student = await UserModel.findOne({_id: req.user._id}).lean()

       
        res.render("pages/student/courseDetail", {
            SubCategory: SubCategory.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            author: teacher,
            course: course,
            chapters: newChapters,
            rate: ave,
            nRate: rate.length,
            myRate: myRate,
            favorite: student.list_courses.map( s => JSON.stringify( s ) ).includes(JSON.stringify(course._id))
        })  
    })
    .catch(next)
}

// [POST] student/update-progress
const updateProgress = async (req, res, next) =>{
    ProgressModel.updateOne({studentID: req.user._id, lessonID: req.body.lessonID}, req.body, {upsert: true})
    .then(num => console.log(num))
    //console.log(req.body)
}

// [POST] student/rate
const rate = async (req, res, next) =>{
    console.log('rate: ', req.body)
    FeedbackModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, req.body, {upsert: true})
    .then(num => console.log(num))
    //console.log(req.body)
}

// [POST] student/feedback
const feedback = async (req, res, next) =>{
    console.log('feedback: ', req.body)

    FeedbackModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, req.body, {upsert: true})
    .then(num => console.log(num))
    res.redirect(req.header('Referer') || '/')
}

// [POST] student/favorite
const favorite = async (req, res, next) =>{
    console.log('feedback: ', req.body)
    var student = await UserModel.findOne({_id: req.user._id}).lean()
    if (req.body.favorite == 'true' )
    {
        console.log('true')
        student.list_courses.push(req.body.courseID);
    }
    //&& !student.list_courses.includes(req.body.courseID)
    if (req.body.favorite == 'false' )
    {
        console.log('false')
        const index = student.list_courses.map( s => JSON.stringify( s ) ).indexOf(JSON.stringify(req.body.courseID))
        console.log(index)

        if (index > -1) {
            student.list_courses.splice(index, 1);
        }
        console.log(student.list_courses)

    }
    console.log('kq: ', student)

    UserModel.updateOne({_id: req.user._id}, student, {upsert: true})
    .then(num => console.log(num))


  //  FeedbackModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, req.body, {upsert: true})
  //  .then(num => console.log(num))
   // res.redirect(req.header('Referer') || '/')
}

module.exports = {
    wishlist,
    courseDetail,
    updateProgress,
    rate,
    feedback,
    favorite
}