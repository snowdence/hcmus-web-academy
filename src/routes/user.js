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
    res.render("pages/user/account-info", {
        userName: req.user.username,
        userEmail: req.user.email,
        userFullname: req.user.fullname,
        userAvatar: req.user.avatar,
        userPhone: req.user.phone,
    });
});

router.route("/change-password").get((req,res)=>{
    res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
    });
});

router.route("/profile").get((req,res)=>{
    res.render("pages/user/profile");
});

router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
