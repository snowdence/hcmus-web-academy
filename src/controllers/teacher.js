const UserModel = require("../models/User")
const CourseModel = require("../models/Course")

// const getIndex =  (req, res, next) => {

//     UserModel.find({})
//     .lean()
//     .then((users) => {
//         res.render("pages/teacher/index", {
//             users : users,
//             count : users.length
//         });    

//       console.log("Founded users: ", users);
//     })
//     .catch((err) => next(err));

// };
const viewCourse =  (req, res, next) => {

    console.log(req.user)
    var curPage = req.query.page
    if(curPage == undefined) curPage = 1
    CourseModel.find({"author_id": req.user._id})
    .lean()
    .then((courses) => {
 
        res.render("pages/teacher/course", {
            courses : courses
        });
     // console.log("Founded course: ", courses);
    })
    .catch((err) => next(err));

};

module.exports = {
    viewCourse: viewCourse,
};
  