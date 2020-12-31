const express = require("express");
const router = express.Router();

router.route("/wishlist").get((req, res)=>{
    res.render("pages/student/wishlist", {
        title: "Wishlist"
    })
});

router.route("/all-courses").get((req, res)=>{
    res.render("pages/student/all-courses", {
        title: "All Courses"
    })
});

router.route("/review-courses").get((req, res)=>{
    res.render("pages/student/review-courses", {
        title: "Review Courses"
    })
});

router.route("/archived").get((req, res)=>{
    res.render("pages/student/archived", {
        title: "Archived"
    })
});
module.exports = router;