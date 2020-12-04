const express = require("express");

const router = express.Router();
const passport = require("passport");
const authenticationMiddleware = require("../middleware/authentication");
router
  .route("/login")
  .get((req, res) => {
    res.render("pages/login", { messages: req.flash("error") });
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/loginOK",
      failureFlash: true,
      failureFlash: "Invalid username or passwerd.",
    })
  );

router.route("/loginOK").get(authenticationMiddleware(), (req, res) => {
  res.send("Login thanh cong");
});
module.exports = router;
