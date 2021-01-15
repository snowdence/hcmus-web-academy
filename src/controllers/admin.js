const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const CourseModel = require("../models/Course");
const FeedbackModel = require("../models/Feedback");
const SubCategoryModel = require("../models/SubCategory");

const bcrypt = require("bcrypt");

const multer = require("multer");

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
          cate: __statics.categories,
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
          cate: __statics.categories,
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
  let teacher = await UserModel.findWithDeleted({ role: 1 }).lean();
  res.render("pages/admin/teacher", {
    layout: "layout-admin",
    cate: __statics.categories,
    teacher,
  });
};

const studentManagement = async (req, res, next) => {
  let student = await UserModel.findWithDeleted({ role: 2 }).lean();
  res.render("pages/admin/student", {
    layout: "layout-admin",
    cate: __statics.categories,
    student,
  });
};

const categoryManagement = async (req, res, next) => {
  let Category = await CategoryModel.find().lean();
  for (x of Category) {
    let SubCategory = await SubCategoryModel.find({
      parent_category: x._id,
    }).lean();
    x.sub_categories = SubCategory;
  }
  res.render("pages/admin/category", {
    layout: "layout-admin",
    cate: __statics.categories,
    Category,
  });
};

//[POST]
const categoryManagementPost = async (req, res, next) => {
  for (x of req.body.categories) {
    console.log("x: ", x);
    if (x.id == "new") {
      newCate = new CategoryModel({ name: x.name });
      newCate.save();
      x.id = newCate._id;
    } else await CategoryModel.updateOne({ _id: x.id }, { name: x.name });
    x.sub_categories = x.sub_categories || [];
    console.log("x1: ", x);
    for (y of x.sub_categories) {
      if (y.id == "new") {
        newCate = new SubCategoryModel({ name: y.name, parent_category: x.id });
        newCate.save();
      } else
        await SubCategoryModel.updateOne(
          { _id: y.id },
          { name: y.name, parent_category: x.id }
        );
    }
  }
  res.redirect(req.header("Referer") || "/");
};

const courseManagement = async (req, res, next) => {
  let average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
  let courses = await CourseModel.find().lean();
  let all_teacher = await UserModel.find({ role: 1 }).lean();

  let all_sub_cate = await SubCategoryModel.find().lean();
  let all_cate = await CategoryModel.find().lean();
  for (x of courses) {
    let nFeedback = await FeedbackModel.find({ courseID: x._id }).lean();
    var ave = nFeedback.length > 0 ? average(nFeedback.map((c) => c.rate)) : 0;

    let teacher = await UserModel.findOne({ _id: x.author_id }).lean();
    let SubCategory = await SubCategoryModel.findOne({
      _id: x.sub_category,
    }).lean();
    let ParentCategory = await CategoryModel.findOne({
      _id: SubCategory.parent_category,
    }).lean();

    x.SubCategory = SubCategory.name;
    x.ParentCategory = ParentCategory.name;

    x.author = teacher;
    x.rating = ave;
    x.allRates = nFeedback.length;
  }
  res.render("pages/admin/course", {
    layout: "layout-admin",
    cate: __statics.categories,
    courses,
    all_teacher,
    all_sub_cate,
    all_cate,
  });
};

//[GET]

const addUser = async (req, res, next) => {
  res.render("pages/admin/addUser",{
    cate: __statics.categories,

  });
};
// [POST]
const addUserPost = async (req, res, next) => {
  console.log(req.body);
  const { fullname, username, phone, password, email } = req.body;
  let check_user = await UserModel.findOne({ username: username }).lean();
  if (check_user) {
    return res.json({ state: false, msg: "User existed" });
  }
  check_user = await UserModel.findOne({ email: email }).lean();
  if (check_user) {
    return res.json({ state: false, msg: "Email existed" });
  }
  const salt = 10;
  const hashpw = await bcrypt.hash(password, salt);
  let new_user = new UserModel({
    username,
    password: hashpw,
    fullname,
    phone,
    email,
    verified: true,
    role: 1,
  });
  try {
    await new_user.save();
    return res.json({ state: true, msg: "Success create the account" });
  } catch (ex) {
    console.log(ex);
    return res.json({ state: false, msg: "DB error" });
  }
};

//[GET]
const editUser = async (req, res, next) => {
  let user = await UserModel.findOne({ _id: req.params.id }).lean();

  console.log("user: ", user);
  res.render("pages/admin/editUserInfo", { 
    user,
    cate: __statics.categories,
  });
};

//[POST] /admin/user edit
const editedUser = async (req, res, next) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/public/img");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
  });
  var upload = multer({ storage: storage });
  upload.single("avatar")(req, res, async function (err) {
    console.log("debug: ", req.file);
    var newData = JSON.parse(JSON.stringify(req.body));
    if (typeof req.file != "undefined") {
      newData.avatar = "/img/" + req.file.filename;
      console.log("change");
    } else delete newData.avatar;
    await UserModel.updateOne({ _id: req.params.id }, newData).lean();
    res.send(req.body);
  });
};

//[POST]
const postUserChangePassword = async (req, res, next) => {
  const userPW = req.user.password;
  const pwChange = req.body.curPassword;
  const isMatch = await bcrypt.compare(pwChange, userPW);
  console.log(isMatch);
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
      cate: __statics.categories,

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
        cate: __statics.categories,

      });
    } else {
      res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
        isFail: true,
        message: "Verified password doesn't match! Check it again",
        cate: __statics.categories,

      });
    }
  }
};

//[GET]
const getUserChangePassword = (req, res, next) => {
  let user = UserModel.findOne({ _id: req.params.id }).lean();

  res.render("pages/user/change-password", {
    userAvatar: user.avatar,
    userFullname: user.fullname,
    userPhone: user.phone,
    userEmail: user.email,
    title: "Change Password",
    cate: __statics.categories,

  });
};

// [POST] /admin/deleteUser
const deleteUser = (req, res, next) => {
  console.log("ok");
  UserModel.delete({ _id: req.body.userID })
    .then((num) => res.send("true"))
    .catch(next);
};

// [POST] /admin/deleteCourse
const deleteCourse = (req, res, next) => {
  console.log("ok");
  CourseModel.delete({ _id: req.body.courseID })
    .then((num) => res.send("true"))
    .catch(next);
};

// [POST] /admin/deleteCategory
const deleteCategory = async (req, res, next) => {
  console.log("ok");
  let sc = await SubCategoryModel.find({ parent_category: req.body.CateID });
  if (sc.length > 0) {
    let course = await CourseModel.find({ sub_category: { $in: sc } });
    if (course.length > 0) {
      res.send("false");
      return;
    }
  }
  CategoryModel.delete({ _id: req.body.CateID })
    .then((num) => res.send("true"))
    .catch(next);
};

// [POST] /admin/deleteSubCategory
const deleteSubCategory = async (req, res, next) => {
  let course = await CourseModel.find({ sub_category: req.body.SubCateID });
  if (course.length > 0) {
    res.send("false");
    return;
  }
  SubCategoryModel.delete({ _id: req.body.SubCateID })
    .then((num) => res.send("true"))
    .catch(next);
};

module.exports = {
  getDashboard,
  getAllUser,
  getAllCategory,
  teacherManagement,
  studentManagement,
  courseManagement,
  categoryManagement,
  editUser,
  editedUser,
  postUserChangePassword,
  getUserChangePassword,
  deleteUser,
  deleteCourse,
  deleteCategory,
  deleteSubCategory,
  addUser,
  addUserPost,
  categoryManagementPost,
};
