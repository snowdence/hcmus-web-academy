const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const getDashboard = (req, res, next) => {
  res.render("pages/admin/dashboard", { layout: "main-admin" });
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
module.exports = {
  getDashboard,
  getAllUser,
  getAllCategory,
};
