const UserModel = require("../models/User");

const getIndex = (req, res, next) => {
  res.render("pages/admin/dashboard", { layout: "main-admin" });
};

module.exports = {
  getIndex,
};
