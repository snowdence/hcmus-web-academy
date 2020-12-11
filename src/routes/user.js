const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.route("/personal-info").get((req, res) => {
    res.render("pages/user/personal-info", {
    userAvatar: req.user.avatar,
    userFullname: req.user.fullname,
    userPhone: req.user.phone,
    userEmail: req.user.email,
  })
}).post(UserController.postUserProfile);

router.route("/account-info").get((req,res)=>{
    res.render("pages/user/account-info");
});

router.route("/email-settings").get((req,res)=>{
    res.render("pages/user/email-settings");
});

router.route("/change-password").get((req,res)=>{
    res.render("pages/user/change-password");
});

router.route("/profile").get((req,res)=>{
    res.render("pages/user/profile");
});

router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
