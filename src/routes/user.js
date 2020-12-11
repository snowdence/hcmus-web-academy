const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.route("/profile").get((req, res)=>{
    res.render("pages/user/profile");
});

router.route("/account-info").get((req,res)=>{
    res.render("pages/user/account-info");
});

router.route("/email-settings").get((req,res)=>{
    res.render("pages/user/email-settings");
});

router.route("/change-password").get((req,res)=>{
    res.render("pages/user/change-password");
});

router.route("/personal-info").get((req,res)=>{
    res.render("pages/user/personal-info");
});

router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
