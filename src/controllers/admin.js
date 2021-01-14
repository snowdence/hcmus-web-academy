const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const CourseModel = require("../models/Course")
const FeedbackModel = require("../models/Feedback")
const SubCategoryModel = require("../models/SubCategory")

const bcrypt = require('bcrypt');

const multer = require('multer');


const getDashboard = (req, res, next) => {
  res.render("pages/admin/dashboard");
};

const getAllUser = async (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  UserModel.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .exec((err, students) => {
      UserModel.countDocuments((err, count) => {
        if (err) return next(err);
        //console.log("Type: " + typeof (students[0]));
        res.render("pages/admin/category/all-category", {
          layout: "main-admin",
          students: students, // sản phẩm trên một page
          currentPage: page, // page hiện tại
          pageCount: count,
          itemPerPage: perPage,
          pages: Math.ceil(count / perPage), // tổng số các page
        });
      });
    });
};

const getAllCategory = async (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  CategoryModel.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .exec((err, catgories) => {
      CategoryModel.countDocuments((err, count) => {
        if (err) return next(err);
        //console.log("Type: " + typeof (students[0]));
        res.render("pages/admin/category/all-category", {
          layout: "main-admin",
          catgories: catgories, // sản phẩm trên một page
          currentPage: page, // page hiện tại
          pageCount: count,
          itemPerPage: perPage,
          pages: Math.ceil(count / perPage), // tổng số các page
        });
      });
    });
};
const teacherManagement = async (req, res, next) => {
  let teacher = await UserModel.find({role: 1}).lean()
  res.render('pages/admin/teacher', {
    layout: "layout-admin",
    teacher
  })
}

const studentManagement = async (req, res, next) => {
  let student = await UserModel.find({role: 2}).lean()
  res.render('pages/admin/student', {
    layout: "layout-admin",
    student
  })
}

const courseManagement = async (req, res, next) => {
  let average = (array) => array.reduce((a, b) => a + b,0) / array.length;
  let courses = await CourseModel.find().lean()
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
  res.render('pages/admin/course', {
    layout: "layout-admin",
    courses,
  })
}

//[GET]

const addUser = async (req, res, next) => {
  
  res.render('pages/admin/addUser')
}

//[GET]
const editUser = async (req, res, next) => {
  let user = await UserModel.findOne({_id: req.params.id}).lean()
  console.log('user: ', user)
  res.render('pages/admin/editUserInfo',{user})
}

//[POST] /admin/user edit
const editedUser = async (req, res, next) => {
    var storage = multer.diskStorage({

      destination: function (req, file, cb) {
        cb(null, './src/public/img')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png')
      }
    })
  var upload = multer({ storage: storage })
  upload.single('avatar')(req,res, async function(err){
    console.log('debug: ', req.file)
      var newData = JSON.parse(JSON.stringify(req.body))
      if(typeof req.file != 'undefined')
      {
          newData.avatar = '/img/' + req.file.filename
          console.log("change")
      }
      else
          delete newData.avatar
      await UserModel.updateOne({_id: req.params.id}, newData).lean()
      res.send(req.body)
 })
}

//[POST]
const postUserChangePassword = async (req, res, next) => {
  const userPW = req.user.password
  const pwChange = req.body.curPassword
  const isMatch = await bcrypt.compare(pwChange, userPW);
  console.log(isMatch)
  if (
    req.user.password === req.body.curPassword &&
    req.body.password === req.body.verPassword
  ) {
    UserModel.updateOne({ username: req.user.username }, req.body)
      .then()
      .catch((err) => next(err));
    res.render("pages/user/change-password", {
      userAvatar: req.user.avatar,
      userFullname: req.user.fullname,
      userPhone: req.user.phone,
      userEmail: req.user.email,
      isUpdateSuccessfully: true,
    });
  } else {
    if (req.user.password !== req.body.curPassword) {
      res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
        isFail: true,
        message: "Wrong password! Please enter again!",
      });
    } else {
      res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
        isFail: true,
        message: "Verified password doesn't match! Check it again",
      });
    }
  }
};

//[GET]
const getUserChangePassword = (req, res, next) => {
  let user = UserModel.findOne({_id: req.params.id}).lean()
  
  res.render("pages/user/change-password", {
    userAvatar: user.avatar,
    userFullname: user.fullname,
    userPhone: user.phone,
    userEmail: user.email,
    title: "Change Password",
  });
}

// [POST] /admin/deleteUser
const deleteUser = (req, res, next) => {
  console.log('ok')
  UserModel.delete({_id:req.body.userID})
  .then((num)=> res.send('true'))
  .catch(next)
}

// [POST] /admin/deleteCourse
const deleteCourse = (req, res, next) => {
  console.log('ok')
  CourseModel.delete({_id:req.body.courseID})
  .then((num)=> res.send('true'))
  .catch(next)
}
module.exports = {
  getDashboard,
  getAllUser,
  getAllCategory,
  teacherManagement,
  studentManagement,
  courseManagement,
  editUser,
  editedUser,
  postUserChangePassword,
  getUserChangePassword,
  deleteUser,
  deleteCourse,
  addUser,
};
