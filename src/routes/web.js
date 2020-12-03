const express = require("express");

const router = express.Router();
const passport = require("passport");

router
  .route("/login")
  .get((req, res) => {
    res.render("pages/login");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/loginOK",
    })
  );

router.route("/loginOK").get((req, res) => {
  if (req.isAuthenticated()) {
    res.send("ok ban da dang nhap");
  } else {
    res.send("Ban chua dang nhap");
  }
});
module.exports = router;
