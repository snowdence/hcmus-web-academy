const courseModel = require("../models/Course");
const ChapterModel = require("../models/Chapter")
const LessonModel = require("../models/Lesson")
const SubCategoryModel = require("../models/SubCategory")
const UserModel = require("../models/User")
const ProgressModel = require("../models/Progress")
const FeedbackModel = require("../models/Feedback")
const EnrollModel = require("../models/Enroll")
const FavoriteModel = require("../models/Favorite")
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const wishlist = async (req, res , next) => {
    let average = (array) => array.reduce((a, b) => a + b,0) / array.length;

    let perPage = 5;
    let page = req.params.page || 1;
    let courses = await FavoriteModel.find({studentID:req.user._id}).skip(perPage * page - perPage).limit(perPage)
    .lean()

    console.log('course1: ', courses.map(c=>c.courseID))

    courses = await courseModel.find({_id: {$in: courses.map(c=>c.courseID)}}).lean()
    for(x of courses)
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
    console.log('course: ', courses)
    let count = await FavoriteModel.countDocuments({studentID:req.user._id})
    res.render('pages/student/watchlist',{
        courses,
        currentPage: page, // page hiện tại
        pageCount: count,
        itemPerPage: perPage,
        pages: Math.ceil(count / perPage), // tổng số các page
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
        let nFeedback = await FeedbackModel.find({courseID: course._id}).lean()
        let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
        var ave_ = (nFeedback.length>0) ? average(nFeedback.map(x=>x.rate)) : 0;
        myRate = await FeedbackModel.findOne({courseID: course._id, studentID: req.user._id})
        myRate = (myRate != null)? myRate.rate: 0

        for(x of nFeedback)
        {
            x.student = await UserModel.findOne({_id: x.studentID}).lean()
        }
        let sameCate = await courseModel.find({sub_category: course.sub_category})
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

        courseModel.findOneAndUpdate({slug :req.params.slug}, {$inc : {'count_view' : 1}}).exec();


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
        let fav = await FavoriteModel.findOne({studentID: req.user._id, courseID: course._id}).lean()
        let enroll = await EnrollModel.findOne({studentID: req.user._id, courseID: course._id}).lean()
        res.render("pages/student/courseDetail", {
            SubCategory: SubCategory.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            author: teacher,
            course: course,
            chapters: newChapters,
            rate: ave_,
            nRate: nFeedback.length,
            myRate: myRate,
            favorite: fav != null,
            enroll: enroll != null,
            sameCate: sameCate,
            nFeedback: nFeedback,
        })  
    })
    .catch(next)
}

const lessonDetail = async(req, res, next) => {
    
    courseModel.findOne({slug: req.params.slug})
    .lean()
    .then(async course => 
    {
      
        myRate = await FeedbackModel.findOne({courseID: course._id, studentID: req.user._id})
        myRate = (myRate != null)? myRate.rate: 0

        let nFeedback = await FeedbackModel.find({courseID: course._id})
        let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
        var ave = (nFeedback.length>0) ? average(nFeedback.map(x=>x.rate)) : 0;

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
        let fav = await FavoriteModel.findOne({studentID: req.user._id, courseID: course._id}).lean()
        let enroll = await EnrollModel.findOne({studentID: req.user._id, courseID: course._id}).lean()

        lesson = await LessonModel.findOne({_id: req.params.lesson}).lean()
        res.render("pages/student/lessonDetail", {
            SubCategory: SubCategory.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            author: teacher,
            course: course,
            chapters: newChapters,
            rate: ave,
            nRate: nFeedback.length,
            myRate: myRate,
            favorite: fav != null,
            enroll: enroll!= null,
            lesson: lesson
        })  
    })
    .catch(next)
}

// [POST] student/update-progress
const updateProgress = async (req, res, next) =>{
    console.log('DEBUG: ', req.body)

    ProgressModel.updateOne({studentID: req.user._id, lessonID: req.body.lessonID}, req.body, {upsert: true})
    .then(num => console.log(num))
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
    doc = {
        studentID: req.user._id,
        courseID: req.body.courseID
    }
    if (req.body.favorite == 'true' )
    {
        FavoriteModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, doc, {upsert: true})
        .then(num => console.log(num))
    }
    //&& !student.list_courses.includes(req.body.courseID)
    if (req.body.favorite == 'false' )
    {
        FavoriteModel.findOne({studentID: req.user._id, courseID: req.body.courseID}).deleteOne().exec();
    }
  //  FeedbackModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, req.body, {upsert: true})
  //  .then(num => console.log(num))
   // res.redirect(req.header('Referer') || '/')
}

// [POST] student/enroll
const enroll = async (req, res, next) =>{
    console.log('feedback: ', req.body)
    doc = {
        studentID: req.user._id,
        courseID: req.body.courseID
    }

    courseModel.findOneAndUpdate({_id :req.body.courseID}, {$inc : {'count_enroll' : 1}}).exec();
    EnrollModel.updateOne({studentID: req.user._id, courseID: req.body.courseID}, doc, {upsert: true})
    .then(num => console.log(num))
   res.redirect(req.header('Referer') || '/')
}

module.exports = {
    wishlist,
    courseDetail,
    updateProgress,
    rate,
    feedback,
    favorite,
    review,
    lessonDetail,
    enroll,
}