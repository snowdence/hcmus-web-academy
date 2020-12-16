const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
//user/personal-info
router
  .route("/personal-info")
  .get((req, res) => {
    res.render("pages/user/personal-info", {
      userAvatar: req.user.avatar,
      userFullname: req.user.fullname,
      userPhone: req.user.phone,
      userEmail: req.user.email,
      title: "Personal Information"
    });
  })
  .post(UserController.postUserProfile);

router
  .route("/change-password")
  .get((req, res) => {
    res.render("pages/user/change-password", {
      userAvatar: req.user.avatar,
      userFullname: req.user.fullname,
      userPhone: req.user.phone,
      userEmail: req.user.email,
    });
  })
  .post(UserController.postUserChangePassword);

router.route("/profile").get((req, res) => {
  res.render("pages/user/profile");
});

router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
