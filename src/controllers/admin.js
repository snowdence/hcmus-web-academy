const UserModel = require("../models/User");

const getDashboard = (req, res, next) => {
  res.render("pages/admin/dashboard", { layout: "main-admin" });
};

const getAllCategory = async (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  UserModel
    .find()
    .skip((perPage * page) - perPage)
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
          size: perPage,
          pages: Math.ceil(count / perPage) // tổng số các page
        });
      })
    })
};
module.exports = {
  getDashboard,
  getAllCategory,
};
