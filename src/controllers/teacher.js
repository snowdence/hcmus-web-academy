const UserModel = require("../models/User")
const CourseModel = require("../models/Course")

const viewCourse =  (req, res, next) => {

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
                pages: pages
            });
        })
    })
    .catch((err) => next(err));

};

module.exports = {
    viewCourse: viewCourse,
};
  