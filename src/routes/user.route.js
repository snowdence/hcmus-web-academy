const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
//user/personal-info
router
  .route("/personal-info")
  .get(UserController.getUserProfile)
  .post(UserController.postUserProfile);

router
  .route("/change-password")
  .get(UserController.getUserChangePassword)
  .post(UserController.postUserChangePassword);

router.route("/profile").get((req, res) => {
  res.render("pages/user/profile");
});

router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
