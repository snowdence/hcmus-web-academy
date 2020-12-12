const express = require("express");

const router = express.Router();
const passport = require("passport");
const authenticationMiddleware = require("../middleware/authentication");
router.route("/").get((req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
  } else {
    console.log("Not login");
  }
  res.render("pages/home");
});

router
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("pages/login", {
        layout: null,
        message: req.flash("error"),
      });
    }
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/",
      failureFlash: true,
      failureFlash: "Tài khoản hoặc mật khẩu không chính xác",
    })
  );

router.route("/registry").get((req, res) => {
  res.render("pages/registry", {layout: null});
});

router.route("/logout").get(function (req, res) {
  req.logout();
  res.redirect("/");
});

router.route("/loginOK").get(authenticationMiddleware(), (req, res) => {
  res.send("Login thanh cong");
});
module.exports = router;
