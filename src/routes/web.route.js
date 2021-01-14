const express = require("express");
const webController = require("../controllers/web");
const router = express.Router();
const passport = require("passport");
const register = require("../controllers/register");
const authenticationMiddleware = require("../middleware/authentication");

router.route("/").get(webController.getHomePage);
router.route("/search").get(webController.courseSearch);

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

router
  .route("/registry")
  .get((req, res) => {
    res.render("pages/registry", {
      layout: null,
      title: "Sign Up",
    });
  })
  .post(register.sendMail);

router
  .route("/otp")
  .post(register.otpAuth)
  .get((req, res) => {
    res.render("pages/otp", {
      layout: null,
      noti:
        "You entered your OTP incorrectly 3 times.<br> We've just resent the code to your email",
    });
  });

router.route("/logout").get(function (req, res) {
  req.logout();
  res.redirect("/");
});

router.route("/loginOK").get(authenticationMiddleware(), (req, res) => {
  res.send("Login thanh cong");
});

router.route("/course-detail/:id").get(webController.courseDetail);

router.route("/course").get(webController.myCourse);

module.exports = router;
