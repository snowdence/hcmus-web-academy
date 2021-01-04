const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");

router.route("/watchlist/:page").get(studentController.wishlist);

router.route("/all-courses").get((req, res)=>{
    res.render("pages/student/all-courses", {
        title: "All Courses"
    })
});

router.route("/review-courses").get(studentController.review);

router.route("/archived").get(studentController.archived);
module.exports = router;